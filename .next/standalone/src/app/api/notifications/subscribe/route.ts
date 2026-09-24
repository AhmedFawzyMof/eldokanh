// src/app/api/notifications/subscribe/route.ts
// Public: subscribes a visitor's FCM token to the visitors topic.
// The token itself is NEVER persisted in the DB — FCM manages the
// token-to-topic mapping; we just relay the subscription.
import { NextRequest, NextResponse } from "next/server";
import {
  checkFCMConfig,
  subscribeTokenToTopic,
  VISITORS_TOPIC,
} from "@/lib/fcm";

export async function POST(req: NextRequest) {
  const configError = checkFCMConfig();
  if (configError) {
    return NextResponse.json(
      { error: `Notification setup incomplete: ${configError}` },
      { status: 500 },
    );
  }

  try {
    const { token } = await req.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "FCM token is required" },
        { status: 400 },
      );
    }

    const result = await subscribeTokenToTopic(token, VISITORS_TOPIC);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to subscribe" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Subscribe route exception:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}