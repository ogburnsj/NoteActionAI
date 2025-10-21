import {
  users,
  userPreferences,
  workouts,
  exercises,
  meals,
  heartRateSessions,
  exerciseLibrary,
  workoutTemplates,
  templateExercises,
  programs,
  programWorkouts,
  userPrograms,
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
  type ExerciseLibraryItem,
  type WorkoutTemplate,
  type TemplateExercise,
  type Program,
  type ProgramWorkout,
  type UserProgram,
  type InsertUserProgram,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, like, sql } from "drizzle-orm";

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

  // Exercise Library
  searchExercises(query?: string, muscleGroup?: string): Promise<ExerciseLibraryItem[]>;
  getExerciseById(id: string): Promise<ExerciseLibraryItem | undefined>;
  getMuscleGroups(): Promise<string[]>;

  // Workout Templates
  getWorkoutTemplates(difficulty?: string, category?: string): Promise<WorkoutTemplate[]>;
  getWorkoutTemplate(id: string): Promise<WorkoutTemplate | undefined>;
  getTemplateExercises(templateId: string): Promise<TemplateExercise[]>;
  createWorkoutFromTemplate(templateId: string, userId: string, date: string): Promise<Workout>;

  // Programs
  getPrograms(difficulty?: string, goal?: string): Promise<Program[]>;
  getProgram(id: string): Promise<Program | undefined>;
  getProgramWorkouts(programId: string): Promise<ProgramWorkout[]>;
  getUserPrograms(userId: string): Promise<UserProgram[]>;
  enrollInProgram(userProgram: InsertUserProgram): Promise<UserProgram>;
  updateUserProgram(id: string, userId: string, updates: Partial<InsertUserProgram>): Promise<UserProgram | undefined>;
  getScheduledWorkouts(userProgramId: string, weekNumber: number): Promise<Array<ProgramWorkout & { template: WorkoutTemplate }>>;

  // Progressive Overload
  getExerciseHistory(userId: string, exerciseName: string, limit?: number): Promise<Array<{ date: string; sets: any; workoutName: string }>>;
  suggestProgressiveOverload(userId: string, exerciseName: string): Promise<{ suggestedWeight: number; reason: string } | null>;
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

  // Exercise Library
  async searchExercises(query?: string, muscleGroup?: string): Promise<ExerciseLibraryItem[]> {
    let dbQuery = db.select().from(exerciseLibrary);

    const conditions = [];
    if (query) {
      conditions.push(like(exerciseLibrary.name, `%${query}%`));
    }
    if (muscleGroup) {
      conditions.push(eq(exerciseLibrary.muscleGroup, muscleGroup));
    }

    if (conditions.length > 0) {
      dbQuery = dbQuery.where(and(...conditions)) as any;
    }

    return await dbQuery.orderBy(exerciseLibrary.name);
  }

  async getExerciseById(id: string): Promise<ExerciseLibraryItem | undefined> {
    const [exercise] = await db
      .select()
      .from(exerciseLibrary)
      .where(eq(exerciseLibrary.id, id));
    return exercise;
  }

  async getMuscleGroups(): Promise<string[]> {
    const results = await db
      .selectDistinct({ muscleGroup: exerciseLibrary.muscleGroup })
      .from(exerciseLibrary)
      .orderBy(exerciseLibrary.muscleGroup);
    return results.map((r) => r.muscleGroup);
  }

  // Workout Templates
  async getWorkoutTemplates(difficulty?: string, category?: string): Promise<WorkoutTemplate[]> {
    let dbQuery = db.select().from(workoutTemplates);

    const conditions = [];
    if (difficulty) {
      conditions.push(eq(workoutTemplates.difficulty, difficulty));
    }
    if (category) {
      conditions.push(eq(workoutTemplates.category, category));
    }

    if (conditions.length > 0) {
      dbQuery = dbQuery.where(and(...conditions)) as any;
    }

    return await dbQuery.orderBy(workoutTemplates.name);
  }

  async getWorkoutTemplate(id: string): Promise<WorkoutTemplate | undefined> {
    const [template] = await db
      .select()
      .from(workoutTemplates)
      .where(eq(workoutTemplates.id, id));
    return template;
  }

  async getTemplateExercises(templateId: string): Promise<TemplateExercise[]> {
    return await db
      .select()
      .from(templateExercises)
      .where(eq(templateExercises.templateId, templateId))
      .orderBy(templateExercises.orderIndex);
  }

  async createWorkoutFromTemplate(templateId: string, userId: string, date: string): Promise<Workout> {
    const template = await this.getWorkoutTemplate(templateId);
    if (!template) throw new Error("Template not found");

    const templateExercisesList = await this.getTemplateExercises(templateId);

    // Create workout
    const workout = await this.createWorkout({
      userId,
      name: template.name,
      date,
      notes: `Created from template: ${template.description || ""}`,
    });

    // Create exercises from template
    for (const te of templateExercisesList) {
      // Parse reps to create default sets
      const repsValue = te.reps.includes("-") ? te.reps.split("-")[0] : te.reps;
      const defaultReps = repsValue === "AMRAP" ? 10 : parseInt(repsValue) || 10;
      
      const sets = Array.from({ length: te.sets }, () => ({
        reps: defaultReps,
        weight: 0, // User will fill in
      }));

      await this.createExercise({
        workoutId: workout.id,
        name: te.exerciseName,
        sets,
      });
    }

    return workout;
  }

  // Programs
  async getPrograms(difficulty?: string, goal?: string): Promise<Program[]> {
    let dbQuery = db.select().from(programs);

    const conditions = [];
    if (difficulty) {
      conditions.push(eq(programs.difficulty, difficulty));
    }
    if (goal) {
      conditions.push(eq(programs.goal, goal));
    }

    if (conditions.length > 0) {
      dbQuery = dbQuery.where(and(...conditions)) as any;
    }

    return await dbQuery.orderBy(programs.name);
  }

  async getProgram(id: string): Promise<Program | undefined> {
    const [program] = await db
      .select()
      .from(programs)
      .where(eq(programs.id, id));
    return program;
  }

  async getProgramWorkouts(programId: string): Promise<ProgramWorkout[]> {
    return await db
      .select()
      .from(programWorkouts)
      .where(eq(programWorkouts.programId, programId))
      .orderBy(programWorkouts.weekNumber, programWorkouts.dayNumber);
  }

  async getUserPrograms(userId: string): Promise<UserProgram[]> {
    return await db
      .select()
      .from(userPrograms)
      .where(eq(userPrograms.userId, userId))
      .orderBy(desc(userPrograms.createdAt));
  }

  async enrollInProgram(userProgram: InsertUserProgram): Promise<UserProgram> {
    const [created] = await db.insert(userPrograms).values(userProgram).returning();
    return created;
  }

  async updateUserProgram(id: string, userId: string, updates: Partial<InsertUserProgram>): Promise<UserProgram | undefined> {
    const [updated] = await db
      .update(userPrograms)
      .set({ ...updates, updatedAt: new Date() })
      .where(and(eq(userPrograms.id, id), eq(userPrograms.userId, userId)))
      .returning();
    return updated;
  }

  async getScheduledWorkouts(userProgramId: string, weekNumber: number): Promise<Array<ProgramWorkout & { template: WorkoutTemplate }>> {
    // Get the user program first
    const [userProgram] = await db
      .select()
      .from(userPrograms)
      .where(eq(userPrograms.id, userProgramId));

    if (!userProgram) return [];

    // Get scheduled workouts for the week
    const scheduledWorkouts = await db
      .select()
      .from(programWorkouts)
      .where(
        and(
          eq(programWorkouts.programId, userProgram.programId),
          eq(programWorkouts.weekNumber, weekNumber)
        )
      )
      .orderBy(programWorkouts.dayNumber);

    // Get templates for each workout
    const result = [];
    for (const workout of scheduledWorkouts) {
      const template = await this.getWorkoutTemplate(workout.templateId);
      if (template) {
        result.push({ ...workout, template });
      }
    }

    return result;
  }

  // Progressive Overload
  async getExerciseHistory(
    userId: string,
    exerciseName: string,
    limit: number = 10
  ): Promise<Array<{ date: string; sets: any; workoutName: string }>> {
    const userWorkouts = await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, userId))
      .orderBy(desc(workouts.date))
      .limit(30); // Get last 30 workouts

    const history = [];
    for (const workout of userWorkouts) {
      const workoutExercises = await db
        .select()
        .from(exercises)
        .where(
          and(
            eq(exercises.workoutId, workout.id),
            eq(exercises.name, exerciseName)
          )
        );

      for (const exercise of workoutExercises) {
        history.push({
          date: workout.date,
          sets: exercise.sets,
          workoutName: workout.name,
        });
      }
    }

    return history.slice(0, limit);
  }

  async suggestProgressiveOverload(
    userId: string,
    exerciseName: string
  ): Promise<{ suggestedWeight: number; reason: string } | null> {
    const history = await this.getExerciseHistory(userId, exerciseName, 5);

    if (history.length < 2) return null;

    // Get the most recent session
    const lastSession = history[0];
    const sets = lastSession.sets as Array<{ reps: number; weight: number }>;

    // Check if user completed all target reps with good form
    const avgWeight = sets.reduce((sum, set) => sum + set.weight, 0) / sets.length;
    const avgReps = sets.reduce((sum, set) => sum + set.reps, 0) / sets.length;

    // If completing 8+ reps consistently, suggest increase
    if (avgReps >= 8 && avgWeight > 0) {
      const increase = avgWeight * 0.025; // 2.5% increase
      const suggestedWeight = Math.round((avgWeight + increase) * 2) / 2; // Round to nearest 2.5

      return {
        suggestedWeight,
        reason: `You completed ${avgReps.toFixed(1)} reps on average. Time to increase weight!`,
      };
    }

    return null;
  }
}

export const storage = new DatabaseStorage();
