import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const usePromoCodeMutation = ({
  applyPromoCode,
  removePromoCode,
}: {
  applyPromoCode: (data: any) => void;
  removePromoCode: () => void;
}) => {
  return useMutation({
    mutationFn: async (code: string) => {
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
        toast.error("⚠️ لقد استخدمت هذا الكود من قبل ولا يمكن استخدامه مرة أخرى");
      else if (msg.includes("usage limit"))
        toast.error("❌ عذراً، تجاوز هذا الكود الحد الأقصى للاستخدام");
      else if (msg.includes("expired") || msg.includes("Invalid"))
        toast.error("❌ كود الخصم غير صحيح أو انتهت صلاحيته");
      else
        toast.error(`❌ ${msg || "فشل تطبيق كود الخصم، يرجى المحاولة لاحقاً"}`);
    },
  });
};
