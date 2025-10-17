import { StatCard } from "../StatCard";
import { Dumbbell } from "lucide-react";

export default function StatCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      <StatCard
        title="Total Workouts"
        value="47"
        subtitle="This month"
        icon={Dumbbell}
        trend={{ value: "12% from last month", isPositive: true }}
      />
    </div>
  );
}
