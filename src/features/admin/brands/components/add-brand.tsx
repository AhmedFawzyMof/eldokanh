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
import type { Brand } from "@/types/admin/brands";
import { useBrandMutations } from "../actions";
import { ImageInput } from "@/app/admin/_components/ImageInput";
import axios from "axios";

export function AddBrand() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { addMutation } = useBrandMutations();

  const [formData, setFormData] = useState<Partial<Brand>>({
    name: "",
    nameAr: "",
  });

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
      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }

      addMutation.mutate(formDataToSend, {
        onSuccess: () => {
          setIsOpen(false);
          setFormData({ name: "", nameAr: "" });
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
          إضافة شركة جديدة
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl flex flex-col p-0 overflow-hidden" dir="rtl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-right text-xl font-bold">
            إضافة شركة جديدة
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <form id="add-brand-form" className="space-y-6 pb-6" onSubmit={handleSubmit}>
            <ImageInput
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />

            <div className="grid grid-cols-1 gap-4 border-t pt-6">
              <div className="space-y-2 text-right">
                <Label className="font-bold">اسم الشركة بالعربي</Label>
                <Input
                  value={formData.nameAr}
                  onChange={(e) => handleChange("nameAr", e.target.value)}
                  placeholder="مثال: جهينة"
                  className="rounded-xl h-11 border-slate-200 shadow-sm"
                  required
                />
              </div>
              <div className="space-y-2 text-right">
                <Label className="font-bold">اسم الشركة بالإنجليزي</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="مثال: Juhayna"
                  className="rounded-xl h-11 border-slate-200 shadow-sm"
                />
              </div>
            </div>
          </form>
        </ScrollArea>

        <div className="p-6 border-t bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <Button
            form="add-brand-form"
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
              "إضافة الشركة"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
