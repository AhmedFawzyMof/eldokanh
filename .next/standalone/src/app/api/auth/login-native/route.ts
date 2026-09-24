import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, admins } from "@/db/schema";
import { eq } from "drizzle-orm";
import { encode } from "next-auth/jwt";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const adminData = await db.query.admins.findFirst({
      where: eq(admins.userId, user.id),
    });
    const role = adminData ? "admin" : "user";
    const permissions = adminData?.permissions || "";

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
    console.error("Login Native Auth Error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
