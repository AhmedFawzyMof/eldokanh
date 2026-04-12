"use client";

import { useState, useEffect } from "react";
import type { Brand } from "@/types/admin/brands";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Edit2 } from "lucide-react";
import { useBrandMutations } from "../actions";
import { ImageInput } from "@/app/admin/_components/ImageInput";
import axios from "axios";

interface EditBrandProps {
  brandEdit: Brand;
}

export function EditBrand({ brandEdit }: EditBrandProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Brand>(brandEdit);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { editMutation } = useBrandMutations();

  useEffect(() => {
    if (isOpen) {
      setFormData(brandEdit);
      setSelectedFile(null);
    }
  }, [brandEdit, isOpen]);

  const handleChange = (field: keyof Brand, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nameAr", formData.nameAr || "");
      formDataToSend.append("name", formData.name || "");
      formDataToSend.append("imageUrl", formData.imageUrl || (formData as any).image || "");
      
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

      <DialogContent className="sm:max-w-lg rounded-2xl flex flex-col p-0 overflow-hidden" dir="rtl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-right text-xl font-bold">
            تعديل الشركة: {brandEdit.nameAr}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <form id="edit-brand-form" className="space-y-6 pb-6" onSubmit={handleSubmit}>
            <ImageInput
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              image={formData.imageUrl || (formData as any).image}
            />
            
            <div className="grid grid-cols-1 gap-4 border-t pt-6">
              <div className="space-y-2 text-right">
                <Label className="font-bold">اسم الشركة بالعربي</Label>
                <Input
                  value={formData.nameAr || ""}
                  onChange={(e) => handleChange("nameAr", e.target.value)}
                  className="rounded-xl h-11 border-slate-200 shadow-sm"
                  required
                />
              </div>
              <div className="space-y-2 text-right">
                <Label className="font-bold">اسم الشركة بالإنجليزي</Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="rounded-xl h-11 border-slate-200 shadow-sm"
                />
              </div>
            </div>
          </form>
        </ScrollArea>

        <div className="p-6 border-t bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <Button
            form="edit-brand-form"
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
