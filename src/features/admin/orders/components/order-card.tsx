"use client";

import type { Order } from "@/types/admin/orders";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays, User, CreditCard } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function OrderCard({
  order,
  selectedOrders,
  setSelectedOrders,
}: {
  order: Order;
  selectedOrders: number[];
  setSelectedOrders: (prev: any) => void;
}) {
  const isSelected = selectedOrders.includes(order.id);

  const toggleSelect = (id: number) => {
    setSelectedOrders((prev: any) =>
      prev.includes(id) ? prev.filter((i: number) => i !== id) : [...prev, id],
    );
  };

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

  return (
    <Card
      onClick={() => toggleSelect(order.id)}
      className={`overflow-hidden border-none shadow-sm transition-all active:scale-[0.98] cursor-pointer ${
        isSelected ? "ring-2 ring-primary bg-primary/5" : "bg-white"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="pt-1">
            <Checkbox checked={isSelected} className="h-5 w-5 rounded-md" />
          </div>

          <div className="flex-1 space-y-3 text-right">
            <div className="flex justify-between items-start">
               <span className="text-sm font-black text-slate-900">
                {(order.totalAmount || 0).toLocaleString()} ج.م
              </span>
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className={`text-[10px] font-bold ${getStatusColor(order.status)}`}
                >
                  {getStatusInArabic(order.status)}
                </Badge>
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Order #{order.id}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2 text-slate-600 justify-end order-1">
                <span className="text-xs">
                  {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                </span>
                <CalendarDays className="h-3.5 w-3.5" />
              </div>
              {order.user && (
                <div className="flex items-center gap-2 text-slate-600 justify-end order-2">
                  <span className="text-xs font-medium truncate">
                    {order.user}
                  </span>
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>

            <hr className="border-slate-100" />

            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <Link href={`/admin/receipt/${order.id}`}>
                  <Button size="sm" className="text-xs h-8 rounded-xl">
                    إيصال
                  </Button>
                </Link>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  التفاصيل
                </Link>
              </div>

              <div className="flex gap-2">
                <Badge
                  variant="outline"
                  className="text-[10px] font-normal border-slate-200"
                >
                  {order.paymentStatus}
                </Badge>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-slate-50 px-2 py-1 rounded-md">
                   {order.paymentMethod}
                  <CreditCard className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
