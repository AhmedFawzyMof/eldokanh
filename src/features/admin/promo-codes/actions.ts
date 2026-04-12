import adminApi from "@/lib/admin/api";
import type { PromoCode } from "@/types/admin/promo-codes";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface PromoParams {
  search?: string;
  page?: number;
}

const PromoCodeService = {
  getAll: (params: PromoParams) => {
    return adminApi.get("/promocode", { params });
  },
  add: (data: Partial<PromoCode>) => {
    return adminApi.post("/promocode", data);
  },
  edit: (id: number, data: Partial<PromoCode>) => {
    return adminApi.put(`/promocode/${id}`, data);
  },
  deleteMany: (ids: number[]) => {
    return adminApi.delete("/promocode", {
      params: { ids },
    });
  },
  toggleStatus: (id: number) => {
    return adminApi.patch(`/promocode/${id}/toggle`, {});
  },
};

export const useGetPromoCodes = (params: PromoParams) => {
  return useQuery({
    queryKey: ["admin", "promo-codes", params],
    queryFn: () => PromoCodeService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const usePromoCodeMutations = () => {
  const queryClient = useQueryClient();

  const invalidatePromos = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "promo-codes"] });
  };

  const addMutation = useMutation({
    mutationFn: (data: Partial<PromoCode>) => PromoCodeService.add(data),
    onSuccess: () => {
      invalidatePromos();
      toast.success("تم إضافة كود الخصم بنجاح");
    },
    onError: () => toast.error("فشل في إضافة كود الخصم"),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<PromoCode> }) =>
      PromoCodeService.edit(id, data),
    onSuccess: () => {
      invalidatePromos();
      toast.success("تم تعديل كود الخصم بنجاح");
    },
    onError: () => toast.error("فشل في تعديل كود الخصم"),
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => PromoCodeService.deleteMany(ids),
    onSuccess: () => {
      invalidatePromos();
      toast.success("تم حذف الأكواد المختارة");
    },
    onError: () => toast.error("فشل في عملية الحذف"),
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id: number) => PromoCodeService.toggleStatus(id),
    onSuccess: () => {
      invalidatePromos();
      toast.success("تم تغيير حالة الكود بنجاح");
    },
    onError: () => toast.error("فشل في تغيير الحالة"),
  });

  return { addMutation, editMutation, deleteMutation, toggleStatusMutation };
};
