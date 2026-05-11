import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function getAuthSession() {
  // 1. Try standard cookie-based session
  const session = await getServerSession(authOptions);
  if (session) return session;

  // 2. Fallback to Bearer token for mobile apps
  try {
    // We need to simulate a request object for getToken
    const headerList = await headers();
    const req = {
      headers: Object.fromEntries(headerList.entries()),
      cookies: {},
    } as any;

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (token) {
      return {
        user: {
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          role: token.role as string,
          permissions: token.permissions as string,
        },
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };
    }
  } catch (error) {
    console.error("Bearer token session retrieval failed:", error);
  }

  return null;
}
