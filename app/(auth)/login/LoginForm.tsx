"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { loginSchema } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError(null);

    try {
      await signIn("resend", {
        email: values.email,
        redirectTo: "/account"
      });
    } catch {
      setError("Unable to send login link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button className="w-full" onClick={() => signIn("google", { redirectTo: "/account" })}>
          Continue with Google
        </Button>
        <Button className="w-full" onClick={() => signIn("github", { redirectTo: "/account" })}>
          Continue with GitHub
        </Button>
      </div>

      <div className="relative my-2">
        <div className="h-px w-full bg-white/15" />
        <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-luxury-bg px-3 text-xs text-white/60">
          or use email magic link
        </span>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <Input type="email" placeholder="you@example.com" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
        ) : null}
        {error ? <p className="text-xs text-red-400">{error}</p> : null}
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Sending link..." : "Send Magic Link"}
        </Button>
      </form>
    </div>
  );
}
