import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRedisClient } from "@/lib/redis";
import { enforceRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const cartItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  image: z.string().url(),
  price: z.number().positive(),
  quantity: z.number().int().min(1)
});

const payloadSchema = z.object({
  items: z.array(cartItemSchema)
});

type CartSessionItem = z.infer<typeof cartItemSchema>;

const CART_COOKIE = "shopnova_cart_sid";

function getOrCreateSessionId(): string {
  const cookieStore = cookies();
  const existing = cookieStore.get(CART_COOKIE)?.value;
  if (existing) {
    return existing;
  }

  const next = crypto.randomUUID();
  cookieStore.set(CART_COOKIE, next, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });

  return next;
}

async function getGuestCart(): Promise<CartSessionItem[]> {
  const sessionId = getOrCreateSessionId();
  const redis = getRedisClient();

  if (!redis) {
    return [];
  }

  const saved = await redis.get<CartSessionItem[]>(`cart:session:${sessionId}`);
  return saved ?? [];
}

async function setGuestCart(items: CartSessionItem[]): Promise<void> {
  const sessionId = getOrCreateSessionId();
  const redis = getRedisClient();

  if (!redis) {
    return;
  }

  await redis.set(`cart:session:${sessionId}`, items, {
    ex: 60 * 60 * 24 * 30
  });
}

export async function GET(): Promise<NextResponse> {
  try {
    const session = await auth();
    const forwarded = headers().get("x-forwarded-for") ?? "anonymous";
    const ip = forwarded.split(",")[0]?.trim() || "anonymous";
    const cartKey = session?.user?.id ? `cart:get:user:${session.user.id}` : `cart:get:ip:${ip}`;
    const getLimit = await enforceRateLimit(cartKey, 180, 60);

    if (!getLimit.allowed) {
      return NextResponse.json({ error: "Too many cart requests" }, { status: 429 });
    }

    if (session?.user?.id) {
      const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      const items =
        cart?.items.map(
          (item: {
            productId: string;
            quantity: number;
            price: number;
            product: {
              name: string;
              images: string;
            };
          }) => ({
            productId: item.productId,
            name: item.product.name,
            image:
              (JSON.parse(item.product.images as string) as string[])[0] ??
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            price: Number(item.price),
            quantity: item.quantity
          })
        ) ?? [];

      return NextResponse.json({ items, source: "db" });
    }

    const items = await getGuestCart();
    return NextResponse.json({ items, source: "redis" });
  } catch {
    return NextResponse.json({ error: "Failed to load cart" }, { status: 500 });
  }
}

export async function PUT(request: Request): Promise<NextResponse> {
  try {
    const session = await auth();
    const forwarded = headers().get("x-forwarded-for") ?? "anonymous";
    const ip = forwarded.split(",")[0]?.trim() || "anonymous";
    const cartKey = session?.user?.id ? `cart:put:user:${session.user.id}` : `cart:put:ip:${ip}`;
    const putLimit = await enforceRateLimit(cartKey, 120, 60);

    if (!putLimit.allowed) {
      return NextResponse.json({ error: "Too many cart update requests" }, { status: 429 });
    }

    const body: unknown = await request.json();
    const parsed = payloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { items } = parsed.data;

    if (session?.user?.id) {
      const cart = await prisma.cart.upsert({
        where: { userId: session.user.id },
        update: {},
        create: {
          userId: session.user.id
        }
      });

      await prisma.$transaction([
        prisma.cartItem.deleteMany({ where: { cartId: cart.id } }),
        ...items.map((item) =>
          prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId: item.productId,
              quantity: item.quantity,
              price: item.price
            }
          })
        )
      ]);

      return NextResponse.json({ success: true, source: "db" });
    }

    await setGuestCart(items);
    return NextResponse.json({ success: true, source: "redis" });
  } catch {
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
  }
}

export async function DELETE(): Promise<NextResponse> {
  try {
    const session = await auth();
    const forwarded = headers().get("x-forwarded-for") ?? "anonymous";
    const ip = forwarded.split(",")[0]?.trim() || "anonymous";
    const cartKey = session?.user?.id
      ? `cart:delete:user:${session.user.id}`
      : `cart:delete:ip:${ip}`;
    const deleteLimit = await enforceRateLimit(cartKey, 60, 60);

    if (!deleteLimit.allowed) {
      return NextResponse.json({ error: "Too many cart clear requests" }, { status: 429 });
    }

    if (session?.user?.id) {
      const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id }
      });

      if (cart) {
        await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
      }

      return NextResponse.json({ success: true, source: "db" });
    }

    await setGuestCart([]);
    return NextResponse.json({ success: true, source: "redis" });
  } catch {
    return NextResponse.json({ error: "Failed to clear cart" }, { status: 500 });
  }
}
