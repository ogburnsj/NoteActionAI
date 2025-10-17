import { MealCard } from "../MealCard";

export default function MealCardExample() {
  return (
    <div className="space-y-4 p-6 max-w-2xl">
      <MealCard
        name="Grilled Chicken & Rice"
        time="12:30 PM"
        calories={650}
        macros={{ protein: 45, carbs: 60, fat: 18 }}
        onEdit={() => console.log("Edit clicked")}
        onDelete={() => console.log("Delete clicked")}
      />
    </div>
  );
}
