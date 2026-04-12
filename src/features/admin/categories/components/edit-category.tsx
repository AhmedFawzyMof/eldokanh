"use client";

import { useState, useEffect } from "react";
import type { Category } from "@/types/admin/categories";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Edit2 } from "lucide-react";
import { useCategoryMutations } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import { ImageInput } from "@/app/admin/_components/ImageInput";
import axios from "axios";

interface EditCategoryProps {
  categoryEdit: Category;
}

export function EditCategory({ categoryEdit }: EditCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Category>(categoryEdit);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { editMutation } = useCategoryMutations();

  useEffect(() => {
    if (isOpen) {
      setFormData(categoryEdit);
      setSelectedFile(null);
    }
  }, [categoryEdit, isOpen]);

  const handleChange = (field: keyof Category, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nameAr", formData.nameAr || "");
      formDataToSend.append("name", formData.name || "");
      formDataToSend.append("descriptionAr", (formData as any).descriptionAr || "");
      formDataToSend.append("description", (formData as any).description || "");
      formDataToSend.append("image", formData.imageUrl || (formData as any).image || "");
      
      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
        formDataToSend.append("oldImageUrl", formData.imageUrl || (formData as any).image || "");
      }

      editMutation.mutate(
        {
          id: formData.id,
          data: formDataToSend,
        },
        {
          onSuccess: () => {
            setIsOpen(false);
            setSelectedFile(null);
          },
        },
      );
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
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

      <DialogContent
        className="sm:max-w-lg rounded-2xl flex flex-col p-0 overflow-hidden"
        dir="rtl"
      >
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-right text-xl font-bold">
            تعديل القسم: {categoryEdit.nameAr}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <form
            id="edit-category-form"
            className="space-y-6 pb-6"
            onSubmit={handleSubmit}
          >
            <ImageInput
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              image={formData.imageUrl || (formData as any).image}
            />

            <div className="grid grid-cols-1 gap-4 border-t pt-6">
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
            </div>

            <div className="space-y-2 text-right border-t pt-6">
              <Label className="font-bold">الوصف بالعربي</Label>
              <Textarea
                value={(formData as any).descriptionAr || ""}
                onChange={(e) =>
                  handleChange("descriptionAr" as any, e.target.value)
                }
                className="rounded-xl min-h-[100px] border-slate-200 shadow-sm"
                rows={3}
              />
            </div>
          </form>
        </ScrollArea>

        <div className="p-6 border-t bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <Button
            form="edit-category-form"
            type="submit"
            className="w-full h-12 text-lg font-black rounded-xl shadow-lg shadow-primary/20"
            disabled={editMutation.isPending || isUploading}
          >
            {editMutation.isPending || isUploading ? (
              <>
                <Loader2 className="ml-3 h-5 w-5 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              "حفظ التغييرات"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
