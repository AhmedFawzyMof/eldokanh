"use client";

import { useState } from "react";
import { Tag, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

export default function PromoCodeSection() {
  const [promoInput, setPromoInput] = useState("");
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);
  const { promoCode, applyPromoCode, removePromoCode } = useCartStore();

  const handleApplyPromo = async () => {
    if (!promoInput) return;
    setIsValidatingPromo(true);
    try {
      const res = await fetch(`/api/promo?code=${promoInput}`);
      const data = await res.json();

      if (res.ok) {
        applyPromoCode(data);
        toast.success("تم تطبيق كود الخصم بنجاح");
        setPromoInput("");
      } else {
        toast.error(data.error || "كود الخصم غير صحيح");
      }
    } catch (err) {
      toast.error("حدث خطأ أثناء التحقق من الكود");
    } finally {
      setIsValidatingPromo(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border space-y-4">
      <h3 className="font-bold flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" /> كود الخصم
      </h3>

      {promoCode ? (
        <div className="flex items-center justify-between bg-green-50 border border-green-100 p-3 rounded-xl">
          <div className="text-sm">
            <span className="font-bold text-green-700">{promoCode.code}</span>
            <p className="text-xs text-green-600">تم تطبيق الخصم</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={removePromoCode}
            className="text-green-700 hover:bg-green-100 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="أدخل الكود هنا"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            className="rounded-xl"
          />
          <Button
            type="button"
            variant="secondary"
            onClick={handleApplyPromo}
            disabled={isValidatingPromo || !promoInput}
            className="rounded-xl"
          >
            {isValidatingPromo ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "تطبيق"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
