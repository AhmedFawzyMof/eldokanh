"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

type ProductFilterProps = {
  categories: any[];
  brands: any[];
  searchParams: any;
  categoryId?: number;
  brandId?: number;
  search?: string;
};

export default function ProductsFilter({
  categories,
  brands,
  searchParams,
  categoryId,
  brandId,
  search,
}: ProductFilterProps) {
  const router = useRouter();
  const [searchParam, setSearchParam] = useState(search || "");
  const updateParams = (key: string, value?: string) => {
    const newSearchParams = new URLSearchParams(Object.entries(searchParams));
    if (value && value !== "all") newSearchParams.set(key, value);
    else newSearchParams.delete(key);
    newSearchParams.set("page", "1");
    router.replace(`?${newSearchParams.toString()}`);
  };

  const handleSearch = () => {
    updateParams("search", searchParam);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 mb-8" dir="rtl">
      {/* القسم / التصنيف */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="category">القسم</Label>
        <Select
          onValueChange={(value) => updateParams("categoryId", value)}
          value={categoryId?.toString() || "all"}
        >
          <SelectTrigger id="category" className="border-primary/50 border">
            <SelectValue placeholder="اختار القسم" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الأقسام</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id.toString()}>
                {cat.nameAr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* الشركات / البراندات */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="companies">الشركة</Label>
        <Select
          onValueChange={(value) => updateParams("brandId", value)}
          value={brandId?.toString() || "all"}
        >
          <SelectTrigger id="companies" className="border-primary/50 border">
            <SelectValue placeholder="اختار الشركة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">كل الشركات</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand.id} value={brand.id.toString()}>
                {brand.nameAr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* البحث */}
      <div className="flex flex-col gap-2 w-full">
        <Label htmlFor="search">دور هنا</Label>
        <div className="w-full flex items-center gap-2">
          <Input
            id="search"
            className="border-primary/50 text-right"
            placeholder="اسم المنتج أو السعر..."
            onChange={(event) => setSearchParam(event.target.value)}
            value={searchParam}
          />
          <Button onClick={handleSearch} className="px-4">
            <Search className="ml-2 h-4 w-4" />
            بحث
          </Button>
        </div>
      </div>
    </div>
  );
}
