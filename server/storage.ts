import {
  users,
  userPreferences,
  workouts,
  exercises,
  meals,
  heartRateSessions,
  type User,
  type UpsertUser,
  type UserPreferences,
  type InsertUserPreferences,
  type Workout,
  type InsertWorkout,
  type Exercise,
  type InsertExercise,
  type Meal,
  type InsertMeal,
  type HeartRateSession,
  type InsertHeartRateSession,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // User Preferences
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  upsertUserPreferences(prefs: InsertUserPreferences): Promise<UserPreferences>;

  // Workouts
  getWorkouts(userId: string): Promise<Workout[]>;
  getWorkout(id: string, userId: string): Promise<Workout | undefined>;
  createWorkout(workout: InsertWorkout): Promise<Workout>;
  updateWorkout(id: string, workout: Partial<InsertWorkout>, userId: string): Promise<Workout | undefined>;
  deleteWorkout(id: string, userId: string): Promise<void>;

  // Exercises
  getExercisesByWorkout(workoutId: string): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  updateExercise(id: string, exercise: Partial<InsertExercise>): Promise<Exercise | undefined>;
  deleteExercise(id: string): Promise<void>;

  // Meals
  getMealsByDate(userId: string, date: string): Promise<Meal[]>;
  getMeals(userId: string, limit?: number): Promise<Meal[]>;
  createMeal(meal: InsertMeal): Promise<Meal>;
  updateMeal(id: string, meal: Partial<InsertMeal>, userId: string): Promise<Meal | undefined>;
  deleteMeal(id: string, userId: string): Promise<void>;

  // Heart Rate Sessions
  getHeartRateSessions(userId: string): Promise<HeartRateSession[]>;
  createHeartRateSession(session: InsertHeartRateSession): Promise<HeartRateSession>;
  updateHeartRateSession(id: string, session: Partial<InsertHeartRateSession>): Promise<HeartRateSession | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // User Preferences
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    const [prefs] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));
    return prefs;
  }

  async upsertUserPreferences(prefs: InsertUserPreferences): Promise<UserPreferences> {
    const existing = await this.getUserPreferences(prefs.userId);
    
    if (existing) {
      const [updated] = await db
        .update(userPreferences)
        .set({ ...prefs, updatedAt: new Date() })
        .where(eq(userPreferences.userId, prefs.userId))
        .returning();
      return updated;
    } else {
      const [created] = await db
        .insert(userPreferences)
        .values(prefs)
        .returning();
      return created;
    }
  }

  // Workouts
  async getWorkouts(userId: string): Promise<Workout[]> {
    return await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId))
      .orderBy(desc(workouts.date));
  }

  async getWorkout(id: string, userId: string): Promise<Workout | undefined> {
    const [workout] = await db
      .select()
      .from(workouts)
      .where(and(eq(workouts.id, id), eq(workouts.userId, userId)));
    return workout;
  }

  async createWorkout(workout: InsertWorkout): Promise<Workout> {
    const [created] = await db.insert(workouts).values(workout).returning();
    return created;
  }

  async updateWorkout(id: string, workout: Partial<InsertWorkout>, userId: string): Promise<Workout | undefined> {
    const [updated] = await db
      .update(workouts)
      .set({ ...workout, updatedAt: new Date() })
      .where(and(eq(workouts.id, id), eq(workouts.userId, userId)))
      .returning();
    return updated;
  }

  async deleteWorkout(id: string, userId: string): Promise<void> {
    await db
      .delete(workouts)
      .where(and(eq(workouts.id, id), eq(workouts.userId, userId)));
  }

  // Exercises
  async getExercisesByWorkout(workoutId: string): Promise<Exercise[]> {
    return await db
      .select()
      .from(exercises)
      .where(eq(exercises.workoutId, workoutId))
      .orderBy(desc(exercises.createdAt));
  }

  async createExercise(exercise: InsertExercise): Promise<Exercise> {
    const [created] = await db.insert(exercises).values(exercise).returning();
    return created;
  }

  async updateExercise(id: string, exercise: Partial<InsertExercise>): Promise<Exercise | undefined> {
    const [updated] = await db
      .update(exercises)
      .set({ ...exercise, updatedAt: new Date() })
      .where(eq(exercises.id, id))
      .returning();
    return updated;
  }

  async deleteExercise(id: string): Promise<void> {
    await db.delete(exercises).where(eq(exercises.id, id));
  }

  // Meals
  async getMealsByDate(userId: string, date: string): Promise<Meal[]> {
    return await db
      .select()
      .from(meals)
      .where(and(eq(meals.userId, userId), eq(meals.date, date)))
      .orderBy(meals.time);
  }

  async getMeals(userId: string, limit: number = 50): Promise<Meal[]> {
    return await db
      .select()
      .from(meals)
      .where(eq(meals.userId, userId))
      .orderBy(desc(meals.date), desc(meals.time))
      .limit(limit);
  }

  async createMeal(meal: InsertMeal): Promise<Meal> {
    const [created] = await db.insert(meals).values(meal).returning();
    return created;
  }

  async updateMeal(id: string, meal: Partial<InsertMeal>, userId: string): Promise<Meal | undefined> {
    const [updated] = await db
      .update(meals)
      .set({ ...meal, updatedAt: new Date() })
      .where(and(eq(meals.id, id), eq(meals.userId, userId)))
      .returning();
    return updated;
  }

  async deleteMeal(id: string, userId: string): Promise<void> {
    await db
      .delete(meals)
      .where(and(eq(meals.id, id), eq(meals.userId, userId)));
  }

  // Heart Rate Sessions
  async getHeartRateSessions(userId: string): Promise<HeartRateSession[]> {
    return await db
      .select()
      .from(heartRateSessions)
      .where(eq(heartRateSessions.userId, userId))
      .orderBy(desc(heartRateSessions.startTime));
  }

  async createHeartRateSession(session: InsertHeartRateSession): Promise<HeartRateSession> {
    const [created] = await db.insert(heartRateSessions).values(session).returning();
    return created;
  }

  async updateHeartRateSession(id: string, session: Partial<InsertHeartRateSession>): Promise<HeartRateSession | undefined> {
    const [updated] = await db
      .update(heartRateSessions)
      .set(session)
      .where(eq(heartRateSessions.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
