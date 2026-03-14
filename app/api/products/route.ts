import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { requireAdminSession } from "@/lib/authorization";

export async function GET(): Promise<NextResponse> {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const payload: unknown = await request.json();
    const parsed = productSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        ...parsed.data,
        images: JSON.stringify(parsed.data.images)
      },
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
      }
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
