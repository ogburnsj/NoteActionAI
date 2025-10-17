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
