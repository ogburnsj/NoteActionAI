import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface Macros {
  protein: number;
  carbs: number;
  fat: number;
}

interface MealCardProps {
  name: string;
  time: string;
  calories: number;
  macros: Macros;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function MealCard({ name, time, calories, macros, onEdit, onDelete }: MealCardProps) {
  const totalMacros = macros.protein + macros.carbs + macros.fat;
  const proteinPercent = (macros.protein / totalMacros) * 100;
  const carbsPercent = (macros.carbs / totalMacros) * 100;
  const fatPercent = (macros.fat / totalMacros) * 100;

  return (
    <Card className="p-4 hover-elevate" data-testid={`card-meal-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-lg font-semibold">{name}</h4>
          <p className="text-sm text-muted-foreground">{time}</p>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onEdit}
            data-testid={`button-edit-meal-${name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onDelete}
            data-testid={`button-delete-meal-${name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-2xl font-mono font-semibold" data-testid="text-meal-calories">
          {calories} kcal
        </p>

        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden flex">
          <div
            className="h-full bg-chart-2"
            style={{ width: `${proteinPercent}%` }}
            data-testid="progress-protein"
          />
          <div
            className="h-full bg-chart-3"
            style={{ width: `${carbsPercent}%` }}
            data-testid="progress-carbs"
          />
          <div
            className="h-full bg-chart-1"
            style={{ width: `${fatPercent}%` }}
            data-testid="progress-fat"
          />
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-chart-2" />
            <span className="text-muted-foreground">P: {macros.protein}g</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-chart-3" />
            <span className="text-muted-foreground">C: {macros.carbs}g</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-chart-1" />
            <span className="text-muted-foreground">F: {macros.fat}g</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
