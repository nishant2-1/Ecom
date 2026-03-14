import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text
} from "@react-email/components";
import type { ReactNode } from "react";

type EmailShellProps = {
  preview: string;
  eyebrow: string;
  title: string;
  intro: string;
  ctaLabel?: string;
  ctaHref?: string;
  children?: ReactNode;
};

export function EmailShell({
  preview,
  eyebrow,
  title,
  intro,
  ctaLabel,
  ctaHref,
  children
}: EmailShellProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body
        style={{
          backgroundColor: "#060606",
          color: "#ffffff",
          fontFamily: "DM Sans, Inter, system-ui, sans-serif",
          padding: "24px 0"
        }}
      >
        <Container
          style={{
            margin: "0 auto",
            maxWidth: "620px",
            padding: "30px",
            border: "1px solid rgba(255,255,255,0.12)",
            background:
              "radial-gradient(circle at top left, rgba(245,166,35,0.16), transparent 26%), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))",
            borderRadius: "24px"
          }}
        >
          <Section>
            <Text
              style={{
                color: "#F5A623",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                fontSize: "11px",
                margin: 0
              }}
            >
              {eyebrow}
            </Text>
            <Text
              style={{
                color: "#ffffff",
                fontSize: "32px",
                lineHeight: "1.2",
                fontWeight: 700,
                margin: "16px 0 12px"
              }}
            >
              {title}
            </Text>
            <Text style={{ color: "#d6d6d6", fontSize: "15px", lineHeight: "1.7", margin: 0 }}>{intro}</Text>
          </Section>

          {ctaLabel && ctaHref ? (
            <Section style={{ marginTop: "24px" }}>
              <Button
                href={ctaHref}
                style={{
                  backgroundColor: "#F5A623",
                  color: "#050505",
                  fontWeight: 700,
                  padding: "14px 22px",
                  borderRadius: "14px",
                  textDecoration: "none"
                }}
              >
                {ctaLabel}
              </Button>
            </Section>
          ) : null}

          {children ? <Section style={{ marginTop: "24px" }}>{children}</Section> : null}

          <Hr style={{ borderColor: "rgba(255,255,255,0.1)", margin: "28px 0" }} />

          <Text style={{ color: "#8d8d8d", fontSize: "12px", lineHeight: "1.6", margin: 0 }}>
            ShopNova premium commerce. Immersive catalog, elevated checkout, and precise order orchestration.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}