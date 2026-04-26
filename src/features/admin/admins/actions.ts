import adminApi from "@/lib/admin/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface AdminsParams {
  search?: string;
  permissions?: string;
}

const AdminService = {
  getAll: (params: AdminsParams) => {
    return adminApi.get("/admins", { params });
  },
  add: (data: any) => {
    return adminApi.post("/admins", data);
  },
  edit: (id: number, data: any) => {
    return adminApi.put(`/admins/${id}`, data);
  },
  delete: (id: number) => {
    return adminApi.delete("/admins", {
      params: { id },
    });
  },
};

export const useGetAdmins = (params: AdminsParams) => {
  return useQuery({
    queryKey: ["admin", "admins", params],
    queryFn: () => AdminService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useAdminMutations = () => {
  const queryClient = useQueryClient();

  const invalidateAdmins = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "admins"] });
  };

  const addMutation = useMutation({
    mutationFn: (data: any) => AdminService.add(data),
    onSuccess: () => {
      invalidateAdmins();
      toast.success("تم إضافة المشرف بنجاح");
    },
    onError: () => toast.error("فشل في إضافة المشرف"),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) =>
      AdminService.edit(id, data),
    onSuccess: () => {
      invalidateAdmins();
      toast.success("تم تعديل المشرف بنجاح");
    },
    onError: () => toast.error("فشل في تعديل المشرف"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => AdminService.delete(id),
    onSuccess: () => {
      invalidateAdmins();
      toast.success("تم حذف المشرف");
    },
    onError: () => toast.error("فشل في الحذف"),
  });

  return { addMutation, editMutation, deleteMutation };
};
