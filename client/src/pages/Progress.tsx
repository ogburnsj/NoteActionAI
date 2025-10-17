import { useEffect } from "react";
import { WorkoutChart } from "@/components/WorkoutChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Workout, Exercise, Meal } from "@shared/schema";

export default function Progress() {
  const { data: workouts, isLoading: workoutsLoading, error: workoutsError } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const { data: exercisesByWorkout } = useQuery<Record<string, Exercise[]>>({
    queryKey: ["/api/workouts/all-exercises"],
    queryFn: async () => {
      if (!workouts || workouts.length === 0) return {};
      
      const exercisesMap: Record<string, Exercise[]> = {};
      await Promise.all(
        workouts.map(async (workout) => {
          const res = await fetch(`/api/workouts/${workout.id}/exercises`, {
            credentials: "include",
          });
          if (res.ok) {
            exercisesMap[workout.id] = await res.json();
          }
        })
      );
      return exercisesMap;
    },
    enabled: !!workouts && workouts.length > 0,
  });

  const { data: allMeals, error: mealsError } = useQuery<Meal[]>({
    queryKey: ["/api/meals"],
  });

  useEffect(() => {
    if ((workoutsError && isUnauthorizedError(workoutsError as Error)) ||
        (mealsError && isUnauthorizedError(mealsError as Error))) {
      window.location.href = "/api/login";
    }
  }, [workoutsError, mealsError]);

  if (workoutsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  const getExerciseProgressData = (exerciseName: string) => {
    if (!workouts || !exercisesByWorkout) return [];
    
    const data: Array<{ date: string; value: number }> = [];
    
    workouts.forEach((workout) => {
      const exercises = exercisesByWorkout[workout.id] || [];
      const exercise = exercises.find(e => e.name.toLowerCase() === exerciseName.toLowerCase());
      
      if (exercise) {
        const sets = exercise.sets as Array<{ reps: number; weight: number }>;
        const maxWeight = Math.max(...sets.map(s => s.weight));
        data.push({
          date: new Date(workout.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          value: maxWeight,
        });
      }
    });
    
    return data.slice(-7);
  };

  const getCalorieProgressData = () => {
    if (!allMeals) return [];
    
    const caloriesByDate: Record<string, number> = {};
    
    allMeals.forEach((meal) => {
      const date = new Date(meal.date).toLocaleDateString('en-US', { weekday: 'short' });
      caloriesByDate[date] = (caloriesByDate[date] || 0) + meal.calories;
    });
    
    const last7Days = Object.entries(caloriesByDate)
      .map(([date, value]) => ({ date, value }))
      .slice(-7);
    
    return last7Days;
  };

  const squatData = getExerciseProgressData("Barbell Squat");
  const benchData = getExerciseProgressData("Bench Press");
  const caloriesData = getCalorieProgressData();

  const hasData = squatData.length > 0 || benchData.length > 0 || caloriesData.length > 0;

  if (!hasData) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Progress Tracking</h1>
        <Card className="p-12 text-center">
          <p className="text-muted-foreground">
            Start tracking your workouts and meals to see your progress over time!
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Progress Tracking</h1>

      <div className="space-y-6">
        {squatData.length > 0 && (
          <WorkoutChart title="Squat Progress (lb)" data={squatData} />
        )}
        {benchData.length > 0 && (
          <WorkoutChart title="Bench Press Progress (lb)" data={benchData} />
        )}
        {caloriesData.length > 0 && (
          <WorkoutChart title="Weekly Calorie Intake" data={caloriesData} />
        )}
      </div>
    </div>
  );
}
