import { WorkoutChart } from "../WorkoutChart";

export default function WorkoutChartExample() {
  const mockData = [
    { date: "Mon", value: 225 },
    { date: "Tue", value: 235 },
    { date: "Wed", value: 245 },
    { date: "Thu", value: 240 },
    { date: "Fri", value: 255 },
    { date: "Sat", value: 265 },
    { date: "Sun", value: 275 }
  ];

  return (
    <div className="p-6 max-w-4xl">
      <WorkoutChart title="Squat Progress (lb)" data={mockData} />
    </div>
  );
}
