import adminApi from "@/lib/admin/api";
import type { Brand } from "@/types/admin/brands";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface BrandsParams {
  search?: string;
}

const BrandService = {
  getAll: (params: BrandsParams) => {
    return adminApi.get("/brands", { params });
  },
  add: (data: any) => {
    return adminApi.post("/brands", data);
  },
  edit: (id: number, data: any) => {
    return adminApi.put(`/brands/${id}`, data);
  },
  deleteMany: (ids: number[]) => {
    return adminApi.delete("/brands", {
      params: { ids },
    });
  },
};

export const useGetBrands = (params: BrandsParams) => {
  return useQuery({
    queryKey: ["admin", "brands", params],
    queryFn: () => BrandService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useBrandMutations = () => {
  const queryClient = useQueryClient();

  const invalidateBrands = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "brands"] });
  };

  const addMutation = useMutation({
    mutationFn: (data: FormData) => BrandService.add(data),
    onSuccess: () => {
      invalidateBrands();
      toast.success("تم اضافة الشركة بنجاح");
    },
    onError: () => toast.error("فشل في اضافة الشركة"),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      BrandService.edit(id, data),
    onSuccess: () => {
      invalidateBrands();
      toast.success("تم تعديل الشركة بنجاح");
    },
    onError: () => toast.error("فشل في تعديل الشركة"),
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => BrandService.deleteMany(ids),
    onSuccess: () => {
      invalidateBrands();
      toast.success("تم حذف الشركات");
    },
    onError: () => toast.error("فشل في الحذف"),
  });

  return { addMutation, editMutation, deleteMutation };
};
