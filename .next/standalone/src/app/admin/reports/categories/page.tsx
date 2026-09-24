import { StatCard } from "@/features/admin/dashboard/components/stat-card";
import { Filterdate } from "@/features/admin/reports/components/filterDate";
import { differenceInPercent } from "@/lib/admin/differenceInPercent";
import { getCategoriesReports } from "@/models/reports";
import { BanknoteArrowUp, DollarSign, ShoppingCart, X } from "lucide-react";
import { CategoriesTable } from "@/features/admin/reports/components/categoriesTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CategoriesReportsPage(props: {
  searchParams: Promise<{ from?: string; to?: string; category?: string }>;
}) {
  const searchParams = await props.searchParams;
  let from = new Date().toISOString().split("T")[0];
  let to = new Date().toISOString().split("T")[0];
  const category = parseInt(searchParams.category || "0");

  if (searchParams.from) {
    from = new Date(searchParams.from).toISOString().split("T")[0];
  }

  if (searchParams.to) {
    to = new Date(searchParams.to).toISOString().split("T")[0];
  }

  const data = await getCategoriesReports(from, to, category);

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
    profetTrend = Number(
      differenceInPercent(
        reportData.stats.totalProfet,
        reportData.stats.totalProfetLastMonth,
      ),
    );
  }

  return (
    <div className="flex flex-col p-6 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <Filterdate />
        {category > 0 && (
          <div className="flex items-center gap-3 bg-secondary/20 px-4 py-2 rounded-full border border-secondary">
            <span className="text-sm font-medium">عرض نتائج قسم محدد</span>
            <Link
              href={`/admin/reports/categories?from=${from}&to=${to}`}
              className="hover:opacity-80 transition-opacity"
            >
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
          title="صافي الربح"
          value={`${reportData.stats?.totalProfet || 0} ج.م`}
          description="من الشهر الماضي"
          icon={BanknoteArrowUp}
          trend={profetTrend}
        />
      </div>
      <CategoriesTable categories={reportData.categories} />
    </div>
  );
}
