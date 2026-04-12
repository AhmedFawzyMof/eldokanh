import adminApi from "@/lib/admin/api";
import type { SubCategory } from "@/types/admin/subcategories";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface SubCategoryParams {
  search?: string;
  page?: number;
}

const SubCategoryService = {
  getAll: (params: SubCategoryParams) => {
    return adminApi.get("/subcategories", { params });
  },
  add: (data: Partial<SubCategory>) => {
    return adminApi.post("/subcategories", data);
  },
  edit: (id: number, data: Partial<SubCategory>) => {
    return adminApi.put(`/subcategories/${id}`, data);
  },
  deleteMany: (ids: number[]) => {
    return adminApi.delete("/subcategories", {
      params: { ids },
    });
  },
};

export const useGetSubCategories = (params: SubCategoryParams) => {
  return useQuery({
    queryKey: ["admin", "subcategories", params],
    queryFn: () => SubCategoryService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useSubCategoryMutations = () => {
  const queryClient = useQueryClient();

  const invalidateSubCategories = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "subcategories"] });
  };

  const addMutation = useMutation({
    mutationFn: (data: Partial<SubCategory>) => SubCategoryService.add(data),
    onSuccess: () => {
      invalidateSubCategories();
      toast.success("تم اضافة القسم بنجاح");
    },
    onError: () => toast.error("فشل في اضافة القسم"),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<SubCategory> }) =>
      SubCategoryService.edit(id, data),
    onSuccess: () => {
      invalidateSubCategories();
      toast.success("تم تعديل القسم بنجاح");
    },
    onError: () => toast.error("فشل في تعديل القسم"),
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => SubCategoryService.deleteMany(ids),
    onSuccess: () => {
      invalidateSubCategories();
      toast.success("تم حذف القسم");
    },
    onError: () => toast.error("فشل في الحذف"),
  });

  return { addMutation, editMutation, deleteMutation };
};
