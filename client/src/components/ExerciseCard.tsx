import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, TrendingUp } from "lucide-react";

interface Set {
  reps: number;
  weight: number;
}

interface ProgressiveSuggestion {
  suggestedWeight: number;
  reason: string;
}

interface ExerciseCardProps {
  name: string;
  sets: Set[];
  unit: "lb" | "kg";
  onEdit?: () => void;
  onDelete?: () => void;
  onWeightClick?: (weight: number) => void;
  progressiveSuggestion?: ProgressiveSuggestion | null;
}

export function ExerciseCard({ name, sets, unit, onEdit, onDelete, onWeightClick, progressiveSuggestion }: ExerciseCardProps) {
  return (
    <Card className="p-4 group hover-elevate" data-testid={`card-exercise-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-lg font-semibold">{name}</h4>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            data-testid={`button-edit-exercise-${name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            data-testid={`button-delete-exercise-${name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {progressiveSuggestion && (
        <div className="mb-3 p-2 rounded-md bg-primary/10 border border-primary/20">
          <div className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">
                Try {progressiveSuggestion.suggestedWeight}{unit} next time
              </p>
              <p className="text-xs text-muted-foreground">{progressiveSuggestion.reason}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {sets.map((set, index) => (
          <div
            key={index}
            className={`inline-flex items-center gap-2 bg-secondary px-3 py-1 rounded-md ${
              onWeightClick ? "cursor-pointer hover-elevate active-elevate-2" : ""
            }`}
            onClick={() => onWeightClick?.(set.weight)}
            data-testid={`badge-set-${index}`}
          >
            <span className="text-sm font-mono">
              {set.reps} × {set.weight}{unit}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
