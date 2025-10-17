import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="p-6" data-testid={`card-stat-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between gap-4 mb-4">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-4xl font-bold font-mono" data-testid={`text-stat-value-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</p>
        {subtitle && (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        )}
        {trend && (
          <p className={`text-sm font-medium ${trend.isPositive ? 'text-chart-2' : 'text-chart-3'}`}>
            {trend.isPositive ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
    </Card>
  );
}
