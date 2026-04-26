"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function AdminFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [permissions, setPermissions] = useState(
    searchParams.get("permissions") || "all",
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (search) params.set("search", search);
    else params.delete("search");

    if (permissions !== "all") params.set("permissions", permissions);
    else params.delete("permissions");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, [search, permissions, pathname, router]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          type="search"
          placeholder="ابحث عن مشرف بالاسم أو البريد..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-12 pr-12 text-lg rounded-2xl border-slate-200 focus:ring-primary shadow-sm"
        />
        {isPending && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Select value={permissions} onValueChange={setPermissions}>
          <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
            <SelectValue placeholder="جميع الصلاحيات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الصلاحيات</SelectItem>
            <SelectItem value="full">صلاحية كاملة</SelectItem>
            <SelectItem value="restricted">صلاحية محدودة</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
