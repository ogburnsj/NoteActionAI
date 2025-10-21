import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Target, TrendingUp } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Program {
  id: string;
  name: string;
  description: string | null;
  difficulty: string;
  durationWeeks: number;
  daysPerWeek: number;
  goal: string | null;
}

interface ProgramWorkout {
  id: string;
  programId: string;
  weekNumber: number;
  dayNumber: number;
  dayName: string | null;
}

interface ProgramBrowserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProgramEnrolled?: () => void;
}

export function ProgramBrowser({ open, onOpenChange, onProgramEnrolled }: ProgramBrowserProps) {
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: programs, isLoading } = useQuery<Program[]>({
    queryKey: ["/api/programs"],
    enabled: open,
  });

  const { data: programWorkouts } = useQuery<ProgramWorkout[]>({
    queryKey: ["/api/programs", selectedProgramId, "workouts"],
    queryFn: async () => {
      const response = await fetch(`/api/programs/${selectedProgramId}/workouts`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch program workouts");
      return response.json();
    },
    enabled: !!selectedProgramId,
  });

  const enrollMutation = useMutation({
    mutationFn: async (programId: string) => {
      const response = await apiRequest("POST", "/api/user-programs", {
        programId,
        startDate: new Date().toISOString().split('T')[0],
        currentWeek: 1,
        completedWorkouts: [],
        status: "active",
      });
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-programs"] });
      toast({
        title: "Enrolled in program",
        description: "You've been enrolled in the program. Check your Programs page to track progress!",
      });
      onOpenChange(false);
      onProgramEnrolled?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to enroll in program",
        variant: "destructive",
      });
    },
  });

  const selectedProgram = programs?.find(p => p.id === selectedProgramId);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner": return "bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100";
      case "intermediate": return "bg-yellow-100 dark:bg-yellow-900 text-yellow-900 dark:text-yellow-100";
      case "advanced": return "bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100";
      default: return "";
    }
  };

  // Group workouts by week
  const workoutsByWeek: { [week: number]: ProgramWorkout[] } = {};
  programWorkouts?.forEach((workout) => {
    if (!workoutsByWeek[workout.weekNumber]) {
      workoutsByWeek[workout.weekNumber] = [];
    }
    workoutsByWeek[workout.weekNumber].push(workout);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Browse Workout Programs</DialogTitle>
          <DialogDescription>
            Choose a structured program to follow for consistent progress
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">Loading programs...</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground">AVAILABLE PROGRAMS</h3>
              {programs?.map((program) => (
                <Card
                  key={program.id}
                  className={`p-4 cursor-pointer hover-elevate active-elevate-2 ${
                    selectedProgramId === program.id ? "border-primary" : ""
                  }`}
                  onClick={() => setSelectedProgramId(program.id)}
                  data-testid={`card-program-${program.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold">{program.name}</h4>
                    <Badge className={getDifficultyColor(program.difficulty)}>
                      {program.difficulty}
                    </Badge>
                  </div>
                  {program.description && (
                    <p className="text-sm text-muted-foreground mb-3">{program.description}</p>
                  )}
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {program.durationWeeks} weeks
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {program.daysPerWeek} days/week
                    </div>
                    {program.goal && (
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {program.goal}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>

            <div>
              {selectedProgram ? (
                <div className="sticky top-0 space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm text-muted-foreground mb-3">PROGRAM SCHEDULE</h3>
                    <Card className="p-4">
                      <h4 className="font-semibold text-lg mb-3">{selectedProgram.name}</h4>
                      <div className="space-y-4 max-h-80 overflow-y-auto">
                        {Object.keys(workoutsByWeek)
                          .sort((a, b) => Number(a) - Number(b))
                          .map((weekNum) => {
                            const week = Number(weekNum);
                            const workouts = workoutsByWeek[week];
                            return (
                              <div key={week} className="space-y-2">
                                <h5 className="font-semibold text-sm">Week {week}</h5>
                                <div className="space-y-1">
                                  {workouts
                                    .sort((a, b) => a.dayNumber - b.dayNumber)
                                    .map((workout) => (
                                      <div
                                        key={workout.id}
                                        className="flex items-center gap-2 text-sm text-muted-foreground pl-3"
                                        data-testid={`schedule-week-${week}-day-${workout.dayNumber}`}
                                      >
                                        <span className="font-mono text-xs">Day {workout.dayNumber}</span>
                                        <span>•</span>
                                        <span>{workout.dayName}</span>
                                      </div>
                                    ))}
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </Card>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => enrollMutation.mutate(selectedProgram.id)}
                    disabled={enrollMutation.isPending}
                    data-testid="button-enroll-program"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {enrollMutation.isPending ? "Enrolling..." : "Enroll in Program"}
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <Calendar className="h-12 w-12 mx-auto mb-3" />
                    <p>Select a program to view schedule</p>
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
