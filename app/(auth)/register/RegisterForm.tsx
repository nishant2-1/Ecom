"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { z } from "zod";
import { registerSchema } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type RegisterFormValues = z.infer<typeof registerSchema>;

type RegisterFormProps = {
  providers: {
    google: boolean;
    github: boolean;
    magicLink: boolean;
  };
};

export function RegisterForm({ providers }: RegisterFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: ""
    }
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      await signIn("resend", {
        email: values.email,
        redirectTo: "/account"
      });
    } catch {
      setError("Could not create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          className="w-full"
          disabled={!providers.google}
          onClick={() => signIn("google", { redirectTo: "/account" })}
        >
          Google
        </Button>
        <Button
          className="w-full"
          disabled={!providers.github}
          onClick={() => signIn("github", { redirectTo: "/account" })}
        >
          GitHub
        </Button>
      </div>

      {!providers.google || !providers.github ? (
        <p className="text-xs text-white/60">
          Social login is disabled until provider credentials are configured in `.env.local`.
        </p>
      ) : null}

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <Input type="text" placeholder="Your full name" {...form.register("name")} />
        {form.formState.errors.name ? (
          <p className="text-xs text-red-400">{form.formState.errors.name.message}</p>
        ) : null}

        <Input type="email" placeholder="you@example.com" {...form.register("email")} />
        {form.formState.errors.email ? (
          <p className="text-xs text-red-400">{form.formState.errors.email.message}</p>
        ) : null}

        {error ? <p className="text-xs text-red-400">{error}</p> : null}

        <Button className="w-full" type="submit" disabled={loading || !providers.magicLink}>
          {loading ? "Creating account..." : "Create Account & Send Magic Link"}
        </Button>

        {!providers.magicLink ? (
          <p className="text-xs text-white/60">
            Magic link is disabled until `RESEND_API_KEY` is configured.
          </p>
        ) : null}
      </form>
    </div>
  );
}
