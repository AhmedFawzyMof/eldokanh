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
import { Loader2, Plus } from "lucide-react";
import type { Offer } from "@/types/admin/offers";
import { useOfferMutations } from "../actions";
import { ImageInput } from "@/app/admin/_components/ImageInput";
import axios from "axios";

interface AddOfferProps {
  categories: { id: number; nameAr: string }[];
  brands: { id: number; nameAr: string }[];
}

export function AddOffer({ categories, brands }: AddOfferProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { addMutation } = useOfferMutations();

  const [formData, setFormData] = useState<Partial<Offer>>({
    productId: undefined,
    categoryId: undefined,
    brandId: undefined,
  });

  const handleChange = (field: keyof Offer, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const formDataToSend = new FormData();
      if (formData.productId) formDataToSend.append("productId", String(formData.productId));
      if (formData.categoryId) formDataToSend.append("categoryId", String(formData.categoryId));
      if (formData.brandId) formDataToSend.append("brandId", String(formData.brandId));
      formDataToSend.append("file", selectedFile);

      addMutation.mutate(formDataToSend, {
        onSuccess: () => {
          setIsOpen(false);
          setFormData({ productId: undefined, categoryId: undefined, brandId: undefined });
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
          إضافة عرض جديد
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl flex flex-col p-0 overflow-hidden" dir="rtl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-right text-xl font-bold">
            إضافة عرض ترويجي جديد
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <form id="add-offer-form" className="space-y-6 pb-6" onSubmit={handleSubmit}>
            <ImageInput
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />

            <div className="grid grid-cols-1 gap-6 border-t pt-6">
              <div className="space-y-2 text-right">
                <Label className="font-bold">رقم المنتج (اختياري)</Label>
                <Input
                  type="number"
                  onChange={(e) => handleChange("productId", Number(e.target.value))}
                  placeholder="ID المنتج المرتبط"
                  className="rounded-xl h-11 border-slate-200 shadow-sm"
                />
              </div>

              <div className="space-y-2 text-right">
                <Label className="font-bold">القسم المرتبط</Label>
                <Select
                  onValueChange={(v) => handleChange("categoryId", Number(v))}
                >
                  <SelectTrigger dir="rtl" className="h-11 rounded-xl shadow-sm">
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
                  onValueChange={(v) => handleChange("brandId", Number(v))}
                >
                  <SelectTrigger dir="rtl" className="h-11 rounded-xl shadow-sm">
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
            form="add-offer-form"
            type="submit"
            className="w-full h-12 text-lg font-black rounded-xl shadow-lg shadow-primary/20"
            disabled={addMutation.isPending || isUploading || !selectedFile}
          >
            {addMutation.isPending || isUploading ? (
              <>
                <Loader2 className="ml-3 h-5 w-5 animate-spin" />
                جاري الإضافة...
              </>
            ) : (
              "إضافة العرض"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
