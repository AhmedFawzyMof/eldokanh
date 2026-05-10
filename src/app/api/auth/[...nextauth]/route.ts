import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest } from "next/server";

const MOBILE_SCHEMES = ["com.eldokanh.app://"];

function isMobileCallback(url: string) {
  return MOBILE_SCHEMES.some((scheme) => url.startsWith(scheme));
}

function rewriteRequest(req: NextRequest) {
  const url = req.nextUrl.clone();
  const callbackUrl = url.searchParams.get("callbackUrl");

  if (callbackUrl && isMobileCallback(callbackUrl)) {
    // Replace the deep-link callbackUrl with a server-side relay URL.
    // The original mobile URL is stored in a separate param so auth.ts can use it.
    const relayUrl = `${url.origin}/api/auth/mobile-relay?target=${encodeURIComponent(callbackUrl)}`;
    url.searchParams.set("callbackUrl", relayUrl);
    return new NextRequest(url, req);
  }

  return req;
}

const handler = NextAuth(authOptions);

export async function GET(req: NextRequest, ctx: { params: { nextauth: string[] } }) {
  return handler(rewriteRequest(req), ctx);
}

export async function POST(req: NextRequest, ctx: { params: { nextauth: string[] } }) {
  return handler(rewriteRequest(req), ctx);
}

