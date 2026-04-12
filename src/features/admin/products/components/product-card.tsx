"use client";

import type { Product } from "@/types/admin/products";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { EditProduct } from "@/features/admin/products/components/edit-products";

export function ProductCard({
  product,
  selectedProducts,
  categories,
  brands,
  setSelectedProducts,
}: {
  product: Product;
  selectedProducts: number[];
  categories: any[];
  brands: any[];
  setSelectedProducts: (prev: any) => void;
}) {
  const isSelected = selectedProducts.includes(product.id!);

  const toggleSelect = (id: number) => {
    setSelectedProducts((prev: any) =>
      prev.includes(id) ? prev.filter((i: number) => i !== id) : [...prev, id],
    );
  };
  return (
    <Card
      key={product.id}
      onClick={() => toggleSelect(product.id!)}
      className={`overflow-hidden border-none shadow-sm transition-all active:scale-[0.98] cursor-pointer ${
        isSelected ? "ring-2 ring-primary bg-primary/5" : ""
      }`}
    >
      <CardContent className="p-0">
        <div className="flex p-3 gap-4">
          {/* Image Container */}
          <div className="relative shrink-0">
            <img
              src={product.imageUrl}
              alt={product.nameAr}
              className="h-24 w-24 rounded-xl object-cover bg-slate-100"
            />
            <div className="absolute top-1 right-1">
              <Checkbox
                checked={isSelected}
                className="h-5 w-5 rounded-full bg-white shadow-sm"
              />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 flex flex-col justify-between min-w-0 text-right">
            <div>
              <div className="flex justify-between items-start gap-1">
                <Badge
                  variant={product.isActive ? "secondary" : "destructive"}
                  className="text-[10px] px-1.5 h-5 shrink-0"
                >
                  {product.isActive ? "متاح" : "غير متاح"}
                </Badge>
                <h3 className="font-bold text-sm text-slate-900 leading-snug truncate flex-1">
                  {product.nameAr}
                </h3>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {product.descriptionAr}
              </p>

              <div className="flex justify-end gap-1 mt-2">
                <Badge
                  variant="outline"
                  className="text-[10px] font-normal border-slate-200"
                >
                  {product.categoryAr || product.category}
                </Badge>
              </div>
            </div>

            <div className="flex items-end justify-between mt-2">
              <div onClick={(e) => e.stopPropagation()}>
                <EditProduct
                  productEdit={product}
                  categories={categories || []}
                  brands={brands || []}
                />
              </div>

              <div className="flex flex-col">
                {product.discountPrice ? (
                  <>
                    <span className="text-[10px] line-through text-muted-foreground decoration-red-400">
                      {(
                        product.price! + product.discountPrice
                      ).toLocaleString()}{" "}
                      ج.م
                    </span>
                    <span className="text-sm font-black text-primary">
                      {product.price?.toLocaleString()} ج.م
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-black text-primary">
                    {product.price?.toLocaleString()} ج.m
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
