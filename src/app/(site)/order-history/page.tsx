import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth-session";
import { getUserOrders } from "@/models/orders";
import PaginationComponent from "@/components/pagination";
import { ShoppingBag } from "lucide-react";
import OrderCard from "@/features/order-histroy/components/orderCard";
import EmptyOrders from "@/features/order-histroy/components/emptyOrders";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session = await getAuthSession();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/orders");
  }

  const params = await searchParams;
  const currentPage = Number(params?.page) || 1;
  const { orders, totalOrders, totalPages } = await getUserOrders(
    Number(session.user.id),
    currentPage,
  );

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl" dir="rtl">
      <div className="flex items-center gap-3 mb-10">
        <div className="bg-primary/10 p-2 rounded-lg text-primary">
          <ShoppingBag size={28} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">طلباتي</h1>
          <p className="text-muted-foreground mt-1">
            عرض وإدارة جميع طلباتك السابقة
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>

          <div className="pt-6 border-t">
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              totalProducts={totalOrders}
              searchParams={searchParams}
            />
          </div>
        </div>
      )}
    </div>
  );
}
