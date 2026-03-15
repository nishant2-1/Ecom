import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { AntigravityShowcase } from "@/components/three/AntigravityShowcase";
import { formatCurrency } from "@/lib/utils";

const FALLBACK_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop";

function resolveImage(raw: string): string {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
      return parsed[0];
    }
  } catch {
    return FALLBACK_PRODUCT_IMAGE;
  }

  return FALLBACK_PRODUCT_IMAGE;
}

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const [orders, addresses, reviews, products] = await Promise.all([
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
      take: 6
    }),
    prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }]
    }),
    prisma.review.findMany({
      where: { userId: session.user.id },
      include: { product: true },
      orderBy: { createdAt: "desc" },
      take: 6
    }),
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        images: true,
        price: true,
        category: {
          select: {
            name: true
          }
        }
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 8
    })
  ]);

  const spent = orders.reduce((sum, order) => sum + order.total, 0);
  const activeOrders = orders.filter(
    (order) => order.status !== "DELIVERED" && order.status !== "CANCELLED"
  ).length;
  const avgOrder = orders.length > 0 ? spent / orders.length : 0;

  const showcaseProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    image: resolveImage(product.images),
    category: product.category.name,
    price: product.price
  }));

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-12 md:px-12">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_10%,rgba(245,166,35,0.16),transparent_36%),radial-gradient(circle_at_80%_75%,rgba(255,255,255,0.08),transparent_38%)]" />

      <div className="overflow-hidden rounded-[34px] border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.11),rgba(255,255,255,0.03))] p-6 shadow-glass md:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-luxury-amber">
              Antigravity Command Deck
            </p>
            <h1 className="mt-3 text-luxury-heading text-4xl leading-tight md:text-5xl">
              Welcome back, {session.user.name ?? "Customer"}
            </h1>
            <p className="mt-4 max-w-2xl text-sm text-white/70 md:text-base">
              Your personal commerce cockpit blends live metrics, immersive 3D motion, and curated
              products so every return feels like a premium control room.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">Orders</p>
                <p className="mt-2 text-3xl text-luxury-amber">{orders.length}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">Active</p>
                <p className="mt-2 text-3xl text-luxury-amber">{activeOrders}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">Spent</p>
                <p className="mt-2 text-xl text-luxury-amber">{formatCurrency(spent)}</p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.22em] text-white/60">Avg Order</p>
                <p className="mt-2 text-xl text-luxury-amber">{formatCurrency(avgOrder)}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="rounded-xl bg-luxury-amber px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Explore Products
              </Link>
              <Link
                href="/checkout"
                className="rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:border-luxury-amber hover:text-luxury-amber"
              >
                Continue Checkout
              </Link>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/15 bg-black/25 p-3 shadow-amber">
            <AntigravityShowcase />
          </div>
        </div>
      </div>

      <div className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-5">
            <h2 className="text-luxury-heading text-2xl">Recent Orders</h2>
            <div className="mt-4 space-y-3">
              {orders.length === 0 ? (
                <p className="text-sm text-white/60">No orders yet.</p>
              ) : (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm"
                  >
                    <div className="flex items-center justify-between text-white/80">
                      <span>#{order.id.slice(0, 10)}</span>
                      <span className="text-luxury-amber">{formatCurrency(order.total)}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs">
                      <span className="text-white/60">{order.items.length} items</span>
                      <span className="rounded-full border border-white/20 px-2 py-1 text-white/75">
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5">
            <h2 className="text-luxury-heading text-2xl">Reviews and Address Book</h2>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-white/10 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Reviews</p>
                <div className="mt-3 space-y-2">
                  {reviews.length === 0 ? (
                    <p className="text-sm text-white/60">No reviews yet.</p>
                  ) : (
                    reviews.slice(0, 3).map((review) => (
                      <div key={review.id} className="rounded-lg bg-white/5 p-2 text-sm">
                        <p className="text-white">{review.product.name}</p>
                        <p className="text-xs text-white/65">Rating: {review.rating}/5</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 p-3">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60">Addresses</p>
                <div className="mt-3 space-y-2">
                  {addresses.length === 0 ? (
                    <p className="text-sm text-white/60">No saved addresses.</p>
                  ) : (
                    addresses.slice(0, 3).map((address) => (
                      <div
                        key={address.id}
                        className="rounded-lg bg-white/5 p-2 text-sm text-white/80"
                      >
                        <p>{address.street}</p>
                        <p className="text-xs text-white/65">
                          {address.city}, {address.state} {address.zip}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-luxury-amber">
                3D Commerce Picks
              </p>
              <h2 className="text-luxury-heading text-2xl">Live Product Display</h2>
            </div>
            <Link href="/products" className="text-sm text-white/70 hover:text-luxury-amber">
              View all
            </Link>
          </div>

          <div className="mt-4 space-y-3">
            {showcaseProducts.length === 0 ? (
              <p className="text-sm text-white/60">
                Products will appear here once inventory is added.
              </p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {showcaseProducts.map((product) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group overflow-hidden rounded-xl border border-white/10 bg-black/20 transition duration-300 hover:-translate-y-1 hover:border-luxury-amber/60"
                  >
                    <div className="relative h-36 overflow-hidden">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    </div>
                    <div className="p-3">
                      <p className="text-[11px] uppercase tracking-[0.15em] text-white/55">
                        {product.category}
                      </p>
                      <p className="mt-1 text-sm text-white">{product.name}</p>
                      <p className="mt-1 text-sm text-luxury-amber">
                        {formatCurrency(product.price)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3 text-xs text-white/65">
            Visual mode is powered by WebGL with floating orbital geometry and dynamic lighting to
            create a real-world, anti-gravity dashboard feel.
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white/65">
        Tip: Open this on desktop for full 3D interaction. Mobile keeps the same data and product
        richness with optimized rendering.
      </div>
    </section>
  );
}
