import { CustomerList } from "@/features/admin/customers/components/customer-list";
import { CustomerFilters } from "@/features/admin/customers/components/customer-filters";
import { AddCustomer } from "@/features/admin/customers/components/add-customer";
import { getCustomers } from "@/models/users";

export default async function CustomersPage(props: {
  searchParams: Promise<{ search?: string; sort?: string }>;
}) {
  const searchParams = await props.searchParams;
  const search = searchParams.search || "";
  const sort = searchParams.sort || "newest";
  const customers = await getCustomers(search, sort);

  return (
    <div className="flex flex-col min-h-screen pb-32">
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b p-4 shadow-sm space-y-4">
        <CustomerFilters />

        <div className="flex items-center justify-between">
          <h1 className="text-xl font-black text-slate-900">
            العملاء ({customers.length})
          </h1>
          <AddCustomer />
        </div>
      </div>

      <CustomerList customers={customers as any} />
    </div>
  );
}
