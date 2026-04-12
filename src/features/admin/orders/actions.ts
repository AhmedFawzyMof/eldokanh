import adminApi from "@/lib/admin/api";
import type { Order } from "@/types/admin/orders";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface OrderParams {
  search?: string;
  page?: number;
}

const OrderService = {
  getAll: (params: OrderParams) => {
    return adminApi.get("/orders", { params });
  },
  getOne: (id: number) => {
    return adminApi.get(`/orders/${id}`);
  },
  add: (data: Partial<Order>) => {
    return adminApi.post("/orders", data);
  },
  edit: (id: number, data: Partial<Order>) => {
    return adminApi.put(`/orders/${id}`, data);
  },
  deleteMany: (ids: number[]) => {
    return adminApi.delete("/orders", {
      params: { ids },
    });
  },
  deleteOne: (id: number, orderItemId: number) => {
    return adminApi.delete(`/orders/${id}`, {
      params: { id: orderItemId },
    });
  },
  createPOS: (data: any) => {
    return adminApi.post("/orders/pos", data);
  },
};

export const useGetOrders = (params: OrderParams) => {
  return useQuery({
    queryKey: ["admin", "orders", params],
    queryFn: () => OrderService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetOrderById = (id?: number) => {
  return useQuery({
    queryKey: ["admin", "order", id],
    queryFn: () => OrderService.getOne(id!),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  });
};

export const useOrderMutations = () => {
  const queryClient = useQueryClient();

  const invalidateOrders = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
  };

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Order> }) =>
      OrderService.edit(id, data),
    onSuccess: () => {
      invalidateOrders();
      toast.success("تم تعديل الطلب بنجاح");
    },
    onError: () => toast.error("فشل في تعديل الطلب"),
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => OrderService.deleteMany(ids),
    onSuccess: () => {
      invalidateOrders();
      toast.success("تم حذف الطلبات");
    },
    onError: () => toast.error("فشل في الحذف"),
  });

  const deleteOrderItemMutation = useMutation({
    mutationFn: ({ id, orderItemId }: { id: number; orderItemId: number }) =>
      OrderService.deleteOne(id, orderItemId),
    onSuccess: () => {
      invalidateOrders();
      toast.success("تم حذف بند من الطلب");
    },
    onError: () => toast.error("فشل في الحذف"),
  });

  return { editMutation, deleteMutation, deleteOrderItemMutation };
};

export const useCreatePOSOrder = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => OrderService.createPOS(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      toast.success("تم إتمام العملية بنجاح");
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "فشل في إتمام العملية";
      toast.error(message);
    },
  });
};
