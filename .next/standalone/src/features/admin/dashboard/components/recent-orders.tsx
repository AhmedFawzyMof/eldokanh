import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

type RecentOrder = {
  orderId: number;
  user: string | null;
  createdAt: string | null;
  totalAmount: number | null;
  status: string | null;
};

export function RecentOrders({
  recentOrders,
}: {
  recentOrders?: RecentOrder[];
}) {
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status.toLowerCase()) {
      case "delivered": return "default";
      case "pending": return "secondary";
      case "processing": return "outline";
      case "confirmed": return "default";
      case "cancelled": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-3 py-1";
      case "pending": return "bg-amber-100 text-amber-700 hover:bg-amber-100 border-none px-3 py-1";
      case "processing": return "bg-sky-100 text-sky-700 hover:bg-sky-100 border-none px-3 py-1";
      case "confirmed": return "bg-indigo-100 text-indigo-700 hover:bg-indigo-100 border-none px-3 py-1";
      case "cancelled": return "bg-rose-100 text-rose-700 hover:bg-rose-100 border-none px-3 py-1";
      default: return "px-3 py-1";
    }
  };

  const getStatusInArabic = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered": return "تم التوصيل";
      case "pending": return "قيد الانتظار";
      case "processing": return "قيد التجهيز";
      case "confirmed": return "مؤكد";
      case "cancelled": return "ملغي";
      default: return "غير معروف";
    }
  };

  if (!recentOrders) return null;

  return (
    <div className="rounded-xl border border-secondary overflow-hidden">
      <Table>
        <TableHeader className="bg-secondary/50">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="text-right py-4 font-semibold">رقم الطلب</TableHead>
            <TableHead className="text-right py-4 font-semibold">العميل</TableHead>
            <TableHead className="text-right py-4 font-semibold">التاريخ</TableHead>
            <TableHead className="text-right py-4 font-semibold">المبلغ</TableHead>
            <TableHead className="text-center py-4 font-semibold">الحالة</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.map((order) => (
            <TableRow key={order.orderId} className="hover:bg-secondary/20 transition-colors">
              <TableCell className="font-bold">
                #{order.orderId}
              </TableCell>
              <TableCell className="font-medium">{order.user || "عميل زائر"}</TableCell>
              <TableCell className="text-muted-foreground text-xs">
                {order.createdAt ? format(new Date(order.createdAt), "d MMMM yyyy", { locale: ar }) : "-"}
              </TableCell>
              <TableCell className="font-bold">
                {order.totalAmount?.toLocaleString()} ج.م
              </TableCell>
              <TableCell className="text-center">
                <Badge className={getStatusStyles(order.status!)}>
                  {getStatusInArabic(order.status!)}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
