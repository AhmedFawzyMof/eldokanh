import { PromoCodeSearch } from "@/features/admin/promo-codes/components/promo-code-search";
import { AddPromoCode } from "@/features/admin/promo-codes/components/add-promo-code";
import { PromoCodeListContainer } from "@/features/admin/promo-codes/components/promo-code-list-container";
import { getAllPromoCodes } from "@/models/promo_codes";
import PaginationComponent from "@/components/pagination";

export default async function PromoCodesPage(props: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const page = Number(searchParams.page) || 1;

  const data = await getAllPromoCodes(search, page);
  const codes = data.promoCodes || [];
  const totalCount = data.count || 0;
  const totalPages = Math.ceil(totalCount / 20) || 1;

  return (
    <div className="flex flex-col min-h-screen pb-8">
      <div className="sticky top-16 lg:top-0 z-10 bg-white/95 backdrop-blur-md border-b p-4 shadow-sm space-y-4">
        <PromoCodeSearch />

        <div className="flex items-center justify-between pt-1">
          <h1 className="text-xl font-black text-slate-900">
            أكواد الخصم ({totalCount})
          </h1>
          <AddPromoCode />
        </div>
      </div>

      <PromoCodeListContainer initialPromoCodes={codes as any} />

      <div className="p-4 flex justify-center">
        <PaginationComponent
          totalProducts={totalCount}
          totalPages={totalPages}
          currentPage={page}
          searchParams={{ search }}
        />
      </div>
    </div>
  );
}
