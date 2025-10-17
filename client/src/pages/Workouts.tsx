import { useState } from "react";
import { ExerciseCard } from "@/components/ExerciseCard";
import { AddWorkoutDialog } from "@/components/AddWorkoutDialog";
import { EmptyState } from "@/components/EmptyState";
import { Dumbbell } from "lucide-react";
import emptyWorkoutImage from "@assets/generated_images/Empty_workout_state_illustration_857a6628.png";

//todo: remove mock functionality
const mockWorkouts = [
  {
    id: 1,
    name: "Barbell Squat",
    sets: [
      { reps: 10, weight: 135 },
      { reps: 8, weight: 185 },
      { reps: 6, weight: 225 }
    ]
  },
  {
    id: 2,
    name: "Bench Press",
    sets: [
      { reps: 10, weight: 135 },
      { reps: 8, weight: 155 },
      { reps: 6, weight: 175 }
    ]
  },
  {
    id: 3,
    name: "Deadlift",
    sets: [
      { reps: 8, weight: 225 },
      { reps: 6, weight: 275 },
      { reps: 4, weight: 315 }
    ]
  }
];

export default function Workouts() {
  const [workouts] = useState(mockWorkouts);

  if (workouts.length === 0) {
    return (
      <EmptyState
        title="No workouts yet"
        description="Start tracking your fitness journey by adding your first workout"
        actionLabel="Add Workout"
        onAction={() => console.log("Add workout")}
        icon={Dumbbell}
        imageSrc={emptyWorkoutImage}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Workouts</h1>
        <AddWorkoutDialog />
      </div>

      <div className="space-y-4">
        {workouts.map((workout) => (
          <ExerciseCard
            key={workout.id}
            name={workout.name}
            sets={workout.sets}
            unit="lb"
            onEdit={() => console.log(`Edit ${workout.name}`)}
            onDelete={() => console.log(`Delete ${workout.name}`)}
          />
        ))}
      </div>
    </div>
  );
}
