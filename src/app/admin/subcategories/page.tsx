import { SubCategorySearch } from "@/features/admin/subcategories/components/subcategory-search";
import { AddSubCategory } from "@/features/admin/subcategories/components/add-subcategory";
import { SubCategoryListContainer } from "@/features/admin/subcategories/components/subcategory-list-container";
import { getAllSubCategories } from "@/models/subcategories";
import { getAllCategories } from "@/models/categories";
import PaginationComponent from "@/components/pagination";

export default async function SubCategoriesPage(props: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const page = Number(searchParams.page) || 1;

  const [data, categories] = await Promise.all([
    getAllSubCategories(page, search, {
      description: true,
      productCount: true,
    }),
    getAllCategories(null, {
      image: false,
      description: false,
      productCount: false,
    }),
  ]);

  const subcategories = data.subcategories || [];
  const totalCount = data.count || 0;
  const totalPages = Math.ceil(data.count / 20);

  return (
    <div className="flex flex-col min-h-screen pb-32">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b p-4 shadow-sm space-y-4">
        <SubCategorySearch />

        <div className="flex items-center justify-between pt-1">
          <h1 className="text-xl font-black text-slate-900">
            إدارة الأقسام الفرعية ({totalCount})
          </h1>
          <AddSubCategory categories={categories as any} />
        </div>
      </div>

      <SubCategoryListContainer initialSubCategories={subcategories as any} />

      <div className="p-4 flex justify-center">
        <PaginationComponent
          totalProducts={totalCount}
          totalPages={totalPages}
          currentPage={page}
          searchParams={{ search }}
        />
      </div>
    </div>
  );
}
