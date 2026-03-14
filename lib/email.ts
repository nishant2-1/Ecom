import { Resend } from "resend";
import { MagicLinkEmail } from "@/emails/MagicLinkEmail";
import { WelcomeEmail } from "@/emails/WelcomeEmail";
import { OrderConfirmationEmail } from "@/emails/OrderConfirmationEmail";
import { ShippingUpdateEmail } from "@/emails/ShippingUpdateEmail";

type EmailOrderItem = {
  name: string;
  quantity: number;
  lineTotal: string;
};

type SendEmailOptions = {
  to: string;
  subject: string;
  react: JSX.Element;
  from: string;
  replyTo?: string;
  required?: boolean;
};

type EmailSettings = {
  replyTo?: string;
  fromDefault: string;
  fromAuth: string;
  fromOrders: string;
  fromShipping: string;
};

type EmailRuntimeStatus = {
  configured: boolean;
  mode: "production" | "development" | "test";
  fromDefault: string;
  fromAuth: string;
  fromOrders: string;
  fromShipping: string;
  replyTo?: string;
  missing: string[];
};

function getEmailSettings(): EmailSettings {
  return {
    replyTo: process.env.EMAIL_REPLY_TO,
    fromDefault: process.env.EMAIL_FROM_DEFAULT ?? "ShopNova <noreply@shopnova.dev>",
    fromAuth: process.env.EMAIL_FROM_AUTH ?? process.env.EMAIL_FROM_DEFAULT ?? "ShopNova Auth <auth@shopnova.dev>",
    fromOrders: process.env.EMAIL_FROM_ORDERS ?? process.env.EMAIL_FROM_DEFAULT ?? "ShopNova Orders <orders@shopnova.dev>",
    fromShipping:
      process.env.EMAIL_FROM_SHIPPING ?? process.env.EMAIL_FROM_DEFAULT ?? "ShopNova Shipping <shipping@shopnova.dev>"
  };
}

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null;
  }

  return new Resend(process.env.RESEND_API_KEY);
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

export function getEmailRuntimeStatus(): EmailRuntimeStatus {
  const settings = getEmailSettings();
  const mode =
    process.env.NODE_ENV === "production"
      ? "production"
      : process.env.NODE_ENV === "test"
        ? "test"
        : "development";

  const missing: string[] = [];
  if (!process.env.RESEND_API_KEY) {
    missing.push("RESEND_API_KEY");
  }
  if (!process.env.EMAIL_FROM_DEFAULT) {
    missing.push("EMAIL_FROM_DEFAULT");
  }

  return {
    configured: missing.length === 0,
    mode,
    fromDefault: settings.fromDefault,
    fromAuth: settings.fromAuth,
    fromOrders: settings.fromOrders,
    fromShipping: settings.fromShipping,
    replyTo: settings.replyTo,
    missing
  };
}

async function sendEmail({ to, subject, react, from, replyTo, required = false }: SendEmailOptions): Promise<void> {
  const resend = getResendClient();

  if (!resend) {
    const message = `Email provider not configured for subject: ${subject}`;

    if (required) {
      throw new Error(message);
    }

    if (process.env.NODE_ENV !== "production") {
      console.info(`[email:skipped] ${message} -> ${to}`);
    }
    return;
  }

  try {
    await resend.emails.send({
      from,
      to,
      subject,
      react,
      replyTo
    });
  } catch (error) {
    console.error(`[email:error] Failed sending ${subject} to ${to}`, error);

    if (required) {
      throw error;
    }
  }
}

export async function sendMagicLinkEmail(to: string, url: string): Promise<void> {
  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[email:magic-link] ${to} -> ${url}`);
      return;
    }
  }

  const settings = getEmailSettings();

  await sendEmail({
    to,
    subject: "Your ShopNova secure sign-in link",
    react: MagicLinkEmail({ email: to, url }),
    from: settings.fromAuth,
    replyTo: settings.replyTo,
    required: true
  });
}

export async function sendWelcomeEmail(to: string, name: string): Promise<void> {
  const settings = getEmailSettings();

  await sendEmail({
    from: settings.fromDefault,
    to,
    subject: "Welcome to ShopNova",
    react: WelcomeEmail({ name }),
    replyTo: settings.replyTo
  });
}

export async function sendOrderConfirmationEmail(
  to: string,
  customerName: string,
  orderId: string,
  total: string,
  items: EmailOrderItem[]
): Promise<void> {
  const settings = getEmailSettings();

  await sendEmail({
    from: settings.fromOrders,
    to,
    subject: `Order Confirmed - ${orderId}`,
    react: OrderConfirmationEmail({ customerName, orderId, total, items }),
    replyTo: settings.replyTo
  });
}

export async function sendShippingUpdateEmail(
  to: string,
  customerName: string,
  orderId: string,
  status: string
): Promise<void> {
  const settings = getEmailSettings();

  await sendEmail({
    from: settings.fromShipping,
    to,
    subject: `Shipping Update - ${orderId}`,
    react: ShippingUpdateEmail({ customerName, orderId, status }),
    replyTo: settings.replyTo
  });
}
