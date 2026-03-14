import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdminSession } from "@/lib/authorization";

const schema = z.object({
  role: z.enum(["ADMIN", "USER"])
});

type Params = {
  params: {
    id: string;
  };
};

export async function PATCH(request: Request, { params }: Params): Promise<NextResponse> {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body: unknown = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: params.id },
      data: { role: parsed.data.role },
      select: {
        id: true,
        email: true,
        role: true,
        name: true
      }
    });

    return NextResponse.json({ user: updated });
  } catch {
    return NextResponse.json({ error: "Failed to update user role" }, { status: 500 });
  }
}
