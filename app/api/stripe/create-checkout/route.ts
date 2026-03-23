import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { enforceRateLimit } from "@/lib/rate-limit";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().min(1)
});

const createCheckoutSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  address: z.object({
    street: z.string().min(3),
    city: z.string().min(2),
    state: z.string().min(2),
    zip: z.string().min(4),
    country: z.string().min(2)
  }),
  promoCode: z.string().optional()
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured. Add STRIPE_SECRET_KEY on the server." },
        { status: 503 }
      );
    }

    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const forwarded = request.headers.get("x-forwarded-for") ?? "anonymous";
    const ip = forwarded.split(",")[0]?.trim() || "anonymous";
    const limit = await enforceRateLimit(`stripe-checkout:${ip}`, 20, 60);

    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many checkout requests" }, { status: 429 });
    }

    const payload: unknown = await request.json();
    const parsed = createCheckoutSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { items, address, promoCode } = parsed.data;

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await prisma.order.create({
      data: {
        userId: session.user.id,
        status: "PENDING",
        total,
        address: JSON.stringify(address),
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      }
    });

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name
        },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.quantity
    }));

    const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3001";

    const checkout = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${baseUrl}/checkout?status=cancelled`,
      allow_promotion_codes: true,
      discounts: promoCode ? [{ coupon: promoCode }] : undefined,
      metadata: {
        orderId: order.id,
        userId: session.user.id
      }
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripePaymentId: checkout.payment_intent?.toString() ?? checkout.id
      }
    });

    return NextResponse.json({ id: checkout.id, url: checkout.url, orderId: order.id });
  } catch {
    return NextResponse.json(
      { error: "Failed to create Stripe checkout session" },
      { status: 500 }
    );
  }
}
