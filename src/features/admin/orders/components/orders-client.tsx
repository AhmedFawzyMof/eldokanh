"use client";

import { useState, useTransition, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Trash2, Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOrderMutations } from "@/features/admin/orders/actions";
import { OrderCard } from "@/features/admin/orders/components/order-card";
import PaginationComponent from "@/components/pagination";
import type { Order } from "@/types/admin/orders";

interface OrdersClientProps {
  initialOrders: Order[];
  initialTotalCount: number;
  initialSearch: string;
  initialPage: number;
  initialStartDate: string;
  initialEndDate: string;
}

export default function OrdersClient({
  initialOrders,
  initialTotalCount,
  initialSearch,
  initialPage,
  initialStartDate,
  initialEndDate,
}: OrdersClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  const { deleteMutation } = useOrderMutations();

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setStartDate(searchParams.get("startDate") || initialStartDate);
    setEndDate(searchParams.get("endDate") || initialEndDate);
  }, [searchParams, initialStartDate, initialEndDate]);

  const handleFilterChange = (val: string, type: "search" | "startDate" | "endDate") => {
    let newSearch = search;
    let newStart = startDate;
    let newEnd = endDate;
    
    if (type === "search") {
      newSearch = val;
      setSearch(val);
    } else if (type === "startDate") {
      newStart = val;
      setStartDate(val);
    } else if (type === "endDate") {
      newEnd = val;
      setEndDate(val);
    }

    const params = new URLSearchParams(searchParams.toString());
    if (newSearch) params.set("search", newSearch);
    else params.delete("search");
    
    if (newStart) params.set("startDate", newStart);
    else params.delete("startDate");

    if (newEnd) params.set("endDate", newEnd);
    else params.delete("endDate");

    params.set("page", "1");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleDelete = () => {
    deleteMutation.mutate(selectedOrders, {
      onSuccess: () => setSelectedOrders([]),
    });
  };

  const totalPages = Math.ceil(initialTotalCount / 20) || 1;

  return (
    <div className="flex flex-col min-h-screen pb-8">
      <div className="sticky top-16 lg:top-0 z-10 bg-white/95 backdrop-blur-md border-b p-4 shadow-sm space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="search"
              placeholder="ابحث عن طلب برقم الهاتف أو الاسم..."
              value={search}
              onChange={(e) => handleFilterChange(e.target.value, "search")}
              className="h-12 pr-12 text-lg rounded-2xl border-slate-200 focus:ring-primary shadow-sm"
            />
            {isPending && (
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            )}
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="flex-1 md:w-40">
              <label className="text-xs text-slate-500 mb-1 block">من تاريخ</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => handleFilterChange(e.target.value, "startDate")}
                className="h-12 rounded-2xl border-slate-200 focus:ring-primary shadow-sm"
              />
            </div>
            <div className="flex-1 md:w-40">
              <label className="text-xs text-slate-500 mb-1 block">إلى تاريخ</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => handleFilterChange(e.target.value, "endDate")}
                className="h-12 rounded-2xl border-slate-200 focus:ring-primary shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-900">
            إدارة الطلبات ({initialTotalCount})
          </h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {initialOrders.length > 0 ? (
          initialOrders.map((order: Order) => (
            <OrderCard
              key={order.id}
              order={order}
              selectedOrders={selectedOrders}
              setSelectedOrders={setSelectedOrders}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
            <ShoppingBag className="h-16 w-16 stroke-1 px-4" />
            <p className="text-lg">لا توجد طلبات حالياً</p>
          </div>
        )}
      </div>

      <div className="p-4 flex justify-center">
        <PaginationComponent
          totalProducts={initialTotalCount}
          totalPages={totalPages}
          currentPage={initialPage}
          searchParams={Object.fromEntries(searchParams.entries())}
        />
      </div>

      {selectedOrders.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between animate-in fade-in zoom-in slide-in-from-bottom-10 border border-slate-700">
            <span className="text-sm font-bold">
              تم تحديد {selectedOrders.length} طلب
            </span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedOrders([])}
                className="text-white hover:bg-white/10 rounded-xl"
              >
                إلغاء
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="rounded-xl shadow-lg px-4"
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4 ml-2" />
                حذف المحدد
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
