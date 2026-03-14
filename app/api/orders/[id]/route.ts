import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendShippingUpdateEmail } from "@/lib/email";

type OrderRouteParams = {
  params: {
    id: string;
  };
};

export async function GET(_request: Request, { params }: OrderRouteParams): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: { items: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (session.user.role !== "ADMIN" && order.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: OrderRouteParams): Promise<NextResponse> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payload: unknown = await request.json();

    const status =
      typeof payload === "object" && payload !== null && "status" in payload
        ? String((payload as { status: string }).status)
        : undefined;

    const validStatus = new Set(["PENDING", "PAID", "SHIPPED", "DELIVERED", "CANCELLED"]);

    if (!status || !validStatus.has(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: params.id },
      data: { status },
      include: {
        user: true
      }
    });

    if (order.user.email && (status === "SHIPPED" || status === "DELIVERED")) {
      await sendShippingUpdateEmail(
        order.user.email,
        order.user.name ?? "ShopNova Customer",
        order.id,
        status
      );
    }

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
