"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus } from "lucide-react";
import type { SubCategory } from "@/types/admin/subcategories";
import { useSubCategoryMutations } from "../actions";

interface AddSubCategoryProps {
  categories: { id: number; nameAr: string }[];
}

export function AddSubCategory({ categories }: AddSubCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { addMutation } = useSubCategoryMutations();

  const [formData, setFormData] = useState<Partial<SubCategory>>({
    name: "",
    nameAr: "",
    description: "",
    descriptionAr: "",
    categoryId: 0,
  });

  const handleChange = (field: keyof SubCategory, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) return;

    addMutation.mutate(formData, {
      onSuccess: () => {
        setIsOpen(false);
        setFormData({ name: "", nameAr: "", description: "", descriptionAr: "", categoryId: 0 });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold rounded-xl h-11 px-6 shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          إضافة قسم فرعي جديد
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl flex flex-col p-6 overflow-hidden" dir="rtl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-right text-xl font-bold">
            إضافة قسم فرعي جديد
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto max-h-[70vh] pr-1">
          {/* Parent Category */}
          <div className="space-y-2 text-right">
            <Label className="font-bold">القسم الرئيسي</Label>
            <Select
              onValueChange={(v) => handleChange("categoryId", Number(v))}
              required
            >
              <SelectTrigger dir="rtl" className="h-11 rounded-xl shadow-sm">
                <SelectValue placeholder="اختر القسم الرئيسي" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Arabic Name */}
          <div className="space-y-2 text-right">
            <Label className="font-bold">اسم القسم بالعربي</Label>
            <Input
              value={formData.nameAr}
              onChange={(e) => handleChange("nameAr", e.target.value)}
              placeholder="مثال: مكونات الطهي"
              className="rounded-xl h-11 border-slate-200 shadow-sm"
              required
            />
          </div>

          {/* English Name */}
          <div className="space-y-2 text-right">
            <Label className="font-bold">اسم القسم بالإنجليزي</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="مثال: Cooking Ingredients"
              className="rounded-xl h-11 border-slate-200 shadow-sm"
            />
          </div>

          {/* Arabic Description */}
          <div className="space-y-2 text-right">
            <Label className="font-bold">الوصف بالعربي</Label>
            <Textarea
              value={formData.descriptionAr}
              onChange={(e) => handleChange("descriptionAr", e.target.value)}
              placeholder="مثال: يشمل جميع مكونات الطهي الأساسية"
              className="rounded-xl border-slate-200 shadow-sm resize-none"
              rows={3}
            />
          </div>

          {/* English Description */}
          <div className="space-y-2 text-right">
            <Label className="font-bold">الوصف بالإنجليزي</Label>
            <Textarea
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="e.g. Includes all basic cooking ingredients"
              className="rounded-xl border-slate-200 shadow-sm resize-none"
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg font-black rounded-xl shadow-lg shadow-primary/20 mt-2"
            disabled={addMutation.isPending || !formData.categoryId}
          >
            {addMutation.isPending ? (
              <>
                <Loader2 className="ml-3 h-5 w-5 animate-spin" />
                جاري الإضافة...
              </>
            ) : (
              "إضافة القسم"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
