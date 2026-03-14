import { formatCurrency } from "@/lib/utils";

type CartItemProps = {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  onRemove?: (productId: string) => void;
};

export function CartItem({ productId, name, quantity, price, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-white/10 p-3">
      <div>
        <p className="text-sm text-white">{name}</p>
        <p className="text-xs text-white/60">Qty: {quantity}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-luxury-amber">{formatCurrency(price * quantity)}</p>
        {onRemove ? (
          <button
            type="button"
            onClick={() => onRemove(productId)}
            className="mt-1 text-xs text-red-300 transition hover:text-red-400"
          >
            Remove
          </button>
        ) : null}
      </div>
    </div>
  );
}
