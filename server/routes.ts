// Reference: blueprint:javascript_log_in_with_replit
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertUserPreferencesSchema,
  insertWorkoutSchema,
  insertExerciseSchema,
  insertMealSchema,
  insertHeartRateSessionSchema,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User Preferences
  app.get("/api/preferences", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const prefs = await storage.getUserPreferences(userId);
      res.json(prefs);
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  app.post("/api/preferences", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertUserPreferencesSchema.parse({ ...req.body, userId });
      const prefs = await storage.upsertUserPreferences(data);
      res.json(prefs);
    } catch (error: any) {
      console.error("Error saving preferences:", error);
      res.status(400).json({ message: error.message || "Failed to save preferences" });
    }
  });

  // Workouts
  app.get("/api/workouts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workouts = await storage.getWorkouts(userId);
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      res.status(500).json({ message: "Failed to fetch workouts" });
    }
  });

  app.get("/api/workouts/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workout = await storage.getWorkout(req.params.id, userId);
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      res.json(workout);
    } catch (error) {
      console.error("Error fetching workout:", error);
      res.status(500).json({ message: "Failed to fetch workout" });
    }
  });

  app.post("/api/workouts", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertWorkoutSchema.parse({ ...req.body, userId });
      const workout = await storage.createWorkout(data);
      res.json(workout);
    } catch (error: any) {
      console.error("Error creating workout:", error);
      res.status(400).json({ message: error.message || "Failed to create workout" });
    }
  });

  app.patch("/api/workouts/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const workout = await storage.updateWorkout(req.params.id, req.body, userId);
      if (!workout) {
        return res.status(404).json({ message: "Workout not found" });
      }
      res.json(workout);
    } catch (error: any) {
      console.error("Error updating workout:", error);
      res.status(400).json({ message: error.message || "Failed to update workout" });
    }
  });

  app.delete("/api/workouts/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteWorkout(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting workout:", error);
      res.status(500).json({ message: "Failed to delete workout" });
    }
  });

  // Exercises
  app.get("/api/workouts/:workoutId/exercises", isAuthenticated, async (req: any, res) => {
    try {
      const exercises = await storage.getExercisesByWorkout(req.params.workoutId);
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      res.status(500).json({ message: "Failed to fetch exercises" });
    }
  });

  app.post("/api/exercises", isAuthenticated, async (req: any, res) => {
    try {
      const data = insertExerciseSchema.parse(req.body);
      const exercise = await storage.createExercise(data);
      res.json(exercise);
    } catch (error: any) {
      console.error("Error creating exercise:", error);
      res.status(400).json({ message: error.message || "Failed to create exercise" });
    }
  });

  app.patch("/api/exercises/:id", isAuthenticated, async (req: any, res) => {
    try {
      const exercise = await storage.updateExercise(req.params.id, req.body);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.json(exercise);
    } catch (error: any) {
      console.error("Error updating exercise:", error);
      res.status(400).json({ message: error.message || "Failed to update exercise" });
    }
  });

  app.delete("/api/exercises/:id", isAuthenticated, async (req: any, res) => {
    try {
      await storage.deleteExercise(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting exercise:", error);
      res.status(500).json({ message: "Failed to delete exercise" });
    }
  });

  // Meals
  app.get("/api/meals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const date = req.query.date as string | undefined;
      
      const meals = date 
        ? await storage.getMealsByDate(userId, date)
        : await storage.getMeals(userId);
      
      res.json(meals);
    } catch (error) {
      console.error("Error fetching meals:", error);
      res.status(500).json({ message: "Failed to fetch meals" });
    }
  });

  app.post("/api/meals", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertMealSchema.parse({ ...req.body, userId });
      const meal = await storage.createMeal(data);
      res.json(meal);
    } catch (error: any) {
      console.error("Error creating meal:", error);
      res.status(400).json({ message: error.message || "Failed to create meal" });
    }
  });

  app.patch("/api/meals/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const meal = await storage.updateMeal(req.params.id, req.body, userId);
      if (!meal) {
        return res.status(404).json({ message: "Meal not found" });
      }
      res.json(meal);
    } catch (error: any) {
      console.error("Error updating meal:", error);
      res.status(400).json({ message: error.message || "Failed to update meal" });
    }
  });

  app.delete("/api/meals/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      await storage.deleteMeal(req.params.id, userId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting meal:", error);
      res.status(500).json({ message: "Failed to delete meal" });
    }
  });

  // Heart Rate Sessions
  app.get("/api/heart-rate-sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getHeartRateSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching heart rate sessions:", error);
      res.status(500).json({ message: "Failed to fetch sessions" });
    }
  });

  app.post("/api/heart-rate-sessions", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = insertHeartRateSessionSchema.parse({ ...req.body, userId });
      const session = await storage.createHeartRateSession(data);
      res.json(session);
    } catch (error: any) {
      console.error("Error creating heart rate session:", error);
      res.status(400).json({ message: error.message || "Failed to create session" });
    }
  });

  app.patch("/api/heart-rate-sessions/:id", isAuthenticated, async (req: any, res) => {
    try {
      const session = await storage.updateHeartRateSession(req.params.id, req.body);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (error: any) {
      console.error("Error updating heart rate session:", error);
      res.status(400).json({ message: error.message || "Failed to update session" });
    }
  });

  // Open Food Facts API proxy
  app.get("/api/barcode/:barcode", isAuthenticated, async (req, res) => {
    try {
      const barcode = req.params.barcode;
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
      const data = await response.json();
      
      if (data.status === 1) {
        const product = data.product;
        res.json({
          name: product.product_name || "Unknown Product",
          calories: Math.round(product.nutriments?.['energy-kcal_100g'] || 0),
          protein: Math.round(product.nutriments?.proteins_100g || 0),
          carbs: Math.round(product.nutriments?.carbohydrates_100g || 0),
          fat: Math.round(product.nutriments?.fat_100g || 0),
        });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      console.error("Error fetching barcode data:", error);
      res.status(500).json({ message: "Failed to fetch product data" });
    }
  });

  // Exercise Library
  app.get("/api/exercises/library", isAuthenticated, async (req: any, res) => {
    try {
      const { query, muscleGroup } = req.query;
      const exercises = await storage.searchExercises(query, muscleGroup);
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching exercise library:", error);
      res.status(500).json({ message: "Failed to fetch exercise library" });
    }
  });

  app.get("/api/exercises/library/:id", isAuthenticated, async (req: any, res) => {
    try {
      const exercise = await storage.getExerciseById(req.params.id);
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      res.json(exercise);
    } catch (error) {
      console.error("Error fetching exercise:", error);
      res.status(500).json({ message: "Failed to fetch exercise" });
    }
  });

  app.get("/api/exercises/muscle-groups", isAuthenticated, async (req: any, res) => {
    try {
      const muscleGroups = await storage.getMuscleGroups();
      res.json(muscleGroups);
    } catch (error) {
      console.error("Error fetching muscle groups:", error);
      res.status(500).json({ message: "Failed to fetch muscle groups" });
    }
  });

  // Workout Templates
  app.get("/api/templates", isAuthenticated, async (req: any, res) => {
    try {
      const { difficulty, category } = req.query;
      const templates = await storage.getWorkoutTemplates(difficulty, category);
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", isAuthenticated, async (req: any, res) => {
    try {
      const template = await storage.getWorkoutTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.get("/api/templates/:id/exercises", isAuthenticated, async (req: any, res) => {
    try {
      const exercises = await storage.getTemplateExercises(req.params.id);
      res.json(exercises);
    } catch (error) {
      console.error("Error fetching template exercises:", error);
      res.status(500).json({ message: "Failed to fetch template exercises" });
    }
  });

  app.post("/api/templates/:id/create-workout", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { date } = req.body;
      const workout = await storage.createWorkoutFromTemplate(req.params.id, userId, date || new Date().toISOString().split('T')[0]);
      res.json(workout);
    } catch (error: any) {
      console.error("Error creating workout from template:", error);
      res.status(400).json({ message: error.message || "Failed to create workout from template" });
    }
  });

  // Programs
  app.get("/api/programs", isAuthenticated, async (req: any, res) => {
    try {
      const { difficulty, goal } = req.query;
      const programs = await storage.getPrograms(difficulty, goal);
      res.json(programs);
    } catch (error) {
      console.error("Error fetching programs:", error);
      res.status(500).json({ message: "Failed to fetch programs" });
    }
  });

  app.get("/api/programs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const program = await storage.getProgram(req.params.id);
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      res.json(program);
    } catch (error) {
      console.error("Error fetching program:", error);
      res.status(500).json({ message: "Failed to fetch program" });
    }
  });

  app.get("/api/programs/:id/workouts", isAuthenticated, async (req: any, res) => {
    try {
      const workouts = await storage.getProgramWorkouts(req.params.id);
      res.json(workouts);
    } catch (error) {
      console.error("Error fetching program workouts:", error);
      res.status(500).json({ message: "Failed to fetch program workouts" });
    }
  });

  app.get("/api/user-programs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userPrograms = await storage.getUserPrograms(userId);
      res.json(userPrograms);
    } catch (error) {
      console.error("Error fetching user programs:", error);
      res.status(500).json({ message: "Failed to fetch user programs" });
    }
  });

  app.post("/api/user-programs", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const data = { ...req.body, userId };
      const userProgram = await storage.enrollInProgram(data);
      res.json(userProgram);
    } catch (error: any) {
      console.error("Error enrolling in program:", error);
      res.status(400).json({ message: error.message || "Failed to enroll in program" });
    }
  });

  app.patch("/api/user-programs/:id", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userProgram = await storage.updateUserProgram(req.params.id, userId, req.body);
      if (!userProgram) {
        return res.status(404).json({ message: "User program not found" });
      }
      res.json(userProgram);
    } catch (error: any) {
      console.error("Error updating user program:", error);
      res.status(400).json({ message: error.message || "Failed to update user program" });
    }
  });

  app.get("/api/user-programs/:id/schedule/:week", isAuthenticated, async (req: any, res) => {
    try {
      const weekNumber = parseInt(req.params.week);
      const scheduledWorkouts = await storage.getScheduledWorkouts(req.params.id, weekNumber);
      res.json(scheduledWorkouts);
    } catch (error) {
      console.error("Error fetching scheduled workouts:", error);
      res.status(500).json({ message: "Failed to fetch scheduled workouts" });
    }
  });

  // Progressive Overload
  app.get("/api/exercises/:exerciseName/history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const history = await storage.getExerciseHistory(userId, req.params.exerciseName, 10);
      res.json(history);
    } catch (error) {
      console.error("Error fetching exercise history:", error);
      res.status(500).json({ message: "Failed to fetch exercise history" });
    }
  });

  app.get("/api/exercises/:exerciseName/suggestion", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const suggestion = await storage.suggestProgressiveOverload(userId, req.params.exerciseName);
      res.json(suggestion);
    } catch (error) {
      console.error("Error getting progressive overload suggestion:", error);
      res.status(500).json({ message: "Failed to get suggestion" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
