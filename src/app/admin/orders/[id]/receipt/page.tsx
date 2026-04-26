"use client";

import { use, useRef, useMemo } from "react";
import AdminLoading from "@/app/admin/_components/AdminLoading";
import { useGetOrderById } from "@/features/admin/orders/actions";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { ChevronRight, Printer, MoveLeft } from "lucide-react";
import Link from "next/link";
import "./receipt.css";
import Image from "next/image";

const METHODS = {
  cash: "نقدي (عند الاستلام)",
  fawaterk: "بطاقة ائتمان / ميزة",
} as const;

export default function ReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const id = parseInt(resolvedParams.id);
  const receiptRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useGetOrderById(id);
  const orderData = data?.data;

  const subtotal = useMemo(() => {
    if (!orderData?.items) return 0;
    return orderData.items.reduce((acc: number, item: any) => {
      return acc + item.price * item.quantity;
    }, 0);
  }, [orderData?.items]);

  const discount = useMemo(() => {
    if (!orderData?.promo) return 0;
    const { discountType, discountValue } = orderData.promo;

    if (discountType === "percentage") {
      return (subtotal * discountValue) / 100;
    }
    return discountValue;
  }, [subtotal, orderData?.promo]);

  const deliveryCost = orderData?.payment?.deliveryCost || 0;
  const finalAmount = subtotal - discount + deliveryCost;

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Order-${id}`,
  });

  if (isLoading) return <AdminLoading />;
  if (!orderData)
    return (
      <div className="p-8 text-center font-bold">لم يتم العثور على الطلب</div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 pb-20">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="rounded-xl">
              <Link href={`/admin/orders/${id}`}>
                <MoveLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-black text-slate-900">
                إيصال الطلب #{id}
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                ORDER RECEIPT
              </p>
            </div>
          </div>
          <Button
            onClick={() => handlePrint()}
            className="rounded-xl h-11 px-6 font-bold shadow-lg shadow-primary/20 flex items-center gap-2"
          >
            <Printer className="h-5 w-5" />
            طباعة الإيصال
          </Button>
        </div>
      </div>

      <div className="flex-1 flex justify-center p-4 md:p-8">
        <div className="bg-white shadow-xl shadow-slate-200/50 rounded-3xl p-8 border border-slate-100 h-fit printable-card">
          <div dir="rtl" className="printable-area mx-auto" ref={receiptRef}>
            <div className="text-center space-y-4">
              <div className="logo py-4 flex items-center flex-col">
                <Image width={150} height={150} src="/logo.webp" alt="Logo" />
                <div className="h-1 w-12 bg-primary mx-auto mt-1 rounded-full" />
              </div>

              <div className="divider" />

              <div className="header-info text-sm font-bold text-slate-600">
                <span>
                  التاريخ:{" "}
                  {new Date(orderData.createdAt).toLocaleDateString("ar-EG")}
                </span>
                <span>
                  وسيلة الدفع:{" "}
                  {METHODS[orderData.payment.method as keyof typeof METHODS] ||
                    orderData.payment.method}
                </span>
              </div>

              <div className="divider" />
            </div>

            <div className="user-details space-y-3 py-4 text-sm">
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="font-bold text-slate-900">رقم الطلب</span>
                <span className="font-black text-primary">#{id}</span>
              </div>
              <div className="space-y-2 px-1">
                <p className="flex justify-between">
                  <span className="text-slate-400 font-bold">العميل:</span>
                  <span className="text-slate-900 font-black">
                    {orderData.address.fullName}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-slate-400 font-bold">الهاتف:</span>
                  <span className="text-slate-900 font-black font-mono">
                    {orderData.address.phone}
                  </span>
                </p>
                <div className="flex justify-between items-start gap-4">
                  <span className="text-slate-400 font-bold shrink-0">
                    العنوان:
                  </span>
                  <span className="text-slate-900 font-bold text-left md:text-right leading-relaxed">
                    {orderData.address.city}، {orderData.address.street}، مبنى{" "}
                    {orderData.address.building}، دور {orderData.address.floor}
                  </span>
                </div>
              </div>
            </div>

            <div className="divider" />

            <div className="py-4">
              <table className="w-full text-right border-collapse text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-100">
                    <th className="py-3 font-black text-slate-900 text-right">
                      المنتج
                    </th>
                    <th className="py-3 font-black text-slate-900 text-center">
                      السعر
                    </th>
                    <th className="py-3 font-black text-slate-900 text-center">
                      الكمية
                    </th>
                    <th className="py-3 font-black text-slate-900 text-left">
                      المجموع
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orderData.items.map((item: any) => (
                    <tr key={item.id}>
                      <td className="py-4 font-bold text-slate-800">
                        {item.nameAr}
                      </td>
                      <td className="py-4 text-center font-mono font-bold text-slate-600">
                        {item.price?.toLocaleString()}
                      </td>
                      <td className="py-4 text-center font-mono font-bold text-slate-600">
                        {item.quantity}
                      </td>
                      <td className="py-4 text-left font-mono font-black text-slate-900">
                        {(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 space-y-3 bg-slate-50 p-6 rounded-3xl border border-slate-100">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">
                  الإجمالي الفرعي
                </span>
                <span className="font-black font-mono text-slate-700">
                  {subtotal.toLocaleString()} ج.م
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600 font-bold">
                    خصم ({orderData.promo.code})
                  </span>
                  <span className="font-black font-mono text-emerald-600">
                    -{discount.toLocaleString()} ج.م
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-bold">تكلفة التوصيل</span>
                <span className="font-black font-mono text-slate-700">
                  {deliveryCost.toLocaleString()} ج.م
                </span>
              </div>

              <div className="divider !my-2 border-slate-200" />

              <div className="flex justify-between items-center text-lg">
                <span className="font-black text-slate-900">
                  الإجمالي النهائي
                </span>
                <span className="text-2xl font-black text-primary font-mono tracking-tight">
                  {finalAmount.toLocaleString()} ج.م
                </span>
              </div>
            </div>

            <div className="footer text-center mt-12 space-y-2">
              <p className="text-sm font-black text-slate-900">
                شكراً لتسوقكم معنا!
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                WWW.ELDOKANH.COM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
