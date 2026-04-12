import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const ALLOWED_ORIGIN = "https://admin-app-tjbd.vercel.app";
const PUBLIC_API_ROUTES = ["/api/admin/login"];

function withCors(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  return response;
}

async function handleApiAdminMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (req.method === "OPTIONS") {
    return withCors(new NextResponse(null, { status: 204 }));
  }

  if (PUBLIC_API_ROUTES.some((route) => pathname.startsWith(route))) {
    return withCors(NextResponse.next());
  }

  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return withCors(
      NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
    );
  }

  try {
    jwt.verify(token, process.env.NEXTAUTH_SECRET!);
    return withCors(NextResponse.next());
  } catch {
    return withCors(
      NextResponse.json({ message: "Invalid token" }, { status: 401 }),
    );
  }
}

export default withAuth(
  async function middleware(req) {
    const { pathname } = req.nextUrl;
    if (pathname.startsWith("/api/admin")) {
      return await handleApiAdminMiddleware(req);
    }
    const token = req.nextauth.token;
    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/api/admin")) return true;
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
