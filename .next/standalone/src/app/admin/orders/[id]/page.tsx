import { tryCatch } from "@/lib/tryCatch";
import { getOrderById } from "@/models/orders";
import OrderEditForm from "@/features/admin/orders/components/order-edit-form";
import { getAllDeliveries } from "@/models/delivery";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage(props: OrderPageProps) {
  const orderParams = await props.params;
  const orderId = parseInt(orderParams.id);
  const { data, error } = await tryCatch(() => getOrderById(orderId));
  const { data: deliveryData, error: deliveryError } = await tryCatch(() =>
    getAllDeliveries(null),
  );

  if (isNaN(orderId) && !data) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400">
        <p className="text-lg font-bold">الطلب غير موجود</p>
      </div>
    );
  }

  if (error || deliveryError) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400">
        <p className="text-lg font-bold">
          {error?.message}
          {deliveryError?.message}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <OrderEditForm initialData={data} deliveryData={deliveryData} />
    </div>
  );
}
