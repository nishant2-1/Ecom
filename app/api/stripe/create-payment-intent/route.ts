import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { enforceRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const checkoutItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().min(1)
});

const payloadSchema = z.object({
  items: z.array(checkoutItemSchema).min(1),
  address: z.object({
    street: z.string().min(3),
    city: z.string().min(2),
    state: z.string().min(2),
    zip: z.string().min(4),
    country: z.string().min(2)
  })
});

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rate = await enforceRateLimit(`payment-intent:${session.user.id}`, 30, 60);
    if (!rate.allowed) {
      return NextResponse.json({ error: "Too many payment attempts" }, { status: 429 });
    }

    const body: unknown = await request.json();
    const parsed = payloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { items, address } = parsed.data;

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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "inr",
      metadata: {
        orderId: order.id,
        userId: session.user.id
      },
      automatic_payment_methods: {
        enabled: true
      }
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        stripePaymentId: paymentIntent.id
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      orderId: order.id,
      amount: total
    });
  } catch {
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 });
  }
}
