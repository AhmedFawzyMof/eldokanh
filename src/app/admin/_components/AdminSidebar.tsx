"use client";

import { cn } from "@/lib/utils";
import { Home, Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { adminPages } from "@/lib/admin/pages";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery } from "@tanstack/react-query";
import adminApi from "@/lib/admin/api";
import { hasPermission } from "@/types/permissions";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [fullUrl, setFullUrl] = useState("");

  const userPermissions = session?.user?.permissions;
  const userRole = session?.user?.role;
  const isAdmin = userRole === "admin";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.host;
      const protocol = window.location.protocol;
      setFullUrl(`${protocol}//${host}${pathname}`);
    }
  }, [pathname]);

  const { data } = useQuery({
    queryKey: ["admin", "sidebar"],
    queryFn: async () => {
      return await adminApi.get("/counters");
    },
  });

  const effectivePermissions = userPermissions || (isAdmin ? "full" : "");

  const filteredPages =
    status === "loading"
      ? []
      : adminPages.filter((page) => {
          if (status === "authenticated") {
            return hasPermission(
              effectivePermissions || "full",
              page.permission as any,
            );
          }
          return false;
        });

  const currentPage =
    adminPages.find((page) => page.href === pathname)?.title ||
    "لوحة المعلومات";

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  if (pathname.includes("admin/login")) {
    return null;
  }

  const NavContent = () => (
    <div className="flex flex-col h-full bg-card border-l">
      <div className="p-6">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <Home className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl tracking-tight">الدكان ماركت</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1 py-4" dir="rtl">
          {filteredPages.map((page, index) => {
            const isActive = pathname === page.href;
            return (
              <Link
                key={index}
                href={page.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/10"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <page.icon
                  className={cn(
                    "h-5 w-5",
                    isActive
                      ? "text-primary-foreground"
                      : "text-muted-foreground group-hover:text-primary",
                  )}
                />
                <span className="font-medium">{page.title}</span>
                {page.badge &&
                  (() => {
                    const count =
                      page.href === "/admin/contact"
                        ? data?.data.contacts
                        : page.href === "/admin/orders"
                          ? data?.data.orders
                          : 0;

                    if (!count || count === 0) return null;

                    return (
                      <span
                        className={cn(
                          "mr-auto flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                          isActive
                            ? "bg-primary-foreground text-primary"
                            : "bg-primary text-primary-foreground",
                        )}
                      >
                        {count}
                      </span>
                    );
                  })()}
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      <div className="p-4 mt-auto border-t">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
          onClick={handleLogout}
          disabled={!session}
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">تسجيل الخروج</span>
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header and Sidebar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between h-16 py-2 px-4 shadow-sm bg-background border-b w-full">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-6 w-6 text-primary" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-80">
            <NavContent />
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold">{currentPage}</span>
        </div>
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 right-0 z-50 w-72 flex-col">
        <NavContent />
      </aside>
    </>
  );
}
