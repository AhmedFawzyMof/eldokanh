"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter, useSearchParams } from "next/navigation";

const ADMIN_COMMISSION_RATE = 0.15;

function formatMoney(value: number) {
  return `${value.toLocaleString(undefined, { maximumFractionDigits: 2 })} ج.م`;
}

export function OrdersByAdminTable({ rows }: { rows: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const openAdminDetails = (adminId: number) => {
    const params = new URLSearchParams();
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const query = params.toString();
    router.push(
      `/admin/reports/orders/${adminId}${query ? `?${query}` : ""}`,
    );
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>عدد الطلبات لكل مشرف</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-secondary/50 overflow-hidden">
          <Table dir="rtl">
            <TableHeader className="bg-secondary/5">
              <TableRow>
                <TableHead className="text-right">المشرف</TableHead>
                <TableHead className="text-right">عدد الطلبات</TableHead>
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
                    لا توجد طلبات مسجلة في هذه الفترة
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow
                    key={row.adminId}
                    onClick={() => openAdminDetails(row.adminId)}
                    className="cursor-pointer hover:bg-secondary/10"
                  >
                    <TableCell className="font-medium">
                      {row.name || "غير محدد"}
                    </TableCell>
                    <TableCell>{row.orders}</TableCell>
                    <TableCell>
                      {formatMoney(row.revenue || 0)}
                    </TableCell>
                    <TableCell>
                      {formatMoney(row.profit || 0)}
                    </TableCell>
                    <TableCell className="text-primary font-bold">
                      {formatMoney((row.profit || 0) * ADMIN_COMMISSION_RATE)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}