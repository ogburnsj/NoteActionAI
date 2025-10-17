import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { toast } = useToast();
  const [unit, setUnit] = useState("lb");
  const [barWeight, setBarWeight] = useState("45");
  const [calorieGoal, setCalorieGoal] = useState("2000");
  const [proteinGoal, setProteinGoal] = useState("150");
  const [carbsGoal, setCarbsGoal] = useState("200");
  const [fatGoal, setFatGoal] = useState("67");

  const handleSave = () => {
    console.log("Settings saved:", {
      unit,
      barWeight,
      calorieGoal,
      proteinGoal,
      carbsGoal,
      fatGoal
    });
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card className="p-6 space-y-6">
        <div>
          <h2 className="text-xl font-semibold mb-4">Workout Preferences</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Weight Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger id="unit" data-testid="select-unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lb">Pounds (lb)</SelectItem>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bar-weight">Barbell Weight ({unit})</Label>
              <Input
                id="bar-weight"
                type="number"
                value={barWeight}
                onChange={(e) => setBarWeight(e.target.value)}
                data-testid="input-bar-weight"
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Nutrition Goals</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="calorie-goal">Daily Calorie Goal (kcal)</Label>
              <Input
                id="calorie-goal"
                type="number"
                value={calorieGoal}
                onChange={(e) => setCalorieGoal(e.target.value)}
                data-testid="input-calorie-goal"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="protein-goal">Protein (g)</Label>
                <Input
                  id="protein-goal"
                  type="number"
                  value={proteinGoal}
                  onChange={(e) => setProteinGoal(e.target.value)}
                  data-testid="input-protein-goal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs-goal">Carbs (g)</Label>
                <Input
                  id="carbs-goal"
                  type="number"
                  value={carbsGoal}
                  onChange={(e) => setCarbsGoal(e.target.value)}
                  data-testid="input-carbs-goal"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat-goal">Fat (g)</Label>
                <Input
                  id="fat-goal"
                  type="number"
                  value={fatGoal}
                  onChange={(e) => setFatGoal(e.target.value)}
                  data-testid="input-fat-goal"
                />
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleSave} className="w-full" data-testid="button-save-settings">
          Save Settings
        </Button>
      </Card>
    </div>
  );
}
