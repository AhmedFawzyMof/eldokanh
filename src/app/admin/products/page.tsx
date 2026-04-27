import { ProductFilters } from "@/features/admin/products/components/product-filters";
import { AddProduct } from "@/features/admin/products/components/add-products";
import { ProductListContainer } from "@/features/admin/products/components/product-list-container";
import PaginationComponent from "@/components/pagination";
import { getAllProducts } from "@/models/products";
import { getAllCategories } from "@/models/categories";
import { getAllBrands } from "@/models/brands";

export default async function ProductsPage(props: {
  searchParams: Promise<{
    search?: string;
    categoryId?: string;
    brandId?: string;
    page?: string;
  }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const categoryId = searchParams.categoryId ? Number(searchParams.categoryId) : null;
  const brandId = searchParams.brandId ? Number(searchParams.brandId) : null;
  const page = searchParams.page ? Number(searchParams.page) : 1;

  const [productsData, categories, brands] = await Promise.all([
    getAllProducts(page, search, categoryId, brandId),
    getAllCategories(null, {
      image: false,
      description: false,
      productCount: false,
    }),
    getAllBrands(null, { onlyActive: false, includeDetails: false }),
  ]);

  const products = productsData.products || [];
  const totalCount = productsData.count || 0;
  const totalPages = Math.ceil(totalCount / 20) || 1;

  return (
    <div className="flex flex-col min-h-screen pb-8">
      {/* Sticky Header with Search & Filters */}
      <div className="sticky top-16 lg:top-0 z-10 bg-white/95 backdrop-blur-md border-b p-4 shadow-sm space-y-4">
        <ProductFilters categories={categories as any} brands={brands as any} />

        <div className="flex items-center justify-between pt-1">
          <h1 className="text-xl font-black text-slate-900">
            المنتجات ({totalCount})
          </h1>
          <AddProduct categories={categories as any} brands={brands as any} />
        </div>
      </div>

      <ProductListContainer
        products={products as any}
        categories={categories as any}
        brands={brands as any}
        totalCount={totalCount}
      />

      <div className="p-4 flex justify-center">
        <PaginationComponent
          totalProducts={totalCount}
          totalPages={totalPages}
          currentPage={page}
          searchParams={searchParams}
        />
      </div>
    </div>
  );
}
