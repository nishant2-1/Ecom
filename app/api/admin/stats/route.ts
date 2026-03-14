import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/authorization";

export async function GET(): Promise<NextResponse> {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [usersCount, productsCount, ordersCount, paidOrders] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.findMany({ where: { status: "PAID" }, select: { total: true } })
    ]);

    const totalRevenue = paidOrders.reduce(
      (sum: number, order: { total: number }) => sum + Number(order.total),
      0
    );

    return NextResponse.json({
      stats: {
        users: usersCount,
        products: productsCount,
        orders: ordersCount,
        revenue: totalRevenue
      }
    });
  } catch {
    return NextResponse.json({ error: "Failed to load admin stats" }, { status: 500 });
  }
}
