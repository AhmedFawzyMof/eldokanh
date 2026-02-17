"use client";
import React, { useState } from "react";
import { ShieldCheck, Eye, Share2, MapPin, Mail, Lock } from "lucide-react";

const PrivacyPage = () => {
  const [activeSection, setActiveSection] = useState("collection");

  const sections = [
    { id: "collection", title: "بيانات بنجمعها", icon: <Eye size={18} /> },
    {
      id: "usage",
      title: "بنستخدمها في إيه؟",
      icon: <ShieldCheck size={18} />,
    },
    { id: "contact", title: "كلمنا", icon: <Mail size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-muted/30" dir="rtl">
      {/* Hero Header */}
      <div className="bg-primary py-16 px-6 text-center text-primary-foreground">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          سياسة الخصوصية
        </h1>
        <p className="text-primary-foreground/80 max-w-2xl mx-auto text-lg leading-relaxed">
          خصوصيتك تهمنا زي بالظبط جودة المنتجات اللي بنوصلها لك. هنا بنشرح لك
          إزاي بنهتم ببياناتك.
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
          {/* Section: Collection */}
          <section id="collection">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                1. البيانات اللي بنجمعها
              </h2>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              عشان نوصلك طلباتك طازة ومجمدة لحد باب البيت، بنحتاج نجمع شوية
              معلومات:
            </p>
            <div className="grid grid-cols-1 gap-4">
              {[
                {
                  title: "بيانات شخصية",
                  desc: "الاسم، عنوان التوصيل، الإيميل، ورقم الموبايل.",
                },
                {
                  title: "بيانات الدفع",
                  desc: "بتتم بأمان عن طريق (منصات بوابات الدفع). إحنا مش بنسجل أرقام كروتك عندنا.",
                },
                {
                  title: "تفضيلاتك",
                  desc: "الأصناف اللي بتحبها عشان نحسن لك تجربة التسوق.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 border border-border rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                  <div>
                    <h4 className="font-bold text-foreground">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Usage */}
          <section id="usage">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent rounded-lg text-accent-foreground">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                2. بنستخدم بياناتك في إيه؟
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 border rounded-2xl bg-muted/20 border-border">
                <h3 className="font-bold mb-2 text-primary">عمليات التوصيل</h3>
                <p className="text-sm text-muted-foreground">
                  بنشير عنوانك ورقمك مع الطيارين عشان نضمن الحاجة توصلك قبل ما
                  تفك.
                </p>
              </div>
              <div className="p-5 border rounded-2xl bg-muted/20 border-border">
                <h3 className="font-bold mb-2 text-primary">التنبيهات</h3>
                <p className="text-sm text-muted-foreground">
                  بنبعت لك رسايل بحالة الطلب
                </p>
              </div>
            </div>
          </section>

          {/* Section: Contact */}
          <section id="contact" className="border-t pt-12">
            <div className="bg-muted rounded-2xl p-8 flex flex-col items-center text-center">
              <Mail className="w-10 h-10 text-primary mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-foreground">
                عندك سؤال؟
              </h2>
              <p className="text-muted-foreground mb-4">
                مسؤول حماية البيانات عندنا جاهز يرد عليك في أي وقت.
              </p>
              <a
                href="mailto:privacy@yourfrozenapp.com"
                className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-bold hover:opacity-90 transition-all shadow-md"
              >
                راسل فريق الخصوصية
              </a>
            </div>
          </section>

          <footer className="text-sm text-muted-foreground pt-8 border-t text-center">
            آخر تحديث: 24 أكتوبر 2023 | &copy; 2026 El Dokanh
          </footer>
        </main>
      </div>
    </div>
  );
};

export default PrivacyPage;
