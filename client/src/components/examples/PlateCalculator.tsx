import { PlateCalculator } from "../PlateCalculator";

export default function PlateCalculatorExample() {
  return (
    <div className="p-6 max-w-2xl">
      <PlateCalculator
        barWeight={45}
        availablePlates={[45, 35, 25, 10, 5, 2.5]}
        unit="lb"
      />
    </div>
  );
}
