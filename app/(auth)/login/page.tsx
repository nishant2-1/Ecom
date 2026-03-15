import Link from "next/link";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  const authProviders = {
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    github: Boolean(process.env.GITHUB_ID && process.env.GITHUB_SECRET),
    magicLink: Boolean(process.env.RESEND_API_KEY)
  };

  return (
    <section className="mx-auto max-w-md px-6 py-20">
      <div className="glass-card rounded-2xl p-8 shadow-glass">
        <h1 className="text-luxury-heading text-3xl">Login</h1>
        <p className="mt-2 text-sm text-white/70">Use Google, GitHub, or a secure magic link.</p>
        <div className="mt-6">
          <LoginForm providers={authProviders} />
        </div>
        <p className="mt-5 text-center text-xs text-white/60">
          New here?{" "}
          <Link href="/register" className="text-luxury-amber hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
