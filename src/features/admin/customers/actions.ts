import adminApi from "@/lib/admin/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CustomersParams {
  search?: string;
  sort?: string;
}

const CustomerService = {
  getAll: (params: CustomersParams) => {
    return adminApi.get("/customers", { params });
  },
  add: (data: any) => {
    return adminApi.post("/customers", data);
  },
  edit: (id: number, data: any) => {
    return adminApi.put(`/customers/${id}`, data);
  },
  delete: (id: number) => {
    return adminApi.delete("/customers", {
      params: { id },
    });
  },
};

export const useGetCustomers = (params: CustomersParams) => {
  return useQuery({
    queryKey: ["admin", "customers", params],
    queryFn: () => CustomerService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCustomerMutations = () => {
  const queryClient = useQueryClient();

  const invalidateCustomers = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
  };

  const addMutation = useMutation({
    mutationFn: (data: any) => CustomerService.add(data),
    onSuccess: () => {
      invalidateCustomers();
      toast.success("تم إضافة العميل بنجاح");
    },
    onError: () => toast.error("فشل في إضافة العميل"),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      CustomerService.edit(id, data),
    onSuccess: () => {
      invalidateCustomers();
      toast.success("تم تعديل العميل بنجاح");
    },
    onError: () => toast.error("فشل في تعديل العميل"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => CustomerService.delete(id),
    onSuccess: () => {
      invalidateCustomers();
      toast.success("تم حذف العميل");
    },
    onError: () => toast.error("فشل في الحذف"),
  });

  return { addMutation, editMutation, deleteMutation };
};
