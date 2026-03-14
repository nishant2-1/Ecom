"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addressSchema } from "@/lib/validations";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

const checkoutFormSchema = z.object({
  street: addressSchema.shape.street,
  city: addressSchema.shape.city,
  state: addressSchema.shape.state,
  zip: addressSchema.shape.zip,
  country: addressSchema.shape.country
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

type CheckoutFormProps = {
  onSubmit: (values: CheckoutFormValues) => Promise<void>;
};

export function CheckoutForm({ onSubmit }: CheckoutFormProps) {
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "India"
    }
  });

  return (
    <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
      <Input placeholder="Street" {...form.register("street")} />
      <Input placeholder="City" {...form.register("city")} />
      <Input placeholder="State" {...form.register("state")} />
      <Input placeholder="ZIP" {...form.register("zip")} />
      <Input placeholder="Country" {...form.register("country")} />
      <Button type="submit">Continue to Payment</Button>
    </form>
  );
}
