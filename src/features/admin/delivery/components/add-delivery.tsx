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
import { Loader2, Plus } from "lucide-react";
import type { Delivery } from "@/types/admin/delivery";
import { useDeliveryMutations } from "../actions";

export function AddDelivery() {
  const [isOpen, setIsOpen] = useState(false);
  const { addMutation } = useDeliveryMutations();

  const [formData, setFormData] = useState<Partial<Delivery>>({
    city: "",
    deliveryCost: 0,
  });

  const handleChange = (field: keyof Delivery, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(formData, {
      onSuccess: () => {
        setIsOpen(false);
        setFormData({ city: "", deliveryCost: 0 });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold rounded-xl h-11 px-6 shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          إضافة منطقة جديدة
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl flex flex-col p-6 overflow-hidden" dir="rtl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-right text-xl font-bold">
            إضافة منطقة توصيل جديدة
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-right">
            <Label className="font-bold">اسم المدينة / المنطقة</Label>
            <Input
              value={formData.city}
              onChange={(e) => handleChange("city", e.target.value)}
              placeholder="مثال: مدينة نصر"
              className="rounded-xl h-11 border-slate-200 shadow-sm"
              required
            />
          </div>
          
          <div className="space-y-2 text-right">
            <Label className="font-bold">سعر التوصيل (ج.م)</Label>
            <Input
              type="number"
              value={formData.deliveryCost}
              onChange={(e) => handleChange("deliveryCost", Number(e.target.value))}
              placeholder="0"
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
              "إضافة المنطقة"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
