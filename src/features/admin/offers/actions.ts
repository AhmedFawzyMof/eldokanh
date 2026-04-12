import adminApi from "@/lib/admin/api";
import type { Offer } from "@/types/admin/offers";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const OfferService = {
  getAll: () => {
    return adminApi.get("/offers");
  },
  add: (data: any) => {
    return adminApi.post("/offers", data);
  },
  edit: (id: number, data: any) => {
    return adminApi.put(`/offers/${id}`, data);
  },
  deleteMany: (ids: number[]) => {
    return adminApi.delete("/offers", {
      params: { ids },
    });
  },
};

export const useGetOffers = () => {
  return useQuery({
    queryKey: ["admin", "offers"],
    queryFn: () => OfferService.getAll(),
    staleTime: 5 * 60 * 1000,
  });
};

export const useOfferMutations = () => {
  const queryClient = useQueryClient();

  const invalidateOffers = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "offers"] });
  };

  const addMutation = useMutation({
    mutationFn: (data: FormData) => OfferService.add(data),
    onSuccess: () => {
      invalidateOffers();
      toast.success("تم اضافة العرض بنجاح");
    },
    onError: () => toast.error("فشل في اضافة العرض"),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      OfferService.edit(id, data),
    onSuccess: () => {
      invalidateOffers();
      toast.success("تم تعديل العرض بنجاح");
    },
    onError: () => toast.error("فشل في تعديل العرض"),
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => OfferService.deleteMany(ids),
    onSuccess: () => {
      invalidateOffers();
      toast.success("تم حذف العرض");
    },
    onError: () => toast.error("فشل في الحذف"),
  });

  return { addMutation, editMutation, deleteMutation };
};
