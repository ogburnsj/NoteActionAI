import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, Clock, TrendingUp } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WorkoutTemplate {
  id: string;
  name: string;
  description: string | null;
  difficulty: string;
  duration: number;
  category: string | null;
}

interface TemplateExercise {
  id: string;
  exerciseName: string;
  sets: number;
  reps: string;
  restSeconds: number | null;
  notes: string | null;
}

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWorkoutCreated?: () => void;
}

export function TemplateSelector({ open, onOpenChange, onWorkoutCreated }: TemplateSelectorProps) {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: templates, isLoading } = useQuery<WorkoutTemplate[]>({
    queryKey: ["/api/templates"],
    enabled: open,
  });

  const { data: templateExercises } = useQuery<TemplateExercise[]>({
    queryKey: ["/api/templates", selectedTemplateId, "exercises"],
    queryFn: async () => {
      const response = await fetch(`/api/templates/${selectedTemplateId}/exercises`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch template exercises");
      return response.json();
    },
    enabled: !!selectedTemplateId,
  });

  const createWorkoutMutation = useMutation({
    mutationFn: async (templateId: string) => {
      const response = await apiRequest("POST", `/api/templates/${templateId}/create-workout`, {
        date: new Date().toISOString().split('T')[0]
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({
        title: "Workout created",
        description: "Your workout has been created from the template",
      });
      onOpenChange(false);
      onWorkoutCreated?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create workout",
        variant: "destructive",
      });
    },
  });

  const selectedTemplate = templates?.find(t => t.id === selectedTemplateId);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner": return "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100";
      case "intermediate": return "bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100";
      case "advanced": return "bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100";
      default: return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Choose a Workout Template</DialogTitle>
          <DialogDescription>
            Select a pre-built workout template to get started quickly
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading templates...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">AVAILABLE TEMPLATES</h3>
              {templates?.map((template) => (
                <Card
                  key={template.id}
                  className={`p-4 cursor-pointer hover-elevate active-elevate-2 ${
                    selectedTemplateId === template.id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedTemplateId(template.id)}
                  data-testid={`card-template-${template.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{template.name}</h4>
                    <Badge className={getDifficultyColor(template.difficulty)}>
                      {template.difficulty}
                    </Badge>
                  </div>
                  {template.description && (
                    <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  )}
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {template.duration} min
                    </div>
                    {template.category && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {template.category}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div>
              {selectedTemplate ? (
                <div className="sticky top-0 space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-3">TEMPLATE PREVIEW</h3>
                    <Card className="p-4">
                      <h4 className="font-semibold text-lg mb-2">{selectedTemplate.name}</h4>
                      <div className="space-y-2">
                        {templateExercises?.map((exercise, idx) => (
                          <div
                            key={exercise.id}
                            className="flex items-start gap-3 text-sm"
                            data-testid={`preview-exercise-${idx}`}
                          >
                            <span className="font-mono text-muted-foreground">{idx + 1}.</span>
                            <div className="flex-1">
                              <p className="font-medium">{exercise.exerciseName}</p>
                              <p className="text-muted-foreground">
                                {exercise.sets} sets × {exercise.reps} reps
                                {exercise.restSeconds && ` • ${exercise.restSeconds}s rest`}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => createWorkoutMutation.mutate(selectedTemplate.id)}
                    disabled={createWorkoutMutation.isPending}
                    data-testid="button-create-from-template"
                  >
                    <Dumbbell className="h-4 w-4 mr-2" />
                    {createWorkoutMutation.isPending ? "Creating..." : "Create Workout from Template"}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Dumbbell className="h-12 w-12 mx-auto mb-3" />
                    <p>Select a template to preview</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
