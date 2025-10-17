import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface PlateCalculatorProps {
  barWeight: number;
  availablePlates: number[];
  unit: "lb" | "kg";
}

export function PlateCalculator({ barWeight, availablePlates, unit }: PlateCalculatorProps) {
  const [targetWeight, setTargetWeight] = useState("");

  const calculatePlates = (total: number): number[] => {
    const weightPerSide = (total - barWeight) / 2;
    if (weightPerSide <= 0) return [];

    const plates: number[] = [];
    let remaining = weightPerSide;
    const sortedPlates = [...availablePlates].sort((a, b) => b - a);

    for (const plate of sortedPlates) {
      while (remaining >= plate) {
        plates.push(plate);
        remaining -= plate;
      }
    }

    return plates;
  };

  const plates = targetWeight ? calculatePlates(parseFloat(targetWeight)) : [];

  return (
    <Card className="p-6" data-testid="card-plate-calculator">
      <h3 className="text-xl font-semibold mb-4">Plate Calculator</h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="target-weight">Target Weight ({unit})</Label>
          <Input
            id="target-weight"
            type="number"
            placeholder={`Enter weight (bar: ${barWeight}${unit})`}
            value={targetWeight}
            onChange={(e) => setTargetWeight(e.target.value)}
            data-testid="input-target-weight"
          />
        </div>

        {plates.length > 0 && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Plates per side:</p>
            <div className="flex items-center gap-2 p-4 bg-secondary rounded-lg">
              <div className="flex flex-wrap gap-2">
                {plates.map((plate, index) => (
                  <div
                    key={index}
                    className="px-3 py-2 bg-primary text-primary-foreground rounded-md font-mono text-sm font-medium"
                    data-testid={`badge-plate-${index}`}
                  >
                    {plate}{unit}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-2xl font-mono font-semibold text-center" data-testid="text-total-weight">
              Total: {targetWeight}{unit}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
