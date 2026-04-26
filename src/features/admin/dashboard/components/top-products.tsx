import { Progress } from "@/components/ui/progress";

interface TopProduct {
  productId: number | null;
  name: string | null;
  nameAr: string;
  soldQuantity: number;
  revenue: number;
}

export function TopProducts({ topProducts }: { topProducts?: TopProduct[] }) {
  if (!topProducts) return null;

  // Find max quantity to scale progress bars
  const maxQuantity = Math.max(...topProducts.map(p => p.soldQuantity), 1);

  return (
    <div className="space-y-6 pt-4">
      {topProducts.map((product) => (
        <div
          key={product.productId}
          className="group transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="space-y-1">
              <p className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">
                {product.name ? product.name : product.nameAr}
              </p>
              <p className="text-xs text-muted-foreground">
                {product.soldQuantity} الوحدات المباعة
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-primary">
                {(product.revenue).toLocaleString()} ج.م
              </p>
            </div>
          </div>
          <Progress value={(product.soldQuantity / maxQuantity) * 100} className="h-1.5 bg-secondary" />
        </div>
      ))}
    </div>
  );
}
