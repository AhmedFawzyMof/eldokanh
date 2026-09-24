import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import Link from "next/link";

export default function EmptyOrders() {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-20">
        <Package className="h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-xl font-medium">لا توجد طلبات بعد</h3>
        <p className="text-muted-foreground mb-6">
          ابدأ التسوق لإضافة طلباتك هنا.
        </p>
        <Button asChild>
          <Link href="/products">تصفح المنتجات</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
