"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useState } from "react";

interface ProductFiltersProps {
  categories: any[];
  brands: any[];
}

export function ProductFilters({ categories, brands }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("categoryId") || "all");
  const [brand, setBrand] = useState(searchParams.get("brandId") || "all");

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (search) params.set("search", search);
    else params.delete("search");

    if (category !== "all") params.set("categoryId", category);
    else params.delete("categoryId");

    if (brand !== "all") params.set("brandId", brand);
    else params.delete("brandId");

    // Reset to page 1 on filter change
    params.set("page", "1");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  }, [search, category, brand, pathname, router]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          type="search"
          placeholder="ابحث عن منتج..."
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

      <div className="grid grid-cols-2 gap-3">
        <Select
          value={category}
          onValueChange={setCategory}
        >
          <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
            <SelectValue placeholder="جميع الفئات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفئات</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={String(c.id)}>
                {c.nameAr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={brand}
          onValueChange={setBrand}
        >
          <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
            <SelectValue placeholder="جميع الشركات" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الشركات</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b.id} value={String(b.id)}>
                {b.nameAr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
