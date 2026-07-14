import OrdersClient from "@/features/admin/orders/components/orders-client";
import { getAllOrders } from "@/models/orders";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const page = Number(params.page) || 1;
  const today = new Date().toISOString().split("T")[0];
  const startDate = params.startDate || today;
  const endDate = params.endDate || today;

  const data = await getAllOrders(page, search, startDate, endDate);

  return (
    <OrdersClient 
      initialOrders={data.orders as any} 
      initialTotalCount={data.count}
      initialSearch={search} 
      initialPage={page}
      initialStartDate={startDate}
      initialEndDate={endDate}
    />
  );
}
