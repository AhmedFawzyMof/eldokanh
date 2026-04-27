"use client";

import { Users, Shield, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EditAdmin } from "./edit-admin";
import { useAdminMutations } from "../actions";
import { ADMIN_PERMISSIONS, PERMISSION_LABELS, AdminPermission } from "@/types/permissions";

interface Admin {
  id: number;
  userId: number;
  name: string;
  email: string;
  permissions: string;
}

interface AdminListProps {
  admins: Admin[];
}

export function AdminList({ admins }: AdminListProps) {
  const { deleteMutation } = useAdminMutations();

  return (
    <div className="p-4 space-y-4">
      {admins.length > 0 ? (
        admins.map((admin) => (
          <Card key={admin.id} className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-slate-100 p-3 rounded-full">
                  <Shield className="h-6 w-6 text-slate-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{admin.name}</h3>
                  <p className="text-sm text-slate-500">{admin.email}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {admin.permissions === "full" ? (
                      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-none">
                        صلاحية كاملة
                      </Badge>
                    ) : (
                      admin.permissions.split(",").filter(Boolean).map((p) => (
                        <Badge key={p} variant="secondary" className="text-[10px] py-0 h-5">
                          {PERMISSION_LABELS[p as AdminPermission] || p}
                        </Badge>
                      ))
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <EditAdmin admin={admin} />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-slate-400 hover:text-red-500"
                  onClick={() => {
                    if (confirm("هل أنت متأكد من حذف هذا المشرف؟")) {
                      deleteMutation.mutate(admin.id);
                    }
                  }}
                  disabled={deleteMutation.isPending}
                >
                  {deleteMutation.isPending ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Trash2 className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
          <Users className="h-16 w-16 stroke-1 px-4" />
          <p className="text-lg">لا يوجد مشرفين حالياً</p>
        </div>
      )}
    </div>
  );
}
