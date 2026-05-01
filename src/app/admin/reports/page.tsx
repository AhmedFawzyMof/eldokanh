import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DollarSign,
  BanknoteArrowUp,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
} from "lucide-react";
import { TopProducts } from "@/features/admin/dashboard/components/top-products";
import { RecentOrders } from "@/features/admin/dashboard/components/recent-orders";
import { StatCard } from "@/features/admin/dashboard/components/stat-card";
import { RevenueChart } from "@/features/admin/dashboard/components/revenue-chart";
import { getStatData } from "@/models/reports";
import { differenceInPercent } from "@/lib/admin/differenceInPercent";
import { DateButtons } from "@/features/admin/reports/components/dateButtons";
import Link from "next/link";

export default async function ReportsPage(props: {
  searchParams: Promise<{ date?: string; from?: string; to?: string }>;
}) {
  const searchParams = await props.searchParams;
  const date = searchParams.date || "";
  let from = new Date().toISOString().split("T")[0];
  let to = new Date().toISOString().split("T")[0];

  if (searchParams.from) {
    from = new Date(searchParams.from).toISOString().split("T")[0];
  }

  if (searchParams.to) {
    to = new Date(searchParams.to).toISOString().split("T")[0];
  }

  const data = await getStatData(from, to, date);

  if (!data) {
    return (
      <div className="p-8 text-center bg-card rounded-3xl m-4">
        لا توجد بيانات متاحة حالياً
      </div>
    );
  }

  const reportData = data;

  let revenueTrend;
  let ordersTrend;
  let customersTrend;
  let profetTrend;

  if (reportData.stats) {
    revenueTrend = Number(
      differenceInPercent(
        reportData.stats?.totalRevenue,
        reportData.stats.totalOrdersLastMonth,
      ),
    );
    ordersTrend = Number(
      differenceInPercent(
        reportData.stats.totalOrders,
        reportData.stats.totalOrdersLastMonth,
      ),
    );

    customersTrend = Number(
      differenceInPercent(
        reportData.stats.activeUsers,
        reportData.stats.activeUsersLastMonth,
      ),
    );
    profetTrend = Number(
      differenceInPercent(
        reportData.stats.totalProfet,
        reportData.stats.totalProfetLastMonth,
      ),
    );
  }

  return (
    <div className="flex flex-col p-6 space-y-8 max-w-[1600px] mx-auto">
      <DateButtons />
      <div className="flex flex-col items-start gap-3 lg:flex-row">
        <Link
          href={"/admin/reports/categories"}
          className=" bg-primary p-2 rounded text-white cursor-pointer"
        >
          تقارير حسب الاقسام
        </Link>
        <Link
          href={"/admin/reports/companies"}
          className=" bg-primary p-2 rounded text-white cursor-pointer"
        >
          تقارير حسب الشركات
        </Link>
        <Link
          href={"/admin/reports/all"}
          className=" bg-primary p-2 rounded text-white cursor-pointer"
        >
          تقارير عامه
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="إجمالي الإيرادات"
          value={`${reportData.stats?.totalRevenue || 0} ج.م`}
          description="من الشهر الماضي"
          icon={DollarSign}
          trend={revenueTrend}
        />

        <StatCard
          title="عدد الطلبات"
          value={`+${reportData.stats?.totalOrders}`}
          description="من الشهر الماضي"
          icon={ShoppingCart}
          trend={ordersTrend}
        />

        <StatCard
          title="العملاء النشطين"
          value={`+${reportData.stats?.activeUsers}`}
          description="من الشهر الماضي"
          icon={Users}
          trend={customersTrend}
        />

        <StatCard
          title="صافي الربح"
          value={`${reportData.stats?.totalProfet || 0} ج.م`}
          description="من الشهر الماضي"
          icon={BanknoteArrowUp}
          trend={profetTrend}
        />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <RevenueChart data={reportData.revenue} />
        </div>
      </div>
    </div>
  );
}
