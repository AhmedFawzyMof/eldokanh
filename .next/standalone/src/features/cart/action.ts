import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const MINIMUM_ORDER_FOR_PROMO = 100;

export const usePromoCodeMutation = ({
  applyPromoCode,
  removePromoCode,
  getSubtotal,
}: {
  applyPromoCode: (data: any) => void;
  removePromoCode: () => void;
  getSubtotal: () => number;
}) => {
  return useMutation({
    mutationFn: async (code: string) => {
      const subtotal = getSubtotal();
      if (subtotal <= MINIMUM_ORDER_FOR_PROMO) {
        toast.error(
          `🛒 الحد الأدنى لتطبيق كود الخصم هو ${MINIMUM_ORDER_FOR_PROMO} ج.م`,
        );
        return;
      }

      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error);
      }

      return data;
    },
    onSuccess: (data) => {
      applyPromoCode(data);
      const discount =
        data.discountType === "percentage"
          ? `خصم ${data.discountValue}%`
          : `خصم ${data.discountValue} ج.م`;
      toast.success(`🎉 تم تطبيق كود "${data.code}" بنجاح — ${discount}`);
    },
    onError: (error: any) => {
      removePromoCode();
      const msg: string = error.message || "";
      if (msg.includes("already used"))
        toast.error(
          "⚠️ لقد استخدمت هذا الكود من قبل ولا يمكن استخدامه مرة أخرى",
        );
      else if (msg.includes("usage limit"))
        toast.error("❌ عذراً، تجاوز هذا الكود الحد الأقصى للاستخدام");
      else if (msg.includes("expired") || msg.includes("Invalid"))
        toast.error("❌ كود الخصم غير صحيح أو انتهت صلاحيته");
      else
        toast.error(`❌ ${msg || "فشل تطبيق كود الخصم، يرجى المحاولة لاحقاً"}`);
    },
  });
};
