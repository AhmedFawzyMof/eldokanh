import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  getAdminProductsReport,
  ADMIN_COMMISSION_RATE,
} from "@/models/reports";
import { AdminProductsTable } from "@/features/admin/reports/components/adminProductsTable";
import { Filterdate } from "@/features/admin/reports/components/filterDate";

export default async function AdminProductsPage(props: {
  params: Promise<{ adminId: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;

  const adminId = parseInt(params.adminId);
  if (!adminId) notFound();

  const admin = await db
    .select({ id: users.id, name: users.name })
    .from(users)
    .where(eq(users.id, adminId))
    .get();

  if (!admin) notFound();

  let from = new Date().toISOString().split("T")[0];
  let to = new Date().toISOString().split("T")[0];

  if (searchParams.from) {
    from = new Date(searchParams.from).toISOString().split("T")[0];
  }

  if (searchParams.to) {
    to = new Date(searchParams.to).toISOString().split("T")[0];
  }

  const products = await getAdminProductsReport({ from, to, adminId });
  const totalProfit = products.reduce((sum, p) => sum + (p.profit || 0), 0);

  return (
    <div className="flex flex-col p-6 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/admin/reports/orders"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            عودة لتقارير المشرفين
          </Link>
          <h1 className="text-2xl font-bold">منتجات {admin.name}</h1>
          <p className="text-muted-foreground">
            إجمالي ربح المشرف ({ADMIN_COMMISSION_RATE * 100}%):{" "}
            <span className="font-bold text-primary">
              {totalProfit.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}{" "}
              ج.م
            </span>
          </p>
        </div>
        <Filterdate />
      </div>
      <AdminProductsTable rows={products} />
    </div>
  );
}
