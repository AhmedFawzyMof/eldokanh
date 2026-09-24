"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function BrandSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [value, setValue] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, [value, pathname, router]);

  return (
    <div className="relative text-right">
      <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
      <Input
        type="search"
        placeholder="البحث عن شركة..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-12 pr-12 text-lg rounded-2xl border-slate-200 focus:ring-primary shadow-sm"
      />
      {isPending && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
