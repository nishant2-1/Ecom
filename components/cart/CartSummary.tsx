import { formatCurrency } from "@/lib/utils";

type CartSummaryProps = {
  subtotal: number;
};

export function CartSummary({ subtotal }: CartSummaryProps) {
  const shipping = subtotal > 10000 ? 0 : 199;
  const total = subtotal + shipping;

  return (
    <div className="glass-card rounded-2xl p-4">
      <h3 className="text-luxury-heading text-xl">Summary</h3>
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between text-white/70">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-white/70">
          <span>Shipping</span>
          <span>{formatCurrency(shipping)}</span>
        </div>
        <div className="flex justify-between border-t border-white/10 pt-2 text-white">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}
