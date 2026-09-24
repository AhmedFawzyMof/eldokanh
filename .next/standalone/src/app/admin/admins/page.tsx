import { AdminList } from "@/features/admin/admins/components/admin-list";
import { AdminFilters } from "@/features/admin/admins/components/admin-filters";
import { AddAdmin } from "@/features/admin/admins/components/add-admin";
import { getAllAdmins } from "@/models/admins";

export default async function AdminsPage(props: {
  searchParams: Promise<{ search?: string; permissions?: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const permissions = searchParams.permissions || "all";
  const admins = await getAllAdmins(search, permissions);

  return (
    <div className="flex flex-col min-h-screen pb-8">
      <div className="sticky top-16 lg:top-0 z-10 bg-white/95 backdrop-blur-md border-b p-4 shadow-sm space-y-4">
        <AdminFilters />

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-900">
            المشرفين ({admins.length})
          </h1>
          <AddAdmin />
        </div>
      </div>

      <AdminList admins={admins as any} />
    </div>
  );
}
