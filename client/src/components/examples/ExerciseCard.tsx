import { ExerciseCard } from "../ExerciseCard";

export default function ExerciseCardExample() {
  return (
    <div className="space-y-4 p-6 max-w-2xl">
      <ExerciseCard
        name="Barbell Squat"
        sets={[
          { reps: 10, weight: 135 },
          { reps: 8, weight: 185 },
          { reps: 6, weight: 225 }
        ]}
        unit="lb"
        onEdit={() => console.log("Edit clicked")}
        onDelete={() => console.log("Delete clicked")}
      />
    </div>
  );
}
