"use client";

import { cn } from "@/lib/utils";
import { Home, Menu, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { adminPages } from "@/lib/admin/pages";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const [fullUrl, setFullUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const host = window.location.host;
      const protocol = window.location.protocol;
      setFullUrl(`${protocol}//${host}${pathname}`);
    }
  }, [pathname]);

  const currentPage =
    adminPages.find((page) => page.href === pathname)?.title ||
    "لوحة المعلومات";

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/admin/login");
  };

  if (fullUrl.includes("admin/login")) {
    return null;
  }

  return (
    <div className="sticky top-0 z-40 flex flex-row-reverse items-center justify-between h-12 py-2 px-4 shadow bg-background">
      <Link href="/admin/dashboard">
        <p className="text-2xl font-bold">{currentPage}</p>
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Menu className="h-6 w-6 text-primary cursor-pointer" />
        </SheetTrigger>
        <SheetContent side="right" className="w-72 px-4 flex flex-col h-full">
          <SheetHeader>
            <SheetTitle>
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-2 px-2"
              >
                <Home className="h-6 w-6" />
                <span className="font-bold text-xl">الدكان ماركت</span>
              </Link>
            </SheetTitle>
          </SheetHeader>

          <nav dir="rtl" className="flex-1 px-4 py-4 overflow-y-auto">
            <div className="grid gap-1">
              {adminPages.map((page, index) => (
                <Link
                  key={index}
                  href={page.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-primary",
                    pathname === page.href
                      ? "bg-secondary font-medium text-primary"
                      : "text-muted-foreground",
                  )}
                >
                  <page.icon className="h-4 w-4" />
                  <span>{page.title}</span>
                  {/* Badge logic can be added here if needed, linking to API counts */}
                </Link>
              ))}
            </div>
          </nav>

          <SheetFooter className="mt-auto">
            <SheetClose asChild>
              <Button
                variant="destructive"
                className="w-full flex items-center gap-2"
                onClick={handleLogout}
                disabled={!session}
              >
                <LogOut className="h-4 w-4" />
                تسجيل الخروج
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
