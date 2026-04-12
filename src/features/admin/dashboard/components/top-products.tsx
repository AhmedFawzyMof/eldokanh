interface TopProduct {
  productId: number | null;
  name: string | null;
  soldQuantity: number;
  revenue: number;
}

export function TopProducts({ topProducts }: { topProducts?: TopProduct[] }) {
  if (!topProducts) return null;

  return (
    <div className="space-y-6">
      {topProducts.map((product) => (
        <div
          key={product.productId}
          className="space-y-2 border-b border-orange-100 pb-2 last:border-0"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium leading-none">{product.name}</p>
              <p className="text-sm text-muted-foreground">
                {product.soldQuantity} الوحدات المباعة
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium leading-none">
                ربح: {product.revenue * product.soldQuantity} ج.م
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
