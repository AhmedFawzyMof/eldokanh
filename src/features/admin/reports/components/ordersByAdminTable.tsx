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

export function OrdersByAdminTable({ rows }: { rows: any[] }) {
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
                <TableHead className="text-right">البريد الإلكتروني</TableHead>
                <TableHead className="text-right">عدد الطلبات</TableHead>
                <TableHead className="text-right">إجمالي الإيرادات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center py-10 text-muted-foreground"
                  >
                    لا توجد طلبات مسجلة في هذه الفترة
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.adminId}>
                    <TableCell className="font-medium">
                      {row.name || "غير محدد"}
                    </TableCell>
                    <TableCell>{row.email || "-"}</TableCell>
                    <TableCell>{row.orders}</TableCell>
                    <TableCell className="text-primary font-bold">
                      {row.revenue?.toLocaleString() || 0} ج.م
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
