import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { enforceRateLimit } from "@/lib/rate-limit";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const forwarded = request.headers.get("x-forwarded-for") ?? "anonymous";
    const ip = forwarded.split(",")[0]?.trim() || "anonymous";

    const limit = await enforceRateLimit(`register:${ip}`, 6, 60);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts. Please try again shortly." },
        { status: 429 }
      );
    }

    const body: unknown = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, email } = parsed.data;

    const user = await prisma.user.upsert({
      where: { email },
      update: { name },
      create: {
        name,
        email,
        role: "USER"
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    await sendWelcomeEmail(email, name);

    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to register user" }, { status: 500 });
  }
}
