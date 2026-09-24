"use client";

import { User, Mail, Calendar, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditCustomer } from "./edit-customer";
import { useCustomerMutations } from "../actions";

interface Customer {
  id: number;
  name: string;
  email: string;
  createdAt: string | null;
}

interface CustomerListProps {
  customers: Customer[];
}

export function CustomerList({ customers }: CustomerListProps) {
  const { deleteMutation } = useCustomerMutations();

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      {customers.length > 0 ? (
        customers.map((customer) => (
          <Card key={customer.id} className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="bg-blue-50 p-3 rounded-full">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 truncate">{customer.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{customer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-2">
                      <Calendar className="h-3 w-3" />
                      <span>منذ: {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('ar-EG') : 'غير معروف'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <EditCustomer customer={customer} />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-slate-400 hover:text-red-500"
                    onClick={() => {
                      if (confirm("هل أنت متأكد من حذف هذا العميل؟")) {
                        deleteMutation.mutate(customer.id);
                      }
                    }}
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
          <User className="h-16 w-16 stroke-1 px-4" />
          <p className="text-lg">لا يوجد عملاء حالياً</p>
        </div>
      )}
    </div>
  );
}
