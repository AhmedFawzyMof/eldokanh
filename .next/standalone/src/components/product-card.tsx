"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Heart, HeartCrack } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Product } from "@/db/schema.types";

type ProductCardType = Product & {
  isFav: boolean | null;
  category: string | null;
};

export function ProductCard(data: { product: Partial<ProductCardType> }) {
  const product = data.product;
  const { data: session } = useSession();
  const router = useRouter();

  const addToCart = useCartStore((state) => state.addToCart);

  const isDisabled = !product.isActive;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDisabled) return;

    addToCart({
      id: String(product.id),
      name: product.nameAr!,
      price: product.price!,
      type: product.type!,
      quantity: 1,
      image: product.imageUrl!,
    });
    toast.success("تم اضافة المنتج للسلة بنجاح");
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDisabled) return;

    if (!session) {
      router.push("/api/auth/signin");
      return;
    }

    try {
      const response = await fetch("/api/fav", {
        method: "POST",
        body: JSON.stringify({ productId: product.id }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success("تم اضافة المنتج للمفضلة بنجاح");
      }
    } catch (error) {
      console.error("Error adding to favorites", error);
    }
  };

  let hasDiscount = false;
  if (product.discountPrice && product.discountPrice > 0) {
    hasDiscount = product.discountPrice > 0;
  }
  let discountPercent = 0;
  if (hasDiscount && product.discountPrice && product.discountPrice > 0) {
    discountPercent = Math.round(
      (product.discountPrice / (product.price! + product.discountPrice)) * 100,
    );
  }

  return (
    <Link
      href={isDisabled ? "#" : `/product/${product.id}`}
      className={`group relative block ${isDisabled ? "cursor-not-allowed" : ""}`}
    >
      <div
        className={`bg-card rounded-3xl p-4 shadow-sm transition-all duration-300 ${!isDisabled && "hover:shadow-md"}`}
      >
        {isDisabled && (
          <div className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl bg-white/10 overflow-hidden">
            <div className="bg-white/90 px-4 py-2 rounded-full shadow-xl border border-white/50 transform -rotate-3">
              <span className="text-sm font-bold text-slate-600 tracking-tight">
                غير متوفر حالياً
              </span>
            </div>
          </div>
        )}

        <div
          className={`relative aspect-square mb-4 rounded-2xl overflow-hidden bg-secondary ${isDisabled ? "grayscale-[0.5] opacity-60" : ""}`}
        >
          <Image
            src={product.imageUrl || "/placeholder.svg"}
            alt={product.nameAr!}
            fill
            className={`object-cover transition-transform duration-300 ${!isDisabled && "group-hover:scale-105"}`}
          />

          {/* Favorite Button */}
          {!isDisabled && (
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-2 left-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white shadow"
              onClick={handleFavorite}
            >
              {Boolean(product.isFav) ? (
                <Heart className="h-4 w-4" />
              ) : (
                <HeartCrack className="h-4 w-4" />
              )}
            </Button>
          )}

          {hasDiscount && !isDisabled && (
            <Badge className="absolute top-2 right-2 bg-red-500 text-white">
              وفر {discountPercent}%
            </Badge>
          )}
        </div>

        <div className={`space-y-2 ${isDisabled ? "opacity-40" : ""}`}>
          <div>
            <p className="text-xs text-muted-foreground">{product.category}</p>
            <h3 className="font-medium text-sm leading-tight">
              {product.nameAr}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-semibold text-base">
                {product.price!.toFixed(2)} ج.م
              </span>
              {hasDiscount && product.discountPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {(product.price! + product.discountPrice).toFixed(2)} ج.م
                </span>
              )}
            </div>

            {!isDisabled && (
              <Button
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleAddToCart}
              >
                <Plus className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
