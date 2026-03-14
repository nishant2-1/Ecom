import { Section, Text } from "@react-email/components";
import { EmailShell } from "@/emails/components/EmailShell";

type ShippingUpdateEmailProps = {
  customerName: string;
  orderId: string;
  status: string;
};

export function ShippingUpdateEmail({
  customerName,
  orderId,
  status
}: ShippingUpdateEmailProps) {
  return (
    <EmailShell
      preview="Your ShopNova order status was updated"
      eyebrow="Shipping Update"
      title={`Hi ${customerName}`}
      intro={`Your order ${orderId} has moved to ${status}. We will keep sending milestone updates as it advances through delivery.`}
      ctaLabel="Track In Account"
      ctaHref={`${process.env.NEXTAUTH_URL ?? "http://localhost:3001"}/account`}
    >
      <Section>
        <Text style={{ color: "#d6d6d6", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
          Status now: <strong style={{ color: "#ffffff" }}>{status}</strong>
        </Text>
      </Section>
    </EmailShell>
  );
}
