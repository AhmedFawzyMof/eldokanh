"use client";

import type { PromoCode } from "@/types/admin/promo-codes";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  Ticket,
  Calendar,
  Users,
  Copy,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { EditPromoCode } from "@/features/admin/promo-codes/components/edit-promo-code";
import { toast } from "sonner";

interface PromoCodeCardProps {
  promo: PromoCode;
  selectedCodes: number[];
  setSelectedCodes: (prev: any) => void;
}

export function PromoCodeCard({
  promo,
  selectedCodes,
  setSelectedCodes,
}: PromoCodeCardProps) {
  const isSelected = selectedCodes.includes(promo.id);

  const toggleSelect = (e: React.MouseEvent, id: number) => {
    if ((e.target as HTMLElement).closest("button")) return;

    setSelectedCodes((prev: number[]) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("تم نسخ الكود بنجاح");
  };

  const usagePercentage =
    promo.maxUses > 0 ? (promo.usageCount / promo.maxUses) * 100 : 0;

  return (
    <Card
      onClick={(e) => toggleSelect(e, promo.id)}
      className={`overflow-hidden border-none shadow-sm transition-all active:scale-[0.98] cursor-pointer ${
        isSelected ? "ring-2 ring-primary bg-primary/5" : "bg-white"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="relative shrink-0 flex flex-col items-center justify-center bg-slate-50 rounded-2xl px-4 border border-slate-100 min-w-[100px] h-24">
            <div
              className={`absolute -top-1 -right-1 transition-opacity ${isSelected ? "opacity-100" : "opacity-0"}`}
            >
              <Checkbox
                checked={isSelected}
                className="h-5 w-5 rounded-full bg-white shadow-sm border-slate-200"
              />
            </div>
            <Ticket
              className={`h-10 w-10 ${promo.isActive ? "text-primary" : "text-slate-300"}`}
            />
            <span className="text-[10px] font-black mt-2 text-slate-400 tracking-widest uppercase">
              PROMO
            </span>
          </div>

          <div className="flex-1 min-w-0 flex flex-col justify-between text-right">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => copyToClipboard(promo.code)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <h3 className="font-black text-xl tracking-wider text-slate-900 leading-none">
                    {promo.code}
                  </h3>
                </div>
                <div className="flex items-center gap-3 justify-end">
                  <span className="text-base font-black text-primary">
                    {promo.discountType === "percentage"
                      ? `%${promo.discountValue}`
                      : `${promo.discountValue?.toLocaleString()} ج.م`}
                  </span>
                  <Badge
                    className={`rounded-full px-2 py-0 text-[10px] h-5 ${
                      promo.isActive
                        ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                        : "bg-slate-100 text-slate-500 border-slate-200"
                    }`}
                  >
                    {promo.isActive ? (
                      <CheckCircle2 className="h-3 w-3 ml-1" />
                    ) : (
                      <XCircle className="h-3 w-3 ml-1" />
                    )}
                    {promo.isActive ? "نشط" : "متوقف"}
                  </Badge>
                </div>
              </div>

              <EditPromoCode promoEdit={promo} />
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                <span>{Math.round(usagePercentage)}%</span>
                <div className="flex items-center gap-1.5">
                  <span>
                    الاستخدام: {promo.usageCount} / {promo.maxUses}
                  </span>
                  <Users className="h-3.5 w-3.5" />
                </div>
              </div>
              <Progress
                value={usagePercentage}
                className="h-2 rounded-full bg-slate-100"
              />
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 text-[10px] text-slate-300">
              <span>ID: {promo.id}</span>
              <div className="flex items-center gap-1.5 font-medium">
                <span>
                  ينتهي: {new Date(promo.expiresAt).toLocaleDateString("ar-EG")}
                </span>
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
