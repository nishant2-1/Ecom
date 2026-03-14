import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/authorization";
import { getEmailRuntimeStatus } from "@/lib/email";

export async function GET(): Promise<NextResponse> {
  try {
    const session = await requireAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ email: getEmailRuntimeStatus() });
  } catch {
    return NextResponse.json({ error: "Failed to load email status" }, { status: 500 });
  }
}
