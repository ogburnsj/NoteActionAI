import { useEffect } from "react";
import { StatCard } from "@/components/StatCard";
import { ProgressBar } from "@/components/ProgressBar";
import { ExerciseCard } from "@/components/ExerciseCard";
import { MealCard } from "@/components/MealCard";
import { WorkoutChart } from "@/components/WorkoutChart";
import { PlateCalculator } from "@/components/PlateCalculator";
import { AddWorkoutDialog } from "@/components/AddWorkoutDialog";
import { AddMealDialog } from "@/components/AddMealDialog";
import { Dumbbell, TrendingUp, Flame, Target } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Workout, Exercise, Meal, UserPreferences } from "@shared/schema";

export default function Dashboard() {
  const { toast } = useToast();
  const today = new Date().toISOString().split('T')[0];

  const { data: preferences } = useQuery<UserPreferences>({
    queryKey: ["/api/preferences"],
  });

  const { data: workouts, error: workoutsError } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const { data: meals, error: mealsError } = useQuery<Meal[]>({
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

  const { data: recentExercises } = useQuery<Exercise[]>({
    queryKey: ["/api/workouts/recent-exercises"],
    queryFn: async () => {
      if (!workouts || workouts.length === 0) return [];
      
      const recentWorkout = workouts[workouts.length - 1];
      const res = await fetch(`/api/workouts/${recentWorkout.id}/exercises`, {
        credentials: "include",
      });
      if (res.ok) {
        const exercises = await res.json();
        return exercises.slice(0, 2);
      }
      return [];
    },
    enabled: !!workouts && workouts.length > 0,
  });

  useEffect(() => {
    if ((workoutsError && isUnauthorizedError(workoutsError as Error)) ||
        (mealsError && isUnauthorizedError(mealsError as Error))) {
      window.location.href = "/api/login";
    }
  }, [workoutsError, mealsError]);

  const deleteExerciseMutation = useMutation({
    mutationFn: async (exerciseId: string) => {
      await apiRequest("DELETE", `/api/exercises/${exerciseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/workouts/recent-exercises"] });
      toast({
        title: "Success",
        description: "Exercise deleted successfully!",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
      } else {
        toast({
          title: "Error",
          description: "Failed to delete exercise.",
          variant: "destructive",
        });
      }
    },
  });

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
          description: "Failed to delete meal.",
          variant: "destructive",
        });
      }
    },
  });

  const totalCalories = meals?.reduce((sum, meal) => sum + meal.calories, 0) || 0;
  const totalProtein = meals?.reduce((sum, meal) => sum + meal.protein, 0) || 0;
  const totalCarbs = meals?.reduce((sum, meal) => sum + meal.carbs, 0) || 0;
  const totalFat = meals?.reduce((sum, meal) => sum + meal.fat, 0) || 0;

  const calorieGoal = preferences?.calorieGoal || 2000;
  const proteinGoal = preferences?.proteinGoal || 150;
  const carbsGoal = preferences?.carbsGoal || 200;
  const fatGoal = preferences?.fatGoal || 67;
  const unit = (preferences?.weightUnit || "lb") as "lb" | "kg";
  const barWeight = parseFloat(preferences?.barWeight || "45");
  const availablePlates = (preferences?.availablePlates as number[]) || [45, 35, 25, 10, 5, 2.5];

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const workoutsThisMonth = workouts?.filter(w => {
    const workoutDate = new Date(w.date);
    return workoutDate.getMonth() === currentMonth && workoutDate.getFullYear() === currentYear;
  }).length || 0;

  const workoutsThisWeek = workouts?.filter(w => {
    const workoutDate = new Date(w.date);
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return workoutDate >= weekAgo;
  }).length || 0;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Workouts"
          value={workoutsThisMonth.toString()}
          subtitle="This month"
          icon={Dumbbell}
        />
        <StatCard
          title="This Week"
          value={workoutsThisWeek.toString()}
          subtitle="Workouts complete"
          icon={TrendingUp}
        />
        <StatCard
          title="Calories Today"
          value={totalCalories.toLocaleString()}
          subtitle={`of ${calorieGoal.toLocaleString()} kcal`}
          icon={Flame}
        />
        <StatCard
          title="Meals Today"
          value={(meals?.length || 0).toString()}
          subtitle="Logged meals"
          icon={Target}
        />
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Today's Nutrition</h2>
          <AddMealDialog />
        </div>
        <div className="space-y-4">
          <ProgressBar label="Calories" current={totalCalories} goal={calorieGoal} unit="kcal" color="primary" />
          <ProgressBar label="Protein" current={totalProtein} goal={proteinGoal} unit="g" color="success" />
          <ProgressBar label="Carbs" current={totalCarbs} goal={carbsGoal} unit="g" color="warning" />
          <ProgressBar label="Fat" current={totalFat} goal={fatGoal} unit="g" color="primary" />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Workouts</h2>
            <AddWorkoutDialog />
          </div>
          <div className="space-y-4">
            {!recentExercises || recentExercises.length === 0 ? (
              <Card className="p-6 text-center text-muted-foreground">
                <p>No recent exercises. Add your first workout!</p>
              </Card>
            ) : (
              recentExercises.map((exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  name={exercise.name}
                  sets={exercise.sets as Array<{ reps: number; weight: number }>}
                  unit={unit}
                  onEdit={() => {
                    toast({
                      title: "Coming soon",
                      description: "Edit functionality will be added soon.",
                    });
                  }}
                  onDelete={() => deleteExerciseMutation.mutate(exercise.id)}
                />
              ))
            )}
          </div>
        </div>

        <PlateCalculator
          barWeight={barWeight}
          availablePlates={availablePlates}
          unit={unit}
        />
      </div>

      {meals && meals.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Today's Meals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {meals.slice(0, 4).map((meal) => (
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
      )}
    </div>
  );
}
