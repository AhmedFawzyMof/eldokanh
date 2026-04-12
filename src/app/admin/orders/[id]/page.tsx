"use client";

import { use } from "react";
import AdminLoading from "@/app/admin/_components/AdminLoading";
import { useGetOrderById } from "@/features/admin/orders/actions";
import OrderEditForm from "@/features/admin/orders/components/order-edit-form";

export default function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id);

  const { data, isLoading } = useGetOrderById(id);

  if (isLoading) return <AdminLoading />;

  const order = data?.data;

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400">
        <p className="text-lg font-bold">الطلب غير موجود</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <OrderEditForm initialData={order} />
    </div>
  );
}
