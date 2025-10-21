import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Dumbbell } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExerciseLibraryItem {
  id: string;
  name: string;
  muscleGroup: string;
  equipment: string | null;
  instructions: string | null;
}

interface ExerciseBrowserProps {
  onSelectExercise?: (exercise: ExerciseLibraryItem) => void;
}

export function ExerciseBrowser({ onSelectExercise }: ExerciseBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>("all");

  const { data: muscleGroups } = useQuery<string[]>({
    queryKey: ["/api/exercises/muscle-groups"],
  });

  const { data: exercises, isLoading } = useQuery<ExerciseLibraryItem[]>({
    queryKey: ["/api/exercises/library", searchQuery, selectedMuscleGroup !== "all" ? selectedMuscleGroup : undefined],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      if (selectedMuscleGroup && selectedMuscleGroup !== "all") params.append("muscleGroup", selectedMuscleGroup);
      const queryString = params.toString() ? `?${params.toString()}` : "";
      const response = await fetch(`/api/exercises/library${queryString}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch exercises");
      return response.json();
    },
  });

  const filteredExercises = exercises || [];

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search exercises..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search-exercises"
          />
        </div>
        <Select value={selectedMuscleGroup} onValueChange={setSelectedMuscleGroup}>
          <SelectTrigger className="w-48" data-testid="select-muscle-group">
            <SelectValue placeholder="All muscle groups" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Muscles</SelectItem>
            {muscleGroups?.map((group) => (
              <SelectItem key={group} value={group}>
                {group}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Loading exercises...</div>
      ) : filteredExercises.length === 0 ? (
        <div className="text-center py-8">
          <Dumbbell className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">No exercises found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
          {filteredExercises.map((exercise) => (
            <Card
              key={exercise.id}
              className={`p-4 ${onSelectExercise ? "cursor-pointer hover-elevate active-elevate-2" : ""}`}
              onClick={() => onSelectExercise?.(exercise)}
              data-testid={`card-exercise-${exercise.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold">{exercise.name}</h4>
                <Badge variant="outline" className="text-xs">
                  {exercise.muscleGroup}
                </Badge>
              </div>
              {exercise.equipment && (
                <p className="text-sm text-muted-foreground mb-1">
                  Equipment: {exercise.equipment}
                </p>
              )}
              {exercise.instructions && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {exercise.instructions}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
