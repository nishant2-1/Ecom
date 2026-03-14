import { notFound } from "next/navigation";
import { Product3DViewer } from "@/components/product/Product3DViewer";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { catalogProducts } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

type ProductDetailPageProps = {
  params: {
    slug: string;
  };
};

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = catalogProducts.find((item) => item.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="glass-card rounded-3xl p-4">
          <Product3DViewer />
        </div>

        <div className="space-y-6">
          <p className="text-xs uppercase tracking-[0.2em] text-luxury-amber">{product.category}</p>
          <h1 className="text-luxury-heading text-4xl md:text-5xl">{product.name}</h1>
          <p className="text-2xl text-luxury-amber">{formatCurrency(product.price)}</p>
          <p className="max-w-xl text-white/75">{product.description}</p>

          <div className="glass-card rounded-2xl p-4">
            <h2 className="text-luxury-heading text-2xl">3D Product Viewer</h2>
            <p className="mt-2 text-sm text-white/70">
              Drag to orbit, zoom to inspect surfaces, and evaluate form from every angle.
            </p>
          </div>

          <AddToCartButton
            productId={product.id}
            name={product.name}
            image={product.image}
            price={product.price}
          />
        </div>
      </div>
    </section>
  );
}
