import { BrandSearch } from "@/features/admin/brands/components/brand-search";
import { AddBrand } from "@/features/admin/brands/components/add-brand";
import { BrandListContainer } from "@/features/admin/brands/components/brand-list-container";
import { getAllBrands } from "@/models/brands";

export default async function BrandsPage(props: {
  searchParams: Promise<{ search?: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";

  const brands = await getAllBrands(search, {
    onlyActive: false,
    includeDetails: true,
  });

  return (
    <div className="flex flex-col min-h-screen pb-8">
      <div className="sticky top-16 lg:top-0 z-10 bg-white/95 backdrop-blur-md border-b p-4 shadow-sm space-y-4">
        <BrandSearch />

        <div className="flex items-center justify-between pt-1">
          <h1 className="text-xl font-black text-slate-900">
            إدارة الشركات ({brands.length})
          </h1>
          <AddBrand />
        </div>
      </div>

      <BrandListContainer initialBrands={brands as any} />
    </div>
  );
}
