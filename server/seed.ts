import { db } from "./db";
import {
  exerciseLibrary,
  workoutTemplates,
  templateExercises,
  programs,
  programWorkouts,
} from "@shared/schema";

// Exercise Library Data - 50+ common exercises
const exercisesData = [
  // Chest
  { name: "Barbell Bench Press", muscleGroup: "Chest", equipment: "Barbell", instructions: "Lie on bench, lower bar to chest, press up" },
  { name: "Incline Dumbbell Press", muscleGroup: "Chest", equipment: "Dumbbell", instructions: "Press dumbbells on incline bench" },
  { name: "Decline Bench Press", muscleGroup: "Chest", equipment: "Barbell", instructions: "Press on decline bench" },
  { name: "Dumbbell Flyes", muscleGroup: "Chest", equipment: "Dumbbell", instructions: "Fly dumbbells with slight bend in elbows" },
  { name: "Cable Crossover", muscleGroup: "Chest", equipment: "Cable", instructions: "Cross cables at chest level" },
  { name: "Push-Ups", muscleGroup: "Chest", equipment: "Bodyweight", instructions: "Standard push-up form" },
  { name: "Dips (Chest)", muscleGroup: "Chest", equipment: "Bodyweight", instructions: "Lean forward for chest emphasis" },
  
  // Back
  { name: "Deadlift", muscleGroup: "Back", equipment: "Barbell", instructions: "Hip hinge, pull bar from floor to standing" },
  { name: "Barbell Row", muscleGroup: "Back", equipment: "Barbell", instructions: "Bent over row, pull to lower chest" },
  { name: "Pull-Ups", muscleGroup: "Back", equipment: "Bodyweight", instructions: "Pull chin over bar" },
  { name: "Lat Pulldown", muscleGroup: "Back", equipment: "Cable", instructions: "Pull bar to upper chest" },
  { name: "Seated Cable Row", muscleGroup: "Back", equipment: "Cable", instructions: "Row to lower chest, squeeze shoulder blades" },
  { name: "T-Bar Row", muscleGroup: "Back", equipment: "Barbell", instructions: "Row with V-handle attachment" },
  { name: "Dumbbell Row", muscleGroup: "Back", equipment: "Dumbbell", instructions: "One-arm row on bench" },
  { name: "Face Pulls", muscleGroup: "Back", equipment: "Cable", instructions: "Pull rope to face, external rotation" },
  
  // Legs
  { name: "Barbell Squat", muscleGroup: "Legs", equipment: "Barbell", instructions: "Squat to parallel or below" },
  { name: "Front Squat", muscleGroup: "Legs", equipment: "Barbell", instructions: "Squat with bar on front delts" },
  { name: "Romanian Deadlift", muscleGroup: "Legs", equipment: "Barbell", instructions: "Hip hinge, lower bar to shins" },
  { name: "Leg Press", muscleGroup: "Legs", equipment: "Machine", instructions: "Press platform with legs" },
  { name: "Bulgarian Split Squat", muscleGroup: "Legs", equipment: "Dumbbell", instructions: "Single leg squat, rear foot elevated" },
  { name: "Leg Curl", muscleGroup: "Legs", equipment: "Machine", instructions: "Curl heels to glutes" },
  { name: "Leg Extension", muscleGroup: "Legs", equipment: "Machine", instructions: "Extend legs from bent position" },
  { name: "Calf Raise", muscleGroup: "Legs", equipment: "Machine", instructions: "Raise heels, squeeze calves" },
  { name: "Lunges", muscleGroup: "Legs", equipment: "Dumbbell", instructions: "Step forward, lower back knee" },
  
  // Shoulders
  { name: "Overhead Press", muscleGroup: "Shoulders", equipment: "Barbell", instructions: "Press bar overhead from shoulders" },
  { name: "Dumbbell Shoulder Press", muscleGroup: "Shoulders", equipment: "Dumbbell", instructions: "Press dumbbells overhead" },
  { name: "Lateral Raise", muscleGroup: "Shoulders", equipment: "Dumbbell", instructions: "Raise arms to sides" },
  { name: "Front Raise", muscleGroup: "Shoulders", equipment: "Dumbbell", instructions: "Raise arms to front" },
  { name: "Rear Delt Flyes", muscleGroup: "Shoulders", equipment: "Dumbbell", instructions: "Bent over, fly arms back" },
  { name: "Arnold Press", muscleGroup: "Shoulders", equipment: "Dumbbell", instructions: "Press with rotation" },
  { name: "Upright Row", muscleGroup: "Shoulders", equipment: "Barbell", instructions: "Pull bar to chin, elbows high" },
  
  // Arms - Biceps
  { name: "Barbell Curl", muscleGroup: "Arms", equipment: "Barbell", instructions: "Curl bar to shoulders" },
  { name: "Dumbbell Curl", muscleGroup: "Arms", equipment: "Dumbbell", instructions: "Alternate or simultaneous curls" },
  { name: "Hammer Curl", muscleGroup: "Arms", equipment: "Dumbbell", instructions: "Curl with neutral grip" },
  { name: "Preacher Curl", muscleGroup: "Arms", equipment: "Barbell", instructions: "Curl on preacher bench" },
  { name: "Cable Curl", muscleGroup: "Arms", equipment: "Cable", instructions: "Curl with cable attachment" },
  
  // Arms - Triceps
  { name: "Close-Grip Bench Press", muscleGroup: "Arms", equipment: "Barbell", instructions: "Bench press with narrow grip" },
  { name: "Tricep Pushdown", muscleGroup: "Arms", equipment: "Cable", instructions: "Push cable down, extend elbows" },
  { name: "Overhead Tricep Extension", muscleGroup: "Arms", equipment: "Dumbbell", instructions: "Extend dumbbell overhead" },
  { name: "Skull Crushers", muscleGroup: "Arms", equipment: "Barbell", instructions: "Lower bar to forehead, extend" },
  { name: "Dips (Triceps)", muscleGroup: "Arms", equipment: "Bodyweight", instructions: "Upright dips for triceps" },
  
  // Core
  { name: "Plank", muscleGroup: "Core", equipment: "Bodyweight", instructions: "Hold push-up position" },
  { name: "Hanging Leg Raise", muscleGroup: "Core", equipment: "Bodyweight", instructions: "Raise legs while hanging" },
  { name: "Ab Wheel Rollout", muscleGroup: "Core", equipment: "Ab Wheel", instructions: "Roll wheel forward, return" },
  { name: "Russian Twist", muscleGroup: "Core", equipment: "Dumbbell", instructions: "Twist torso side to side" },
  { name: "Cable Crunch", muscleGroup: "Core", equipment: "Cable", instructions: "Crunch with rope attachment" },
  { name: "Side Plank", muscleGroup: "Core", equipment: "Bodyweight", instructions: "Hold sideways plank position" },
  { name: "Mountain Climbers", muscleGroup: "Core", equipment: "Bodyweight", instructions: "Alternate knee drives in plank" },
  { name: "Bicycle Crunches", muscleGroup: "Core", equipment: "Bodyweight", instructions: "Alternate elbow to opposite knee" },
  { name: "Dragon Flag", muscleGroup: "Core", equipment: "Bodyweight", instructions: "Advanced core exercise, lower body under control" },
];

