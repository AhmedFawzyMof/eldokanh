"use client";

import { useState, useEffect, type ChangeEvent } from "react";
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
import { Loader2, UploadCloud, X } from "lucide-react";
import { useGetSubcategories, useProductMutations } from "../actions";
import { Textarea } from "@/components/ui/textarea";

interface EditProductProps {
  productEdit: Product;
  categories: { id: number; name: string; nameAr: string }[];
  brands: { id: number; name: string; nameAr: string }[];
}

export function EditProduct({
  productEdit,
  categories,
  brands,
}: EditProductProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState<Product>(productEdit);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { editMutation } = useProductMutations();

  const {
    data: subcategories,
    isLoading: isLoadingSubs,
    refetch,
  } = useGetSubcategories({ category: formData.categoryId! }, isOpen);

  useEffect(() => {
    if (isOpen) setFormData(productEdit);
  }, [productEdit, isOpen]);

  const handleChange = (field: keyof Product, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const subCategories = subcategories?.data.subcategories || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (key === "images" && value) {
            formDataToSend.append(key, JSON.stringify(value));
          } else {
            formDataToSend.append(key, String(value));
          }
        }
      });

      if (selectedFile) {
        formDataToSend.append("file", selectedFile);
        formDataToSend.append("oldImageUrl", formData.imageUrl || "");
      }

      editMutation.mutate(
        {
          id: formData.id!,
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
        <Button variant="outline" size="sm" className="rounded-xl h-8 px-3">
          تعديل
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl max-h-[92vh] overflow-y-scroll flex flex-col p-0 rounded-2xl">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-right text-xl font-bold">
            تعديل: {productEdit.nameAr || productEdit.name}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <form
            id="edit-product-form"
            className="space-y-6 pb-6"
            onSubmit={handleSubmit}
          >
            <div className="space-y-3 text-right">
              <Label className="text-base font-bold">صورة المنتج</Label>

              <div className="flex flex-col items-center sm:flex-row-reverse gap-6">
                <div className="relative group w-32 h-32 border-2 border-dashed rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center">
                  {selectedFile || formData.imageUrl ? (
                    <>
                      <img
                        src={
                          selectedFile
                            ? URL.createObjectURL(selectedFile)
                            : formData.imageUrl
                        }
                        alt="Product Preview"
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      {selectedFile && (
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
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
                  <Label htmlFor="edit-image" className="cursor-pointer">
                    <div className="border border-slate-200 rounded-xl p-3 text-center text-sm hover:bg-slate-50 transition-colors">
                      {selectedFile ? selectedFile.name : "اختر صورة جديدة"}
                    </div>
                  </Label>
                  <Input
                    id="edit-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <p className="text-xs text-muted-foreground">
                    {selectedFile
                      ? "سيتم استبدال الصورة القديمة عند الحفظ"
                      : "اتركها فارغة للاحتفاظ بالصورة الحالية"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t pt-6">
              <div className="space-y-2 text-right">
                <Label>الاسم بالعربي</Label>
                <Input
                  value={formData.nameAr || ""}
                  onChange={(e) => handleChange("nameAr", e.target.value)}
                  className="rounded-xl"
                  required
                />
              </div>
              <div className="space-y-2 text-right">
                <Label>الإسم بالإنجليزية</Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 text-right">
                <Label>الوصف بالعربي</Label>
                <Textarea
                  value={formData.descriptionAr || ""}
                  onChange={(e) =>
                    handleChange("descriptionAr", e.target.value)
                  }
                  className="rounded-xl min-h-[100px]"
                  required
                />
              </div>
              <div className="space-y-2 text-right">
                <Label>الوصف بالإنجليزية</Label>
                <Textarea
                  value={formData.description || ""}
                  onChange={(e) => handleChange("description", e.target.value)}
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

              {subCategories.length > 0 && subCategories[0].id && (
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
                  value={
                    formData.brandId ? String(formData.brandId) : undefined
                  }
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
                  value={formData.type}
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
                <Label>السعر الحالي</Label>
                <Input
                  type="number"
                  value={formData.price || 0}
                  onChange={(e) =>
                    handleChange("price", Number(e.target.value))
                  }
                  className="rounded-xl bg-white"
                  required
                />
              </div>
              <div className="space-y-2 text-right">
                <Label>سعر الشراء</Label>
                <Input
                  type="number"
                  value={formData.buyingPrice || 0}
                  onChange={(e) =>
                    handleChange("buyingPrice", Number(e.target.value))
                  }
                  className="rounded-xl bg-white"
                />
              </div>
              <div className="space-y-2 text-right">
                <Label>خصم (قيمة)</Label>
                <Input
                  type="number"
                  value={formData.discountPrice || 0}
                  onChange={(e) =>
                    handleChange("discountPrice", Number(e.target.value))
                  }
                  className="rounded-xl bg-white"
                />
              </div>
              <div className="space-y-2 text-right">
                <Label>الكمية المتاحة</Label>
                <Input
                  type="number"
                  value={formData.stockQuantity || 0}
                  onChange={(e) =>
                    handleChange("stockQuantity", Number(e.target.value))
                  }
                  className="rounded-xl bg-white"
                  required
                />
              </div>
              <div className="space-y-2 text-right">
                <Label>الحالة</Label>
                <Select
                  value={formData.isActive ? "1" : "0"}
                  onValueChange={(val) => handleChange("isActive", val === "1")}
                >
                  <SelectTrigger dir="rtl" className="rounded-xl bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">متاح للبيع</SelectItem>
                    <SelectItem value="0">غير متاح</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </form>
        </ScrollArea>

        <div className="p-6 border-t bg-white">
          <Button
            form="edit-product-form"
            type="submit"
            className="w-full h-12 rounded-xl text-base font-bold"
            disabled={editMutation.isPending || isUploading}
          >
            {editMutation.isPending || isUploading ? (
              <>
                <Loader2 className="ml-2 h-4 w-4 animate-spin" />
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
