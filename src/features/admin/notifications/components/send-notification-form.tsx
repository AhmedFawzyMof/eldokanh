"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import adminApi from "@/lib/admin/api";

export function SendNotification({
  configError = false,
}: {
  configError?: boolean;
}) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [link, setLink] = useState("");
  const [audience, setAudience] = useState<"visitors" | "admins">("visitors");
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;

    setIsSending(true);
    try {
      const res = await adminApi.post("/notifications", {
        title: title.trim(),
        body: body.trim(),
        link: link.trim() || undefined,
        audience,
      });

      if (res.data.success) {
        toast.success(
          audience === "visitors"
            ? "تم إرسال الإشعار لجميع زوار الموقع بنجاح"
            : `تم إرسال الإشعار لـ ${res.data.sentCount || 0} مشرف بنجاح`,
        );
        setTitle("");
        setBody("");
        setLink("");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "فشل إرسال الإشعار");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="max-w-2xl border-none shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>إرسال إشعار جديد</CardTitle>
            <CardDescription>
              اختر الجمهور المناسب — إشعارات الطلبات تصل للمشرفين فقط ولا تصل
              للزوار أبداً.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5" dir="rtl">
          <div className="space-y-2 text-right">
            <Label className="font-bold">إرسال إلى</Label>
            <Select value={audience} onValueChange={(v) => setAudience(v as any)}>
              <SelectTrigger dir="rtl" className="h-11 rounded-xl shadow-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="visitors">زوار الموقع (الأدمن والعملاء)</SelectItem>
                <SelectItem value="admins">المشرفين فقط</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 text-right">
            <Label className="font-bold">عنوان الإشعار</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: عروض نهاية الأسبوع"
              className="rounded-xl h-11 border-slate-200 shadow-sm"
              required
            />
          </div>

          <div className="space-y-2 text-right">
            <Label className="font-bold">نص الإشعار</Label>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="اكتب الرسالة التي ستظهر للزوار..."
              className="rounded-xl border-slate-200 shadow-sm min-h-28"
              required
            />
          </div>

          <div className="space-y-2 text-right">
            <Label className="font-bold">الرابط عند الضغط (اختياري)</Label>
            <Input
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://eldokanh.firebaseapp.com/products"
              dir="ltr"
              className="rounded-xl h-11 border-slate-200 shadow-sm"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg font-black rounded-xl shadow-lg shadow-primary/20 mt-4"
            disabled={isSending || configError}
          >
            {isSending ? (
              <>
                <Loader2 className="ml-3 h-5 w-5 animate-spin" />
                جاري الإرسال...
              </>
            ) : (
              <>
                <Send className="ml-3 h-5 w-5" />
                إرسال الإشعار
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}