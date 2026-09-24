"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Plus } from "lucide-react";
import { useAdminMutations } from "../actions";
import {
  ADMIN_PERMISSIONS,
  PERMISSION_LABELS,
  AdminPermission,
} from "@/types/permissions";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "next-auth/react";

export function AddAdmin() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.permissions === "full";
  const [isOpen, setIsOpen] = useState(false);
  const { addMutation } = useAdminMutations();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    permissions: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(formData, {
      onSuccess: () => {
        setIsOpen(false);
        setFormData({ name: "", email: "", password: "", permissions: "" });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold rounded-xl h-11 px-6 shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          إضافة مشرف جديد
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-xl font-bold">
            إضافة مشرف جديد
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2 text-right">
            <Label className="font-bold">الاسم</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="اسم المشرف"
              className="rounded-xl h-11 border-slate-200"
              required
            />
          </div>
          <div className="space-y-2 text-right">
            <Label className="font-bold">البريد الإلكتروني</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="admin@example.com"
              className="rounded-xl h-11 border-slate-200"
              required
            />
          </div>
          <div className="space-y-2 text-right">
            <Label className="font-bold">كلمة المرور</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder="********"
              className="rounded-xl h-11 border-slate-200"
              required
            />
          </div>
          <div className="space-y-3 text-right">
            <Label className="font-bold">الصلاحيات</Label>
            {isSuperAdmin && (
              <div className="flex items-center gap-2 mb-2">
                <Checkbox
                  id="add-full-access"
                  checked={formData.permissions === "full"}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleChange("permissions", "full");
                    } else {
                      handleChange("permissions", "");
                    }
                  }}
                />
                <Label
                  htmlFor="add-full-access"
                  className="cursor-pointer font-bold"
                >
                  صلاحية كاملة (جميع المهام)
                </Label>
              </div>
            )}

            {formData.permissions !== "full" && (
              <div className="grid grid-cols-2 gap-3 p-3 border rounded-xl bg-slate-50">
                {Object.entries(ADMIN_PERMISSIONS).map(([key, value]) => {
                  const permissionsList = formData.permissions
                    .split(",")
                    .filter(Boolean);
                  const isChecked = permissionsList.includes(value);

                  return (
                    <div key={key} className="flex items-center gap-2">
                      <Checkbox
                        id={`add-perm-${value}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          let newList;
                          if (checked) {
                            newList = [...permissionsList, value];
                          } else {
                            newList = permissionsList.filter(
                              (p) => p !== value,
                            );
                          }
                          handleChange("permissions", newList.join(","));
                        }}
                      />
                      <Label
                        htmlFor={`add-perm-${value}`}
                        className="text-sm cursor-pointer whitespace-nowrap"
                      >
                        {PERMISSION_LABELS[value as AdminPermission]}
                      </Label>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg font-black rounded-xl mt-4"
            disabled={addMutation.isPending}
          >
            {addMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "إضافة المشرف"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
