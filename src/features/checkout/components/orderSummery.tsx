import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SummaryProps {
  subtotal: number;
  discount: number;
  deliveryCost: number;
  finalTotal: number;
  isProcessing: boolean;
  citySelected: boolean;
}

export default function OrderSummary({
  subtotal,
  discount,
  deliveryCost,
  finalTotal,
  isProcessing,
  citySelected,
}: SummaryProps) {
  return (
    <div className="sticky top-24 bg-white rounded-3xl p-6 shadow-sm border space-y-6">
      <h2 className="text-xl font-bold border-b pb-4">ملخص الطلب</h2>
      <div className="space-y-3 pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">المجموع الفرعي</span>
          <span>{subtotal.toFixed(2)} ج.م</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>خصم (برو كود)</span>
            <span>-{discount.toFixed(2)} ج.م</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">مصاريف الشحن</span>
          <span
            className={
              !citySelected
                ? "text-muted-foreground"
                : "text-slate-900 font-medium"
            }
          >
            {citySelected ? `${deliveryCost.toFixed(2)} ج.م` : "حدد المدينة"}
          </span>
        </div>

        <div className="flex justify-between text-lg font-bold pt-4 border-t text-primary">
          <span>الإجمالي النهائي</span>
          <span>{finalTotal.toFixed(2)} ج.م</span>
        </div>
      </div>

      <Button
        form="checkout-form"
        type="submit"
        size="lg"
        className="w-full rounded-full text-lg h-12"
        disabled={isProcessing}
      >
        {isProcessing ? <Loader2 className="animate-spin" /> : "تأكيد الطلب"}
      </Button>
    </div>
  );
}
