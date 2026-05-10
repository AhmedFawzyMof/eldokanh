import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ROUTE_PERMISSIONS } from "./lib/admin/route-permissions";
import { hasPermission } from "./types/permissions";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost",
  "capacitor://localhost",
];

function applyCors(req: any, res: NextResponse) {
  const origin = req.headers.get("origin") || "";
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin)
    ? origin
    : ALLOWED_ORIGINS[0];
  res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  res.headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS",
  );
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  res.headers.set("Access-Control-Allow-Credentials", "true");
  return res;
}

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    if (req.method === "OPTIONS") {
      return applyCors(req, new NextResponse(null, { status: 204 }));
    }

    if (pathname.startsWith("/api/admin")) {
      if (!token) {
        return applyCors(
          req,
          NextResponse.json({ message: "Unauthorized" }, { status: 401 }),
        );
      }
      if (token.role !== "admin") {
        return applyCors(
          req,
          NextResponse.json({ message: "Forbidden" }, { status: 403 }),
        );
      }

      const userPermissions = token.permissions as string;
      const isSuperAdmin = userPermissions === "full";

      // Super Admin Restriction: Only Super Admin can delete orders
      if (pathname.startsWith("/api/admin/orders") && req.method === "DELETE") {
        if (!isSuperAdmin) {
          return applyCors(
            req,
            NextResponse.json(
              { message: "Only Super Admin can delete orders" },
              { status: 403 },
            ),
          );
        }
      }
    }

    if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
      if (token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Check granular permissions for admin pages
      const userPermissions = token.permissions as string;

      // Find the matching route permission
      let requiredPermission: string | undefined;
      const sortedRoutes = Object.keys(ROUTE_PERMISSIONS).sort(
        (a, b) => b.length - a.length,
      );

      for (const route of sortedRoutes) {
        if (pathname === route || pathname.startsWith(route + "/")) {
          requiredPermission = ROUTE_PERMISSIONS[route];
          break;
        }
      }

      if (
        requiredPermission &&
        !hasPermission(userPermissions, requiredPermission as any)
      ) {
        // If they don't have permission for this specific page, redirect to dashboard
        if (pathname !== "/admin/dashboard") {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
      }
    }

    return applyCors(req, NextResponse.next());
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        // Allow public API paths to bypass the middleware token check
        if (
          pathname.startsWith("/api/") &&
          !pathname.startsWith("/api/admin")
        ) {
          return true;
        }
        return !!token;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  },
);

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/((?!auth).*)", // match /api/* but NOT /api/auth/*
  ],
};
