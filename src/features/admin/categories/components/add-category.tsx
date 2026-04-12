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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus } from "lucide-react";
import type { Category } from "@/types/admin/categories";
import { useCategoryMutations } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import { ImageInput } from "@/app/admin/_components/ImageInput";
import axios from "axios";

export function AddCategory() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { addMutation } = useCategoryMutations();

  const [formData, setFormData] = useState<Partial<Category>>({
    name: "",
    nameAr: "",
    descriptionAr: "",
  });


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
      formDataToSend.append("descriptionAr", formData.descriptionAr || "");
      formDataToSend.append("description", formData.description || "");
      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }

      addMutation.mutate(formDataToSend, {
        onSuccess: () => {
          setIsOpen(false);
          setFormData({ name: "", nameAr: "", descriptionAr: "" });
          setSelectedFile(null);
        },
      });
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold rounded-xl h-11 px-6 shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          إضافة قسم جديد
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl flex flex-col p-0 overflow-hidden" dir="rtl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-right text-xl font-bold">
            إضافة قسم جديد
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <form
            id="add-category-form"
            className="space-y-6 pb-6"
            onSubmit={handleSubmit}
          >
            <ImageInput
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />

            <div className="grid grid-cols-1 gap-4 border-t pt-6">
              <div className="space-y-2 text-right">
                <Label className="font-bold">اسم القسم بالعربي</Label>
                <Input
                  value={formData.nameAr}
                  onChange={(e) => handleChange("nameAr", e.target.value)}
                  placeholder="مثال: الخضروات"
                  className="rounded-xl h-11 border-slate-200 shadow-sm"
                  required
                />
              </div>
              <div className="space-y-2 text-right">
                <Label className="font-bold">اسم القسم بالإنجليزي</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="مثال: Vegetables"
                  className="rounded-xl h-11 border-slate-200 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2 text-right border-t pt-6">
              <Label className="font-bold">الوصف بالعربي</Label>
              <Textarea
                value={formData.descriptionAr}
                onChange={(e) => handleChange("descriptionAr", e.target.value)}
                placeholder="وصف مختصر للقسم..."
                className="rounded-xl min-h-[100px] border-slate-200 shadow-sm"
                rows={3}
              />
            </div>
          </form>
        </ScrollArea>

        <div className="p-6 border-t bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <Button
            form="add-category-form"
            type="submit"
            className="w-full h-12 text-lg font-black rounded-xl shadow-lg shadow-primary/20"
            disabled={addMutation.isPending || isUploading}
          >
            {addMutation.isPending || isUploading ? (
              <>
                <Loader2 className="ml-3 h-5 w-5 animate-spin" />
                جاري الإضافة...
              </>
            ) : (
              "إضافة القسم"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
