import { CategorySearch } from "@/features/admin/categories/components/category-search";
import { AddCategory } from "@/features/admin/categories/components/add-category";
import { CategoryListContainer } from "@/features/admin/categories/components/category-list-container";
import { getAllCategories } from "@/models/categories";

export default async function CategoriesPage(props: {
  searchParams: Promise<{ search?: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";

  const categories = await getAllCategories(search, {
    image: true,
    productCount: true,
  });

  return (
    <div className="flex flex-col min-h-screen pb-8">
      <div className="sticky top-16 lg:top-0 z-10 bg-white/95 backdrop-blur-md border-b p-4 shadow-sm space-y-4">
        <CategorySearch />

        <div className="flex items-center justify-between pt-1">
          <h1 className="text-xl font-black text-slate-900">
            إدارة الأقسام ({categories.length})
          </h1>
          <AddCategory />
        </div>
      </div>

      <CategoryListContainer initialCategories={categories as any} />
    </div>
  );
}
