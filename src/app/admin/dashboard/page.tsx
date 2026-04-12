import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users } from "lucide-react";
import { differenceInPercent } from "@/lib/admin/differenceInPercent";
import { TopProducts } from "@/features/admin/dashboard/components/top-products";
import { RecentOrders } from "@/features/admin/dashboard/components/recent-orders";
import { getDashboardData } from "@/models/dashboard";

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) return <div className="p-8 text-center">لا توجد بيانات متاحة</div>;

  const dashboardData = data;

  return (
    <div className="flex flex-col p-4 bg-slate-50 space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="rounded-2xl border-none shadow-sm capitalize">
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الإيرادات</CardTitle>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.order.totalRevenue.total_revenue.toLocaleString()} ج.م
            </div>
            <p className="text-xs text-muted-foreground">
              {Number(differenceInPercent(
                dashboardData.order.totalRevenue.total_revenue,
                dashboardData.order.totalRevenue.total_revenue_lastmonth,
              )) >= 0 ? "+" : ""}
              {differenceInPercent(
                dashboardData.order.totalRevenue.total_revenue,
                dashboardData.order.totalRevenue.total_revenue_lastmonth,
              )}
              % من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عدد الطلبات</CardTitle>
            <ShoppingCart className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{dashboardData.order.numberOfOrders.total_orders}
            </div>
            <p className="text-xs text-muted-foreground">
              {Number(differenceInPercent(
                dashboardData.order.numberOfOrders.total_orders,
                dashboardData.order.numberOfOrders.total_orders_lastmonth,
              )) >= 0 ? "+" : ""}
              {differenceInPercent(
                dashboardData.order.numberOfOrders.total_orders,
                dashboardData.order.numberOfOrders.total_orders_lastmonth,
              )}
              % من الشهر الماضي
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العملاء النشطين</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{dashboardData.activeCustomers.total_user}
            </div>
            <p className="text-xs text-muted-foreground">
               {Number(differenceInPercent(
                dashboardData.activeCustomers.total_user,
                dashboardData.activeCustomers.total_users_lastmonth,
              )) >= 0 ? "+" : ""}
              {differenceInPercent(
                dashboardData.activeCustomers.total_user,
                dashboardData.activeCustomers.total_users_lastmonth,
              )}
              % من الشهر الماضي
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader>
            <CardTitle>أفضل المنتجات</CardTitle>
            <CardDescription>أفضل المنتجات مبيعا هذا الشهر</CardDescription>
          </CardHeader>
          <CardContent>
            <TopProducts topProducts={dashboardData.topProducts} />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader>
            <CardTitle>الطلبات الأخيرة</CardTitle>
            <CardDescription>أحدث طلبات العملاء</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <RecentOrders recentOrders={dashboardData.latestOrders} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
