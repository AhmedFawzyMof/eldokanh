import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PaymentMethodProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PaymentMethod({ value, onChange }: PaymentMethodProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border space-y-6">
      <h2 className="text-xl font-bold">طريقة الدفع</h2>

      <RadioGroup value={value} onValueChange={onChange} className="grid gap-4">
        <Label className="flex items-center gap-3 p-4 border rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
          <RadioGroupItem value="cash" />
          <div className="flex flex-col">
            <span className="font-medium">الدفع عند الاستلام</span>
            <span className="text-xs text-muted-foreground">
              ادفع نقداً عند وصول الطلب لباب منزلك
            </span>
          </div>
        </Label>

        {/* Fawaterk — temporarily disabled */}
        <div className="flex items-center gap-3 p-4 border rounded-2xl opacity-50 cursor-not-allowed select-none bg-slate-50">
          <RadioGroupItem value="card" disabled />
          <div className="flex flex-col flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-muted-foreground">دفع الكتروني (فواتيرك)</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                قريباً
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              ادفع بأمان باستخدام المحافظ الإلكترونية
            </span>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
}
