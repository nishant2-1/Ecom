import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { sendOrderConfirmationEmail } from "@/lib/email";

async function markOrderAsPaid(orderId: string): Promise<void> {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: { status: "PAID" },
    include: {
      user: true,
      items: {
        include: {
          product: true
        }
      }
    }
  });

  if (!order.user.email) {
    return;
  }

  await sendOrderConfirmationEmail(
    order.user.email,
    order.user.name ?? "ShopNova Customer",
    order.id,
    formatCurrency(Number(order.total)),
    order.items.map(
      (item: {
        quantity: number;
        price: number;
        product: {
          name: string;
        };
      }) => ({
        name: item.product.name,
        quantity: item.quantity,
        lineTotal: formatCurrency(Number(item.price) * item.quantity)
      })
    )
  );

  const cart = await prisma.cart.findUnique({ where: { userId: order.userId } });
  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured. Add STRIPE_SECRET_KEY on the server." },
      { status: 503 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json({ error: "Missing STRIPE_WEBHOOK_SECRET" }, { status: 500 });
  }

  try {
    const body = await request.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const orderId = paymentIntent.metadata.orderId;

      if (orderId) {
        await markOrderAsPaid(orderId);
      } else {
        await prisma.order.updateMany({
          where: { stripePaymentId: paymentIntent.id },
          data: { status: "PAID" }
        });
      }
    }

    if (event.type === "checkout.session.completed") {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const orderId = checkoutSession.metadata?.orderId;
      if (orderId) {
        await markOrderAsPaid(orderId);
      }
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: "Invalid webhook event" }, { status: 400 });
  }
}
