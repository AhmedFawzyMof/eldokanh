"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 22,
      mass: 0.8,
    },
  },
};

const hoverSpring = { type: "spring", stiffness: 400, damping: 20 } as const;

export function SubCategoriesSection(categories: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeSub = searchParams.get("subcategory");

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -240 : 240,
      behavior: "smooth",
    });
  };

  const handleClick = (subcategoryId: number) => {
    const params = new URLSearchParams(searchParams.toString());

    params.set("subcategory", subcategoryId.toString());
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  const handleRemove = () => {
    const params = new URLSearchParams(searchParams.toString());

    params.delete("subcategory");
    params.set("page", "1");

    router.push(`?${params.toString()}`);
  };

  return (
    <section dir="rtl" className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-foreground">
            الفئات الفرعية
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("right")}
              className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-foreground" />
            </button>
            <button
              onClick={() => scroll("left")}
              className="p-2 rounded-full border border-border hover:bg-muted transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-foreground" />
            </button>
          </div>
        </div>

        {activeSub && (
          <div className="mb-6 flex justify-start">
            <div className="flex items-center gap-2 bg-primary text-white px-3 py-1 rounded-full text-sm">
              <span>تم اختيار فئة فرعية</span>
              <button
                onClick={handleRemove}
                className="hover:opacity-80 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <motion.div
          ref={scrollRef}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1"
          style={{ scrollbarWidth: "none" }}
        >
          {categories.categories.map((cat: any, i: number) => {
            const isActive = activeSub === cat.id.toString();
            return (
              <motion.div
                key={`${cat.nameAr}-${i}`}
                variants={itemVariants as any}
                whileHover={{
                  y: -4,
                  boxShadow: "0 10px 28px rgba(0,0,0,0.13)",
                  transition: hoverSpring,
                }}
                whileTap={{ scale: 0.95, transition: hoverSpring }}
                onClick={() => handleClick(cat.id)}
                className={`group cursor-pointer shrink-0 flex flex-col items-center gap-1.5 px-5 py-3.5 rounded-2xl border transition-colors duration-300 select-none ${
                  isActive
                    ? "bg-primary border-primary text-primary-foreground shadow-md"
                    : "bg-card border-border text-foreground hover:border-primary/40 hover:bg-accent/60"
                }`}
              >
                <span
                  className={`font-medium text-sm leading-tight text-center whitespace-nowrap ${isActive ? "text-primary-foreground" : "text-foreground"}`}
                >
                  {cat.nameAr}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium tabular-nums transition-colors duration-300 ${
                    isActive
                      ? "bg-white/20 text-primary-foreground"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  }`}
                >
                  {cat.productCount} منتج
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
