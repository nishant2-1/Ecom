"use client";

import Image from "next/image";
import { FormEvent, useDeferredValue, useMemo, useState } from "react";
import { AdminCommandScene } from "@/components/three/AdminCommandScene";
import { formatCurrency } from "@/lib/utils";

type AdminStats = {
  users: number;
  products: number;
  orders: number;
  revenue: number;
  lowStock: number;
  featured: number;
  avgPaidOrder: number;
  paidOrders: number;
};

type AdminCategory = {
  id: string;
  name: string;
  slug: string;
};

type AdminProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  featured: boolean;
  image: string;
  categoryName: string;
  categorySlug: string;
};

type AdminOrder = {
  id: string;
  status: string;
  total: number;
  createdAt: string;
  destination: string;
  itemCount: number;
  user?: {
    email?: string | null;
    name?: string | null;
  } | null;
};

type AdminUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
  createdAt: string;
  orderCount: number;
};

type StatusBreakdown = {
  status: string;
  count: number;
};

type AdminClientProps = {
  initialStats: AdminStats;
  initialCategories: AdminCategory[];
  initialProducts: AdminProduct[];
  initialOrders: AdminOrder[];
  initialUsers: AdminUser[];
  initialStatusBreakdown: StatusBreakdown[];
};

const STATUS_OPTIONS = ["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"];
const ROLE_OPTIONS = ["USER", "ADMIN"];
const STATUS_ACCENTS: Record<string, string> = {
  PENDING: "border-white/20 text-white/70",
  PAID: "border-emerald-400/30 text-emerald-300",
  SHIPPED: "border-sky-400/30 text-sky-300",
  DELIVERED: "border-luxury-amber/40 text-luxury-amber",
  CANCELLED: "border-rose-400/30 text-rose-300"
};

function statusWidth(count: number, total: number): string {
  if (total <= 0) {
    return "0%";
  }

  return `${Math.max(8, Math.round((count / total) * 100))}%`;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(new Date(date));
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseProductResponse(data: {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    stock: number;
    featured: boolean;
    images: string;
    category: {
      name: string;
      slug: string;
    };
  };
}): AdminProduct {
  let image = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop";

  try {
    const parsed = JSON.parse(data.product.images) as unknown;
    if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === "string") {
      image = parsed[0];
    }
  } catch {
    image = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop";
  }

  return {
    id: data.product.id,
    name: data.product.name,
    slug: data.product.slug,
    price: data.product.price,
    stock: data.product.stock,
    featured: data.product.featured,
    image,
    categoryName: data.product.category.name,
    categorySlug: data.product.category.slug
  };
}

