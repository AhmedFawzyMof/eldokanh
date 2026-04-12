"use client";

import { useState, useEffect } from "react";
import type { SubCategory } from "@/types/admin/subcategories";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Edit2 } from "lucide-react";
import { useSubCategoryMutations } from "../actions";

interface EditSubCategoryProps {
  subCategoryEdit: SubCategory;
}

export function EditSubCategory({ subCategoryEdit }: EditSubCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<SubCategory>(subCategoryEdit);
  const { editMutation } = useSubCategoryMutations();

  useEffect(() => {
    if (isOpen) {
      setFormData(subCategoryEdit);
    }
  }, [subCategoryEdit, isOpen]);

  const handleChange = (field: keyof SubCategory, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editMutation.mutate(
      {
        id: formData.id,
        data: formData,
      },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      },
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 gap-2 text-primary hover:text-primary hover:bg-primary/10 rounded-xl"
        >
          <Edit2 className="h-3.5 w-3.5" />
          تعديل
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl flex flex-col p-6 overflow-hidden" dir="rtl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-right text-xl font-bold">
            تعديل القسم الفرعي: {subCategoryEdit.nameAr}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-right">
            <Label className="font-bold">اسم القسم بالعربي</Label>
            <Input
              value={formData.nameAr || ""}
              onChange={(e) => handleChange("nameAr", e.target.value)}
              className="rounded-xl h-11 border-slate-200 shadow-sm"
              required
            />
          </div>
          
          <div className="space-y-2 text-right">
            <Label className="font-bold">اسم القسم بالإنجليزي</Label>
            <Input
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className="rounded-xl h-11 border-slate-200 shadow-sm"
            />
          </div>

          <div className="space-y-2 text-right">
            <Label className="font-bold">الحالة</Label>
            <Select
              value={formData.isActive ? "1" : "0"}
              onValueChange={(v) => handleChange("isActive", v === "1")}
            >
              <SelectTrigger dir="rtl" className="h-11 rounded-xl shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">نشط</SelectItem>
                <SelectItem value="0">معطل</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg font-black rounded-xl shadow-lg shadow-primary/20 mt-4"
            disabled={editMutation.isPending}
          >
            {editMutation.isPending ? (
              <>
                <Loader2 className="ml-3 h-5 w-5 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              "حفظ التغييرات"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
