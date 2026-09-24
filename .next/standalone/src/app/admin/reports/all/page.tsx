import { getAllProductsReports } from "@/models/reports";
import { AllProductsTable } from "@/features/admin/reports/components/allProductsTable";
import { Filterdate } from "@/features/admin/reports/components/filterDate";
import { db } from "@/db";
import { products_category, product_brands } from "@/db/schema";

export default async function AllReportsPage(props: {
  searchParams: Promise<{
    from?: string;
    to?: string;
    category?: string;
    brand?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  let from = new Date().toISOString().split("T")[0];
  let to = new Date().toISOString().split("T")[0];
  const category = parseInt(searchParams.category || "0");
  const brand = parseInt(searchParams.brand || "0");
  const page = parseInt(searchParams.page || "1");

  if (searchParams.from) {
    from = new Date(searchParams.from).toISOString().split("T")[0];
  }

  if (searchParams.to) {
    to = new Date(searchParams.to).toISOString().split("T")[0];
  }

  const [reportData, categories, brands] = await Promise.all([
    getAllProductsReports({ from, to, category, brand, page }),
    db.select().from(products_category).all(),
    db.select().from(product_brands).all(),
  ]);

  return (
    <div className="flex flex-col p-6 space-y-8 max-w-[1600px] mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">تقارير المنتجات التفصيلية</h1>
          <p className="text-muted-foreground">
            عرض إحصائيات المبيعات والأرباح لجميع المنتجات مع فلاتر متقدمة
          </p>
        </div>
        <Filterdate />
      </div>
      <AllProductsTable
        products={reportData.products}
        categories={categories}
        brands={brands}
        totalPages={reportData.totalPages}
        currentPage={page}
      />
    </div>
  );
}
