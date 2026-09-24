"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Package, Plus, Search, Check } from "lucide-react";
import adminApi from "@/lib/admin/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Product } from "@/types/admin/products";

export function AddProductDialog({
  existingProductIds = [],
  onAdd,
}: {
  existingProductIds?: number[];
  onAdd: (product: Product) => void;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isFetching } = useQuery({
    queryKey: ["admin", "products", "order-picker", search],
    queryFn: async () => {
      const res = await adminApi.get("/products", {
        params: { search: search || undefined, page: 1 },
      });
      return res.data;
    },
    enabled: open,
    staleTime: 60_000,
  });

  const products: Product[] = data?.products?.products || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="rounded-xl">
          <Plus className="h-4 w-4 ml-2" />
          إضافة منتج
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl max-h-[85dvh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-lg font-black">
            إضافة منتج إلى الطلب
          </DialogTitle>
          <div className="relative mt-3">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              autoFocus
              placeholder="ابحث عن منتج..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-11 pr-10 rounded-xl border-slate-200 focus:ring-primary"
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isFetching ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-300 gap-3">
              <Package className="h-12 w-12" />
              <p className="text-sm text-slate-400">لا توجد منتجات مطابقة</p>
            </div>
          ) : (
            products.map((product) => {
              const added = existingProductIds.includes(product.id!);
              return (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => onAdd(product)}
                  disabled={added}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl border border-slate-100 bg-white hover:border-primary/30 hover:bg-primary/5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-default disabled:hover:border-slate-100 disabled:hover:bg-white text-right"
                >
                  <div className="h-14 w-14 shrink-0 rounded-xl bg-slate-50 overflow-hidden flex items-center justify-center">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.nameAr}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Package className="h-6 w-6 text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900 truncate">
                      {product.nameAr}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {product.price?.toLocaleString()} ج.م
                      {product.stockQuantity !== undefined && (
                        <span className="mr-2">
                          متاح: {product.stockQuantity}
                        </span>
                      )}
                    </p>
                  </div>
                  {added ? (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-1">
                      <Check className="h-3 w-3" />
                      مضافة
                    </span>
                  ) : (
                    <span className="bg-primary/10 p-2 rounded-lg text-primary">
                      <Plus className="h-4 w-4" />
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
