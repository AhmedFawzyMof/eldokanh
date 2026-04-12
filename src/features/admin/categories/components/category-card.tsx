"use client";

import type { Category } from "@/types/admin/categories";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Layers, Info } from "lucide-react";
import { EditCategory } from "@/features/admin/categories/components/edit-category";

export function CategoryCard({
  category,
  selectedCategories,
  setSelectedCategories,
}: {
  category: Category;
  selectedCategories: number[];
  setSelectedCategories: (prev: any) => void;
}) {
  const isSelected = selectedCategories.includes(category.id);

  const toggleSelect = (id: number) => {
    setSelectedCategories((prev: any) =>
      prev.includes(id) ? prev.filter((i: number) => i !== id) : [...prev, id],
    );
  };

  return (
    <Card
      onClick={() => toggleSelect(category.id)}
      className={`overflow-hidden border-none shadow-sm transition-all active:scale-[0.98] cursor-pointer ${
        isSelected ? "ring-2 ring-primary bg-primary/5" : "bg-white"
      }`}
    >
      <CardContent className="p-0">
        <div className="flex p-3 gap-4">
          <div className="relative shrink-0">
            <div className="h-20 w-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
              {category.imageUrl || (category as any).image ? (
                <img
                  src={category.imageUrl || (category as any).image}
                  alt={category.nameAr}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Layers className="h-8 w-8 text-slate-300" />
              )}
            </div>
            <div
              className={`absolute -top-1 -right-1 transition-opacity ${isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
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
                  variant={category.productCount ? "secondary" : "outline"}
                  className="text-[10px] px-1.5 h-5 shrink-0"
                >
                  {category.productCount || 0} منتج
                </Badge>
                <div className="flex flex-col flex-1">
                  <h3 className="font-bold text-sm text-slate-900 leading-tight truncate">
                    {category.nameAr}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">
                    {category.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                <span>ID: {category.id}</span>
                <Info className="h-3 w-3" />
              </div>

              <EditCategory categoryEdit={category} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
