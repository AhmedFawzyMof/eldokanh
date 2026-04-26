import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Package, ArrowUpRight } from "lucide-react";
import { differenceInPercent } from "@/lib/admin/differenceInPercent";
import { TopProducts } from "@/features/admin/dashboard/components/top-products";
import { RecentOrders } from "@/features/admin/dashboard/components/recent-orders";
import { getDashboardData } from "@/models/dashboard";
import { StatCard } from "@/features/admin/dashboard/components/stat-card";
import { DashboardHeader } from "@/features/admin/dashboard/components/dashboard-header";
import { RevenueChart } from "@/features/admin/dashboard/components/revenue-chart";

export default async function DashboardPage() {
  const data = await getDashboardData();

  if (!data) return <div className="p-8 text-center bg-card rounded-3xl m-4">لا توجد بيانات متاحة حالياً</div>;

  const dashboardData = data;

  const revenueTrend = Number(
    differenceInPercent(
      dashboardData.order.totalRevenue.total_revenue,
      dashboardData.order.totalRevenue.total_revenue_lastmonth,
    )
  );

  const ordersTrend = Number(
    differenceInPercent(
      dashboardData.order.numberOfOrders.total_orders,
      dashboardData.order.numberOfOrders.total_orders_lastmonth,
    )
  );

  const customersTrend = Number(
    differenceInPercent(
      dashboardData.activeCustomers.total_user,
      dashboardData.activeCustomers.total_users_lastmonth,
    )
  );

  return (
    <div className="flex flex-col p-6 space-y-8 max-w-[1600px] mx-auto">
      <DashboardHeader />

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="إجمالي الإيرادات"
          value={`${dashboardData.order.totalRevenue.total_revenue.toLocaleString()} ج.م`}
          description="من الشهر الماضي"
          icon={DollarSign}
          trend={revenueTrend}
        />

        <StatCard
          title="عدد الطلبات"
          value={`+${dashboardData.order.numberOfOrders.total_orders}`}
          description="من الشهر الماضي"
          icon={ShoppingCart}
          trend={ordersTrend}
        />

        <StatCard
          title="العملاء النشطين"
          value={`+${dashboardData.activeCustomers.total_user}`}
          description="من الشهر الماضي"
          icon={Users}
          trend={customersTrend}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Chart Area */}
        <div className="xl:col-span-2">
          <RevenueChart data={dashboardData.monthlyRevenue} />
        </div>

        {/* Top Products Sidebar */}
        <Card className="border-none shadow-sm h-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="space-y-1">
              <CardTitle>أفضل المنتجات</CardTitle>
              <CardDescription>المنتجات الأكثر طلباً</CardDescription>
            </div>
            <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
              <Package className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <TopProducts topProducts={dashboardData.topProducts} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-secondary/50 bg-secondary/10 px-6 py-4">
            <div className="space-y-1">
              <CardTitle className="text-xl">الطلبات الأخيرة</CardTitle>
              <CardDescription>نظرة سريعة على آخر 5 طلبات تم استلامها</CardDescription>
            </div>
            <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
              عرض الكل <ArrowUpRight className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent className="p-0">
            <RecentOrders recentOrders={dashboardData.latestOrders as any} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
