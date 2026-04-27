import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ROUTE_PERMISSIONS } from "./lib/admin/route-permissions";
import { hasPermission } from "./types/permissions";

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

      const userPermissions = token.permissions as string;
      const isSuperAdmin = userPermissions === "full";

      // Super Admin Restriction: Only Super Admin can delete orders
      if (pathname.startsWith("/api/admin/orders") && req.method === "DELETE") {
        if (!isSuperAdmin) {
          return NextResponse.json(
            { message: "Only Super Admin can delete orders" },
            { status: 403 },
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
      const sortedRoutes = Object.keys(ROUTE_PERMISSIONS).sort((a, b) => b.length - a.length);
      
      for (const route of sortedRoutes) {
        if (pathname === route || pathname.startsWith(route + "/")) {
          requiredPermission = ROUTE_PERMISSIONS[route];
          break;
        }
      }

      if (requiredPermission && !hasPermission(userPermissions, requiredPermission as any)) {
        // If they don't have permission for this specific page, redirect to dashboard
        if (pathname !== "/admin/dashboard") {
          return NextResponse.redirect(new URL("/admin/dashboard", req.url));
        }
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
