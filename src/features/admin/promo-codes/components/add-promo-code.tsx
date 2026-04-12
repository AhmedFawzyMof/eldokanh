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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Ticket } from "lucide-react";
import type { PromoCode } from "@/types/admin/promo-codes";
import { usePromoCodeMutations } from "../actions";

export function AddPromoCode() {
  const [isOpen, setIsOpen] = useState(false);
  const { addMutation } = usePromoCodeMutations();

  const [formData, setFormData] = useState<Partial<PromoCode>>({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    maxUses: 100,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
  });

  const handleChange = (field: keyof PromoCode, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(formData, {
      onSuccess: () => {
        setIsOpen(false);
        setFormData({
          code: "",
          discountType: "percentage",
          discountValue: 0,
          maxUses: 100,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
        });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold rounded-xl h-11 px-6 shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          إضافة كود جديد
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-lg rounded-2xl flex flex-col p-6 overflow-hidden"
        dir="rtl"
      >
        <DialogHeader className="mb-4">
          <DialogTitle className="text-right text-xl font-bold">
            إضافة كود خصم جديد
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 text-right">
              <Label className="font-bold">الكود</Label>
              <Input
                value={formData.code}
                onChange={(e) =>
                  handleChange("code", e.target.value.toUpperCase())
                }
                placeholder="PROMO2024"
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
                value={formData.discountValue}
                onChange={(e) =>
                  handleChange("discountValue", Number(e.target.value))
                }
                placeholder="0"
                className="rounded-xl h-11 border-slate-200 shadow-sm"
                required
              />
            </div>
            <div className="space-y-2 text-right">
              <Label className="font-bold">أقصى عدد استخدامات</Label>
              <Input
                type="number"
                value={formData.maxUses}
                onChange={(e) =>
                  handleChange("maxUses", Number(e.target.value))
                }
                className="rounded-xl h-11 border-slate-200 shadow-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-2 text-right">
            <Label className="font-bold">تاريخ الانتهاء</Label>
            <Input
              type="date"
              value={formData.expiresAt}
              onChange={(e) => handleChange("expiresAt", e.target.value)}
              className="rounded-xl h-11 border-slate-200 shadow-sm"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg font-black rounded-xl shadow-lg shadow-primary/20 mt-4"
            disabled={addMutation.isPending}
          >
            {addMutation.isPending ? (
              <>
                <Loader2 className="ml-3 h-5 w-5 animate-spin" />
                جاري الإضافة...
              </>
            ) : (
              "إضافة كود الخصم"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
