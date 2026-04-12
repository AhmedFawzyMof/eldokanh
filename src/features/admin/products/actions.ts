import adminApi from "@/lib/admin/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ProductParams {
  search?: string;
  categoryId?: number | null;
  brandId?: number | null;
  page?: number;
}

const ProductService = {
  getAll: (params: ProductParams) => {
    return adminApi.get("/products", { params });
  },
  add: (data: any) => {
    return adminApi.post("/products", data);
  },
  edit: (id: number, data: any) => {
    return adminApi.put(`/products/${id}`, data);
  },
  deleteMany: (ids: number[]) => {
    return adminApi.delete("/products", {
      params: { ids },
    });
  },
  getSubcategoriesByCategory: (params: { category: number }) => {
    return adminApi.get("/subcategories", {
      params,
    });
  },
};

export const useGetProducts = (params: ProductParams) => {
  return useQuery({
    queryKey: ["admin", "products", params],
    queryFn: () => ProductService.getAll(params),
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetSubcategories = (
  params: { category: number },
  isOpen: boolean,
) => {
  return useQuery({
    queryKey: ["admin", "subcategories", params.category],
    queryFn: () => ProductService.getSubcategoriesByCategory(params),
    enabled: Boolean(params.category) && isOpen,
  });
};

export const useProductMutations = () => {
  const queryClient = useQueryClient();

  const invalidateProducts = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
  };

  const addMutation = useMutation({
    mutationFn: (data: FormData) => ProductService.add(data),
    onSuccess: () => {
      invalidateProducts();
      toast.success("تم اضافة المنتج بنجاح");
    },
    onError: () => toast.error("فشل في اضافة المنتج"),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FormData }) =>
      ProductService.edit(id, data),
    onSuccess: () => {
      invalidateProducts();
      toast.success("تم تعديل المنتج بنجاح");
    },
    onError: () => toast.error("فشل في تعديل المنتج"),
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => ProductService.deleteMany(ids),
    onSuccess: () => {
      invalidateProducts();
      toast.success("تم حذف المنتجات");
    },
    onError: () => toast.error("فشل في الحذف"),
  });

  return { addMutation, editMutation, deleteMutation };
};
