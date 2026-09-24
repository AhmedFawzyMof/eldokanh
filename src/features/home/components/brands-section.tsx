"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { Brand } from "@/db/schema.types";

type BrandSectionType = Brand & {
  productCount: number;
};

export function BrandsSection(brands: { brands: Partial<BrandSectionType>[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

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

  const doubledBrands = [...brands.brands, ...brands.brands];

  return (
    <section dir="rtl" className="pt-2 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-foreground">
            الشركات
          </h2>
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
          className="flex gap-5 overflow-x-auto scrollbar-hide py-4 -mx-1 px-1 cursor-grab active:cursor-grabbing select-none"
          style={{ scrollbarWidth: "none" }}
        >
          {doubledBrands.map((brand, i: number) => (
            <Link
              key={`${brand.nameAr}-${i}`}
              href={`/brand/${brand.id}`}
              className="group cursor-pointer shrink-0 flex flex-col items-center gap-2"
            >
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted ring-1 ring-border/60 transition-all duration-300 group-hover:ring-primary/40 group-hover:scale-105">
                <Image
                  src={brand.image!}
                  alt={brand.nameAr ?? ""}
                  fill
                  sizes="80px"
                  className="object-cover"
                  loading="lazy"
                  draggable={false}
                />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-body text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                  {brand.nameAr}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