async function seedExerciseLibrary() {
  console.log("Seeding exercise library...");
  
  // Check if already seeded
  const existing = await db.select().from(exerciseLibrary).limit(1);
  if (existing.length > 0) {
    console.log("Exercise library already seeded, skipping...");
    return;
  }
  
  await db.insert(exerciseLibrary).values(exercisesData);
  console.log(`Seeded ${exercisesData.length} exercises`);
}

async function seedWorkoutTemplates() {
  console.log("Seeding workout templates...");
  
  // Check if already seeded
  const existing = await db.select().from(workoutTemplates).limit(1);
  if (existing.length > 0) {
    console.log("Workout templates already seeded, skipping...");
    return;
  }
  
  // Get exercise IDs for reference
  const exercises = await db.select().from(exerciseLibrary);
  const getExerciseId = (name: string) => exercises.find(e => e.name === name)?.id || null;
  
  // Template 1: Push Day
  const [pushTemplate] = await db.insert(workoutTemplates).values({
    name: "Push Day (Chest, Shoulders, Triceps)",
    description: "Compound and isolation exercises for pushing muscles",
    difficulty: "Intermediate",
    duration: 60,
    category: "Hypertrophy",
  }).returning();
  
  await db.insert(templateExercises).values([
    { templateId: pushTemplate.id, exerciseLibraryId: getExerciseId("Barbell Bench Press"), exerciseName: "Barbell Bench Press", orderIndex: 1, sets: 4, reps: "6-8", restSeconds: 180 },
    { templateId: pushTemplate.id, exerciseLibraryId: getExerciseId("Incline Dumbbell Press"), exerciseName: "Incline Dumbbell Press", orderIndex: 2, sets: 3, reps: "8-10", restSeconds: 120 },
    { templateId: pushTemplate.id, exerciseLibraryId: getExerciseId("Overhead Press"), exerciseName: "Overhead Press", orderIndex: 3, sets: 3, reps: "8-10", restSeconds: 120 },
    { templateId: pushTemplate.id, exerciseLibraryId: getExerciseId("Lateral Raise"), exerciseName: "Lateral Raise", orderIndex: 4, sets: 3, reps: "12-15", restSeconds: 60 },
    { templateId: pushTemplate.id, exerciseLibraryId: getExerciseId("Tricep Pushdown"), exerciseName: "Tricep Pushdown", orderIndex: 5, sets: 3, reps: "12-15", restSeconds: 60 },
  ]);
  
  // Template 2: Pull Day
  const [pullTemplate] = await db.insert(workoutTemplates).values({
    name: "Pull Day (Back, Biceps)",
    description: "Compound and isolation exercises for pulling muscles",
    difficulty: "Intermediate",
    duration: 60,
    category: "Hypertrophy",
  }).returning();
  
  await db.insert(templateExercises).values([
    { templateId: pullTemplate.id, exerciseLibraryId: getExerciseId("Deadlift"), exerciseName: "Deadlift", orderIndex: 1, sets: 4, reps: "5-6", restSeconds: 180 },
    { templateId: pullTemplate.id, exerciseLibraryId: getExerciseId("Pull-Ups"), exerciseName: "Pull-Ups", orderIndex: 2, sets: 3, reps: "8-12", restSeconds: 120 },
    { templateId: pullTemplate.id, exerciseLibraryId: getExerciseId("Barbell Row"), exerciseName: "Barbell Row", orderIndex: 3, sets: 3, reps: "8-10", restSeconds: 120 },
    { templateId: pullTemplate.id, exerciseLibraryId: getExerciseId("Face Pulls"), exerciseName: "Face Pulls", orderIndex: 4, sets: 3, reps: "15-20", restSeconds: 60 },
    { templateId: pullTemplate.id, exerciseLibraryId: getExerciseId("Barbell Curl"), exerciseName: "Barbell Curl", orderIndex: 5, sets: 3, reps: "10-12", restSeconds: 60 },
  ]);
  
  // Template 3: Leg Day
  const [legTemplate] = await db.insert(workoutTemplates).values({
    name: "Leg Day (Quads, Hamstrings, Glutes)",
    description: "Complete lower body workout",
    difficulty: "Intermediate",
    duration: 75,
    category: "Hypertrophy",
  }).returning();
  
  await db.insert(templateExercises).values([
    { templateId: legTemplate.id, exerciseLibraryId: getExerciseId("Barbell Squat"), exerciseName: "Barbell Squat", orderIndex: 1, sets: 4, reps: "6-8", restSeconds: 180 },
    { templateId: legTemplate.id, exerciseLibraryId: getExerciseId("Romanian Deadlift"), exerciseName: "Romanian Deadlift", orderIndex: 2, sets: 3, reps: "8-10", restSeconds: 120 },
    { templateId: legTemplate.id, exerciseLibraryId: getExerciseId("Leg Press"), exerciseName: "Leg Press", orderIndex: 3, sets: 3, reps: "10-12", restSeconds: 120 },
    { templateId: legTemplate.id, exerciseLibraryId: getExerciseId("Leg Curl"), exerciseName: "Leg Curl", orderIndex: 4, sets: 3, reps: "12-15", restSeconds: 60 },
    { templateId: legTemplate.id, exerciseLibraryId: getExerciseId("Calf Raise"), exerciseName: "Calf Raise", orderIndex: 5, sets: 4, reps: "15-20", restSeconds: 60 },
  ]);
  
  // Template 4: Upper Body
  const [upperTemplate] = await db.insert(workoutTemplates).values({
    name: "Upper Body (Chest, Back, Arms)",
    description: "Complete upper body workout for upper/lower split",
    difficulty: "Beginner",
    duration: 60,
    category: "Strength",
  }).returning();
  
  await db.insert(templateExercises).values([
    { templateId: upperTemplate.id, exerciseLibraryId: getExerciseId("Barbell Bench Press"), exerciseName: "Barbell Bench Press", orderIndex: 1, sets: 3, reps: "8-10", restSeconds: 120 },
    { templateId: upperTemplate.id, exerciseLibraryId: getExerciseId("Barbell Row"), exerciseName: "Barbell Row", orderIndex: 2, sets: 3, reps: "8-10", restSeconds: 120 },
    { templateId: upperTemplate.id, exerciseLibraryId: getExerciseId("Overhead Press"), exerciseName: "Overhead Press", orderIndex: 3, sets: 3, reps: "8-10", restSeconds: 120 },
    { templateId: upperTemplate.id, exerciseLibraryId: getExerciseId("Lat Pulldown"), exerciseName: "Lat Pulldown", orderIndex: 4, sets: 3, reps: "10-12", restSeconds: 90 },
    { templateId: upperTemplate.id, exerciseLibraryId: getExerciseId("Dumbbell Curl"), exerciseName: "Dumbbell Curl", orderIndex: 5, sets: 2, reps: "12-15", restSeconds: 60 },
    { templateId: upperTemplate.id, exerciseLibraryId: getExerciseId("Tricep Pushdown"), exerciseName: "Tricep Pushdown", orderIndex: 6, sets: 2, reps: "12-15", restSeconds: 60 },
  ]);
  
  // Template 5: Lower Body
  const [lowerTemplate] = await db.insert(workoutTemplates).values({
    name: "Lower Body (Legs, Glutes)",
    description: "Complete lower body workout for upper/lower split",
    difficulty: "Beginner",
    duration: 60,
    category: "Strength",
  }).returning();
  
  await db.insert(templateExercises).values([
    { templateId: lowerTemplate.id, exerciseLibraryId: getExerciseId("Barbell Squat"), exerciseName: "Barbell Squat", orderIndex: 1, sets: 3, reps: "8-10", restSeconds: 180 },
    { templateId: lowerTemplate.id, exerciseLibraryId: getExerciseId("Romanian Deadlift"), exerciseName: "Romanian Deadlift", orderIndex: 2, sets: 3, reps: "8-10", restSeconds: 120 },
    { templateId: lowerTemplate.id, exerciseLibraryId: getExerciseId("Bulgarian Split Squat"), exerciseName: "Bulgarian Split Squat", orderIndex: 3, sets: 3, reps: "10-12", restSeconds: 90 },
    { templateId: lowerTemplate.id, exerciseLibraryId: getExerciseId("Leg Curl"), exerciseName: "Leg Curl", orderIndex: 4, sets: 3, reps: "12-15", restSeconds: 60 },
    { templateId: lowerTemplate.id, exerciseLibraryId: getExerciseId("Calf Raise"), exerciseName: "Calf Raise", orderIndex: 5, sets: 3, reps: "15-20", restSeconds: 60 },
  ]);
  
  // Template 6: Full Body
  const [fullBodyTemplate] = await db.insert(workoutTemplates).values({
    name: "Full Body Workout",
    description: "Hit all major muscle groups in one session",
    difficulty: "Beginner",
    duration: 50,
    category: "Strength",
  }).returning();
  
  await db.insert(templateExercises).values([
    { templateId: fullBodyTemplate.id, exerciseLibraryId: getExerciseId("Barbell Squat"), exerciseName: "Barbell Squat", orderIndex: 1, sets: 3, reps: "8-10", restSeconds: 120 },
    { templateId: fullBodyTemplate.id, exerciseLibraryId: getExerciseId("Barbell Bench Press"), exerciseName: "Barbell Bench Press", orderIndex: 2, sets: 3, reps: "8-10", restSeconds: 120 },
    { templateId: fullBodyTemplate.id, exerciseLibraryId: getExerciseId("Barbell Row"), exerciseName: "Barbell Row", orderIndex: 3, sets: 3, reps: "8-10", restSeconds: 120 },
    { templateId: fullBodyTemplate.id, exerciseLibraryId: getExerciseId("Overhead Press"), exerciseName: "Overhead Press", orderIndex: 4, sets: 2, reps: "10-12", restSeconds: 90 },
    { templateId: fullBodyTemplate.id, exerciseLibraryId: getExerciseId("Romanian Deadlift"), exerciseName: "Romanian Deadlift", orderIndex: 5, sets: 2, reps: "10-12", restSeconds: 90 },
  ]);
  
  console.log("Seeded 6 workout templates with exercises");
  
  return { pushTemplate, pullTemplate, legTemplate, upperTemplate, lowerTemplate, fullBodyTemplate };
}

