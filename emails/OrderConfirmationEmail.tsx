import { Section, Text } from "@react-email/components";
import { EmailShell } from "@/emails/components/EmailShell";

type OrderLineItem = {
  name: string;
  quantity: number;
  lineTotal: string;
};

type OrderConfirmationEmailProps = {
  customerName: string;
  orderId: string;
  total: string;
  items: OrderLineItem[];
};

export function OrderConfirmationEmail({
  customerName,
  orderId,
  total,
  items
}: OrderConfirmationEmailProps) {
  return (
    <EmailShell
      preview="Your ShopNova order is confirmed"
      eyebrow="Order Confirmed"
      title={`Thanks, ${customerName}`}
      intro={`We have locked in your order ${orderId}. Your items are now in motion and the operations team has started processing fulfillment.`}
      ctaLabel="View Your Orders"
      ctaHref={`${process.env.NEXTAUTH_URL ?? "http://localhost:3001"}/account`}
    >
      <Section>
        <Text style={{ color: "#ffffff", fontSize: "14px", fontWeight: 700, margin: "0 0 12px" }}>
          Order Summary
        </Text>
        {items.map((item) => (
          <Text key={`${item.name}-${item.quantity}`} style={{ color: "#d6d6d6", fontSize: "14px", margin: "8px 0" }}>
            {item.name} x {item.quantity} - {item.lineTotal}
          </Text>
        ))}
        <Text style={{ color: "#F5A623", fontWeight: 700, marginTop: "16px", fontSize: "15px" }}>Total: {total}</Text>
      </Section>
    </EmailShell>
  );
}
