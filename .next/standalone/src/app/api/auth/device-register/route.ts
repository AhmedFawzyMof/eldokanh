import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { deviceSessions } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const { deviceId } = await req.json();

    if (!deviceId || typeof deviceId !== "string") {
      return NextResponse.json({ error: "deviceId is required" }, { status: 400 });
    }

    // Expire time: 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Upsert: if deviceId already exists, reset it to pending
    const existing = await db.query.deviceSessions.findFirst({
      where: eq(deviceSessions.deviceId, deviceId),
    });

    if (existing) {
      await db
        .update(deviceSessions)
        .set({ status: "pending", token: null, userId: null, expiresAt })
        .where(eq(deviceSessions.deviceId, deviceId));
    } else {
      await db.insert(deviceSessions).values({ deviceId, expiresAt });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[device-register]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
