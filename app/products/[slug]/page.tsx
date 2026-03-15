import { notFound } from "next/navigation";
import { Product3DViewer } from "@/components/product/Product3DViewer";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { catalogProducts, getProductDetails } from "@/lib/mock-data";
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

  const details = getProductDetails(product);

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 md:px-12">
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="glass-card rounded-3xl p-4">
          <Product3DViewer />
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs uppercase tracking-[0.2em] text-luxury-amber">
              {product.category}
            </p>
            <span className="rounded-full border border-luxury-amber/50 px-3 py-1 text-xs text-luxury-amber">
              {details.rating.toFixed(1)} / 5 rating
            </span>
            <span className="text-xs text-white/60">{details.reviews}+ verified buyer reviews</span>
          </div>
          <h1 className="text-luxury-heading text-4xl md:text-5xl">{product.name}</h1>
          <p className="text-2xl text-luxury-amber">{formatCurrency(product.price)}</p>
          <p className="max-w-xl text-white/75">{product.description}</p>
          <p className="max-w-2xl text-sm text-white/70">{details.story}</p>

          <div className="grid gap-4 md:grid-cols-2">
            <article className="glass-card rounded-2xl p-4">
              <h2 className="text-luxury-heading text-lg">Highlights</h2>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                {details.highlights.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="text-luxury-amber">+</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="glass-card rounded-2xl p-4">
              <h2 className="text-luxury-heading text-lg">Specifications</h2>
              <dl className="mt-3 space-y-2 text-sm">
                {details.specs.map((spec) => (
                  <div key={spec.label} className="flex items-center justify-between gap-4">
                    <dt className="text-white/60">{spec.label}</dt>
                    <dd className="text-right text-white/85">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </article>
          </div>

          <div className="glass-card rounded-2xl p-4">
            <h2 className="text-luxury-heading text-2xl">3D Product Viewer</h2>
            <p className="mt-2 text-sm text-white/70">
              Drag to orbit, zoom to inspect surfaces, and evaluate form from every angle.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <article className="glass-card rounded-2xl p-4">
              <h2 className="text-luxury-heading text-base">Materials</h2>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                {details.materials.map((material) => (
                  <li key={material}>{material}</li>
                ))}
              </ul>
            </article>

            <article className="glass-card rounded-2xl p-4">
              <h2 className="text-luxury-heading text-base">In The Box</h2>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                {details.inTheBox.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            <article className="glass-card rounded-2xl p-4">
              <h2 className="text-luxury-heading text-base">Service</h2>
              <p className="mt-3 text-sm text-white/75">{details.shipping}</p>
              <p className="mt-3 text-sm text-white/75">{details.warranty}</p>
              <p className="mt-3 text-sm text-white/60">{details.care}</p>
            </article>
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
