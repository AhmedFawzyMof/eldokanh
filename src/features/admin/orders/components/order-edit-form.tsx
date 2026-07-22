"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Trash2,
  Loader2,
  Save,
  ShoppingBag,
  Truck,
  CreditCard,
  ChevronRight,
} from "lucide-react";
import { useOrderMutations } from "../actions";
import { useGetPromoCodes } from "@/features/admin/promo-codes/actions";
import type { Delivery } from "@/types/admin/delivery";
import Link from "next/link";

export default function OrderEditForm({
  initialData,
  deliveryData,
}: {
  initialData: any;
  deliveryData: any;
}) {
  const [formData, setFormData] = useState(initialData);
  const [selectedCity, setSelectedCity] = useState<Delivery | null>(null);
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<any>(
    initialData.promo || null,
  );
  const [promoError, setPromoError] = useState("");
  const { editMutation, deleteOrderItemMutation } = useOrderMutations();
  const { data: promoCodesData } = useGetPromoCodes({});
  const promoCodes = promoCodesData?.data?.promoCodes?.promoCodes || [];

  const subtotal = useMemo(() => {
    return formData.items.reduce((acc: number, item: any) => {
      return acc + item.price * item.quantity;
    }, 0);
  }, [formData.items]);

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    const { discountType, discountValue, appliesTo } = appliedPromo;

    const baseAmount =
      appliesTo === "delivery" ? formData.payment?.deliveryCost || 0 : subtotal;

    if (discountType === "percentage") {
      return (baseAmount * discountValue) / 100;
    }
    return discountValue;
  }, [subtotal, appliedPromo, formData.payment?.deliveryCost]);

  const finalAmount = subtotal - discount;

  useEffect(() => {
    setFormData((prev: any) => ({
      ...prev,
      payment: {
        ...prev.payment,
        amount: finalAmount,
      },
    }));
  }, [finalAmount]);

  const handleApplyPromo = () => {
    const trimmed = promoCodeInput.trim();
    if (!trimmed) return;
    const found = promoCodes.find(
      (p: any) => p.code.toLowerCase() === trimmed.toLowerCase(),
    );
    if (!found) {
      setPromoError("كود الخصم غير صحيح");
      return;
    }
    setAppliedPromo(found);
    setPromoError("");
    setPromoCodeInput("");
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoError("");
  };

  useEffect(() => {
    if (!selectedCity) return;
    setFormData((prev: any) => ({
      ...prev,
      address: { ...prev.address, city: selectedCity.city },
      payment: { ...prev.payment, deliveryCost: selectedCity.deliveryCost },
    }));
  }, [selectedCity]);

  const update = (section: string | null, field: string, value: any) => {
    if (section) {
      setFormData({
        ...formData,
        [section]: { ...(formData[section] || {}), [field]: value },
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const cities: Delivery[] = deliveryData || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    editMutation.mutate({
      id: initialData.id,
      data: { ...formData, promoCode: appliedPromo?.code || null },
    });
  };

  const handleDeleteItem = (orderItemId: number) => {
    deleteOrderItemMutation.mutate({ id: initialData.id, orderItemId });
  };

  return (
    <form className="space-y-8 pb-32" onSubmit={handleSubmit} dir="rtl">
      <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
        <Link
          href="/admin/orders"
          className="hover:text-primary transition-colors"
        >
          الطلبات
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="text-slate-900 font-bold">
          تعديل الطلب #{initialData.id}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Order Status Section */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                حالة الطلب
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold">حالة الطلب</Label>
                <Select
                  value={formData.status}
                  onValueChange={(v) => update(null, "status", v)}
                >
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 shadow-none">
                    <SelectValue placeholder="اختر الحالة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">مؤكد</SelectItem>
                    <SelectItem value="cancelled">ملغي</SelectItem>
                    <SelectItem value="pending">قيد الانتظار</SelectItem>
                    <SelectItem value="processing">جاري التجهيز</SelectItem>
                    <SelectItem value="delivered">تم التوصيل</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="font-bold">حالة الدفع</Label>
                <Select
                  value={formData.paymentStatus}
                  onValueChange={(v) => update(null, "paymentStatus", v)}
                >
                  <SelectTrigger className="h-12 rounded-xl border-slate-200 shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unpaid">غير مدفوع</SelectItem>
                    <SelectItem value="paid">مدفوع</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address Section */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Truck className="h-5 w-5 text-primary" />
                </div>
                عنوان الشحن
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label className="font-bold">الاسم بالكامل</Label>
                  <Input
                    required
                    value={formData.address?.fullName || ""}
                    onChange={(e) =>
                      update("address", "fullName", e.target.value)
                    }
                    className="h-12 rounded-xl border-slate-200 shadow-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">رقم الهاتف</Label>
                  <Input
                    required
                    value={formData.address?.phone || ""}
                    onChange={(e) => update("address", "phone", e.target.value)}
                    className="h-12 rounded-xl border-slate-200 shadow-none"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="font-bold">المدينة / المنطقة</Label>
                  <Select
                    required
                    onValueChange={(city) => setSelectedCity(JSON.parse(city))}
                    value={(() => {
                      const found = cities.find(
                        (c) => c.city === formData.address?.city,
                      );
                      return found ? JSON.stringify(found) : undefined;
                    })()}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-slate-200 shadow-none">
                      <SelectValue placeholder={"اختر المدينة"} />
                    </SelectTrigger>
                    <SelectContent>
                      {cities.map((city: Delivery) => (
                        <SelectItem key={city.id} value={JSON.stringify(city)}>
                          {city.city}{" "}
                          {city.deliveryCost! > 0 &&
                            `(+${city.deliveryCost} ج.م)`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="font-bold">الشارع</Label>
                  <Input
                    required
                    value={formData.address?.street || ""}
                    onChange={(e) =>
                      update("address", "street", e.target.value)
                    }
                    className="h-12 rounded-xl border-slate-200 shadow-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 md:col-span-2">
                  <div className="space-y-2">
                    <Label className="font-bold">المبنى</Label>
                    <Input
                      value={formData.address?.building || ""}
                      onChange={(e) =>
                        update("address", "building", e.target.value)
                      }
                      className="h-12 rounded-xl border-slate-200 shadow-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">الدور</Label>
                    <Input
                      value={formData.address?.floor || ""}
                      onChange={(e) =>
                        update("address", "floor", e.target.value)
                      }
                      className="h-12 rounded-xl border-slate-200 shadow-none"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items Section */}
          <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-lg font-black flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
                محتويات الطلب
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {formData.items.map((item: any, i: number) => {
                const isUnit = item.type === "unit";
                return (
                  <div
                    key={item.id}
                    className="group relative flex flex-col md:flex-row gap-4 p-4 rounded-2xl border border-slate-100 bg-white hover:border-primary/20 hover:bg-primary/1 transition-all"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">
                          {item.nameAr}
                        </span>
                        <Badge
                          variant="secondary"
                          className="text-[10px] rounded-full h-5"
                        >
                          {isUnit ? "بالقطعة" : "بالوزن"}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-400">
                        ID: {item.id}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="w-24">
                        <Label className="text-[10px] text-slate-400 mb-1 block">
                          السعر
                        </Label>
                        <div className="font-black text-sm">
                          {item.price?.toLocaleString()} ج.م
                        </div>
                      </div>
                      <div className="w-28 space-y-1">
                        <Label className="text-[10px] text-slate-400">
                          الكمية
                        </Label>
                        <Input
                          type="number"
                          step={isUnit ? 1 : 0.001}
                          value={item.quantity}
                          onChange={(e) => {
                            const value = e.target.value;
                            const items = [...formData.items];
                            items[i].quantity =
                              value === ""
                                ? 0
                                : isUnit
                                  ? parseInt(value)
                                  : parseFloat(value);
                            setFormData({ ...formData, items });
                          }}
                          className="h-10 rounded-xl border-slate-200 text-center font-bold"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-slate-300 hover:text-destructive hover:bg-destructive/5 rounded-xl transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-8">
            {/* Payment Summary Section */}
            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b">
                <CardTitle className="text-lg font-black flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <CreditCard className="h-5 w-5 text-primary" />
                  </div>
                  ملخص الدفع
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="font-bold">طريقة الدفع</Label>
                    <Select
                      value={formData.payment?.method || "cash"}
                      onValueChange={(v) => update("payment", "method", v)}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-slate-200 shadow-none text-right">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">نقدي</SelectItem>
                        <SelectItem value="e-wallet">
                          محفظة إلكترونية
                        </SelectItem>
                        <SelectItem value="credit-card">
                          بطاقة ائتمان
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="font-bold">تكلفة التوصيل (ج.م)</Label>
                    <Input
                      type="number"
                      value={formData.payment?.deliveryCost || ""}
                      onChange={(e) =>
                        update(
                          "payment",
                          "deliveryCost",
                          Number(e.target.value),
                        )
                      }
                      className="h-12 rounded-xl border-slate-200 shadow-none text-right"
                    />
                  </div>
                </div>

                {/* Promo Code Section */}
                <div className="space-y-2">
                  <Label className="font-bold">كود الخصم</Label>
                  {appliedPromo ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-emerald-600" />
                        <span className="font-bold text-emerald-700">
                          {appliedPromo.code}
                        </span>
                        {appliedPromo.discountType === "percentage" ? (
                          <span className="text-xs text-emerald-500">
                            ({appliedPromo.discountValue}%)
                          </span>
                        ) : (
                          <span className="text-xs text-emerald-500">
                            (-{appliedPromo.discountValue} ج.م)
                          </span>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemovePromo}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl h-8 px-3 text-xs"
                      >
                        إزالة
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        value={promoCodeInput}
                        onChange={(e) => {
                          setPromoCodeInput(e.target.value);
                          setPromoError("");
                        }}
                        placeholder="أدخل كود الخصم"
                        className="h-12 rounded-xl border-slate-200 shadow-none text-right flex-1"
                      />
                      <Button
                        type="button"
                        onClick={handleApplyPromo}
                        className="h-12 rounded-xl px-6 font-bold"
                      >
                        تطبيق
                      </Button>
                    </div>
                  )}
                  {promoError && (
                    <p className="text-xs text-red-500 font-bold">
                      {promoError}
                    </p>
                  )}
                </div>

                <Separator className="bg-slate-100" />

                <div className="space-y-3">
                  <div className="flex justify-between text-sm text-slate-500">
                    <span>إجمالي المنتجات</span>
                    <span className="font-bold font-mono">
                      {subtotal.toLocaleString()} ج.م
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center gap-1.5 text-emerald-600">
                        <Tag className="h-3.5 w-3.5" />
                        <span>كود الخصم ({appliedPromo?.code})</span>
                      </div>
                      <span className="font-bold font-mono text-emerald-600">
                        -{discount.toLocaleString()} ج.م
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm text-slate-500">
                    <span>تكلفة التوصيل</span>
                    <span className="font-bold font-mono">
                      {formData.payment?.deliveryCost?.toLocaleString() || 0}{" "}
                      ج.م
                    </span>
                  </div>

                  <div className="pt-4 mt-2 border-t flex justify-between items-center bg-primary/5 -mx-6 px-6 py-4">
                    <span className="font-black text-slate-700">
                      الإجمالي النهائي
                    </span>
                    <span className="text-2xl font-black text-primary font-mono tracking-tight">
                      {(
                        finalAmount + (formData.payment?.deliveryCost || 0)
                      ).toLocaleString()}{" "}
                      ج.م
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button
              type="submit"
              className="w-full h-16 text-xl font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-transform active:scale-[0.98]"
              disabled={editMutation.isPending}
            >
              {editMutation.isPending ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <Save className="h-6 w-6" />
                  حفظ كل التغييرات
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function Tag(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l4.71-4.71c.94-.94.94-2.48 0-3.42L12 2Z" />
      <path d="M7 7h.01" />
    </svg>
  );
}
