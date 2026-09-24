"use client";

import { useState, useEffect } from "react";
import type { Delivery } from "@/types/admin/delivery";
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
import { Loader2, Edit2 } from "lucide-react";
import { useDeliveryMutations } from "../actions";

interface EditDeliveryProps {
  deliveryEdit: Delivery;
}

export function EditDelivery({ deliveryEdit }: EditDeliveryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Delivery>(deliveryEdit);
  const { editMutation } = useDeliveryMutations();

  useEffect(() => {
    if (isOpen) {
      setFormData(deliveryEdit);
    }
  }, [deliveryEdit, isOpen]);

  const handleChange = (field: keyof Delivery, value: any) => {
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

      <DialogContent className="sm:max-w-md rounded-2xl flex flex-col p-6 overflow-hidden" dir="rtl">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-right text-xl font-bold">
            تعديل سعر التوصيل لـ {deliveryEdit.city}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-right">
            <Label className="font-bold">اسم المدينة / المنطقة</Label>
            <Input
              value={formData.city || ""}
              onChange={(e) => handleChange("city", e.target.value)}
              className="rounded-xl h-11 border-slate-200 shadow-sm"
              required
            />
          </div>
          
          <div className="space-y-2 text-right">
            <Label className="font-bold">سعر التوصيل (ج.م)</Label>
            <Input
              type="number"
              value={formData.deliveryCost || 0}
              onChange={(e) => handleChange("deliveryCost", Number(e.target.value))}
              className="rounded-xl h-11 border-slate-200 shadow-sm"
              required
            />
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
