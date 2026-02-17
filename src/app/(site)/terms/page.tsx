"use client";
import React, { useState } from "react";
import {
  ShieldCheck,
  Snowflake,
  Truck,
  RefreshCcw,
  AlertTriangle,
  Scale,
} from "lucide-react";

const TermsPage = () => {
  const [activeSection, setActiveSection] = useState("agreement");

  const sections = [
    { id: "agreement", title: "الاتفاقية", icon: <Scale size={18} /> },
    {
      id: "frozen",
      title: "المجمدات والمواد الغذائية",
      icon: <Snowflake size={18} />,
    },
    { id: "refunds", title: "سياسة الاسترجاع", icon: <RefreshCcw size={18} /> },
    { id: "delivery", title: "الشحن والتوصيل", icon: <Truck size={18} /> },
    {
      id: "safety",
      title: "الصحة والسلامة",
      icon: <AlertTriangle size={18} />,
    },
  ];

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      {/* Hero Header */}
      <div className="bg-primary py-16 px-6 text-center text-primary-foreground">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          شروط الاستخدام
        </h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg leading-relaxed">
          كل اللي محتاج تعرفه عن خدماتنا، معايير التوصيل، والتزامنا بسلامة
          الأكل.
        </p>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 px-6 py-12">
        {/* Sticky Sidebar Navigation */}
        <aside className="md:w-1/4">
          <nav className="sticky top-24 space-y-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => {
                  setActiveSection(section.id);
                  document
                    .getElementById(section.id)
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-right font-medium ${
                  activeSection === section.id
                    ? "bg-background text-primary shadow-md ring-1 ring-border"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                {section.icon}
                {section.title}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="md:w-3/4 bg-background rounded-2xl shadow-sm border border-border p-8 md:p-12 space-y-16">
          {/* Section: Agreement */}
          <section id="agreement">
            <div className="flex items-center gap-3 mb-4 text-primary">
              <ShieldCheck className="w-8 h-8" />
              <h2 className="text-2xl font-bold text-foreground">
                1. الموافقة على الشروط
              </h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">
              بمجرد دخولك على منصة <strong>El Dokanh</strong>، إنت بتوافق على
              اتباع إجراءات التشغيل الخاصة بنا. الشروط دي بتنطبق على كل الزوار،
              المستخدمين، وأي حد حابب يستخدم خدماتنا.
            </p>
          </section>

          {/* Section: Frozen Food */}
          <section
            id="frozen"
            className="p-8 bg-primary/5 rounded-2xl border border-primary/20"
          >
            <div className="flex items-center gap-3 mb-4 text-primary">
              <Snowflake className="w-8 h-8" />
              <h2 className="text-2xl font-bold">2. ضمان "سلسلة التبريد"</h2>
            </div>
            <p className="text-foreground/80 mb-4">
              إحنا بنستخدم تغليف عازل مخصوص عشان نحافظ على درجة حرارة الحاجة طول
              الطريق. لكن، بمجرد ما الطلب بيتم تصنيفه إنه{" "}
              <strong>"تم التوصيل"</strong>:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <li className="bg-background p-4 rounded-xl shadow-sm text-sm border border-border">
                <strong>المسؤولية:</strong> الحفاظ على درجة الحرارة بيتنقل
                لمسؤولية العميل فوراً بعد الاستلام.
              </li>
              <li className="bg-background p-4 rounded-xl shadow-sm text-sm border border-border">
                <strong>مواعيد التوصيل:</strong> لازم تكون موجود في خلال الـ
                ساعتين بتوع ميعاد التوصيل عشان الحاجة ما تفكش.
              </li>
            </ul>
          </section>

          {/* Section: Refunds */}
          <section id="refunds">
            <div className="flex items-center gap-3 mb-6 text-foreground">
              <RefreshCcw className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold">3. الاسترجاع ورقابة الجودة</h2>
            </div>
            <div className="space-y-4">
              <p className="text-muted-foreground">
                عشان بنبيع مواد غذائية سريعة التلف، للأسف مش بنقدر نقبل
                المرتجعات العادية. لو الطلب وصلك في حالة مش مرضية:
              </p>
              <div className="border-r-4 border-primary pr-6 py-2 italic text-foreground bg-muted/30">
                "أي مشكلة لازم تبلغنا بها في خلال <strong>120 دقيقة</strong>{" "}
                (ساعتين) من وقت الاستلام، مع تقديم صور واضحة للمنتج وحالته."
              </div>
            </div>
          </section>

          {/* Section: Safety */}
          <section id="safety" className="border-t pt-12">
            <div className="flex items-center gap-3 mb-4 text-destructive">
              <AlertTriangle className="w-8 h-8" />
              <h2 className="text-2xl font-bold text-foreground">
                4. الصحة والسلامة والحساسية
              </h2>
            </div>
            <p className="text-muted-foreground">
              منتجاتنا بتتصنع في منشآت ممكن تتعامل مع مكسرات، ألبان، وجلوتين.
              رغم إننا بنكتب المكونات، بننصح العملاء اللي عندهم حساسية شديدة
              يتواصلوا مع المصنع مباشرة للتأكد من أدق التفاصيل.
            </p>
          </section>

          <footer className="text-sm text-muted-foreground pt-8 border-t text-center">
            &copy; 2026 جميع الحقوق محفوظة لشركة El Dokanh.
            <br />
            عندك استفسار؟
            <a
              href="mailto:support@frozen.com"
              className="text-primary underline underline-offset-4"
            >
              support@frozen.com
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default TermsPage;
