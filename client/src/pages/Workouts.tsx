import { useEffect, useState } from "react";
import { ExerciseCard } from "@/components/ExerciseCard";
import { AddWorkoutDialog } from "@/components/AddWorkoutDialog";
import { PlateCalculator } from "@/components/PlateCalculator";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { Dumbbell } from "lucide-react";
import emptyWorkoutImage from "@assets/generated_images/Empty_workout_state_illustration_857a6628.png";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Workout, Exercise, UserPreferences } from "@shared/schema";

export default function Workouts() {
  const { toast } = useToast();
  const [selectedWeight, setSelectedWeight] = useState<number | null>(null);

  const { data: workouts, isLoading: workoutsLoading, error: workoutsError } = useQuery<Workout[]>({
    queryKey: ["/api/workouts"],
  });

  const { data: preferences } = useQuery<UserPreferences>({
    queryKey: ["/api/preferences"],
  });

  const { data: exercisesByWorkout } = useQuery<Record<string, Exercise[]>>({
    queryKey: ["/api/workouts/exercises"],
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

  useEffect(() => {
    if (workoutsError && isUnauthorizedError(workoutsError as Error)) {
      window.location.href = "/api/login";
    }
  }, [workoutsError]);

  const deleteExerciseMutation = useMutation({
    mutationFn: async (exerciseId: string) => {
      await apiRequest("DELETE", `/api/exercises/${exerciseId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      queryClient.invalidateQueries({ queryKey: ["/api/workouts/exercises"] });
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
          description: "Failed to delete exercise. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  if (workoutsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  const allExercises: Array<Exercise & { workoutName: string }> = [];
  if (workouts && exercisesByWorkout) {
    workouts.forEach((workout) => {
      const exercises = exercisesByWorkout[workout.id] || [];
      exercises.forEach((exercise) => {
        allExercises.push({
          ...exercise,
          workoutName: workout.name,
        });
      });
    });
  }

  if (allExercises.length === 0) {
    return (
      <EmptyState
        title="No workouts yet"
        description="Start tracking your fitness journey by adding your first workout"
        actionLabel="Add Workout"
        onAction={() => {}}
        icon={Dumbbell}
        imageSrc={emptyWorkoutImage}
      />
    );
  }

  const unit = (preferences?.weightUnit || "lb") as "lb" | "kg";
  const barWeight = parseFloat(preferences?.barWeight || "45");
  const availablePlates = (preferences?.availablePlates as number[]) || [45, 35, 25, 10, 5, 2.5];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Workouts</h1>
        <AddWorkoutDialog />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workouts List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Exercises</h2>
          {allExercises.map((exercise) => (
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
              onWeightClick={(weight) => {
                setSelectedWeight(weight);
                toast({
                  title: "Weight selected",
                  description: `Calculating plates for ${weight}${unit}`,
                });
              }}
            />
          ))}
        </div>

        {/* Plate Calculator */}
        <div className="sticky top-6 h-fit">
          <PlateCalculator
            barWeight={barWeight}
            availablePlates={availablePlates}
            unit={unit}
            initialWeight={selectedWeight}
          />
        </div>
      </div>
    </div>
  );
}
