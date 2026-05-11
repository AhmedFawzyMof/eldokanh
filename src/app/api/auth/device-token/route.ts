import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { deviceSessions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const deviceId = req.nextUrl.searchParams.get("deviceId");

  if (!deviceId) {
    return NextResponse.json({ error: "deviceId is required" }, { status: 400 });
  }

  const session = await db.query.deviceSessions.findFirst({
    where: eq(deviceSessions.deviceId, deviceId),
  });

  if (!session) {
    return NextResponse.json({ status: "not_found" }, { status: 404 });
  }

  // Check expiry
  if (session.expiresAt && new Date(session.expiresAt) < new Date()) {
    await db
      .update(deviceSessions)
      .set({ status: "expired" })
      .where(eq(deviceSessions.deviceId, deviceId));
    return NextResponse.json({ status: "expired" });
  }

  if (session.status === "authenticated" && session.token) {
    // One-time retrieval: expire the session after delivering the token
    await db
      .update(deviceSessions)
      .set({ status: "expired" })
      .where(eq(deviceSessions.deviceId, deviceId));

    return NextResponse.json({ status: "authenticated", token: session.token });
  }

  return NextResponse.json({ status: session.status });
}
