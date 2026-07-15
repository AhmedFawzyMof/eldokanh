"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function StoreStatusBanner() {
  const [isClosed, setIsClosed] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 0 && hour < 11) {
      setIsClosed(true);
    }
  }, []);

  if (!isClosed) return null;
  if (pathname?.startsWith("/admin")) return null;

  return (
    <div className="bg-red-500 text-white px-4 py-2 text-center text-sm font-medium z-50 relative shadow-sm">
      <strong className="font-bold">تنبيه: </strong>
      لا يمكن توصيل الطلبات بعد الساعة 12 صباحاً.
    </div>
  );
}
