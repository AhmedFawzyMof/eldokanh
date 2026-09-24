import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="w-full mx-auto py-20 md:py-24 px-4" dir="rtl">
      <div className="container mx-auto max-w-5xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 rounded-[2.5rem] p-12 md:p-16 text-center space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            فريزرك يستاهل يتملي صح
          </h2>

          <p className="text-neutral-300 text-lg max-w-2xl mx-auto leading-relaxed">
            أحسن منتجات مجمدة ومستورد بجودة مضمونة وطعم يحكي حكاية اختار اللي
            يعجبك وسيب الباقي علينا… طلبك لحد باب البيت بسرعة وأمان.
          </p>

          <div className="flex flex-col items-center gap-6 mt-8">
            <Button
              size="lg"
              className="rounded-full px-10 py-7 text-lg bg-white text-black hover:bg-neutral-100 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 font-medium"
              asChild
            >
              <Link href="/products">يلا نملّي الفريزر </Link>
            </Button>

            <div className="flex items-center gap-4 text-sm text-neutral-500">
              <Link
                href="/privacy"
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                سياسة الخصوصية
              </Link>
              <span className="w-1 h-1 bg-neutral-700 rounded-full"></span>
              <Link
                href="/terms"
                className="hover:text-white transition-colors underline-offset-4 hover:underline"
              >
                شروط الاستخدام
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
