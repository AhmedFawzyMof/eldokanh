"use client";

import { useState } from "react";
import { Trash2, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BrandCard } from "./brand-card";
import { useBrandMutations } from "../actions";
import type { Brand } from "@/types/admin/brands";

interface BrandListContainerProps {
  initialBrands: Brand[];
}

export function BrandListContainer({ initialBrands }: BrandListContainerProps) {
  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const { deleteMutation } = useBrandMutations();

  const handleDelete = () => {
    deleteMutation.mutate(selectedBrands, {
      onSuccess: () => setSelectedBrands([]),
    });
  };

  return (
    <>
      <div className="p-4 space-y-4">
        {initialBrands.length > 0 ? (
          initialBrands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              selectedBrands={selectedBrands}
              setSelectedBrands={setSelectedBrands}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
            <Building2 className="h-16 w-16 stroke-1 px-4 opacity-20" />
            <p className="text-lg">لا توجد شركات مطابقة للبحث</p>
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      {selectedBrands.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between animate-in fade-in zoom-in slide-in-from-bottom-10 border border-slate-700">
            <div className="flex flex-col">
              <span className="text-sm font-bold">
                تم تحديد {selectedBrands.length} شركة
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedBrands([])}
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
