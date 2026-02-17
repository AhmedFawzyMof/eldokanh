import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ShippingFormProps {
  deliveryOptions: DeliveryOption[];
  setSelectedCity: (city: string) => void;
}

export interface DeliveryOption {
  city: string;
  cost: number;
}

export default function ShippingForm({
  deliveryOptions,
  setSelectedCity,
}: ShippingFormProps) {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
          1
        </div>
        <h2 className="text-xl font-bold">عنوان الشحن</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">الاسم بالكامل</Label>
          <Input
            id="fullName"
            name="fullName"
            required
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>المدينة</Label>
          <Select onValueChange={setSelectedCity} name="city" required>
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="اختر المدينة" />
            </SelectTrigger>
            <SelectContent>
              {deliveryOptions.map((opt) => (
                <SelectItem key={opt.city} value={opt.city}>
                  {opt.city} ({opt.cost} ج.م)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="street">اسم الشارع</Label>
          <Input
            id="street"
            name="street"
            placeholder="مثال: شارع التحرير"
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="building">رقم العقار / العمارة</Label>
          <Input
            id="building"
            name="building"
            placeholder="مثال: 12"
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="floor">الدور</Label>
          <Input
            id="floor"
            name="floor"
            placeholder="مثال: 3"
            className="rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}
