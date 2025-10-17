import { WorkoutChart } from "@/components/WorkoutChart";

//todo: remove mock functionality
const mockSquatData = [
  { date: "Week 1", value: 225 },
  { date: "Week 2", value: 235 },
  { date: "Week 3", value: 245 },
  { date: "Week 4", value: 250 },
  { date: "Week 5", value: 260 },
  { date: "Week 6", value: 270 },
  { date: "Week 7", value: 275 }
];

const mockBenchData = [
  { date: "Week 1", value: 155 },
  { date: "Week 2", value: 160 },
  { date: "Week 3", value: 165 },
  { date: "Week 4", value: 170 },
  { date: "Week 5", value: 175 },
  { date: "Week 6", value: 180 },
  { date: "Week 7", value: 185 }
];

const mockCaloriesData = [
  { date: "Mon", value: 1950 },
  { date: "Tue", value: 2100 },
  { date: "Wed", value: 1850 },
  { date: "Thu", value: 2050 },
  { date: "Fri", value: 1900 },
  { date: "Sat", value: 2200 },
  { date: "Sun", value: 2000 }
];

export default function Progress() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Progress Tracking</h1>

      <div className="space-y-6">
        <WorkoutChart title="Squat Progress (lb)" data={mockSquatData} />
        <WorkoutChart title="Bench Press Progress (lb)" data={mockBenchData} />
        <WorkoutChart title="Weekly Calorie Intake" data={mockCaloriesData} />
      </div>
    </div>
  );
}
