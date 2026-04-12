"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGetDeliveries } from "@/features/admin/delivery/actions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Delivery } from "@/types/admin/delivery";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface CheckoutDialogProps {
  isOpen: boolean;
  total: number;
  isPending: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (formData: any) => void;
}

export function CheckoutDialog({
  isOpen,
  total,
  isPending,
  onOpenChange,
  onConfirm,
}: CheckoutDialogProps) {
  const [selectedCity, setSelectedCity] = useState<Delivery>({} as Delivery);
  const { data, isLoading } = useGetDeliveries({ search: "" });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const formValues = Object.fromEntries(formData.entries());

    onConfirm({
      ...formValues,
      city: selectedCity.city,
      deliveryCost: selectedCity.deliveryCost,
    });
  };

  const cities: Delivery[] = data?.data || [];
  const isOtherCity = selectedCity.city === "أخرى" || selectedCity.city === "أخري";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-xl font-black text-slate-900 border-b pb-4">
            تأجيل الطلب وتسجيل البيانات
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 text-right">
              <Label htmlFor="fullName" className="font-bold">اسم العميل</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="مثال: محمد أحمد"
                required
                className="rounded-xl h-11 border-slate-200"
              />
            </div>
            <div className="space-y-2 text-right">
              <Label htmlFor="phone" className="font-bold">رقم الهاتف</Label>
              <Input
                id="phone"
                name="phone"
                placeholder="01xxxxxxxxx"
                required
                className="rounded-xl h-11 border-slate-200"
              />
            </div>
          </div>

          <div className="space-y-2 text-right">
            <Label className="font-bold">المدينة / المنطقة</Label>
            <Select
              onValueChange={(city) => setSelectedCity(JSON.parse(city))}
              required
            >
              <SelectTrigger dir="rtl" className="w-full h-11 rounded-xl border-slate-200">
                <SelectValue
                  placeholder={isLoading ? "جاري تحميل قائمة المدن..." : "اختر المنطقة"}
                />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city: Delivery) => (
                  <SelectItem key={city.id} value={JSON.stringify(city)}>
                    {city.city}{" "}
                    {(city.deliveryCost || 0) > 0 && `(+${city.deliveryCost} ج.م)`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 text-right">
            <Label htmlFor="street" className="font-bold">
              {isOtherCity
                ? "العنوان بالتفصيل (المدينة والشارع)"
                : "اسم الشارع"}
            </Label>
            <Input
              id="street"
              name="street"
              placeholder={
                isOtherCity ? "اكتب اسم مدينتك والشارع هنا" : "اسم الشارع الرئيسي"
              }
              required
              className="rounded-xl h-11 border-slate-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-right">
              <Label htmlFor="building" className="font-bold">المبنى / المنزل</Label>
              <Input id="building" name="building" className="rounded-xl h-11 border-slate-200" />
            </div>
            <div className="space-y-2 text-right">
              <Label htmlFor="floor" className="font-bold">الطابق</Label>
              <Input id="floor" name="floor" className="rounded-xl h-11 border-slate-200" />
            </div>
          </div>

          <div className="bg-slate-900 text-white p-5 rounded-2xl flex justify-between items-center mt-8 shadow-xl shadow-slate-200">
             <div className="flex flex-col">
              <span className="text-2xl font-black">
                {(total + (selectedCity.deliveryCost || 0)).toLocaleString()} ج.م
              </span>
              {(selectedCity.deliveryCost || 0) > 0 && (
                <span className="text-[10px] text-slate-400">شامل التوصيل (+{selectedCity.deliveryCost} ج.م)</span>
              )}
            </div>
            <span className="font-bold text-lg">إجمالي الطلب</span>
          </div>

          <DialogFooter className="mt-8">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full h-14 text-xl font-black rounded-2xl shadow-lg shadow-primary/20"
            >
              {isPending ? (
                <>
                  <Loader2 className="ml-3 h-6 w-6 animate-spin" />
                  جاري تسجيل الطلب...
                </>
              ) : (
                "تأكيد وإنهاء العملية"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
