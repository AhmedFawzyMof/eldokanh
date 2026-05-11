import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import { db } from "@/db";
import { deviceSessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { encode } from "next-auth/jwt";
import { NextRequest } from "next/server";

export async function GET(request: Request) {
  const req = request as unknown as NextRequest;
  const { searchParams } = new URL(request.url);
  const deviceId = searchParams.get("deviceId");

  if (!deviceId) {
    return new Response("Missing deviceId", { status: 400 });
  }

  // Get the current user's JWT token from cookie
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  if (!token || !token.id) {
    // Not authenticated — redirect to login carrying the deviceId forward
    return Response.redirect(
      new URL(
        `/login?deviceId=${encodeURIComponent(deviceId)}`,
        request.url,
      ),
    );
  }

  // Find the pending device session
  const deviceSession = await db.query.deviceSessions.findFirst({
    where: eq(deviceSessions.deviceId, deviceId),
  });

  if (deviceSession && deviceSession.status === "pending") {
    // Encode a lightweight token the mobile app can use
    const encodedToken = await encode({
      token: {
        id: token.id,
        name: token.name,
        email: token.email,
        role: token.role,
      },
      secret: process.env.NEXTAUTH_SECRET!,
    });

    await db
      .update(deviceSessions)
      .set({
        status: "authenticated",
        userId: parseInt(token.id as string),
        token: encodedToken,
      })
      .where(eq(deviceSessions.deviceId, deviceId));

    console.log("[device-success] Device session authenticated:", deviceId);
  }

  // Redirect to the main site (the browser will close or user can navigate away)
  return Response.redirect(new URL("/products", request.url));
}
