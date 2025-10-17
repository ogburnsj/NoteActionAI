import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { UserPreferences } from "@shared/schema";

export default function Settings() {
  const { toast } = useToast();
  const [unit, setUnit] = useState("lb");
  const [barWeight, setBarWeight] = useState("45");
  const [calorieGoal, setCalorieGoal] = useState("2000");
  const [proteinGoal, setProteinGoal] = useState("150");
  const [carbsGoal, setCarbsGoal] = useState("200");
  const [fatGoal, setFatGoal] = useState("67");

  const { data: preferences, isLoading, error } = useQuery<UserPreferences>({
    queryKey: ["/api/preferences"],
  });

  useEffect(() => {
    if (error && isUnauthorizedError(error as Error)) {
      window.location.href = "/api/login";
    }
  }, [error]);

  useEffect(() => {
    if (preferences) {
      setUnit(preferences.weightUnit);
      setBarWeight(preferences.barWeight);
      setCalorieGoal(preferences.calorieGoal.toString());
      setProteinGoal(preferences.proteinGoal.toString());
      setCarbsGoal(preferences.carbsGoal.toString());
      setFatGoal(preferences.fatGoal.toString());
    }
  }, [preferences]);

  const saveMutation = useMutation({
    mutationFn: async (data: {
      weightUnit: string;
      barWeight: string;
      calorieGoal: number;
      proteinGoal: number;
      carbsGoal: number;
      fatGoal: number;
    }) => {
      const res = await apiRequest("POST", "/api/preferences", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/preferences"] });
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
      } else {
        toast({
          title: "Error",
          description: "Failed to save settings. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const handleSave = () => {
    saveMutation.mutate({
      weightUnit: unit,
      barWeight,
      calorieGoal: parseInt(calorieGoal),
      proteinGoal: parseInt(proteinGoal),
      carbsGoal: parseInt(carbsGoal),
      fatGoal: parseInt(fatGoal),
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-2xl">
        <Skeleton className="h-10 w-48" />
        <Card className="p-6 space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <Skeleton className="h-10 w-full" />
        </Card>
      </div>
    );
  }

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

        <Button 
          onClick={handleSave} 
          className="w-full" 
          data-testid="button-save-settings"
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </Card>
    </div>
  );
}
