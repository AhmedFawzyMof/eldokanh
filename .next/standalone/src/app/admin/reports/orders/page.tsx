import { getOrdersByAdminReport, ADMIN_COMMISSION_RATE } from "@/models/reports";
import { OrdersByAdminTable } from "@/features/admin/reports/components/ordersByAdminTable";
import { Filterdate } from "@/features/admin/reports/components/filterDate";

export default async function OrdersByAdminPage(props: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const searchParams = await props.searchParams;
  let from = new Date().toISOString().split("T")[0];
  let to = new Date().toISOString().split("T")[0];

  if (searchParams.from) {
    from = new Date(searchParams.from).toISOString().split("T")[0];
  }

  if (searchParams.to) {
    to = new Date(searchParams.to).toISOString().split("T")[0];
  }

  const rows = await getOrdersByAdminReport({ from, to });
  const totalOrders = rows.reduce((sum, row) => sum + (row.orders || 0), 0);
  const totalProfit = rows.reduce((sum, row) => sum + (row.profit || 0), 0);

  return (
    <div className="flex flex-col p-6 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">تقارير المشرفين</h1>
          <p className="text-muted-foreground">
            عدد الطلبات التي أنشأها كل مشرف من صفحة الطلبات (POS)
          </p>
        </div>
        <Filterdate />
      </div>
      <div className="text-sm text-muted-foreground">
        إجمالي الطلبات في الفترة: {totalOrders} | إجمالي الربح:{" "}
        {totalProfit.toLocaleString(undefined, { maximumFractionDigits: 2 })}{" "}
        ج.م | إجمالي ربح المشرفين (
        {ADMIN_COMMISSION_RATE * 100}%):{" "}
        {(totalProfit * ADMIN_COMMISSION_RATE).toLocaleString(undefined, {
          maximumFractionDigits: 2,
        })}{" "}
        ج.م
      </div>
      <OrdersByAdminTable rows={rows} />
    </div>
  );
}
