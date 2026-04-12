"use client";

import { useState } from "react";
import { Trash2, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OfferCard } from "./offer-card";
import { useOfferMutations } from "../actions";
import type { Offer } from "@/types/admin/offers";

interface OfferListContainerProps {
  initialOffers: Offer[];
  categories: any[];
  brands: any[];
}

export function OfferListContainer({
  initialOffers,
  categories,
  brands,
}: OfferListContainerProps) {
  const [selectedOffers, setSelectedOffers] = useState<number[]>([]);
  const { deleteMutation } = useOfferMutations();

  const handleDelete = () => {
    deleteMutation.mutate(selectedOffers, {
      onSuccess: () => setSelectedOffers([]),
    });
  };

  return (
    <>
      <div className="p-4 space-y-4">
        {initialOffers.length > 0 ? (
          initialOffers.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              selectedOffers={selectedOffers}
              setSelectedOffers={setSelectedOffers}
              categories={categories}
              brands={brands}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
            <ImageIcon className="h-16 w-16 stroke-1 px-4 opacity-20" />
            <p className="text-lg text-center">لا توجد عروض حالياً</p>
          </div>
        )}
      </div>

      {/* Floating Action Bar */}
      {selectedOffers.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
          <div className="bg-slate-900 text-white rounded-2xl p-4 shadow-2xl flex items-center justify-between animate-in fade-in zoom-in slide-in-from-bottom-10 border border-slate-700">
            <div className="flex flex-col">
              <span className="text-sm font-bold">
                تم تحديد {selectedOffers.length} عرض
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedOffers([])}
                className="text-white hover:bg-white/10 rounded-xl"
              >
                إلغاء
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                className="rounded-xl shadow-lg px-4"
                disabled={deleteMutation.isPending}
              >
                <Trash2 className="h-4 w-4 ml-2" />
                <span>حذف المحدد</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
