import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Scan } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { BarcodeScanner } from "@/components/BarcodeScanner";

export function AddMealDialog() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const createMealMutation = useMutation({
    mutationFn: async (data: {
      name: string;
      date: string;
      time: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }) => {
      const res = await apiRequest("POST", "/api/meals", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/meals"] });
      toast({
        title: "Success",
        description: "Meal added successfully!",
      });
      setOpen(false);
      setShowScanner(false);
      setMealName("");
      setCalories("");
      setProtein("");
      setCarbs("");
      setFat("");
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
      } else {
        toast({
          title: "Error",
          description: "Failed to add meal. Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = () => {
    if (!mealName.trim() || !calories || !protein || !carbs || !fat) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const time = now.toTimeString().slice(0, 5);

    createMealMutation.mutate({
      name: mealName,
      date: today,
      time,
      calories: parseInt(calories),
      protein: parseInt(protein),
      carbs: parseInt(carbs),
      fat: parseInt(fat),
    });
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
          {!showScanner ? (
            <>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowScanner(true)}
                  className="flex-1"
                  data-testid="button-scan-barcode"
                >
                  <Scan className="h-4 w-4 mr-2" />
                  Scan Barcode
                </Button>
              </div>

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
                <Button 
                  variant="outline" 
                  onClick={() => setOpen(false)} 
                  className="flex-1" 
                  data-testid="button-cancel"
                  disabled={createMealMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  className="flex-1" 
                  data-testid="button-save-meal"
                  disabled={createMealMutation.isPending}
                >
                  {createMealMutation.isPending ? "Saving..." : "Save Meal"}
                </Button>
              </div>
            </>
          ) : (
            <BarcodeScanner
              onScan={(productData) => {
                setMealName(productData.name);
                setCalories(productData.calories.toString());
                setProtein(productData.protein.toString());
                setCarbs(productData.carbs.toString());
                setFat(productData.fat.toString());
                setShowScanner(false);
              }}
              onClose={() => setShowScanner(false)}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
