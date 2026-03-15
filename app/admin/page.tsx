import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getEmailRuntimeStatus } from "@/lib/email";
import { AdminClient } from "./AdminClient";

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

function resolveAddress(raw: string): string {
  try {
    const parsed = JSON.parse(raw) as {
      city?: string;
      state?: string;
      country?: string;
    };

    return (
      [parsed.city, parsed.state, parsed.country].filter(Boolean).join(", ") ||
      "Unspecified destination"
    );
  } catch {
    return "Unspecified destination";
  }
}

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const [
    usersCount,
    productsCount,
    orderMetrics,
    lowStockCount,
    featuredCount,
    categories,
    products,
    orders,
    users
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.findMany({
      select: {
        total: true,
        status: true
      }
    }),
    prisma.product.count({ where: { stock: { lte: 10 } } }),
    prisma.product.count({ where: { featured: true } }),
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true
      },
      orderBy: { name: "asc" }
    }),
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        stock: true,
        featured: true,
        images: true,
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 12
    }),
    prisma.order.findMany({
      select: {
        id: true,
        status: true,
        total: true,
        createdAt: true,
        address: true,
        user: {
          select: {
            email: true,
            name: true
          }
        },
        _count: {
          select: {
            items: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 10
    }),
    prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            orders: true
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 12
    })
  ]);

  const paidStatuses = new Set(["PAID", "SHIPPED", "DELIVERED"]);
  const paidOrders = orderMetrics.filter((order) => paidStatuses.has(order.status));
  const revenue = paidOrders.reduce((sum, order) => sum + order.total, 0);
  const statusMap = new Map<string, number>([
    ["PENDING", 0],
    ["PAID", 0],
    ["SHIPPED", 0],
    ["DELIVERED", 0],
    ["CANCELLED", 0]
  ]);

  for (const order of orderMetrics) {
    statusMap.set(order.status, (statusMap.get(order.status) ?? 0) + 1);
  }

  const stats = {
    users: usersCount,
    products: productsCount,
    orders: orderMetrics.length,
    revenue,
    lowStock: lowStockCount,
    featured: featuredCount,
    avgPaidOrder: paidOrders.length > 0 ? revenue / paidOrders.length : 0,
    paidOrders: paidOrders.length
  };

  const statusBreakdown = Array.from(statusMap.entries()).map(([status, count]) => ({
    status,
    count
  }));
  const emailStatus = getEmailRuntimeStatus();

  return (
    <section className="mx-auto max-w-[1500px] px-6 py-10 md:px-12">
      <h1 className="text-luxury-heading text-4xl md:text-5xl">Admin Command Center</h1>
      <p className="mt-2 max-w-3xl text-sm text-white/70 md:text-base">
        High-visibility operations for inventory, customers, and order flow with real product
        visuals and a premium control-surface layout.
      </p>

      <div className="mt-8">
        <AdminClient
          initialStats={stats}
          initialProducts={products.map((product) => ({
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            stock: product.stock,
            featured: product.featured,
            image: resolveImage(product.images),
            categoryName: product.category.name,
            categorySlug: product.category.slug
          }))}
          initialCategories={categories}
          initialOrders={orders.map((order) => ({
            id: order.id,
            status: order.status,
            total: order.total,
            createdAt: order.createdAt.toISOString(),
            destination: resolveAddress(order.address),
            itemCount: order._count.items,
            user: {
              email: order.user?.email ?? null,
              name: order.user?.name ?? null
            }
          }))}
          initialUsers={users.map((user) => ({
            id: user.id,
            name: user.name ?? null,
            email: user.email ?? null,
            role: user.role,
            createdAt: user.createdAt.toISOString(),
            orderCount: user._count.orders
          }))}
          initialStatusBreakdown={statusBreakdown}
          initialEmailStatus={emailStatus}
        />
      </div>
    </section>
  );
}
