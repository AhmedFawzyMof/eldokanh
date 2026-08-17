"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ADMIN_COMMISSION_RATE = 0.15;

function formatMoney(value: number) {
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} ج.م`;
}

export function AdminProductsTable({ rows }: { rows: any[] }) {
  const totalRevenue = rows.reduce((sum, r) => sum + (r.revenue || 0), 0);
  const totalProfit = rows.reduce((sum, r) => sum + (r.profit || 0), 0);
  const totalCommission = totalProfit * ADMIN_COMMISSION_RATE;

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="pt-6">
        <div className="rounded-md border border-secondary/50 overflow-hidden">
          <Table dir="rtl">
            <TableHeader className="bg-secondary/5">
              <TableRow>
                <TableHead className="text-right">المنتج</TableHead>
                <TableHead className="text-right">الكمية المباعة</TableHead>
                <TableHead className="text-right">إجمالي الإيرادات</TableHead>
                <TableHead className="text-right">صافي الربح</TableHead>
                <TableHead className="text-right">
                  ربح المشرف ({ADMIN_COMMISSION_RATE * 100}%)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-10 text-muted-foreground"
                  >
                    لا توجد منتجات مباعة في هذه الفترة
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.productId}>
                    <TableCell className="font-medium">
                      {row.name || "غير محدد"}
                    </TableCell>
                    <TableCell>{row.quantity || 0}</TableCell>
                    <TableCell>{formatMoney(row.revenue || 0)}</TableCell>
                    <TableCell>{formatMoney(row.profit || 0)}</TableCell>
                    <TableCell className="text-primary font-bold">
                      {formatMoney((row.profit || 0) * ADMIN_COMMISSION_RATE)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableRow>
              <TableCell colSpan={2} className="font-bold">
                الإجمالي
              </TableCell>
              <TableCell className="font-bold">
                {formatMoney(totalRevenue)}
              </TableCell>
              <TableCell className="font-bold">
                {formatMoney(totalProfit)}
              </TableCell>
              <TableCell className="text-primary font-bold">
                {formatMoney(totalCommission)}
              </TableCell>
            </TableRow>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}