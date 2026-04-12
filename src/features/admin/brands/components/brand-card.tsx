"use client";

import type { Brand } from "@/types/admin/brands";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Info } from "lucide-react";
import { EditBrand } from "@/features/admin/brands/components/edit-brand";

export function BrandCard({
  brand,
  selectedBrands,
  setSelectedBrands,
}: {
  brand: Brand;
  selectedBrands: number[];
  setSelectedBrands: (prev: any) => void;
}) {
  const isSelected = selectedBrands.includes(brand.id);

  const toggleSelect = (id: number) => {
    setSelectedBrands((prev: any) =>
      prev.includes(id) ? prev.filter((i: number) => i !== id) : [...prev, id],
    );
  };

  return (
    <Card
      onClick={() => toggleSelect(brand.id)}
      className={`overflow-hidden border-none shadow-sm transition-all active:scale-[0.98] cursor-pointer ${
        isSelected ? "ring-2 ring-primary bg-primary/5" : "bg-white"
      }`}
    >
      <CardContent className="p-0">
        <div className="flex p-3 gap-4">
          <div className="relative shrink-0">
            <div className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
              {brand.imageUrl || (brand as any).image ? (
                <img
                  src={brand.imageUrl || (brand as any).image}
                  alt={brand.nameAr}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Building2 className="h-8 w-8 text-slate-300" />
              )}
            </div>
            <div
              className={`absolute -top-1 -right-1 transition-opacity ${isSelected ? "opacity-100" : "opacity-0"}`}
            >
              <Checkbox
                checked={isSelected}
                className="h-5 w-5 rounded-full bg-white shadow-sm border-slate-200"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between min-w-0 text-right">
            <div>
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col flex-1">
                  <h3 className="font-bold text-sm text-slate-900 leading-tight truncate">
                    {brand.nameAr}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
                    {brand.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                <span>ID: {brand.id}</span>
                <Info className="h-3 w-3" />
              </div>

              <EditBrand brandEdit={brand} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
