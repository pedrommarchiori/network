import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { eq, desc, and } from "drizzle-orm";
import {
  specialties,
  scenarios,
  checklists,
  checklistItems,
  attempts,
  responses,
  performanceMetrics,
  specialtyPerformance,
  categories
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

  // Specialties routes
  app.get('/api/specialties', async (req, res) => {
    try {
      const specialtiesList = await storage.getAllSpecialties();
      res.json(specialtiesList);
    } catch (error) {
      console.error("Error fetching specialties:", error);
      res.status(500).json({ message: "Failed to fetch specialties" });
    }
  });

  app.get('/api/specialties/:id', async (req, res) => {
    try {
      const specialty = await storage.getSpecialty(parseInt(req.params.id));
      if (!specialty) {
        return res.status(404).json({ message: "Specialty not found" });
      }
      res.json(specialty);
    } catch (error) {
      console.error("Error fetching specialty:", error);
      res.status(500).json({ message: "Failed to fetch specialty" });
    }
  });

  // Scenarios routes
  app.get('/api/scenarios', async (req, res) => {
    try {
      const { specialtyId } = req.query;
      let scenariosList;
      
      if (specialtyId) {
        scenariosList = await storage.getScenariosBySpecialty(parseInt(specialtyId as string));
      } else {
        scenariosList = await storage.getAllScenarios();
      }
      
      res.json(scenariosList);
    } catch (error) {
      console.error("Error fetching scenarios:", error);
      res.status(500).json({ message: "Failed to fetch scenarios" });
    }
  });

  app.get('/api/scenarios/:id', async (req, res) => {
    try {
      const scenario = await storage.getScenario(parseInt(req.params.id));
      if (!scenario) {
        return res.status(404).json({ message: "Scenario not found" });
      }
      res.json(scenario);
    } catch (error) {
      console.error("Error fetching scenario:", error);
      res.status(500).json({ message: "Failed to fetch scenario" });
    }
  });

  // Checklists routes
  app.get('/api/checklists', async (req, res) => {
    try {
      const { scenarioId } = req.query;
      let checklistsList;
      
      if (scenarioId) {
        checklistsList = await storage.getChecklistsByScenario(parseInt(scenarioId as string));
      } else {
        checklistsList = await storage.getAllChecklists();
      }
      
      res.json(checklistsList);
    } catch (error) {
      console.error("Error fetching checklists:", error);
      res.status(500).json({ message: "Failed to fetch checklists" });
    }
  });

  app.get('/api/checklists/:id', async (req, res) => {
    try {
      const checklist = await storage.getChecklist(parseInt(req.params.id));
      if (!checklist) {
        return res.status(404).json({ message: "Checklist not found" });
      }
      res.json(checklist);
    } catch (error) {
      console.error("Error fetching checklist:", error);
      res.status(500).json({ message: "Failed to fetch checklist" });
    }
  });

  app.get('/api/checklists/:id/items', async (req, res) => {
    try {
      const items = await storage.getChecklistItems(parseInt(req.params.id));
      res.json(items);
    } catch (error) {
      console.error("Error fetching checklist items:", error);
      res.status(500).json({ message: "Failed to fetch checklist items" });
    }
  });

  // Attempts routes
  app.post('/api/attempts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { checklistId } = req.body;
      
      const attempt = await storage.createAttempt({
        userId,
        checklistId,
        startTime: new Date(),
        completed: false
      });
      
      res.status(201).json(attempt);
    } catch (error) {
      console.error("Error creating attempt:", error);
      res.status(500).json({ message: "Failed to create attempt" });
    }
  });

  app.get('/api/attempts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const attemptId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const attempt = await storage.getAttempt(attemptId);
      
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }
      
      if (attempt.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      res.json(attempt);
    } catch (error) {
      console.error("Error fetching attempt:", error);
      res.status(500).json({ message: "Failed to fetch attempt" });
    }
  });

  app.patch('/api/attempts/:id/complete', isAuthenticated, async (req: any, res) => {
    try {
      const attemptId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const { responses } = req.body;
      
      const attempt = await storage.getAttempt(attemptId);
      
      if (!attempt) {
        return res.status(404).json({ message: "Attempt not found" });
      }
      
      if (attempt.userId !== userId) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      // Calculate score based on responses
      const score = await storage.completeAttempt(attemptId, responses);
      
      res.json({ score });
    } catch (error) {
      console.error("Error completing attempt:", error);
      res.status(500).json({ message: "Failed to complete attempt" });
    }
  });

  // User performance routes
  app.get('/api/users/:userId/performance', isAuthenticated, async (req: any, res) => {
    try {
      const requestUserId = req.params.userId;
      const currentUserId = req.user.claims.sub;
      
      // Only allow users to see their own performance or admins to see anyone's
      const user = await storage.getUser(currentUserId);
      if (requestUserId !== currentUserId && !user?.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const performance = await storage.getUserPerformanceMetrics(requestUserId);
      res.json(performance);
    } catch (error) {
      console.error("Error fetching performance:", error);
      res.status(500).json({ message: "Failed to fetch performance" });
    }
  });

  app.get('/api/users/:userId/specialty-performance', isAuthenticated, async (req: any, res) => {
    try {
      const requestUserId = req.params.userId;
      const currentUserId = req.user.claims.sub;
      
      // Only allow users to see their own performance or admins to see anyone's
      const user = await storage.getUser(currentUserId);
      if (requestUserId !== currentUserId && !user?.isAdmin) {
        return res.status(403).json({ message: "Unauthorized" });
      }
      
      const performance = await storage.getUserSpecialtyPerformance(requestUserId);
      res.json(performance);
    } catch (error) {
      console.error("Error fetching specialty performance:", error);
      res.status(500).json({ message: "Failed to fetch specialty performance" });
    }
  });

  // Ranking route
  app.get('/api/ranking', async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const ranking = await storage.getUserRanking(limit);
      res.json(ranking);
    } catch (error) {
      console.error("Error fetching ranking:", error);
      res.status(500).json({ message: "Failed to fetch ranking" });
    }
  });

  // Categories route
  app.get('/api/categories', async (req, res) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Dashboard routes
  app.get('/api/dashboard', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Get user details
      const user = await storage.getUser(userId);
      
      // Get performance by specialty
      const specialtyPerformance = await storage.getUserSpecialtyPerformance(userId);
      
      // Get performance by category
      const categoryPerformance = await storage.getUserPerformanceMetrics(userId);
      
      // Get recent attempts
      const recentAttempts = await storage.getUserRecentAttempts(userId, 5);
      
      // Get top ranking
      const ranking = await storage.getUserRanking(5);
      
      // Get practice recommendations
      const recommendations = await storage.getUserRecommendations(userId, 3);
      
      const dashboard = {
        user,
        specialtyPerformance,
        categoryPerformance,
        recentAttempts,
        ranking,
        recommendations,
      };
      
      res.json(dashboard);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
      res.status(500).json({ message: "Failed to fetch dashboard" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
