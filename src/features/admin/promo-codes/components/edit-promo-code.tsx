"use client";

import { useState, useEffect } from "react";
import type { PromoCode } from "@/types/admin/promo-codes";
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
import { Loader2, Edit2, CalendarIcon } from "lucide-react";
import { usePromoCodeMutations } from "../actions";

interface EditPromoCodeProps {
  promoEdit: PromoCode;
}

export function EditPromoCode({ promoEdit }: EditPromoCodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<PromoCode>(promoEdit);
  const { editMutation } = usePromoCodeMutations();

  useEffect(() => {
    if (isOpen) {
      setFormData(promoEdit);
    }
  }, [promoEdit, isOpen]);

  const handleChange = (field: keyof PromoCode, value: any) => {
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

      <DialogContent className="sm:max-w-lg rounded-2xl flex flex-col p-6 overflow-hidden" dir="rtl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-right text-xl font-bold">
            تعديل كود الخصم: {promoEdit.code}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 text-right">
              <Label className="font-bold">الكود</Label>
              <Input
                value={formData.code || ""}
                onChange={(e) => handleChange("code", e.target.value.toUpperCase())}
                className="rounded-xl h-11 border-slate-200 shadow-sm font-black tracking-widest"
                required
              />
            </div>
            <div className="space-y-2 text-right">
              <Label className="font-bold">نوع الخصم</Label>
              <Select
                value={formData.discountType}
                onValueChange={(v) => handleChange("discountType", v)}
              >
                <SelectTrigger dir="rtl" className="h-11 rounded-xl shadow-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">نسبة مئوية (%)</SelectItem>
                  <SelectItem value="fixed">مبلغ ثابت (ج.م)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 text-right">
              <Label className="font-bold">قيمة الخصم</Label>
              <Input
                type="number"
                value={formData.discountValue || 0}
                onChange={(e) => handleChange("discountValue", Number(e.target.value))}
                className="rounded-xl h-11 border-slate-200 shadow-sm"
                required
              />
            </div>
            <div className="space-y-2 text-right">
              <Label className="font-bold">أقصى عدد استخدامات</Label>
              <Input
                type="number"
                value={formData.maxUses || 0}
                onChange={(e) => handleChange("maxUses", Number(e.target.value))}
                className="rounded-xl h-11 border-slate-200 shadow-sm"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 text-right">
              <Label className="font-bold">تاريخ الانتهاء</Label>
              <Input
                type="date"
                value={formData.expiresAt ? new Date(formData.expiresAt).toISOString().split('T')[0] : ""}
                onChange={(e) => handleChange("expiresAt", e.target.value)}
                className="rounded-xl h-11 border-slate-200 shadow-sm"
                required
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
