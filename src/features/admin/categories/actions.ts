import adminApi from "@/lib/admin/api";
import type { Category } from "@/types/admin/categories";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CategoryParams {
  search?: string;
}

const CategoryService = {
  getAll: (params: CategoryParams) => {
    return adminApi.get("/categories", { params });
  },
  add: (data: any) => {
    return adminApi.post("/categories", data);
  },
  edit: (id: number, data: any) => {
    return adminApi.put(`/categories/${id}`, data);
  },
  deleteMany: (ids: number[]) => {
    return adminApi.delete("/categories", {
      params: { ids },
    });
  },
};

export const useGetCategories = (params: CategoryParams) => {
  return useQuery({
    queryKey: ["admin", "categories", params],
    queryFn: () => CategoryService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useCategoryMutations = () => {
  const queryClient = useQueryClient();

  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
  };

  const addMutation = useMutation({
    mutationFn: (data: FormData) => CategoryService.add(data),
    onSuccess: () => {
      invalidateCategories();
      toast.success("تم اضافة القسم بنجاح");
    },
    onError: () => toast.error("فشل في اضافة القسم"),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      CategoryService.edit(id, data),
    onSuccess: () => {
      invalidateCategories();
      toast.success("تم تعديل القسم بنجاح");
    },
    onError: () => toast.error("فشل في تعديل القسم"),
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => CategoryService.deleteMany(ids),
    onSuccess: () => {
      invalidateCategories();
      toast.success("تم حذف الاقسام");
    },
    onError: () => toast.error("فشل في الحذف"),
  });

  return { addMutation, editMutation, deleteMutation };
};
