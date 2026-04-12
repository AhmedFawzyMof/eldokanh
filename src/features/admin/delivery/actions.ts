import adminApi from "@/lib/admin/api";
import type { Delivery } from "@/types/admin/delivery";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeliveryParams {
  search?: string;
}

const DeliveryService = {
  getAll: (params: DeliveryParams) => {
    return adminApi.get("/delivery", { params });
  },
  add: (data: Partial<Delivery>) => {
    return adminApi.post("/delivery", data);
  },
  edit: (id: number, data: Partial<Delivery>) => {
    return adminApi.put(`/delivery/${id}`, data);
  },
  deleteMany: (ids: number[]) => {
    return adminApi.delete("/delivery", {
      params: { ids },
    });
  },
};

export const useGetDeliveries = (params: DeliveryParams) => {
  return useQuery({
    queryKey: ["admin", "deliveries", params],
    queryFn: () => DeliveryService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useDeliveryMutations = () => {
  const queryClient = useQueryClient();

  const invalidateDeliveries = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "deliveries"] });
  };

  const addMutation = useMutation({
    mutationFn: (data: Partial<Delivery>) => DeliveryService.add(data),
    onSuccess: () => {
      invalidateDeliveries();
      toast.success("تم اضافة المنطقة بنجاح");
    },
    onError: () => toast.error("فشل في اضافة المنطقة"),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Delivery> }) =>
      DeliveryService.edit(id, data),
    onSuccess: () => {
      invalidateDeliveries();
      toast.success("تم تعديل المنطقة بنجاح");
    },
    onError: () => toast.error("فشل في تعديل المنطقة"),
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => DeliveryService.deleteMany(ids),
    onSuccess: () => {
      invalidateDeliveries();
      toast.success("تم حذف المناطق");
    },
    onError: () => toast.error("فشل في الحذف"),
  });

  return { addMutation, editMutation, deleteMutation };
};
