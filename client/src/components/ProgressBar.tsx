interface ProgressBarProps {
  label: string;
  current: number;
  goal: number;
  unit: string;
  color?: "primary" | "success" | "warning";
}

export function ProgressBar({ label, current, goal, unit, color = "primary" }: ProgressBarProps) {
  const percentage = Math.min((current / goal) * 100, 100);
  
  const colorClasses = {
    primary: "bg-primary",
    success: "bg-chart-2",
    warning: "bg-chart-3"
  };

  return (
    <div className="space-y-2" data-testid={`progress-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-muted-foreground" data-testid={`text-progress-value-${label.toLowerCase().replace(/\s+/g, '-')}`}>
          {current} / {goal} {unit}
        </span>
      </div>
      <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full ${colorClasses[color]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
