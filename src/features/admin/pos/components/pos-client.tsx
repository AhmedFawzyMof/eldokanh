"use client";

import { useState, useMemo, useTransition, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Package, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Product } from "@/types/admin/products";
import { CheckoutDialog } from "@/features/admin/orders/components/checkout-dialog";
import { useCreatePOSOrder } from "@/features/admin/orders/actions";
import { CheckoutCart } from "@/features/admin/orders/components/cart";
import PaginationComponent from "@/components/pagination";

type CartItem = Product & { quantity: number };

interface POSClientProps {
  initialProducts: Product[];
  initialTotalCount: number;
  categories: any[];
  brands: any[];
  initialSearch: string;
  initialCategoryId: number | null;
  initialBrandId: number | null;
  initialPage: number;
}

export function POSClient({
  initialProducts,
  initialTotalCount,
  categories,
  brands,
  initialSearch,
  initialCategoryId,
  initialBrandId,
  initialPage,
}: POSClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPendingUrl, startTransition] = useTransition();

  const [search, setSearch] = useState(initialSearch);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const { mutate: createOrder, isPending: isOrderPending } = useCreatePOSOrder(
    () => {
      setCart([]);
      setIsCheckoutOpen(false);
    },
  );

  const updateUrl = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, value);
    });
    if (!updates.page) params.set("page", "1");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id
            ? { ...i, quantity: i.quantity + (i.type === "unit" ? 1 : 0.5) }
            : i,
        );
      }
      return [
        ...prev,
        { ...product, quantity: product.type === "unit" ? 1 : 0.5 },
      ];
    });
  };

  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0),
    [cart],
  );

  const cartQuantity = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart],
  );

  const handleFinishOrder = (addressData: any) => {
    const orderPayload = {
      items: cart.map((item) => ({
        productId: item.id!,
        quantity: item.quantity,
        price: item.price!,
      })),
      address: {
        fullName: addressData.fullName,
        phone: addressData.phone,
        city: addressData.city,
        street: addressData.street,
        building: addressData.building,
        floor: addressData.floor,
      },
      deliveryCost: addressData.deliveryCost,
      total: cartTotal,
    };

    createOrder(orderPayload);
  };

  const totalPages = Math.ceil(initialTotalCount / 20) || 1;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-40">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b p-4 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="search"
            placeholder="البحث عن منتج..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              updateUrl({ search: e.target.value });
            }}
            className="h-12 pr-12 text-lg rounded-2xl border-slate-200 focus:ring-primary shadow-sm"
          />
          {isPendingUrl && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select
            value={
              initialCategoryId === null ? "all" : String(initialCategoryId)
            }
            onValueChange={(v) =>
              updateUrl({ categoryId: v === "all" ? null : v })
            }
          >
            <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white shadow-sm">
              <SelectValue placeholder="جميع الفئات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الفئات</SelectItem>
              {categories.map((c: any) => (
                <SelectItem key={c.id} value={String(c.id)}>
                  {c.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={initialBrandId === null ? "all" : String(initialBrandId)}
            onValueChange={(v) =>
              updateUrl({ brandId: v === "all" ? null : v })
            }
          >
            <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white shadow-sm">
              <SelectValue placeholder="جميع الشركات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الشركات</SelectItem>
              {brands.map((b: any) => (
                <SelectItem key={b.id} value={String(b.id)}>
                  {b.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      <main className="p-4 flex-1">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {initialProducts.map((product: Product) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="group bg-white rounded-2xl p-3 text-right border border-slate-100 hover:border-primary/30 active:scale-[0.97] transition-all duration-200 shadow-sm flex flex-col items-center"
            >
              <div className="w-full aspect-square bg-slate-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden relative">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.nameAr}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <Package className="h-10 w-10 text-slate-200" />
                )}
                {cart.find((item) => item.id === product.id) && (
                  <div className="absolute top-2 right-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                    {cart.find((item) => item.id === product.id)?.quantity}
                  </div>
                )}
              </div>
              <h3 className="font-bold text-sm text-slate-800 line-clamp-2 min-h-[2.5rem] w-full px-1">
                {product.nameAr}
              </h3>
              <div className="flex justify-between items-center w-full mt-2 px-1">
                <span className="text-primary font-black text-sm">
                  {product.price?.toLocaleString()} ج.م
                </span>
                <div className="bg-primary/10 p-1.5 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <Plus className="h-4 w-4" />
                </div>
              </div>
            </button>
          ))}
        </div>

        {initialProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
            <Package className="h-16 w-16 stroke-1 px-4" />
            <p className="text-lg">لا توجد منتجات مطابقة للبحث</p>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <PaginationComponent
            totalProducts={initialTotalCount}
            totalPages={totalPages}
            currentPage={initialPage}
            searchParams={Object.fromEntries(searchParams.entries())}
          />
        </div>
      </main>

      <CheckoutCart
        cart={cart}
        CartQuantity={cartQuantity}
        cartTotal={cartTotal}
        setCart={setCart}
        onCheckout={setIsCheckoutOpen}
      />

      <CheckoutDialog
        isOpen={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        total={cartTotal}
        isPending={isOrderPending}
        onConfirm={handleFinishOrder}
      />
    </div>
  );
}
