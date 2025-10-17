import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

interface Set {
  reps: string;
  weight: string;
}

export function AddWorkoutDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [exerciseName, setExerciseName] = useState("");
  const [sets, setSets] = useState<Set[]>([{ reps: "", weight: "" }]);

  const createWorkoutMutation = useMutation({
    mutationFn: async (data: { name: string; date: string }) => {
      const res = await apiRequest("POST", "/api/workouts", data);
      return res.json();
    },
    onSuccess: (workout) => {
      return createExerciseMutation.mutate({ workoutId: workout.id });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
      } else {
        toast({
          title: "Error",
          description: "Failed to create workout. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const createExerciseMutation = useMutation({
    mutationFn: async ({ workoutId }: { workoutId: string }) => {
      const exerciseData = {
        workoutId,
        name: exerciseName,
        sets: sets.map(s => ({ reps: parseInt(s.reps), weight: parseInt(s.weight) })),
      };
      const res = await apiRequest("POST", "/api/exercises", exerciseData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({
        title: "Success",
        description: "Exercise added successfully!",
      });
      setOpen(false);
      setExerciseName("");
      setSets([{ reps: "", weight: "" }]);
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
      } else {
        toast({
          title: "Error",
          description: "Failed to create exercise. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const addSet = () => {
    setSets([...sets, { reps: "", weight: "" }]);
  };

  const removeSet = (index: number) => {
    setSets(sets.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!exerciseName.trim() || sets.some(s => !s.reps || !s.weight)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const today = new Date().toISOString().split('T')[0];
    createWorkoutMutation.mutate({ 
      name: `${exerciseName} Workout`, 
      date: today 
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-workout">
          <Plus className="h-4 w-4 mr-2" />
          Add Exercise
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" data-testid="dialog-add-workout">
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="exercise-name">Exercise Name</Label>
            <Input
              id="exercise-name"
              placeholder="e.g., Barbell Squat"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              data-testid="input-exercise-name"
            />
          </div>

          <div className="space-y-2">
            <Label>Sets</Label>
            {sets.map((set, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder="Reps"
                  type="number"
                  value={set.reps}
                  onChange={(e) => {
                    const newSets = [...sets];
                    newSets[index].reps = e.target.value;
                    setSets(newSets);
                  }}
                  data-testid={`input-reps-${index}`}
                />
                <Input
                  placeholder="Weight"
                  type="number"
                  value={set.weight}
                  onChange={(e) => {
                    const newSets = [...sets];
                    newSets[index].weight = e.target.value;
                    setSets(newSets);
                  }}
                  data-testid={`input-weight-${index}`}
                />
                {sets.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeSet(index)}
                    data-testid={`button-remove-set-${index}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={addSet}
              className="w-full"
              data-testid="button-add-set"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Set
            </Button>
          </div>

          <div className="flex gap-2 pt-4">
            <Button 
              variant="outline" 
              onClick={() => setOpen(false)} 
              className="flex-1" 
              data-testid="button-cancel"
              disabled={createWorkoutMutation.isPending || createExerciseMutation.isPending}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex-1" 
              data-testid="button-save-workout"
              disabled={createWorkoutMutation.isPending || createExerciseMutation.isPending}
            >
              {createWorkoutMutation.isPending || createExerciseMutation.isPending ? "Saving..." : "Save Exercise"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
