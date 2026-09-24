"use client";

import { Category } from "@/db/schema.types";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";

type CategorySectionType = Category & { productCount: number };

export function CategoriesSection(categories: {
  categories: Partial<CategorySectionType>[];
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  const updateCanScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScroll(el.scrollWidth > el.clientWidth + 2);
  };

  useEffect(() => {
    updateCanScroll();
  }, []);

  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const isPaused = useRef(false);

  const startDrag = (pageX: number) => {
    if (!scrollRef.current) return;
    isDown.current = true;
    startX.current = pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const moveDrag = (pageX: number) => {
    if (!isDown.current || !scrollRef.current) return;
    const x = pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDrag = () => {
    isDown.current = false;
  };

  const doubledCategories = [
    ...categories.categories,
    ...categories.categories,
  ];

  return (
    <section dir="rtl" className="py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-foreground">
            الأقسام
          </h2>
          <button
            onClick={() => {
              const el = scrollRef.current;
              if (!el) return;
              const step = el.clientWidth * 0.6;
              el.scrollBy({ left: -step, behavior: "smooth" });
            }}
            aria-label="تصفح الأقسام"
            disabled={!canScroll}
            className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full border border-border/60 bg-background text-foreground cursor-pointer transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:border-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-background disabled:hover:text-foreground disabled:hover:border-border/60"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        </div>

        <div
          ref={scrollRef}
          onMouseDown={(e) => startDrag(e.pageX)}
          onMouseMove={(e) => moveDrag(e.pageX)}
          onMouseUp={stopDrag}
          onMouseLeave={() => {
            isPaused.current = false;
            stopDrag();
          }}
          onTouchStart={(e) => startDrag(e.touches[0].pageX)}
          onTouchMove={(e) => moveDrag(e.touches[0].pageX)}
          onTouchEnd={stopDrag}
          onMouseEnter={() => (isPaused.current = true)}
          onScroll={updateCanScroll}
          className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 -mx-1 px-1 cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: "none" }}
        >
          {doubledCategories.map((cat, i: number) => (
            <Link
              key={`${cat.nameAr}-${i}`}
              href={`/category/${cat.id}`}
              className="group cursor-pointer flex-shrink-0 px-4 py-2 bg-background border border-border/50 rounded-full transition-all duration-300 hover:shadow-md hover:border-primary/20 select-none"
            >
              <span className="font-body text-sm font-semibold text-foreground group-hover:text-primary transition-colors whitespace-nowrap">
                {cat.nameAr}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
