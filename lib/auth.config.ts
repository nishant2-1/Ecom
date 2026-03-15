import type { NextAuthConfig } from "next-auth";
import type { Provider } from "next-auth/providers";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";
import { sendMagicLinkEmail } from "@/lib/email";

type Role = "ADMIN" | "USER";

export const authConfig = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: (() => {
    const providers: Provider[] = [];

    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      providers.push(
        Google({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
      );
    }

    if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
      providers.push(
        GitHub({
          clientId: process.env.GITHUB_ID,
          clientSecret: process.env.GITHUB_SECRET
        })
      );
    }

    if (process.env.RESEND_API_KEY) {
      providers.push(
        Resend({
          apiKey: process.env.RESEND_API_KEY,
          from:
            process.env.EMAIL_FROM_AUTH ??
            process.env.EMAIL_FROM_DEFAULT ??
            "ShopNova Auth <auth@shopnova.dev>",
          async sendVerificationRequest({ identifier, url }) {
            await sendMagicLinkEmail(identifier, url);
          }
        })
      );
    }

    return providers;
  })(),
  pages: {
    signIn: "/login"
  },
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = ((user as { role?: Role }).role ?? "USER") as Role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as Role | undefined) ?? "USER";
      }
      return session;
    }
  }
} satisfies NextAuthConfig;
