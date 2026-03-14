import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CheckoutClient } from "./CheckoutClient";

export default async function CheckoutPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-12">
      <h1 className="text-luxury-heading text-4xl">Checkout</h1>
      <p className="mt-3 text-white/70">Secure payment with embedded and hosted Stripe options.</p>

      <div className="mt-8">
        <CheckoutClient />
      </div>
    </section>
  );
}
