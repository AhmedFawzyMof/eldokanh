"use client";

import type { Delivery } from "@/types/admin/delivery";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Truck, Info, MapPin } from "lucide-react";
import { EditDelivery } from "@/features/admin/delivery/components/edit-delivery";

export function DeliveryCard({
  delivery,
  selectedIds,
  setSelectedIds,
}: {
  delivery: Delivery;
  selectedIds: number[];
  setSelectedIds: (prev: any) => void;
}) {
  const isSelected = selectedIds.includes(delivery.id);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev: any) =>
      prev.includes(id) ? prev.filter((i: number) => i !== id) : [...prev, id],
    );
  };

  return (
    <Card
      onClick={() => toggleSelect(delivery.id)}
      className={`overflow-hidden border-none shadow-sm transition-all active:scale-[0.98] cursor-pointer ${
        isSelected ? "ring-2 ring-primary bg-primary/5" : "bg-white"
      }`}
    >
      <CardContent className="p-0">
        <div className="flex p-4 gap-4 items-center">
          <div className="relative shrink-0">
            <div className="h-16 w-16 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
              <MapPin className="h-8 w-8 text-primary/40" />
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
              <div className="flex justify-between items-center gap-2">
                <div className="flex flex-col flex-1">
                  <h3 className="font-bold text-lg text-slate-900 leading-tight truncate">
                    {delivery.city}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Truck className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-sm font-black text-primary">
                      {delivery.deliveryCost?.toLocaleString()} ج.م
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50">
              <div className="flex items-center gap-1.5 text-[10px] text-slate-300">
                <span>ID: {delivery.id}</span>
                <Info className="h-3 w-3" />
              </div>

              <EditDelivery deliveryEdit={delivery} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
