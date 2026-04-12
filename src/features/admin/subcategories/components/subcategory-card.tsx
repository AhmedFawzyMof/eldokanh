"use client";

import type { SubCategory } from "@/types/admin/subcategories";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { LayoutGrid, Info } from "lucide-react";
import { EditSubCategory } from "@/features/admin/subcategories/components/edit-subcategory";

export function SubCategoryCard({
  subcategory,
  selectedSubCategories,
  setSelectedSubCategories,
}: {
  subcategory: SubCategory;
  selectedSubCategories: number[];
  setSelectedSubCategories: (prev: any) => void;
}) {
  const isSelected = selectedSubCategories.includes(subcategory.id);

  const toggleSelect = (id: number) => {
    setSelectedSubCategories((prev: any) =>
      prev.includes(id) ? prev.filter((i: number) => i !== id) : [...prev, id],
    );
  };

  return (
    <Card
      onClick={() => toggleSelect(subcategory.id)}
      className={`overflow-hidden border-none shadow-sm transition-all active:scale-[0.98] cursor-pointer ${
        isSelected ? "ring-2 ring-primary bg-primary/5" : "bg-white"
      }`}
    >
      <CardContent className="p-0">
        <div className="flex p-4 gap-4 items-center">
          <div className="relative shrink-0">
            <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
              <LayoutGrid className="h-8 w-8 text-primary/30" />
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
                <Badge
                  variant={subcategory.isActive ? "secondary" : "outline"}
                  className={`text-[10px] px-1.5 h-5 shrink-0 ${
                    subcategory.isActive
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                      : ""
                  }`}
                >
                  {subcategory.isActive ? "نشط" : "معطل"}
                </Badge>
                <div className="flex flex-col flex-1">
                  <h3 className="font-bold text-base text-slate-900 leading-tight truncate">
                    {subcategory.nameAr}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
                    {subcategory.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                <span>{subcategory.productCount || 0} منتج</span>
                <span className="mx-1">•</span>
                <span>ID: {subcategory.id}</span>
                <Info className="h-3 w-3" />
              </div>

              <EditSubCategory subCategoryEdit={subcategory} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
