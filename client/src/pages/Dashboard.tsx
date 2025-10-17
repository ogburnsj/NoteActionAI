import { StatCard } from "@/components/StatCard";
import { ProgressBar } from "@/components/ProgressBar";
import { ExerciseCard } from "@/components/ExerciseCard";
import { MealCard } from "@/components/MealCard";
import { WorkoutChart } from "@/components/WorkoutChart";
import { PlateCalculator } from "@/components/PlateCalculator";
import { AddWorkoutDialog } from "@/components/AddWorkoutDialog";
import { AddMealDialog } from "@/components/AddMealDialog";
import { Dumbbell, TrendingUp, Flame, Target } from "lucide-react";
import { Card } from "@/components/ui/card";

//todo: remove mock functionality
const mockWorkoutData = [
  { date: "Mon", value: 225 },
  { date: "Tue", value: 235 },
  { date: "Wed", value: 245 },
  { date: "Thu", value: 240 },
  { date: "Fri", value: 255 },
  { date: "Sat", value: 265 },
  { date: "Sun", value: 275 }
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Workouts"
          value="47"
          subtitle="This month"
          icon={Dumbbell}
          trend={{ value: "12% from last month", isPositive: true }}
        />
        <StatCard
          title="PR Lifts"
          value="8"
          subtitle="New records"
          icon={TrendingUp}
          trend={{ value: "3 this week", isPositive: true }}
        />
        <StatCard
          title="Calories Today"
          value="1,650"
          subtitle="of 2,000 kcal"
          icon={Flame}
        />
        <StatCard
          title="Weekly Goal"
          value="5/6"
          subtitle="Workouts complete"
          icon={Target}
        />
      </div>

      {/* Nutrition Progress */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Today's Nutrition</h2>
          <AddMealDialog />
        </div>
        <div className="space-y-4">
          <ProgressBar label="Calories" current={1650} goal={2000} unit="kcal" color="primary" />
          <ProgressBar label="Protein" current={120} goal={150} unit="g" color="success" />
          <ProgressBar label="Carbs" current={180} goal={200} unit="g" color="warning" />
          <ProgressBar label="Fat" current={45} goal={67} unit="g" color="primary" />
        </div>
      </Card>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Workouts */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Workouts</h2>
            <AddWorkoutDialog />
          </div>
          <div className="space-y-4">
            <ExerciseCard
              name="Barbell Squat"
              sets={[
                { reps: 10, weight: 135 },
                { reps: 8, weight: 185 },
                { reps: 6, weight: 225 }
              ]}
              unit="lb"
              onEdit={() => console.log("Edit squat")}
              onDelete={() => console.log("Delete squat")}
            />
            <ExerciseCard
              name="Bench Press"
              sets={[
                { reps: 10, weight: 135 },
                { reps: 8, weight: 155 },
                { reps: 6, weight: 175 }
              ]}
              unit="lb"
              onEdit={() => console.log("Edit bench")}
              onDelete={() => console.log("Delete bench")}
            />
          </div>
        </div>

        {/* Plate Calculator */}
        <PlateCalculator
          barWeight={45}
          availablePlates={[45, 35, 25, 10, 5, 2.5]}
          unit="lb"
        />
      </div>

      {/* Recent Meals */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Today's Meals</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MealCard
            name="Breakfast Bowl"
            time="8:30 AM"
            calories={450}
            macros={{ protein: 25, carbs: 55, fat: 12 }}
            onEdit={() => console.log("Edit breakfast")}
            onDelete={() => console.log("Delete breakfast")}
          />
          <MealCard
            name="Grilled Chicken & Rice"
            time="12:30 PM"
            calories={650}
            macros={{ protein: 45, carbs: 60, fat: 18 }}
            onEdit={() => console.log("Edit lunch")}
            onDelete={() => console.log("Delete lunch")}
          />
          <MealCard
            name="Protein Shake"
            time="3:00 PM"
            calories={200}
            macros={{ protein: 30, carbs: 15, fat: 5 }}
            onEdit={() => console.log("Edit snack")}
            onDelete={() => console.log("Delete snack")}
          />
          <MealCard
            name="Salmon & Vegetables"
            time="6:45 PM"
            calories={550}
            macros={{ protein: 40, carbs: 35, fat: 25 }}
            onEdit={() => console.log("Edit dinner")}
            onDelete={() => console.log("Delete dinner")}
          />
        </div>
      </div>

      {/* Progress Chart */}
      <WorkoutChart title="Squat Progress (lb)" data={mockWorkoutData} />
    </div>
  );
}
