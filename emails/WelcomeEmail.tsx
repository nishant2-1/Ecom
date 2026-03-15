import { Section, Text } from "@react-email/components";
import { EmailShell } from "@/emails/components/EmailShell";

type WelcomeEmailProps = {
  name: string;
};

export function WelcomeEmail({ name }: WelcomeEmailProps) {
  return (
    <EmailShell
      preview="Welcome to ShopNova"
      eyebrow="ShopNova"
      title={`Welcome, ${name}`}
      intro="Your premium commerce account is now ready. Explore curated products, cinematic 3D presentation, and a checkout flow designed like a flagship retail experience."
      ctaLabel="Explore Collection"
      ctaHref={`${process.env.NEXTAUTH_URL ?? "http://localhost:3001"}/products`}
    >
      <Section>
        <Text style={{ color: "#d6d6d6", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
          Start with featured drops, save favorites, and manage your orders from an immersive
          account dashboard.
        </Text>
      </Section>
    </EmailShell>
  );
}
