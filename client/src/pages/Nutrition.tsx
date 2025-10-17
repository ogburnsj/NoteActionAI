import { useState } from "react";
import { MealCard } from "@/components/MealCard";
import { AddMealDialog } from "@/components/AddMealDialog";
import { ProgressBar } from "@/components/ProgressBar";
import { EmptyState } from "@/components/EmptyState";
import { UtensilsCrossed } from "lucide-react";
import { Card } from "@/components/ui/card";
import emptyMealsImage from "@assets/generated_images/Empty_meals_state_illustration_c1410298.png";

//todo: remove mock functionality
const mockMeals = [
  {
    id: 1,
    name: "Breakfast Bowl",
    time: "8:30 AM",
    calories: 450,
    macros: { protein: 25, carbs: 55, fat: 12 }
  },
  {
    id: 2,
    name: "Grilled Chicken & Rice",
    time: "12:30 PM",
    calories: 650,
    macros: { protein: 45, carbs: 60, fat: 18 }
  },
  {
    id: 3,
    name: "Protein Shake",
    time: "3:00 PM",
    calories: 200,
    macros: { protein: 30, carbs: 15, fat: 5 }
  },
  {
    id: 4,
    name: "Salmon & Vegetables",
    time: "6:45 PM",
    calories: 550,
    macros: { protein: 40, carbs: 35, fat: 25 }
  }
];

export default function Nutrition() {
  const [meals] = useState(mockMeals);

  if (meals.length === 0) {
    return (
      <EmptyState
        title="No meals logged"
        description="Track your nutrition by logging your first meal of the day"
        actionLabel="Add Meal"
        onAction={() => console.log("Add meal")}
        icon={UtensilsCrossed}
        imageSrc={emptyMealsImage}
      />
    );
  }

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.macros.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.macros.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.macros.fat, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Nutrition</h1>
        <AddMealDialog />
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Daily Goals</h2>
        <div className="space-y-4">
          <ProgressBar label="Calories" current={totalCalories} goal={2000} unit="kcal" color="primary" />
          <ProgressBar label="Protein" current={totalProtein} goal={150} unit="g" color="success" />
          <ProgressBar label="Carbs" current={totalCarbs} goal={200} unit="g" color="warning" />
          <ProgressBar label="Fat" current={totalFat} goal={67} unit="g" color="primary" />
        </div>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Today's Meals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {meals.map((meal) => (
            <MealCard
              key={meal.id}
              name={meal.name}
              time={meal.time}
              calories={meal.calories}
              macros={meal.macros}
              onEdit={() => console.log(`Edit ${meal.name}`)}
              onDelete={() => console.log(`Delete ${meal.name}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
