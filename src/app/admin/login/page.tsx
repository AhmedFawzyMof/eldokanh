"use client";

import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Lock, Mail, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/admin/dashboard");
      router.refresh();
    }
  }, [session, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("خطأ في تسجيل الدخول. يرجى التأكد من البيانات.");
      } else {
        toast.success("تم تسجيل الدخول بنجاح");
        router.push("/admin/dashboard");
        router.refresh();
      }
    } catch (error) {
      toast.error("حدث خطأ ما. يرجى المحاولة لاحقاً.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background p-4">
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[center_top_-1px] [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <Card
        dir="rtl"
        className="relative w-full max-w-md shadow-2xl rounded-3xl border-muted/40 bg-background/80 backdrop-blur-sm"
      >
        <CardHeader className="text-center pt-8 pb-4 space-y-3">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-2">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <CardTitle className="text-3xl font-extrabold tracking-tight">
            بوابة المسؤول
          </CardTitle>
          <p className="text-muted-foreground font-medium">
            أهلاً بك مجدداً في الدكان ماركت
          </p>
        </CardHeader>

        <form onSubmit={handleLogin}>
          <CardContent className="space-y-5 px-8">
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-bold px-1 text-foreground/80"
              >
                البريد الإلكتروني
              </Label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@eldokanh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-2xl pr-10 border-muted-foreground/20 focus-visible:ring-primary h-11 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-bold px-1 text-foreground/80"
              >
                كلمة المرور
              </Label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-2xl pr-10 border-muted-foreground/20 focus-visible:ring-primary h-11 transition-all"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="pb-10 pt-4 px-8">
            <Button
              type="submit"
              size="lg"
              className="w-full rounded-2xl h-12 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98] transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>جاري التحقق...</span>
                </div>
              ) : (
                "دخول للمنصة"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
