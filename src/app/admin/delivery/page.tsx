import { DeliverySearch } from "@/features/admin/delivery/components/delivery-search";
import { AddDelivery } from "@/features/admin/delivery/components/add-delivery";
import { DeliveryListContainer } from "@/features/admin/delivery/components/delivery-list-container";
import { getAllDeliveries } from "@/models/delivery";

export default async function DeliveryPage(props: {
  searchParams: Promise<{ search?: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";

  const deliveries = await getAllDeliveries(search);

  return (
    <div className="flex flex-col min-h-screen pb-32">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b p-4 shadow-sm space-y-4">
        <DeliverySearch />

        <div className="flex items-center justify-between pt-1">
          <h1 className="text-xl font-black text-slate-900">
            أسعار التوصيل ({deliveries.length})
          </h1>
          <AddDelivery />
        </div>
      </div>

      <DeliveryListContainer initialDeliveries={deliveries as any} />
    </div>
  );
}
