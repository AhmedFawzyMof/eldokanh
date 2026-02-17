"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

import ShippingForm from "@/features/checkout/components/shippingForm";
import PaymentMethod from "@/features/checkout/components/paymentMethod";
import OrderSummary from "@/features/checkout/components/orderSummery";
import PromoCodeSection from "@/features/checkout/components/promoCodeSection";

export interface DeliveryOption {
  city: string;
  cost: number;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [deliveryOptions, setDeliveryOptions] = useState<DeliveryOption[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const {
    cart,
    getSubtotal,
    getTotal,
    getDiscountAmount,
    promoCode,
    clearCart,
  } = useCartStore();

  useEffect(() => {
    const fetchDelivery = async () => {
      try {
        const res = await fetch("/api/delivery");
        const data = await res.json();
        setDeliveryOptions(data);
      } catch (err) {
        console.error("Failed to load delivery costs");
      }
    };
    fetchDelivery();
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  const deliveryCost = useMemo(() => {
    const option = deliveryOptions.find((opt) => opt.city === selectedCity);
    return option ? option.cost : 0;
  }, [selectedCity, deliveryOptions]);

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const finalTotal = getTotal() + deliveryCost;

  const handlePlaceOrder = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCity) return toast.error("يرجى اختيار المدينة");
    if (cart.length === 0) return toast.error("سلة التسوق فارغة");

    setIsProcessing(true);
    const formData = new FormData(e.currentTarget);

    const orderData = {
      address: {
        fullName: formData.get("fullName"),
        phone: formData.get("phone"),
        city: selectedCity,
        street: formData.get("street"),
        building: formData.get("building"),
        floor: formData.get("floor"),
      },
      paymentMethod,
      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      promoCodeId: promoCode ? promoCode.code : null,
      totalAmount: finalTotal,
      deliveryCost: deliveryCost,
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        toast.error("حدث خطأ أثناء إتمام الطلب");
      }

      const resData: any = response.json();
      clearCart();
      router.push(`/order-confirmation/${resData.orderId}`);
    } catch (err) {
      toast.error("خطأ في الاتصال بالخادم");
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href="/cart">
            <ArrowLeft className="ml-2 h-4 w-4" /> العودة للسلة
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <h1 className="text-3xl font-bold">إتمام الشراء</h1>
            <form
              onSubmit={handlePlaceOrder}
              id="checkout-form"
              className="space-y-8"
            >
              <ShippingForm
                deliveryOptions={deliveryOptions}
                setSelectedCity={setSelectedCity}
              />
              <PaymentMethod
                value={paymentMethod}
                onChange={setPaymentMethod}
              />
            </form>
          </div>

          <div className="lg:col-span-1 space-y-6">
            <PromoCodeSection />
            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              deliveryCost={deliveryCost}
              finalTotal={finalTotal}
              isProcessing={isProcessing}
              citySelected={!!selectedCity}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
