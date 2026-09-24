"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { Product } from "@/types/admin/products";

type CartItem = Product & { quantity: number };

export function CheckoutCart({
  cart,
  CartQuantity,
  cartTotal,
  setCart,
  onCheckout,
}: {
  cart: CartItem[];
  CartQuantity: number;
  cartTotal: number;
  setCart: Dispatch<SetStateAction<CartItem[]>>;
  onCheckout: Dispatch<SetStateAction<boolean>>;
}) {
  const updateQuantity = (item: CartItem, direction: "plus" | "minus") => {
    const isUnit = item.type === "unit";
    // Check for Arabic category name correctly after porting
    const isVegFruit = item.categoryAr === "خضروات وفواكه";

    const step = isUnit ? 1 : 0.05;
    const minLimit = isUnit ? 1 : isVegFruit ? 0.25 : 0.05;

    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id !== item.id) return i;

          const currentQty = i.quantity;
          let newQty =
            direction === "plus" ? currentQty + step : currentQty - step;

          newQty = Math.round(newQty * 1000) / 1000;

          if (direction === "minus" && currentQty <= minLimit) {
            return { ...i, quantity: 0 };
          }

          return { ...i, quantity: newQty };
        })
        .filter((i) => i.quantity > 0),
    );
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed w-10 h-10 text-lg bottom-5 left-5 shadow-lg">
          <ShoppingCart className="h-6 w-6" />
          <span className=" sr-only">سلة البيع</span>
          {CartQuantity > 0 && (
            <Badge className="absolute -top-2 -right-2 bg-primary-foreground/20 text-primary-foreground p-1 text-xs">
              {CartQuantity}
            </Badge>
          )}
        </Button>
        {/* <div className="fixed w-full shrink-0 bottom-0 px-4 py-3 pb-6 bg-white/80 backdrop-blur-md border-t z-50">
          <button className="w-full h-14 bg-primary text-primary-foreground rounded-2xl flex items-center justify-between px-5 font-bold text-base active:scale-[0.98] transition-all shadow-lg shadow-primary/20">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              <span>سلة البيع</span>
              {CartQuantity > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-primary-foreground/20 text-primary-foreground px-2 py-0 text-xs rounded-full"
                >
                  {CartQuantity}
                </Badge>
              )}
            </div>
            <span className="text-lg">{cartTotal.toLocaleString()} ج.م</span>
          </button>
        </div> */}
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="rounded-t-[2.5rem] max-h-[90dvh] flex flex-col px-0 border-t-0 shadow-2xl"
      >
        <SheetHeader className="px-6 pb-4 border-b flex-row items-center justify-between">
          <SheetTitle className="text-xl font-bold">سلة البيع</SheetTitle>
          {cart.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCart([])}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
            >
              <Trash2 className="h-4 w-4 ml-2" />
              <span>مسح السلة</span>
            </Button>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-300">
              <ShoppingCart className="h-20 w-20 mb-4 opacity-20" />
              <p className="text-lg font-medium">السلة فارغة حالياً</p>
            </div>
          ) : (
            cart.map((item: CartItem) => (
              <div
                key={item.id}
                className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100"
              >
                <div className="flex-1 min-w-0 text-right">
                  <p className="font-bold text-slate-900 truncate">
                    {item.nameAr}
                  </p>
                  <p className="text-sm text-primary font-medium mt-1">
                    {item.price} ج.م × {item.quantity} ={" "}
                    <span className="font-black">
                      {(item.price! * item.quantity).toLocaleString()}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                  <button
                    onClick={() => updateQuantity(item, "plus")}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-slate-600"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-sm min-w-10 text-center">
                    {item.type === "unit"
                      ? item.quantity
                      : item.quantity.toFixed(2)}
                  </span>
                  <button
                    onClick={() => updateQuantity(item, "minus")}
                    className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-slate-50 text-red-500"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="shrink-0 px-6 py-6 pb-10 border-t bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-2xl font-black text-slate-900">
                {cartTotal.toLocaleString()} ج.م
              </span>
              <span className="text-slate-500 font-bold">إجمالي المبلغ</span>
            </div>
            <Button
              onClick={() => onCheckout(true)}
              className="w-full h-14 text-lg font-black rounded-2xl shadow-lg shadow-primary/20"
            >
              <CreditCard className="ml-3 h-6 w-6" />
              <span>إتمام وتأكيد البيع</span>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
