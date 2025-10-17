import { ProgressBar } from "../ProgressBar";

export default function ProgressBarExample() {
  return (
    <div className="space-y-4 p-6 max-w-md">
      <ProgressBar label="Calories" current={1650} goal={2000} unit="kcal" color="primary" />
      <ProgressBar label="Protein" current={120} goal={150} unit="g" color="success" />
      <ProgressBar label="Carbs" current={180} goal={200} unit="g" color="warning" />
    </div>
  );
}
