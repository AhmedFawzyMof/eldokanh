// src/app/api/admin/send-alert/route.ts
import { NextResponse, NextRequest } from "next/server";
import { getFirebaseAuth } from "@/lib/fcm";

export async function POST(request: NextRequest) {
  try {
    const { targetFid, title, body } = await request.json();
    const projectId = "eldokanh";

    if (!targetFid) {
      return NextResponse.json(
        { error: "Target FID is required" },
        { status: 400 },
      );
    }

    const auth = getFirebaseAuth();
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const accessToken = tokenResponse.token;

    const fcmPayload = {
      message: {
        token: targetFid,
        notification: {
          title: title || "Dashboard Event",
          body: body || "New admin update received.",
        },
        webpush: {
          fcmOptions: {
            link: "https://eldokanh.firebaseapp.com/dashboard",
          },
        },
      },
    };

    const response = await fetch(
      `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fcmPayload),
      },
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("FCM HTTP v1 Error Response:", result);
      return NextResponse.json(
        { error: result.error?.message || "FCM send failed" },
        { status: response.status },
      );
    }

    return NextResponse.json({ success: true, messageId: result.name });
  } catch (error) {
    console.error("Server processing exception:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
