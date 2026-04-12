import OrdersClient from "@/features/admin/orders/components/orders-client";
import { getAllOrders } from "@/models/orders";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const page = Number(params.page) || 1;

  const data = await getAllOrders(page, search);

  return (
    <OrdersClient 
      initialOrders={data.orders as any} 
      initialTotalCount={data.count}
      initialSearch={search} 
      initialPage={page} 
    />
  );
}
