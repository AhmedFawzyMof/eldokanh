import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const ALLOWED_ORIGIN = "https://admin-app-tjbd.vercel.app";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (req.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 204 });
      response.headers.set("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,OPTIONS",
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization",
      );
      response.headers.set("Access-Control-Allow-Credentials", "true");
      return response;
    }

    if (pathname.startsWith("/api/admin")) {
      if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      if (token.role !== "admin") {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }
    }

    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/admin/login",
    },
  },
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
