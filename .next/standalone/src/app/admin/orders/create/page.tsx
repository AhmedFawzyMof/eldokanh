import { POSClient } from "@/features/admin/pos/components/pos-client";
import { getAllProducts } from "@/models/products";
import { getAllCategories } from "@/models/categories";
import { getAllBrands } from "@/models/brands";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    page?: string;
    categoryId?: string;
    brandId?: string;
  }>;
}

export default async function POSPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const page = Number(params.page) || 1;
  const categoryId = params.categoryId ? Number(params.categoryId) : null;
  const brandId = params.brandId ? Number(params.brandId) : null;

  const [productsData, categories, brands] = await Promise.all([
    getAllProducts(page, search, categoryId, brandId),
    getAllCategories(null, {
      image: false,
      description: false,
      productCount: false,
    }),
    getAllBrands(null, { onlyActive: false, includeDetails: false }),
  ]);

  return (
    <POSClient
      initialProducts={productsData.products as any}
      initialTotalCount={productsData.count || 0}
      categories={categories as any}
      brands={brands as any}
      initialSearch={search}
      initialCategoryId={categoryId}
      initialBrandId={brandId}
      initialPage={page}
    />
  );
}
