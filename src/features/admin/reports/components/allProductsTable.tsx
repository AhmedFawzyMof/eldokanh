"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

export function AllProductsTable({
  products,
  categories,
  brands,
  totalPages,
  currentPage,
}: {
  products: any[];
  categories: any[];
  brands: any[];
  totalPages: number;
  currentPage: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value && value !== "0") {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    params.set("page", "1"); // Reset to page 1 on filter change
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("category");
    params.delete("brand");
    params.set("page", "1");
    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <CardTitle>تقارير المنتجات</CardTitle>
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={searchParams.get("category") || "0"}
            onValueChange={(v) => handleFilterChange("category", v)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="حسب القسم" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">كل الأقسام</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={searchParams.get("brand") || "0"}
            onValueChange={(v) => handleFilterChange("brand", v)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="حسب الشركة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">كل الشركات</SelectItem>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id.toString()}>
                  {b.nameAr}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(searchParams.get("category") || searchParams.get("brand")) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-destructive hover:text-destructive/80"
            >
              <X className="h-4 w-4 mr-2" /> مسح الفلاتر
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-secondary/50 overflow-hidden">
          <Table dir="rtl">
            <TableHeader className="bg-secondary/5">
              <TableRow>
                <TableHead className="text-right">المنتج</TableHead>
                <TableHead className="text-right">القسم</TableHead>
                <TableHead className="text-right">الشركة</TableHead>
                <TableHead className="text-right">عدد الطلبات</TableHead>
                <TableHead className="text-right">إجمالي الإيرادات</TableHead>
                <TableHead className="text-right">صافي الربح</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                    لا توجد منتجات مطابقة لهذا الفلتر في هذه الفترة
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.name || "غير محدد"}</TableCell>
                    <TableCell>{p.categoryName || "-"}</TableCell>
                    <TableCell>{p.brandName || "-"}</TableCell>
                    <TableCell>{p.orders}</TableCell>
                    <TableCell>{p.revenue?.toLocaleString() || 0} ج.م</TableCell>
                    <TableCell className="text-primary font-bold">
                      {p.profit?.toLocaleString() || 0} ج.م
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
              صفحة {currentPage} من {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1 || isPending}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage >= totalPages || isPending}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
