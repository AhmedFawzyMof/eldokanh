import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { db } from "@/db";
import { users, admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { encode } from "next-auth/jwt";

export async function POST(req: NextRequest) {
  try {
    const { idToken } = await req.json();

    if (!idToken) {
      return NextResponse.json({ error: "idToken is required" }, { status: 400 });
    }

    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return NextResponse.json({ error: "Invalid token payload" }, { status: 400 });
    }

    let user = await db.query.users.findFirst({
      where: eq(users.email, payload.email),
    });

    if (!user) {
      const result = await db
        .insert(users)
        .values({
          name: payload.name || payload.email.split("@")[0],
          email: payload.email,
          provider: "google",
          providerId: payload.sub,
          password: null,
        })
        .returning();
      user = result[0];
    }

    // Check role
    const adminData = await db.query.admins.findFirst({
      where: eq(admins.userId, user.id),
    });
    const role = adminData ? "admin" : "user";
    const permissions = adminData?.permissions || "";

    // Generate JWT that NextAuth can read
    const token = await encode({
      token: {
        id: user.id.toString(),
        name: user.name,
        email: user.email,
        role,
        permissions,
      },
      secret: process.env.NEXTAUTH_SECRET!,
    });

    return NextResponse.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email, 
        role 
      } 
    });
  } catch (error: any) {
    console.error("Google Native Auth Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
