"use client";

import { useState } from "react";
import { Trash2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryCard } from "./category-card";
import { useCategoryMutations } from "../actions";
import type { Category } from "@/types/admin/categories";

interface CategoryListContainerProps {
  initialCategories: Category[];
}

export function CategoryListContainer({
  initialCategories,
}: CategoryListContainerProps) {
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const { deleteMutation } = useCategoryMutations();

  const handleDelete = () => {
    deleteMutation.mutate(selectedCategories, {
      onSuccess: () => setSelectedCategories([]),
    });
  };

  return (
    <>
      <div className="p-4 space-y-4">
        {initialCategories.length > 0 ? (
          initialCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
            <Layers className="h-16 w-16 stroke-1 px-4 opacity-20" />
            <p className="text-lg">لا توجد أقسام مطابقة للبحث</p>
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      {selectedCategories.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between animate-in fade-in zoom-in slide-in-from-bottom-10 border border-slate-700">
            <div className="flex flex-col">
              <span className="text-sm font-bold">
                تم تحديد {selectedCategories.length} قسم
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCategories([])}
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
