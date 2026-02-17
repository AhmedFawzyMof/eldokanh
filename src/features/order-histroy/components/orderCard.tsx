import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "مكتمل":
      return "bg-green-100 text-green-700 border-green-200 hover:bg-green-100";
    case "قيد التنفيذ":
      return "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-100";
    case "ملغي":
      return "bg-red-100 text-red-700 border-red-200 hover:bg-red-100";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

export default function OrderCard({ order }: { order: any }) {
  return (
    <Card className="overflow-hidden border-muted/60 transition-all hover:border-primary/30 hover:shadow-sm">
      <CardContent className="p-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 gap-4 border-b bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <span className="font-bold text-lg">طلب #{order.id}</span>
              <Badge
                variant="outline"
                className={getStatusColor(order.status!)}
              >
                {order.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              بتاريخ{" "}
              {new Date(order.createdAt!).toLocaleDateString("ar-EG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="text-right sm:text-left">
            <p className="text-xs text-muted-foreground mb-1">إجمالي المبلغ</p>
            <p className="font-bold text-xl text-primary">
              {order.totalAmount.toLocaleString("ar-EG")}{" "}
              <span className="text-sm font-normal">ج.م</span>
            </p>
          </div>
        </div>

        <div className="p-6 grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="text-sm font-bold flex items-center gap-2 text-slate-600">
              <Package size={16} /> المنتجات ({order.items.length})
            </h4>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center text-sm border-b border-dotted pb-2"
                >
                  <span className="text-slate-700">
                    {item.nameAr}{" "}
                    <span className="text-muted-foreground text-xs">
                      × {item.quantity}
                    </span>
                  </span>
                  <span className="font-medium">
                    {(item.price * item.quantity).toLocaleString("ar-EG")} ج.م
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
            <h4 className="text-sm font-bold text-slate-600">عنوان الشحن</h4>
            <div className="text-sm space-y-1 text-slate-700">
              <p className="font-semibold">{order.address.fullName}</p>
              <p className="flex items-center gap-2">
                <span className="text-muted-foreground">المدينة:</span>{" "}
                {order.address.city}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-muted-foreground">الهاتف:</span>{" "}
                {order.address.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="px-6 py-4 bg-slate-50/30 flex items-center justify-between border-t text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-xs">طريقة الدفع:</span>
            <Badge variant="secondary" className="font-normal">
              {order.paymentMethod === "cash"
                ? "الدفع عند الاستلام"
                : "بطاقة ائتمان"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
