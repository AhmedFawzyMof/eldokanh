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

export function CompaniesTable({ brands }: { brands: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleChange = (value: number) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("company", `${value}`);
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
              <TableHead className="text-right">الشركة</TableHead>
              <TableHead className="text-right">عدد الطلبات</TableHead>
              <TableHead className="text-right">إجمالي الإيرادات</TableHead>
              <TableHead className="text-right">صافي الربح</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell className="font-medium">
                  {brand.name || "غير محدد"}
                </TableCell>
                <TableCell>{brand.orders}</TableCell>
                <TableCell>
                  {brand.revenue?.toLocaleString() || 0} ج.م
                </TableCell>
                <TableCell className="text-green-600 font-bold">
                  {brand.profit?.toLocaleString() || 0} ج.م
                </TableCell>
                <TableCell>
                  <Button onClick={(e) => handleChange(brand.id)}>
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