async function seedPrograms() {
  console.log("Seeding programs...");
  
  // Check if already seeded
  const existing = await db.select().from(programs).limit(1);
  if (existing.length > 0) {
    console.log("Programs already seeded, skipping...");
    return;
  }
  
  const templates = await db.select().from(workoutTemplates);
  const getTemplateId = (name: string) => templates.find(t => t.name.includes(name))?.id || templates[0].id;
  
  // Program 1: 2-Week Push/Pull/Legs
  const [pplProgram] = await db.insert(programs).values({
    name: "2-Week Push/Pull/Legs",
    description: "Classic 6-day PPL split for muscle building",
    difficulty: "Intermediate",
    durationWeeks: 2,
    daysPerWeek: 6,
    goal: "Hypertrophy",
  }).returning();
  
  // Week 1 schedule
  await db.insert(programWorkouts).values([
    { programId: pplProgram.id, templateId: getTemplateId("Push"), weekNumber: 1, dayNumber: 1, dayName: "Monday" },
    { programId: pplProgram.id, templateId: getTemplateId("Pull"), weekNumber: 1, dayNumber: 2, dayName: "Tuesday" },
    { programId: pplProgram.id, templateId: getTemplateId("Leg"), weekNumber: 1, dayNumber: 3, dayName: "Wednesday" },
    { programId: pplProgram.id, templateId: getTemplateId("Push"), weekNumber: 1, dayNumber: 4, dayName: "Thursday" },
    { programId: pplProgram.id, templateId: getTemplateId("Pull"), weekNumber: 1, dayNumber: 5, dayName: "Friday" },
    { programId: pplProgram.id, templateId: getTemplateId("Leg"), weekNumber: 1, dayNumber: 6, dayName: "Saturday" },
  ]);
  
  // Week 2 schedule (same as week 1)
  await db.insert(programWorkouts).values([
    { programId: pplProgram.id, templateId: getTemplateId("Push"), weekNumber: 2, dayNumber: 1, dayName: "Monday" },
    { programId: pplProgram.id, templateId: getTemplateId("Pull"), weekNumber: 2, dayNumber: 2, dayName: "Tuesday" },
    { programId: pplProgram.id, templateId: getTemplateId("Leg"), weekNumber: 2, dayNumber: 3, dayName: "Wednesday" },
    { programId: pplProgram.id, templateId: getTemplateId("Push"), weekNumber: 2, dayNumber: 4, dayName: "Thursday" },
    { programId: pplProgram.id, templateId: getTemplateId("Pull"), weekNumber: 2, dayNumber: 5, dayName: "Friday" },
    { programId: pplProgram.id, templateId: getTemplateId("Leg"), weekNumber: 2, dayNumber: 6, dayName: "Saturday" },
  ]);
  
  // Program 2: 4-Week Upper/Lower Split
  const [upperLowerProgram] = await db.insert(programs).values({
    name: "4-Week Upper/Lower Split",
    description: "Classic 4-day upper/lower split for beginners and intermediates",
    difficulty: "Beginner",
    durationWeeks: 4,
    daysPerWeek: 4,
    goal: "Strength",
  }).returning();
  
  // Create schedule for 4 weeks
  for (let week = 1; week <= 4; week++) {
    await db.insert(programWorkouts).values([
      { programId: upperLowerProgram.id, templateId: getTemplateId("Upper"), weekNumber: week, dayNumber: 1, dayName: "Monday" },
      { programId: upperLowerProgram.id, templateId: getTemplateId("Lower"), weekNumber: week, dayNumber: 2, dayName: "Tuesday" },
      { programId: upperLowerProgram.id, templateId: getTemplateId("Upper"), weekNumber: week, dayNumber: 4, dayName: "Thursday" },
      { programId: upperLowerProgram.id, templateId: getTemplateId("Lower"), weekNumber: week, dayNumber: 5, dayName: "Friday" },
    ]);
  }
  
  // Program 3: 4-Week Full Body
  const [fullBodyProgram] = await db.insert(programs).values({
    name: "4-Week Full Body",
    description: "3-day full body routine perfect for beginners",
    difficulty: "Beginner",
    durationWeeks: 4,
    daysPerWeek: 3,
    goal: "General Fitness",
  }).returning();
  
  // Create schedule for 4 weeks
  for (let week = 1; week <= 4; week++) {
    await db.insert(programWorkouts).values([
      { programId: fullBodyProgram.id, templateId: getTemplateId("Full Body"), weekNumber: week, dayNumber: 1, dayName: "Monday" },
      { programId: fullBodyProgram.id, templateId: getTemplateId("Full Body"), weekNumber: week, dayNumber: 3, dayName: "Wednesday" },
      { programId: fullBodyProgram.id, templateId: getTemplateId("Full Body"), weekNumber: week, dayNumber: 5, dayName: "Friday" },
    ]);
  }
  
  console.log("Seeded 3 programs with workout schedules");
}

export async function seedDatabase() {
  try {
    await seedExerciseLibrary();
    await seedWorkoutTemplates();
    await seedPrograms();
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
