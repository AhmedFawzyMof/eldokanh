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
import { useCustomerMutations } from "../actions";

export function AddCustomer() {
  const [isOpen, setIsOpen] = useState(false);
  const { addMutation } = useCustomerMutations();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addMutation.mutate(formData, {
      onSuccess: () => {
        setIsOpen(false);
        setFormData({ name: "", email: "", password: "" });
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="font-bold rounded-xl h-11 px-6 shadow-lg shadow-primary/20 flex items-center gap-2">
          <Plus className="h-5 w-5" />
          إضافة عميل جديد
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-xl font-bold">
            إضافة عميل جديد
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2 text-right">
            <Label className="font-bold">الاسم</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="اسم العميل"
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
              placeholder="customer@example.com"
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

          <Button
            type="submit"
            className="w-full h-12 text-lg font-black rounded-xl mt-4"
            disabled={addMutation.isPending}
          >
            {addMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "إضافة العميل"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
