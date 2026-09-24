import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-session";

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession();

    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error("Session route error:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
