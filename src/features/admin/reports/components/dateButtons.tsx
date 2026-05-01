"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useState, useTransition, useEffect } from "react";

export function DateButtons() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState(searchParams.get("date") || "");
  const [from, setFrom] = useState(
    searchParams.get("form") || new Date().toISOString().split("T")[0],
  );
  const [to, setTo] = useState(
    searchParams.get("to") || new Date().toISOString().split("T")[0],
  );

  useEffect(() => {
    setDate(searchParams.get("date") || "");
    setFrom(searchParams.get("from") || new Date().toISOString().split("T")[0]);
    setTo(searchParams.get("to") || new Date().toISOString().split("T")[0]);
  }, [searchParams]);

  const handleDate = (date: string) => {
    setDate(date);
    const params = new URLSearchParams(searchParams);
    if (date) {
      params.set("date", date);
    } else {
      params.delete("date");
    }

    params.delete("from");
    params.delete("to");

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  const handleChange = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (name === "from") {
      params.set("from", value);
    }

    if (name === "to") {
      params.set("to", value);
    }

    params.delete("date");

    if (!value) {
      params.delete("from");
      params.delete("to");
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`);
    });
  };
  const isCurrentDate = (selectedDate: string) => {
    if (date === "" && selectedDate === "week") {
      return "default";
    }

    if (date === selectedDate) {
      return "default";
    }

    return "outline";
  };
  return (
    <div className="relative text-right flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <Button
          className="cursor-pointer"
          variant={isCurrentDate("week")}
          onClick={() => handleDate("week")}
        >
          اسبوع
        </Button>
        <Button
          className="cursor-pointer"
          variant={isCurrentDate("2weeks")}
          onClick={() => handleDate("2weeks")}
        >
          اسبوعين
        </Button>
        <Button
          className="cursor-pointer"
          variant={isCurrentDate("month")}
          onClick={() => handleDate("month")}
        >
          شهر
        </Button>
      </div>
      <div className="flex items-center gap-3 w-96">
        <div className="flex flex-col gap-1">
          <Label>من</Label>
          <Input
            type="date"
            onChange={(e) => handleChange("from", e.target.value)}
            value={from}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label>الي</Label>
          <Input
            type="date"
            onChange={(e) => handleChange("to", e.target.value)}
            value={to}
          />
        </div>
      </div>
      {isPending && (
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}
    </div>
  );
}
