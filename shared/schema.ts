import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  integer,
  decimal,
  timestamp,
  jsonb,
  index,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// User preferences
export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  weightUnit: varchar("weight_unit", { length: 2 }).notNull().default("lb"), // lb or kg
  barWeight: decimal("bar_weight", { precision: 5, scale: 2 }).notNull().default("45"),
  availablePlates: jsonb("available_plates").notNull().default([45, 35, 25, 10, 5, 2.5]),
  calorieGoal: integer("calorie_goal").notNull().default(2000),
  proteinGoal: integer("protein_goal").notNull().default(150),
  carbsGoal: integer("carbs_goal").notNull().default(200),
  fatGoal: integer("fat_goal").notNull().default(67),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

// Workouts
export const workouts = pgTable("workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  date: date("date").notNull().default(sql`CURRENT_DATE`),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWorkoutSchema = createInsertSchema(workouts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertWorkout = z.infer<typeof insertWorkoutSchema>;
export type Workout = typeof workouts.$inferSelect;

// Exercises
export const exercises = pgTable("exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  workoutId: varchar("workout_id").notNull().references(() => workouts.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  sets: jsonb("sets").notNull(), // Array of { reps: number, weight: number }
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertExerciseSchema = createInsertSchema(exercises).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercises.$inferSelect;

// Meals
export const meals = pgTable("meals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  date: date("date").notNull().default(sql`CURRENT_DATE`),
  time: varchar("time", { length: 5 }).notNull(), // HH:MM format
  calories: integer("calories").notNull(),
  protein: integer("protein").notNull(),
  carbs: integer("carbs").notNull(),
  fat: integer("fat").notNull(),
  barcode: varchar("barcode", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMealSchema = createInsertSchema(meals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMeal = z.infer<typeof insertMealSchema>;
export type Meal = typeof meals.$inferSelect;

// Heart Rate Sessions
export const heartRateSessions = pgTable("heart_rate_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  workoutId: varchar("workout_id").references(() => workouts.id, { onDelete: "set null" }),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  heartRateData: jsonb("heart_rate_data").notNull(), // Array of { timestamp: number, bpm: number, zone: number }
  averageBpm: integer("average_bpm"),
  maxBpm: integer("max_bpm"),
  zoneDistribution: jsonb("zone_distribution"), // { zone1: minutes, zone2: minutes, ... }
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertHeartRateSessionSchema = createInsertSchema(heartRateSessions).omit({
  id: true,
  createdAt: true,
});

export type InsertHeartRateSession = z.infer<typeof insertHeartRateSessionSchema>;
export type HeartRateSession = typeof heartRateSessions.$inferSelect;

// Exercise Library - Master list of common exercises
export const exerciseLibrary = pgTable("exercise_library", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  muscleGroup: varchar("muscle_group", { length: 50 }).notNull(), // Chest, Back, Legs, Shoulders, Arms, Core
  equipment: varchar("equipment", { length: 50 }), // Barbell, Dumbbell, Bodyweight, Machine, etc.
  instructions: text("instructions"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type ExerciseLibraryItem = typeof exerciseLibrary.$inferSelect;

// Workout Templates - Pre-built workout templates
export const workoutTemplates = pgTable("workout_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  difficulty: varchar("difficulty", { length: 20 }).notNull(), // Beginner, Intermediate, Advanced
  duration: integer("duration").notNull(), // Estimated minutes
  category: varchar("category", { length: 50 }), // Strength, Hypertrophy, Power, Conditioning
  createdAt: timestamp("created_at").defaultNow(),
});

export type WorkoutTemplate = typeof workoutTemplates.$inferSelect;

// Template Exercises - Exercises within a template
export const templateExercises = pgTable("template_exercises", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").notNull().references(() => workoutTemplates.id, { onDelete: "cascade" }),
  exerciseLibraryId: varchar("exercise_library_id").references(() => exerciseLibrary.id, { onDelete: "set null" }),
  exerciseName: text("exercise_name").notNull(), // Fallback if not from library
  orderIndex: integer("order_index").notNull(),
  sets: integer("sets").notNull(),
  reps: text("reps").notNull(), // Can be "8-12" or "5" or "AMRAP"
  restSeconds: integer("rest_seconds"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type TemplateExercise = typeof templateExercises.$inferSelect;

// Programs - Structured multi-week programs
export const programs = pgTable("programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  difficulty: varchar("difficulty", { length: 20 }).notNull(), // Beginner, Intermediate, Advanced
  durationWeeks: integer("duration_weeks").notNull(),
  daysPerWeek: integer("days_per_week").notNull(),
  goal: varchar("goal", { length: 50 }), // Strength, Hypertrophy, Fat Loss, General Fitness
  createdAt: timestamp("created_at").defaultNow(),
});

export type Program = typeof programs.$inferSelect;

// Program Workouts - Scheduled workouts within a program
export const programWorkouts = pgTable("program_workouts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  programId: varchar("program_id").notNull().references(() => programs.id, { onDelete: "cascade" }),
  templateId: varchar("template_id").notNull().references(() => workoutTemplates.id, { onDelete: "cascade" }),
  weekNumber: integer("week_number").notNull(),
  dayNumber: integer("day_number").notNull(), // 1-7 for day of week
  dayName: varchar("day_name", { length: 20 }), // Monday, Tuesday, etc. or Day 1, Day 2
  createdAt: timestamp("created_at").defaultNow(),
});

export type ProgramWorkout = typeof programWorkouts.$inferSelect;

// User Programs - Track user enrollment and progress in programs
export const userPrograms = pgTable("user_programs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  programId: varchar("program_id").notNull().references(() => programs.id, { onDelete: "cascade" }),
  startDate: date("start_date").notNull(),
  currentWeek: integer("current_week").notNull().default(1),
  completedWorkouts: jsonb("completed_workouts").notNull().default([]), // Array of { weekNumber, dayNumber, workoutId, completedDate }
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, paused, completed
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserProgramSchema = createInsertSchema(userPrograms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUserProgram = z.infer<typeof insertUserProgramSchema>;
export type UserProgram = typeof userPrograms.$inferSelect;
