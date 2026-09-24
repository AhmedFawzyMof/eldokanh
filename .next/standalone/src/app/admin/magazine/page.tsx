import { AddOffer } from "@/features/admin/offers/components/add-offers";
import { OfferListContainer } from "@/features/admin/offers/components/offer-list-container";
import { getAllOffers } from "@/models/offers";
import { getAllCategories } from "@/models/categories";
import { getAllBrands } from "@/models/brands";

export default async function OffersPage() {
  const [offers, categories, brands] = await Promise.all([
    getAllOffers(),
    getAllCategories(null, {
      image: false,
      description: false,
      productCount: false,
    }),
    getAllBrands(null, { onlyActive: false, includeDetails: false }),
  ]);

  return (
    <div className="flex flex-col min-h-screen pb-8">
      <div className="sticky top-16 lg:top-0 z-10 bg-white/95 backdrop-blur-md border-b p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between pt-1 text-right">
          <h1 className="text-xl font-black text-slate-900">
            إدارة العروض الترويجية ({offers.length})
          </h1>
          <AddOffer categories={categories as any} brands={brands as any} />
        </div>
      </div>

      <OfferListContainer
        initialOffers={offers as any}
        categories={categories as any}
        brands={brands as any}
      />
    </div>
  );
}
