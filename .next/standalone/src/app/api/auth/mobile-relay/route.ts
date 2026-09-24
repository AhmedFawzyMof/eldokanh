import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const target = req.nextUrl.searchParams.get("target");

  if (!target) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!target.startsWith("com.eldokanh.app://")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.redirect(target);
}
