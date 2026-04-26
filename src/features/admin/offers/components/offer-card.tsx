"use client";

import type { Offer } from "@/types/admin/offers";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageIcon, Info, Tag, Package, LayoutGrid } from "lucide-react";
import { EditOffer } from "@/features/admin/offers/components/edit-offers";

interface OfferCardProps {
  offer: Offer;
  selectedOffers: number[];
  setSelectedOffers: (prev: any) => void;
  categories: { id: number; nameAr: string }[];
  brands: { id: number; nameAr: string }[];
}

export function OfferCard({
  offer,
  selectedOffers,
  setSelectedOffers,
  categories,
  brands,
}: OfferCardProps) {
  const isSelected = selectedOffers.includes(offer.id);

  const toggleSelect = (e: React.MouseEvent, id: number) => {
    if ((e.target as HTMLElement).closest("button")) return;

    setSelectedOffers((prev: number[]) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const getTargetInfo = () => {
    if (offer.productId && offer.productId !== 0) {
      return {
        label: "منتج",
        icon: <Package className="h-3 w-3" />,
        id: offer.productId,
      };
    }
    if (offer.categoryId && offer.categoryId !== 0) {
      const cat = categories.find((c) => c.id === offer.categoryId);
      return {
        label: "قسم",
        icon: <LayoutGrid className="h-3 w-3" />,
        name: cat?.nameAr,
      };
    }
    if (offer.brandId && offer.brandId !== 0) {
      const brand = brands.find((b) => b.id === offer.brandId);
      return {
        label: "شركة",
        icon: <Tag className="h-3 w-3" />,
        name: brand?.nameAr,
      };
    }
    return { label: "عام", icon: <Info className="h-3 w-3" /> };
  };

  const target = getTargetInfo();

  return (
    <Card
      onClick={(e) => toggleSelect(e, offer.id)}
      className={`overflow-hidden border-none shadow-sm transition-all active:scale-[0.98] cursor-pointer ${
        isSelected ? "ring-2 ring-primary bg-primary/5" : "bg-white"
      }`}
    >
      <CardContent className="p-0">
        <div className="flex p-3 gap-4">
          <div className="relative shrink-0">
            <div className="h-24 w-36 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
              {offer.image ? (
                <img
                  src={offer.image}
                  alt="Offer"
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="h-10 w-10 text-slate-200" />
              )}
            </div>
            <div
              className={`absolute -top-1 -right-1 transition-opacity ${isSelected ? "opacity-100" : "opacity-0"}`}
            >
              <Checkbox
                checked={isSelected}
                className="h-5 w-5 rounded-full bg-white shadow-sm border-slate-200"
              />
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-between min-w-0 text-right">
            <div>
              <div className="flex justify-between items-start gap-2">
                <div className="flex flex-col gap-2">
                  <h3 className="font-bold text-base text-slate-900 leading-tight">
                    عرض ترويجي #{offer.id}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="w-fit flex gap-1.5 items-center text-[10px] bg-slate-50 text-slate-500 border-slate-200 py-1"
                  >
                    {target.icon}
                    <span>
                      {target.label}: {target.name || target.id || "رئيسي"}
                    </span>
                  </Badge>
                </div>

                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-50 text-[10px] h-5 rounded-full px-2">
                  نشط
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                <Info className="h-3 w-3" />
                <span>ID: {offer.id}</span>
              </div>

              <EditOffer
                offerEdit={offer}
                categories={categories}
                brands={brands}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
