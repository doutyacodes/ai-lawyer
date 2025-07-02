import { authenticate } from "@/lib/auth-server";
import { NextResponse } from "next/server";

export async function GET(req) {
  const result = await authenticate();

  if (!result.success) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
