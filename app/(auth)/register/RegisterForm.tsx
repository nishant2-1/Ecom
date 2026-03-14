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

export function RegisterForm() {
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
        <Button className="w-full" onClick={() => signIn("google", { redirectTo: "/account" })}>
          Google
        </Button>
        <Button className="w-full" onClick={() => signIn("github", { redirectTo: "/account" })}>
          GitHub
        </Button>
      </div>

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

        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Create Account & Send Magic Link"}
        </Button>
      </form>
    </div>
  );
}
