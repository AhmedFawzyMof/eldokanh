import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

type RecentOrder = {
  orderId: number;
  user: string;
  createdAt: string | null;
  totalAmount: number | null;
  status: string | null;
};

export function RecentOrders({
  recentOrders,
}: {
  recentOrders?: RecentOrder[];
}) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "confirmed":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "secondary";
    }
  };

  const getStatusInArabic = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "تم التوصيل";
      case "pending":
        return "قيد الانتظار";
      case "processing":
        return "قيد التجهيز";
      case "confirmed":
        return "مؤكد";
      case "cancelled":
        return "ملغي";
      default:
        return "غير معروف";
    }
  };

  if (!recentOrders) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">معرف الطلب</TableHead>
          <TableHead className="text-center">العميل</TableHead>
          <TableHead className="text-center">تاريخ</TableHead>
          <TableHead className="text-center">إجمالي</TableHead>
          <TableHead className="text-center">الحالة</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentOrders.map((order) => (
          <TableRow key={order.orderId}>
            <TableCell className="font-medium text-center">
              {order.orderId}
            </TableCell>
            <TableCell className="text-center">{order.user}</TableCell>
            <TableCell className="text-center">{order.createdAt}</TableCell>
            <TableCell className="text-center">
              {order.totalAmount} ج.م
            </TableCell>
            <TableCell className="text-center">
              <Badge className={getStatusColor(order.status!)}>
                {getStatusInArabic(order.status!)}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
