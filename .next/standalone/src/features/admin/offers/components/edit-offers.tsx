"use client";

import { useState, useEffect } from "react";
import type { Offer } from "@/types/admin/offers";
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
import { useOfferMutations } from "../actions";
import { ImageInput } from "@/app/admin/_components/ImageInput";
import axios from "axios";

interface EditOfferProps {
  offerEdit: Offer;
  categories: { id: number; nameAr: string }[];
  brands: { id: number; nameAr: string }[];
}

export function EditOffer({ offerEdit, categories, brands }: EditOfferProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Offer>(offerEdit);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { editMutation } = useOfferMutations();

  useEffect(() => {
    if (isOpen) {
      setFormData(offerEdit);
      setSelectedFile(null);
    }
  }, [offerEdit, isOpen]);

  const handleChange = (field: keyof Offer, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formDataToSend = new FormData();
      if (formData.productId)
        formDataToSend.append("productId", String(formData.productId));
      if (formData.categoryId)
        formDataToSend.append("categoryId", String(formData.categoryId));
      if (formData.brandId)
        formDataToSend.append("brandId", String(formData.brandId));
      formDataToSend.append("image", formData.image || "");

      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
        formDataToSend.append("oldImageUrl", formData.image || "");
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
            تعديل العرض الترويجي #{offerEdit.id}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <form
            id="edit-offer-form"
            className="space-y-6 pb-6"
            onSubmit={handleSubmit}
          >
            <ImageInput
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
              image={formData.image}
            />

            <div className="grid grid-cols-1 gap-6 border-t pt-6">
              <div className="space-y-2 text-right">
                <Label className="font-bold">رقم المنتج (اختياري)</Label>
                <Input
                  type="number"
                  value={formData.productId || ""}
                  onChange={(e) =>
                    handleChange("productId", Number(e.target.value))
                  }
                  placeholder="ID المنتج المرتبط"
                  className="rounded-xl h-11 border-slate-200 shadow-sm"
                />
              </div>

              <div className="space-y-2 text-right">
                <Label className="font-bold">القسم المرتبط</Label>
                <Select
                  value={
                    formData.categoryId ? String(formData.categoryId) : "0"
                  }
                  onValueChange={(v) => handleChange("categoryId", Number(v))}
                >
                  <SelectTrigger
                    dir="rtl"
                    className="h-11 rounded-xl shadow-sm"
                  >
                    <SelectValue placeholder="اختر القسم" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">بدون قسم</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 text-right">
                <Label className="font-bold">الشركة المرتبطة</Label>
                <Select
                  value={formData.brandId ? String(formData.brandId) : "0"}
                  onValueChange={(v) => handleChange("brandId", Number(v))}
                >
                  <SelectTrigger
                    dir="rtl"
                    className="h-11 rounded-xl shadow-sm"
                  >
                    <SelectValue placeholder="اختر الشركة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">بدون شركة</SelectItem>
                    {brands.map((brand) => (
                      <SelectItem key={brand.id} value={String(brand.id)}>
                        {brand.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </ScrollArea>

        <div className="p-6 border-t bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <Button
            form="edit-offer-form"
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
