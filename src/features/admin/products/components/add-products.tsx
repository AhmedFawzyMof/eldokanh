"use client";

import { useState, type ChangeEvent } from "react";
import type { Product } from "@/types/admin/products";
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
import { useGetSubcategories, useProductMutations } from "../actions";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, UploadCloud, X } from "lucide-react";

interface AddProductProps {
  categories: { id: number; name: string; nameAr: string }[];
  brands: { id: number; name: string; nameAr: string }[];
}

export function AddProduct({ categories, brands }: AddProductProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { addMutation } = useProductMutations();

  const initialFormState = {
    name: "",
    nameAr: "",
    description: "",
    descriptionAr: "",
    price: 0,
    discountPrice: 0,
    categoryId: 0,
    subcategoryId: 0,
    brandId: 0,
    type: "unit",
    isActive: true,
    stockQuantity: 0,
  };

  const [formData, setFormData] = useState<Partial<Product>>(initialFormState);

  const {
    data: subcategories,
    isLoading: isLoadingSubs,
    refetch,
  } = useGetSubcategories({ category: formData.categoryId! }, isOpen);

  const handleChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, String(value));
        }
      });

      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
      }

      addMutation.mutate(formDataToSend, {
        onSuccess: () => {
          setIsOpen(false);
          setFormData(initialFormState);
          setSelectedFile(null);
        },
      });
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const subCategories = subcategories?.data?.subcategories || [];
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold rounded-xl h-11 px-6 shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          اضافة منتج جديد
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl max-h-[92vh] overflow-y-scroll flex flex-col p-0 rounded-2xl">
        <DialogHeader className="p-6 pb-2 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <DialogTitle className="text-right text-xl font-bold">
            اضافة منتج جديد
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <form
            id="product-form"
            className="space-y-6 pb-6"
            onSubmit={handleAddProduct}
          >
            <div className="space-y-3 text-right">
              <Label className="text-base font-bold">صورة المنتج</Label>
              <div className="flex flex-col items-center sm:flex-row-reverse gap-6">
                <div className="relative group w-32 h-32 border-2 border-dashed rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center">
                  {selectedFile ? (
                    <>
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Product Preview"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-2">
                      <UploadCloud className="mx-auto h-8 w-8 text-slate-300 mb-1" />
                      <span className="text-xs text-slate-400">
                        لا توجد صورة
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex-1 w-full space-y-2">
                  <Label htmlFor="add-image" className="cursor-pointer">
                    <div className="border border-slate-200 rounded-xl p-3 text-center text-sm hover:bg-slate-50 transition-colors">
                      {selectedFile ? selectedFile.name : "اختر صورة المنتج"}
                    </div>
                  </Label>
                  <Input
                    id="add-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground text-center sm:text-right">
                    يفضل استخدام صور بخلفية بيضاء ومقاسات مربعة
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
              <div className="space-y-2 text-right">
                <Label>الاسم بالعربي</Label>
                <Input
                  value={formData.nameAr}
                  onChange={(e) => handleChange("nameAr", e.target.value)}
                  placeholder="ايفون 15 برو"
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2 text-right">
                <Label>اسم المنتج بالإنجليزية</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="iPhone 15 Pro"
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-right">
                <Label>الوصف بالعربي</Label>
                <Textarea
                  value={formData.descriptionAr}
                  onChange={(e) =>
                    handleChange("descriptionAr", e.target.value)
                  }
                  placeholder="وصف مختصر للمنتج..."
                  className="rounded-xl min-h-[100px]"
                  required
                />
              </div>
              <div className="space-y-2 text-right">
                <Label>الوصف بالإنجليزية</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Product description..."
                  className="rounded-xl min-h-[100px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t pt-6">
              <div className="space-y-2 text-right">
                <Label>الفئة</Label>
                <Select
                  value={formData.categoryId ? String(formData.categoryId) : ""}
                  onValueChange={(val) => {
                    const categoryId = Number(val);

                    setFormData((prev) => ({
                      ...prev,
                      categoryId,
                      subcategoryId: undefined,
                    }));

                    refetch();
                  }}
                >
                  <SelectTrigger dir="rtl" className="rounded-xl">
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>
                        {cat.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {subCategories?.length > 0 && subCategories[0].id && (
                <div className="space-y-2 text-right">
                  <Label>الفئة الفرعية</Label>
                  <Select
                    value={
                      formData.subcategoryId
                        ? String(formData.subcategoryId)
                        : ""
                    }
                    disabled={!formData.categoryId || isLoadingSubs}
                    onValueChange={(val) =>
                      handleChange("subcategoryId", Number(val))
                    }
                  >
                    <SelectTrigger dir="rtl" className="rounded-xl">
                      <SelectValue
                        placeholder={
                          isLoadingSubs
                            ? "جاري التحميل..."
                            : "اختر الفئة الفرعية"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories?.map((sub: any) => (
                        <SelectItem key={sub.id} value={sub.id.toString()}>
                          {sub.nameAr}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-2 text-right">
                <Label>الشركة / البراند</Label>
                <Select
                  onValueChange={(val) => handleChange("brandId", Number(val))}
                >
                  <SelectTrigger dir="rtl" className="rounded-xl">
                    <SelectValue placeholder="اختر الشركة" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands?.map((brand) => (
                      <SelectItem key={brand.id} value={String(brand.id)}>
                        {brand.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 text-right">
                <Label>نوع البيع</Label>
                <Select
                  defaultValue="unit"
                  onValueChange={(val) => handleChange("type", val)}
                >
                  <SelectTrigger dir="rtl" className="rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unit">بالوحدة</SelectItem>
                    <SelectItem value="weight">بالوزن / الكيلو</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="space-y-2 text-right">
                <Label>السعر الأساسي</Label>
                <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    handleChange("price", Number(e.target.value))
                  }
                  className="rounded-xl bg-white"
                  required
                />
              </div>
              <div className="space-y-2 text-right">
                <Label>خصم (قيمة)</Label>
                <Input
                  type="number"
                  value={formData.discountPrice}
                  onChange={(e) =>
                    handleChange("discountPrice", Number(e.target.value))
                  }
                  className="rounded-xl bg-white"
                />
              </div>
              <div className="space-y-2 text-right">
                <Label>الكمية المبدئية</Label>
                <Input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) =>
                    handleChange("stockQuantity", Number(e.target.value))
                  }
                  className="rounded-xl bg-white"
                  required
                />
              </div>
              <div className="space-y-2 text-right">
                <Label>حالة العرض</Label>
                <Select
                  defaultValue="1"
                  onValueChange={(val) => handleChange("isActive", val === "1")}
                >
                  <SelectTrigger dir="rtl" className="rounded-xl bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">متاح للبيع</SelectItem>
                    <SelectItem value="0">مخفي / غير متاح</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </ScrollArea>

        <div className="p-6 border-t bg-white">
          <Button
            form="product-form"
            type="submit"
            className="w-full h-12 rounded-xl text-base font-bold"
            disabled={addMutation.isPending || isUploading}
          >
            {addMutation.isPending || isUploading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              "إضافة المنتج"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
