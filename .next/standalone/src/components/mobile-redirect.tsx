"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function MobileRedirect() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (status === "loading") return;

    if (
      pathname?.startsWith("/admin") ||
      pathname?.includes("/login") ||
      pathname?.includes("/register")
    ) {
      return;
    }

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const isApp =
      navigator.userAgent.includes("Capacitor") ||
      window.location.search.includes("platform=app");

    if (isMobile && !isApp) {
      const lastRedirect = localStorage.getItem("last_mobile_redirect");
      const now = Date.now();

      if (!lastRedirect || now - parseInt(lastRedirect) > 10 * 60 * 1000) {
        setIsRedirecting(true);
        localStorage.setItem("last_mobile_redirect", now.toString());

        const params = new URLSearchParams();

        const cartData = localStorage.getItem("cart-storage");
        if (cartData) {
          try {
            const parsed = JSON.parse(cartData);
            if (parsed.state && parsed.state.cart) {
              params.set("cart", JSON.stringify(parsed.state.cart));
            }
          } catch (e) {
            console.error("Failed to parse cart data", e);
          }
        }

        setTimeout(() => {
          if (status === "authenticated") {
            window.location.href = `/auth/mobile-success?${params.toString()}`;
          } else {
            window.location.href = `com.eldokanh.app://callback?${params.toString()}`;
          }
        }, 1500);
      }
    }
  }, [status, pathname]);

  if (isRedirecting) {
    return (
      <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-900">
          جاري فتح التطبيق...
        </h2>
        <p className="text-slate-500 mt-2">
          سننقلك إلى تطبيق الدكانة لتجربة أفضل
        </p>
        <button
          onClick={() => setIsRedirecting(false)}
          className="mt-8 text-primary font-medium underline"
        >
          البقاء في المتصفح
        </button>
      </div>
    );
  }

  return null;
}
