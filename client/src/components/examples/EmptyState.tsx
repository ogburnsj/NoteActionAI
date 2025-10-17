import { EmptyState } from "../EmptyState";
import { Dumbbell } from "lucide-react";

export default function EmptyStateExample() {
  return (
    <div className="p-6">
      <EmptyState
        title="No workouts yet"
        description="Start tracking your fitness journey by adding your first workout"
        actionLabel="Add Workout"
        onAction={() => console.log("Add workout clicked")}
        icon={Dumbbell}
      />
    </div>
  );
}
