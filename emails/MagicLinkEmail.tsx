import { Section, Text } from "@react-email/components";
import { EmailShell } from "@/emails/components/EmailShell";

type MagicLinkEmailProps = {
  email: string;
  url: string;
};

export function MagicLinkEmail({ email, url }: MagicLinkEmailProps) {
  return (
    <EmailShell
      preview="Your secure ShopNova sign-in link"
      eyebrow="Secure Sign-In"
      title="Use your private access link"
      intro={`A sign-in request was started for ${email}. This access link is private, expires automatically, and opens your ShopNova session instantly.`}
      ctaLabel="Sign In To ShopNova"
      ctaHref={url}
    >
      <Section>
        <Text style={{ color: "#d6d6d6", fontSize: "14px", lineHeight: "1.7", margin: 0 }}>
          If you did not request this email, you can ignore it. No account changes will be made.
        </Text>
      </Section>
    </EmailShell>
  );
}
