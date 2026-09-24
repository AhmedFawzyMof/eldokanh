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
import { Loader2, Edit2 } from "lucide-react";
import { useCustomerMutations } from "../actions";

interface EditCustomerProps {
  customer: {
    id: number;
    name: string;
    email: string;
  };
}

export function EditCustomer({ customer }: EditCustomerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { editMutation } = useCustomerMutations();

  const [formData, setFormData] = useState({
    name: customer.name,
    email: customer.email,
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    editMutation.mutate(
      { id: customer.id, data: formData },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-blue-500">
          <Edit2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md rounded-2xl" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right text-xl font-bold">
            تعديل بيانات العميل
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

          <Button
            type="submit"
            className="w-full h-12 text-lg font-black rounded-xl mt-4"
            disabled={editMutation.isPending}
          >
            {editMutation.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "حفظ التعديلات"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
