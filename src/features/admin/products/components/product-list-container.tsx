"use client";

import { useState } from "react";
import { Trash2, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "./product-card";
import { useProductMutations } from "../actions";
import type { Product } from "@/types/admin/products";

interface ProductListContainerProps {
  products: Product[];
  categories: any[];
  brands: any[];
  totalCount: number;
}

export function ProductListContainer({
  products,
  categories,
  brands,
  totalCount,
}: ProductListContainerProps) {
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const { deleteMutation } = useProductMutations();

  const handleDelete = () => {
    deleteMutation.mutate(selectedProducts, {
      onSuccess: () => setSelectedProducts([]),
    });
  };

  return (
    <>
      <div className="p-4 grid grid-cols-1 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categories={categories}
              brands={brands}
              selectedProducts={selectedProducts}
              setSelectedProducts={setSelectedProducts}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
            <PackageX className="h-16 w-16 stroke-1 px-4" />
            <p className="text-lg">لا توجد منتجات حالياً تطابق بحثك</p>
          </div>
        )}
      </div>

      {/* Selection Action Bar */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between animate-in fade-in zoom-in slide-in-from-bottom-10 border border-slate-700">
            <div className="flex flex-col">
              <span className="text-sm font-bold">
                تم تحديد {selectedProducts.length} منتج
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProducts([])}
                className="text-white hover:bg-white/10 rounded-xl"
              >
                إلغاء
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="rounded-xl shadow-lg px-4"
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4 ml-2" />
                <span>حذف المحدد</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
