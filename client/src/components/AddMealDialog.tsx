import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

export function AddMealDialog() {
  const [open, setOpen] = useState(false);
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const handleSubmit = () => {
    console.log("Meal added:", { mealName, calories, protein, carbs, fat });
    setOpen(false);
    setMealName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-meal">
          <Plus className="h-4 w-4 mr-2" />
          Add Meal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md" data-testid="dialog-add-meal">
        <DialogHeader>
          <DialogTitle>Add Meal</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="meal-name">Meal Name</Label>
            <Input
              id="meal-name"
              placeholder="e.g., Grilled Chicken & Rice"
              value={mealName}
              onChange={(e) => setMealName(e.target.value)}
              data-testid="input-meal-name"
            />
          </div>

          <div>
            <Label htmlFor="calories">Calories</Label>
            <Input
              id="calories"
              type="number"
              placeholder="kcal"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              data-testid="input-calories"
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                placeholder="g"
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                data-testid="input-protein"
              />
            </div>
            <div>
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                placeholder="g"
                value={carbs}
                onChange={(e) => setCarbs(e.target.value)}
                data-testid="input-carbs"
              />
            </div>
            <div>
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                placeholder="g"
                value={fat}
                onChange={(e) => setFat(e.target.value)}
                data-testid="input-fat"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1" data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="flex-1" data-testid="button-save-meal">
              Save Meal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
