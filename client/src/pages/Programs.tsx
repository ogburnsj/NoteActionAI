import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Plus, TrendingUp, CheckCircle2 } from "lucide-react";
import { ProgramBrowser } from "@/components/ProgramBrowser";

interface UserProgram {
  id: string;
  userId: string;
  programId: string;
  startDate: string;
  currentWeek: number;
  completedWorkouts: Array<{
    weekNumber: number;
    dayNumber: number;
    workoutId: string;
    completedDate: string;
  }>;
  status: string;
}

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
  templateId: string;
  weekNumber: number;
  dayNumber: number;
  dayName: string | null;
  template: {
    id: string;
    name: string;
    description: string | null;
    difficulty: string;
    duration: number;
    category: string | null;
  };
}

export default function Programs() {
  const [showBrowser, setShowBrowser] = useState(false);

  const { data: userPrograms } = useQuery<UserProgram[]>({
    queryKey: ["/api/user-programs"],
  });

  const activeProgram = userPrograms?.find(p => p.status === "active");

  const { data: program } = useQuery<Program>({
    queryKey: ["/api/programs", activeProgram?.programId],
    queryFn: async () => {
      const response = await fetch(`/api/programs/${activeProgram?.programId}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch program");
      return response.json();
    },
    enabled: !!activeProgram?.programId,
  });

  const { data: scheduledWorkouts } = useQuery<ProgramWorkout[]>({
    queryKey: ["/api/user-programs", activeProgram?.id, "schedule", activeProgram?.currentWeek],
    queryFn: async () => {
      const response = await fetch(`/api/user-programs/${activeProgram?.id}/schedule/${activeProgram?.currentWeek}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch scheduled workouts");
      return response.json();
    },
    enabled: !!activeProgram?.id && !!activeProgram?.currentWeek,
  });

  if (!activeProgram) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Programs</h1>
        </div>

        <div className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Active Program</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            Follow a structured workout program for consistent progress towards your fitness goals
          </p>
          <Button onClick={() => setShowBrowser(true)} data-testid="button-browse-programs">
            <Plus className="h-4 w-4 mr-2" />
            Browse Programs
          </Button>
        </div>

        <ProgramBrowser
          open={showBrowser}
          onOpenChange={setShowBrowser}
          onProgramEnrolled={() => setShowBrowser(false)}
        />
      </div>
    );
  }

  const totalWorkouts = (program?.durationWeeks || 0) * (program?.daysPerWeek || 0);
  const completedCount = activeProgram.completedWorkouts?.length || 0;
  const progressPercentage = totalWorkouts > 0 ? (completedCount / totalWorkouts) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Program</h1>
        <Button variant="outline" onClick={() => setShowBrowser(true)} data-testid="button-change-program">
          <Calendar className="h-4 w-4 mr-2" />
          Change Program
        </Button>
      </div>

      {/* Program Overview */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{program?.name}</h2>
            {program?.description && (
              <p className="text-muted-foreground">{program.description}</p>
            )}
          </div>
          <Badge className="text-sm">
            {program?.difficulty}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              Week {activeProgram.currentWeek} of {program?.durationWeeks}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{program?.goal}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {completedCount} / {totalWorkouts} workouts
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} />
        </div>
      </Card>

      {/* This Week's Schedule */}
      <div>
        <h2 className="text-xl font-semibold mb-4">This Week's Workouts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scheduledWorkouts?.map((workout) => {
            const isCompleted = activeProgram.completedWorkouts?.some(
              cw => cw.weekNumber === workout.weekNumber && cw.dayNumber === workout.dayNumber
            );

            return (
              <Card
                key={workout.id}
                className={`p-4 ${isCompleted ? "opacity-60" : ""}`}
                data-testid={`card-scheduled-workout-${workout.dayNumber}`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{workout.dayName}</h4>
                      {isCompleted && <CheckCircle2 className="h-4 w-4 text-green-600" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{workout.template.name}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {workout.template.duration} min
                  </Badge>
                </div>
                {workout.template.description && (
                  <p className="text-sm text-muted-foreground mb-3">{workout.template.description}</p>
                )}
                {!isCompleted && (
                  <Button className="w-full" size="sm" data-testid={`button-start-workout-${workout.dayNumber}`}>
                    Start Workout
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      <ProgramBrowser
        open={showBrowser}
        onOpenChange={setShowBrowser}
        onProgramEnrolled={() => setShowBrowser(false)}
      />
    </div>
  );
}
