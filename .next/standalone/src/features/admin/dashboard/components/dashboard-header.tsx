"use client";

import { Button } from "@/components/ui/button";
import { Plus, Download, Calendar } from "lucide-react";

export function DashboardHeader() {
  const date = new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">نظرة عامة</h1>
        <p className="text-muted-foreground mt-1 flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          {date}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex gap-2 rounded-xl"
        >
          <Download className="h-4 w-4" />
          تصدير التقرير
        </Button>
      </div>
    </div>
  );
}