export function AdminClient({
  initialStats,
  initialCategories,
  initialProducts,
  initialOrders,
  initialUsers,
  initialStatusBreakdown
}: AdminClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [users, setUsers] = useState(initialUsers);
  const [stats, setStats] = useState(initialStats);
  const [statusBreakdown, setStatusBreakdown] = useState(initialStatusBreakdown);
  const [creating, setCreating] = useState(false);
  const [inventoryQuery, setInventoryQuery] = useState("");
  const [orderFilter, setOrderFilter] = useState("ALL");
  const [userQuery, setUserQuery] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const deferredInventoryQuery = useDeferredValue(inventoryQuery);
  const deferredUserQuery = useDeferredValue(userQuery);

  const topLine = useMemo(
    () => [
      { label: "Revenue", value: formatCurrency(stats.revenue), hint: `${stats.paidOrders} monetized orders` },
      { label: "Orders", value: String(stats.orders), hint: `${statusBreakdown.find((item) => item.status === "PENDING")?.count ?? 0} pending` },
      { label: "Inventory", value: String(stats.products), hint: `${stats.lowStock} low-stock items` },
      { label: "Audience", value: String(stats.users), hint: `${stats.featured} featured products live` },
      { label: "Avg Paid Order", value: formatCurrency(stats.avgPaidOrder), hint: "High-value checkout signal" }
    ],
    [stats, statusBreakdown]
  );

  const filteredProducts = useMemo(() => {
    const query = deferredInventoryQuery.trim().toLowerCase();
    if (!query) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(query) ||
        product.categoryName.toLowerCase().includes(query) ||
        product.slug.toLowerCase().includes(query)
      );
    });
  }, [deferredInventoryQuery, products]);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => (orderFilter === "ALL" ? true : order.status === orderFilter));
  }, [orderFilter, orders]);

  const filteredUsers = useMemo(() => {
    const query = deferredUserQuery.trim().toLowerCase();
    if (!query) {
      return users;
    }

    return users.filter((user) => {
      return (
        (user.name ?? "").toLowerCase().includes(query) ||
        (user.email ?? "").toLowerCase().includes(query) ||
        user.role.toLowerCase().includes(query)
      );
    });
  }, [deferredUserQuery, users]);

  const addProduct = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const image = String(formData.get("image") ?? "").trim();
    const categoryId = String(formData.get("categoryId") ?? "");
    const price = Number(formData.get("price") ?? 0);
    const comparePrice = Number(formData.get("comparePrice") ?? 0);
    const stock = Number(formData.get("stock") ?? 0);

    const payload = {
      name,
      slug: slugify(String(formData.get("slug") ?? "").trim() || name),
      description: String(formData.get("description") ?? "").trim(),
      price,
      comparePrice: comparePrice > 0 ? comparePrice : undefined,
      images: [image],
      categoryId,
      stock,
      featured: Boolean(formData.get("featured"))
    };

    setCreating(true);
    setMessage(null);

    const response = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setCreating(false);

    if (!response.ok) {
      setMessage("Product creation failed. Check the fields and try again.");
      return;
    }

    const data = (await response.json()) as {
      product: {
        id: string;
        name: string;
        slug: string;
        price: number;
        stock: number;
        featured: boolean;
        images: string;
        category: {
          name: string;
          slug: string;
        };
      };
    };

    const nextProduct = parseProductResponse(data);

    setProducts((current) => [nextProduct, ...current]);
    setStats((current) => ({
      ...current,
      products: current.products + 1,
      featured: current.featured + (nextProduct.featured ? 1 : 0),
      lowStock: current.lowStock + (nextProduct.stock <= 10 ? 1 : 0)
    }));
    setMessage(`Product created: ${nextProduct.name}`);
    event.currentTarget.reset();
  };

  const deleteProduct = async (product: AdminProduct) => {
    const response = await fetch(`/api/products/${product.id}`, { method: "DELETE" });
    if (!response.ok) {
      setMessage(`Could not delete ${product.name}.`);
      return;
    }

    setProducts((current) => current.filter((item) => item.id !== product.id));
    setStats((current) => ({
      ...current,
      products: Math.max(0, current.products - 1),
      featured: Math.max(0, current.featured - (product.featured ? 1 : 0)),
      lowStock: Math.max(0, current.lowStock - (product.stock <= 10 ? 1 : 0))
    }));
    setMessage(`Deleted ${product.name}.`);
  };

  const updateOrderStatus = async (id: string, previousStatus: string, status: string) => {
    const response = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      setMessage(`Could not update order ${id.slice(0, 8)}.`);
      return;
    }

    setOrders((current) => current.map((order) => (order.id === id ? { ...order, status } : order)));
    setStatusBreakdown((current) =>
      current.map((item) => {
        if (item.status === previousStatus) {
          return { ...item, count: Math.max(0, item.count - 1) };
        }

        if (item.status === status) {
          return { ...item, count: item.count + 1 };
        }

        return item;
      })
    );
    setMessage(`Order ${id.slice(0, 8)} moved to ${status}.`);
  };

  const updateUserRole = async (id: string, role: string) => {
    const response = await fetch(`/api/admin/users/${id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role })
    });

    if (!response.ok) {
      setMessage("Role update failed.");
      return;
    }

    setUsers((current) => current.map((user) => (user.id === id ? { ...user, role } : user)));
    setMessage(`Access updated to ${role}.`);
  };

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[34px] border border-white/15 bg-[linear-gradient(135deg,rgba(255,255,255,0.1),rgba(255,255,255,0.02))] p-6 shadow-glass md:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr] xl:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-luxury-amber">Operations Deck</p>
            <h2 className="mt-3 text-luxury-heading text-4xl leading-tight md:text-5xl">
              Orchestrate inventory, access, and order flow in one gravity-free workspace.
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-white/70 md:text-base">
              This admin surface is tuned like a live retail control room: visual inventory, status pressure, customer access, and product creation without dead space.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {topLine.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/55">{item.label}</p>
                  <p className="mt-2 text-2xl text-luxury-amber">{item.value}</p>
                  <p className="mt-1 text-xs text-white/45">{item.hint}</p>
                </div>
              ))}
            </div>

            {message ? (
              <div className="mt-4 rounded-xl border border-luxury-amber/30 bg-luxury-amber/10 px-4 py-3 text-sm text-luxury-amber">
                {message}
              </div>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-white/15 bg-black/25 p-3 shadow-amber">
            <AdminCommandScene />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-luxury-amber">Order Pulse</p>
              <h3 className="text-luxury-heading text-2xl">Status Distribution</h3>
            </div>
            <p className="text-xs text-white/50">Real-time operational pressure</p>
          </div>

          <div className="mt-4 space-y-3">
            {statusBreakdown.map((item) => (
              <div key={item.status}>
                <div className="mb-1 flex items-center justify-between text-xs text-white/65">
                  <span>{item.status}</span>
                  <span>{item.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[linear-gradient(90deg,rgba(245,166,35,0.95),rgba(255,255,255,0.6))]"
                    style={{ width: statusWidth(item.count, Math.max(1, stats.orders)) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-luxury-amber">New Inventory</p>
              <h3 className="text-luxury-heading text-2xl">Create Product</h3>
            </div>
            <p className="text-xs text-white/50">Adds straight into live catalog</p>
          </div>

          <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={addProduct}>
            <input name="name" placeholder="Product name" className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm" required />
            <input name="slug" placeholder="Slug (optional)" className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm" />
            <textarea name="description" placeholder="Describe the product" className="min-h-[108px] rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm md:col-span-2" required />
            <input name="image" type="url" placeholder="Primary image URL" className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm md:col-span-2" required />
            <select name="categoryId" className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm" required defaultValue="">
              <option value="" disabled>
                Select category
              </option>
              {initialCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <input name="price" type="number" step="0.01" min="0" placeholder="Price" className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm" required />
            <input name="comparePrice" type="number" step="0.01" min="0" placeholder="Compare price" className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm" />
            <input name="stock" type="number" min="0" placeholder="Stock" className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm" required />
            <label className="flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80">
              <input type="checkbox" name="featured" className="mr-2" /> Feature in storefront
            </label>
            <button disabled={creating} className="rounded-xl bg-luxury-amber px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 md:col-span-2">
              {creating ? "Deploying product..." : "Create Product"}
            </button>
          </form>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card rounded-2xl p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-luxury-amber">Inventory Visuals</p>
              <h3 className="text-luxury-heading text-2xl">Live Product Grid</h3>
            </div>
            <input
              value={inventoryQuery}
              onChange={(event) => setInventoryQuery(event.target.value)}
              placeholder="Search products or categories"
              className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm sm:w-72"
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="group overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                <div className="relative h-40 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />
                  <div className="absolute left-3 top-3 flex gap-2">
                    <span className="rounded-full border border-white/20 bg-black/35 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-white/75">
                      {product.categoryName}
                    </span>
                    {product.featured ? (
                      <span className="rounded-full border border-luxury-amber/30 bg-luxury-amber/10 px-2 py-1 text-[10px] uppercase tracking-[0.16em] text-luxury-amber">
                        Featured
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-white">{product.name}</p>
                      <p className="text-xs text-white/50">/{product.slug}</p>
                    </div>
                    <p className="text-sm text-luxury-amber">{formatCurrency(product.price)}</p>
                  </div>
                  <div className="flex items-center justify-between text-xs text-white/60">
                    <span>Stock: {product.stock}</span>
                    <button onClick={() => deleteProduct(product)} className="text-rose-300 transition hover:text-rose-200">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-2xl p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-luxury-amber">Order Flow</p>
              <h3 className="text-luxury-heading text-2xl">Operations Board</h3>
            </div>
            <select
              value={orderFilter}
              onChange={(event) => setOrderFilter(event.target.value)}
              className="rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
            >
              <option value="ALL">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 space-y-3">
            {filteredOrders.map((order) => (
              <div key={order.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-white">#{order.id.slice(0, 10)}</p>
                    <p className="text-xs text-white/55">{order.user?.email ?? "Unknown customer"}</p>
                  </div>
                  <span className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.14em] ${STATUS_ACCENTS[order.status] ?? "border-white/20 text-white/70"}`}>
                    {order.status}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-white/65">
                  <p>{order.itemCount} items</p>
                  <p className="text-right text-luxury-amber">{formatCurrency(order.total)}</p>
                  <p>{order.destination}</p>
                  <p className="text-right">{formatDate(order.createdAt)}</p>
                </div>
                <select
                  value={order.status}
                  onChange={(event) => updateOrderStatus(order.id, order.status, event.target.value)}
                  className="mt-3 w-full rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
                >
                  {STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="glass-card rounded-2xl p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-luxury-amber">Access Matrix</p>
            <h3 className="text-luxury-heading text-2xl">User Roles</h3>
          </div>
          <input
            value={userQuery}
            onChange={(event) => setUserQuery(event.target.value)}
            placeholder="Search users or roles"
            className="w-full rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm sm:w-72"
          />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredUsers.map((user) => (
            <div key={user.id} className="rounded-xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-white">{user.name ?? "Unnamed operator"}</p>
                  <p className="text-xs text-white/55">{user.email ?? "No email"}</p>
                </div>
                <span className="rounded-full border border-white/15 px-2 py-1 text-[10px] uppercase tracking-[0.15em] text-white/70">
                  {user.orderCount} orders
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-white/55">
                <span>Joined {formatDate(user.createdAt)}</span>
                <span>{user.role}</span>
              </div>
              <select
                value={user.role}
                onChange={(event) => updateUserRole(user.id, event.target.value)}
                className="mt-3 w-full rounded-xl border border-white/20 bg-black/40 px-3 py-2 text-sm"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
