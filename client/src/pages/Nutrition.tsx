import { useEffect } from "react";
import { MealCard } from "@/components/MealCard";
import { AddMealDialog } from "@/components/AddMealDialog";
import { ProgressBar } from "@/components/ProgressBar";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { UtensilsCrossed } from "lucide-react";
import { Card } from "@/components/ui/card";
import emptyMealsImage from "@assets/generated_images/Empty_meals_state_illustration_c1410298.png";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Meal, UserPreferences } from "@shared/schema";

export default function Nutrition() {
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];

  const { data: meals, isLoading: mealsLoading, error: mealsError } = useQuery<Meal[]>({
    queryKey: ["/api/meals", { date: today }],
    queryFn: async () => {
      const res = await fetch(`/api/meals?date=${today}`, {
        credentials: "include",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`${res.status}: ${text}`);
      }
      return res.json();
    },
  });

  const { data: preferences } = useQuery<UserPreferences>({
    queryKey: ["/api/preferences"],
  });

  useEffect(() => {
    if (mealsError && isUnauthorizedError(mealsError as Error)) {
      window.location.href = "/api/login";
    }
  }, [mealsError]);

  const deleteMealMutation = useMutation({
    mutationFn: async (mealId: string) => {
      await apiRequest("DELETE", `/api/meals/${mealId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meals"] });
      toast({
        title: "Success",
        description: "Meal deleted successfully!",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
      } else {
        toast({
          title: "Error",
          description: "Failed to delete meal. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  if (mealsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card className="p-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (!meals || meals.length === 0) {
    return (
      <EmptyState
        title="No meals logged"
        description="Track your nutrition by logging your first meal of the day"
        actionLabel="Add Meal"
        onAction={() => {}}
        icon={UtensilsCrossed}
        imageSrc={emptyMealsImage}
      />
    );
  }

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  const calorieGoal = preferences?.calorieGoal || 2000;
  const proteinGoal = preferences?.proteinGoal || 150;
  const carbsGoal = preferences?.carbsGoal || 200;
  const fatGoal = preferences?.fatGoal || 67;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Nutrition</h1>
        <AddMealDialog />
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Daily Goals</h2>
        <div className="space-y-4">
          <ProgressBar label="Calories" current={totalCalories} goal={calorieGoal} unit="kcal" color="primary" />
          <ProgressBar label="Protein" current={totalProtein} goal={proteinGoal} unit="g" color="success" />
          <ProgressBar label="Carbs" current={totalCarbs} goal={carbsGoal} unit="g" color="warning" />
          <ProgressBar label="Fat" current={totalFat} goal={fatGoal} unit="g" color="primary" />
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
              macros={{ protein: meal.protein, carbs: meal.carbs, fat: meal.fat }}
              onEdit={() => {
                toast({
                  title: "Coming soon",
                  description: "Edit functionality will be added soon.",
                });
              }}
              onDelete={() => deleteMealMutation.mutate(meal.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
