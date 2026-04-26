import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: number;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  const isPositive = trend && trend >= 0;

  return (
    <Card className={cn("overflow-hidden border-none shadow-sm transition-all hover:shadow-md", className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="mt-1 text-2xl font-bold tracking-tight">{value}</h3>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2">
          {trend !== undefined && (
            <div
              className={cn(
                "flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full",
                isPositive
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-rose-100 text-rose-600"
              )}
            >
              {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {Math.abs(trend)}%
            </div>
          )}
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
