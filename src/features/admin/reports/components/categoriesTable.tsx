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

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useEffect, useState, useTransition } from "react";

export function CategoriesTable({ categories }: { categories: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [category, setCategory] = useState(searchParams.get("category") || "0");

  useEffect(() => {
    setCategory(searchParams.get("category") || "0");
  }, [searchParams]);

  const handleChange = (value: number) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("category", `${value}`);
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>الأرباح حسب القسم</CardTitle>
      </CardHeader>
      <CardContent>
        <Table dir="rtl">
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">القسم</TableHead>
              <TableHead className="text-right">عدد الطلبات</TableHead>
              <TableHead className="text-right">إجمالي الإيرادات</TableHead>
              <TableHead className="text-right">صافي الربح</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">
                  {category.name || "غير محدد"}
                </TableCell>
                <TableCell>{category.orders}</TableCell>
                <TableCell>
                  {category.revenue?.toLocaleString() || 0} ج.م
                </TableCell>
                <TableCell className="text-primary font-bold">
                  {category.profit?.toLocaleString() || 0} ج.م
                </TableCell>
                <TableCell>
                  <Button onClick={(e) => handleChange(category.id)}>
                    اختيار
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
