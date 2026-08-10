// src/app/api/admin/notifications/route.ts
// Admin-only: broadcast a custom notification to site visitors (topic,
// no DB storage) or send it exclusively to admin accounts (same targets
// used by order notifications). Nothing is stored in the DB.
import { NextRequest, NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth-session";
import {
  checkFCMConfig,
  sendFCMMessage,
  sendFCMToTopic,
  VISITORS_TOPIC,
} from "@/lib/fcm";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { isNotNull } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json(
      { error: "Admin access required" },
      { status: 403 },
    );
  }

  const configError = checkFCMConfig();
  if (configError) {
    return NextResponse.json(
      { error: `إعدادات الإشعارات غير مكتملة: ${configError}` },
      { status: 500 },
    );
  }

  try {
    const { title, body, link, audience } = await req.json();

    if (!title || !title.trim() || !body || !body.trim()) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 },
      );
    }

    const target = audience === "admins" ? "admins" : "visitors";

    if (target === "admins") {
      // Send to the same admins that receive order notifications.
      const adminUsers = await db
        .select({ fid: admins.fid })
        .from(admins)
        .where(isNotNull(admins.fid));

      let sentCount = 0;
      for (const admin of adminUsers) {
        if (admin.fid) {
          const result = await sendFCMMessage(
            admin.fid,
            title.trim(),
            body.trim(),
            link?.trim() || undefined,
          );
          if (result.success) sentCount++;
        }
      }

      return NextResponse.json({
        success: true,
        sentTo: "admins",
        sentCount,
      });
    }

    const result = await sendFCMToTopic(
      VISITORS_TOPIC,
      title.trim(),
      body.trim(),
      link?.trim() || undefined,
    );

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "FCM send failed" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      sentTo: "visitors",
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("Admin notification broadcast exception:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 },
    );
  }
}