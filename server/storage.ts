import {
  users,
  specialties,
  scenarios,
  checklists,
  checklistItems,
  attempts,
  responses,
  performanceMetrics,
  specialtyPerformance,
  categories,
  type User,
  type UpsertUser,
  type Specialty,
  type Scenario,
  type Checklist,
  type ChecklistItem,
  type Attempt,
  type InsertAttempt,
  type Response,
  type InsertResponse,
  type PerformanceMetric,
  type SpecialtyPerformance as SpecialtyPerformanceType,
  type Category
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or, sql, gt, lt, isNull, count } from "drizzle-orm";
import { DecimalJsLike } from "drizzle-orm/decimal-js-like";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Specialty operations
  getAllSpecialties(): Promise<Specialty[]>;
  getSpecialty(id: number): Promise<Specialty | undefined>;
  
  // Scenario operations
  getAllScenarios(): Promise<Scenario[]>;
  getScenario(id: number): Promise<Scenario | undefined>;
  getScenariosBySpecialty(specialtyId: number): Promise<Scenario[]>;
  
  // Checklist operations
  getAllChecklists(): Promise<Checklist[]>;
  getChecklist(id: number): Promise<Checklist | undefined>;
  getChecklistsByScenario(scenarioId: number): Promise<Checklist[]>;
  getChecklistItems(checklistId: number): Promise<ChecklistItem[]>;
  
  // Attempt operations
  createAttempt(attempt: InsertAttempt): Promise<Attempt>;
  getAttempt(id: number): Promise<Attempt | undefined>;
  getUserAttempts(userId: string): Promise<Attempt[]>;
  getUserRecentAttempts(userId: string, limit: number): Promise<Attempt[]>;
  completeAttempt(id: number, userResponses: { checklistItemId: number; completed: boolean }[]): Promise<number>;
  
  // Performance operations
  getUserPerformanceMetrics(userId: string): Promise<PerformanceMetric[]>;
  getUserSpecialtyPerformance(userId: string): Promise<SpecialtyPerformanceType[]>;
  getUserRanking(limit: number): Promise<User[]>;
  getUserRecommendations(userId: string, limit: number): Promise<Scenario[]>;
  
  // Category operations
  getAllCategories(): Promise<Category[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
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
  
  // Specialty operations
  async getAllSpecialties(): Promise<Specialty[]> {
    return await db.select().from(specialties);
  }
  
  async getSpecialty(id: number): Promise<Specialty | undefined> {
    const [specialty] = await db.select().from(specialties).where(eq(specialties.id, id));
    return specialty;
  }
  
  // Scenario operations
  async getAllScenarios(): Promise<Scenario[]> {
    return await db.select().from(scenarios);
  }
  
  async getScenario(id: number): Promise<Scenario | undefined> {
    const [scenario] = await db.select().from(scenarios).where(eq(scenarios.id, id));
    return scenario;
  }
  
  async getScenariosBySpecialty(specialtyId: number): Promise<Scenario[]> {
    return await db.select().from(scenarios).where(eq(scenarios.specialtyId, specialtyId));
  }
  
  // Checklist operations
  async getAllChecklists(): Promise<Checklist[]> {
    return await db.select().from(checklists);
  }
  
  async getChecklist(id: number): Promise<Checklist | undefined> {
    const [checklist] = await db.select().from(checklists).where(eq(checklists.id, id));
    return checklist;
  }
  
  async getChecklistsByScenario(scenarioId: number): Promise<Checklist[]> {
    return await db.select().from(checklists).where(eq(checklists.scenarioId, scenarioId));
  }
  
  async getChecklistItems(checklistId: number): Promise<ChecklistItem[]> {
    return await db.select().from(checklistItems).where(eq(checklistItems.checklistId, checklistId));
  }
  
  // Attempt operations
  async createAttempt(attemptData: InsertAttempt): Promise<Attempt> {
    const [attempt] = await db.insert(attempts).values(attemptData).returning();
    return attempt;
  }
  
  async getAttempt(id: number): Promise<Attempt | undefined> {
    const [attempt] = await db.select().from(attempts).where(eq(attempts.id, id));
    return attempt;
  }
  
  async getUserAttempts(userId: string): Promise<Attempt[]> {
    return await db.select().from(attempts).where(eq(attempts.userId, userId));
  }
  
  async getUserRecentAttempts(userId: string, limit: number): Promise<Attempt[]> {
    return await db
      .select()
      .from(attempts)
      .where(eq(attempts.userId, userId))
      .orderBy(desc(attempts.startTime))
      .limit(limit);
  }
  
  async completeAttempt(id: number, userResponses: { checklistItemId: number; completed: boolean }[]): Promise<number> {
    // Get the attempt
    const [attempt] = await db.select().from(attempts).where(eq(attempts.id, id));
    if (!attempt) {
      throw new Error("Attempt not found");
    }
    
    // Get the checklist items to calculate score
    const items = await db.select().from(checklistItems).where(eq(checklistItems.checklistId, attempt.checklistId));
    
    // Insert responses
    for (const response of userResponses) {
      await db.insert(responses).values({
        attemptId: id,
        checklistItemId: response.checklistItemId,
        completed: response.completed,
      });
    }
    
    // Calculate score
    let totalWeight = 0;
    let earnedWeight = 0;
    
    for (const item of items) {
      const weight = item.weight as unknown as number;
      totalWeight += weight;
      
      const userResponse = userResponses.find(r => r.checklistItemId === item.id);
      if (userResponse && userResponse.completed) {
        earnedWeight += weight;
      }
    }
    
    const score = totalWeight > 0 ? (earnedWeight / totalWeight) * 10 : 0;
    
    // Update attempt with score and completion
    await db
      .update(attempts)
      .set({
        endTime: new Date(),
        score,
        completed: true,
        updatedAt: new Date(),
      })
      .where(eq(attempts.id, id));
    
    // Update user performance metrics
    await this.updatePerformanceMetrics(attempt.userId, id);
    
    return score;
  }
  
  private async updatePerformanceMetrics(userId: string, attemptId: number): Promise<void> {
    // Get the attempt and responses
    const [attempt] = await db.select().from(attempts).where(eq(attempts.id, attemptId));
    if (!attempt || !attempt.completed) return;
    
    // Get the checklist
    const [checklist] = await db.select().from(checklists).where(eq(checklists.id, attempt.checklistId));
    if (!checklist) return;
    
    // Get the scenario
    const [scenario] = await db.select().from(scenarios).where(eq(scenarios.id, checklist.scenarioId));
    if (!scenario) return;
    
    // Get the user's responses
    const userResponses = await db.select().from(responses).where(eq(responses.attemptId, attemptId));
    
    // Get checklist items with their categories
    const items = await db.select().from(checklistItems).where(eq(checklistItems.checklistId, attempt.checklistId));
    
    // Calculate scores by category
    const categoryScores: Record<number, { totalWeight: number; earnedWeight: number; count: number }> = {};
    
    for (const item of items) {
      if (!item.categoryId) continue;
      
      if (!categoryScores[item.categoryId]) {
        categoryScores[item.categoryId] = { totalWeight: 0, earnedWeight: 0, count: 0 };
      }
      
      const weight = item.weight as unknown as number;
      categoryScores[item.categoryId].totalWeight += weight;
      categoryScores[item.categoryId].count += 1;
      
      const userResponse = userResponses.find(r => r.checklistItemId === item.id);
      if (userResponse && userResponse.completed) {
        categoryScores[item.categoryId].earnedWeight += weight;
      }
    }
    
    // Update performance metrics for each category
    for (const [categoryId, scores] of Object.entries(categoryScores)) {
      const catId = parseInt(categoryId);
      const categoryScore = scores.totalWeight > 0 ? (scores.earnedWeight / scores.totalWeight) * 10 : 0;
      
      // Get existing metric
      const [existingMetric] = await db
        .select()
        .from(performanceMetrics)
        .where(and(eq(performanceMetrics.userId, userId), eq(performanceMetrics.categoryId, catId)));
      
      if (existingMetric) {
        // Update existing metric with weighted average
        const totalAttempts = existingMetric.attemptCount + 1;
        const newScore = ((existingMetric.score as unknown as number) * existingMetric.attemptCount + categoryScore) / totalAttempts;
        
        await db
          .update(performanceMetrics)
          .set({
            score: newScore,
            attemptCount: totalAttempts,
            updatedAt: new Date(),
          })
          .where(and(eq(performanceMetrics.userId, userId), eq(performanceMetrics.categoryId, catId)));
      } else {
        // Create new metric
        await db.insert(performanceMetrics).values({
          userId,
          categoryId: catId,
          score: categoryScore,
          attemptCount: 1,
        });
      }
    }
    
    // Update specialty performance
    const [existingSpecialtyPerf] = await db
      .select()
      .from(specialtyPerformance)
      .where(and(
        eq(specialtyPerformance.userId, userId),
        eq(specialtyPerformance.specialtyId, scenario.specialtyId)
      ));
    
    if (existingSpecialtyPerf) {
      // Update existing specialty performance
      const totalAttempts = existingSpecialtyPerf.attempts + 1;
      const newScore = ((existingSpecialtyPerf.score as unknown as number) * existingSpecialtyPerf.attempts + (attempt.score as unknown as number)) / totalAttempts;
      
      await db
        .update(specialtyPerformance)
        .set({
          score: newScore,
          attempts: totalAttempts,
          lastAttempt: attempt.endTime,
          updatedAt: new Date(),
        })
        .where(and(
          eq(specialtyPerformance.userId, userId),
          eq(specialtyPerformance.specialtyId, scenario.specialtyId)
        ));
    } else {
      // Create new specialty performance
      await db.insert(specialtyPerformance).values({
        userId,
        specialtyId: scenario.specialtyId,
        score: attempt.score,
        attempts: 1,
        lastAttempt: attempt.endTime,
      });
    }
    
    // Update user's overall score
    const userAttempts = await db
      .select()
      .from(attempts)
      .where(and(eq(attempts.userId, userId), eq(attempts.completed, true)));
    
    if (userAttempts.length > 0) {
      const totalScore = userAttempts.reduce((sum, att) => sum + (att.score as unknown as number), 0);
      const averageScore = totalScore / userAttempts.length;
      
      await db
        .update(users)
        .set({
          score: averageScore,
          practiceCount: userAttempts.length,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
        
      // Update user's rank
      await this.updateUserRank(userId);
    }
  }
  
  private async updateUserRank(userId: string): Promise<void> {
    // Get all users ordered by score descending
    const allUsers = await db.select().from(users).orderBy(desc(users.score));
    
    // Update ranks for all users
    for (let i = 0; i < allUsers.length; i++) {
      await db
        .update(users)
        .set({ rank: i + 1 })
        .where(eq(users.id, allUsers[i].id));
    }
  }
  
  // Performance operations
  async getUserPerformanceMetrics(userId: string): Promise<PerformanceMetric[]> {
    return await db
      .select()
      .from(performanceMetrics)
      .where(eq(performanceMetrics.userId, userId));
  }
  
  async getUserSpecialtyPerformance(userId: string): Promise<SpecialtyPerformanceType[]> {
    return await db
      .select()
      .from(specialtyPerformance)
      .where(eq(specialtyPerformance.userId, userId));
  }
  
  async getUserRanking(limit: number): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.score))
      .limit(limit);
  }
  
  async getUserRecommendations(userId: string, limit: number): Promise<Scenario[]> {
    // Get user's attempts with low scores
    const userAttempts = await db
      .select({
        attempt: attempts,
        checklist: checklists,
        scenario: scenarios,
      })
      .from(attempts)
      .innerJoin(checklists, eq(attempts.checklistId, checklists.id))
      .innerJoin(scenarios, eq(checklists.scenarioId, scenarios.id))
      .where(and(
        eq(attempts.userId, userId),
        eq(attempts.completed, true),
        lt(attempts.score, 7) // Scores below 7 are considered areas for improvement
      ))
      .orderBy(attempts.score);
    
    // Extract scenarios from attempts
    const recommendedScenarios: Scenario[] = [];
    const scenarioIds = new Set<number>();
    
    for (const { scenario } of userAttempts) {
      if (!scenarioIds.has(scenario.id) && recommendedScenarios.length < limit) {
        scenarioIds.add(scenario.id);
        recommendedScenarios.push(scenario);
      }
    }
    
    // If not enough recommendations, add scenarios that user hasn't attempted yet
    if (recommendedScenarios.length < limit) {
      const completedScenarioIds = new Set(userAttempts.map(a => a.scenario.id));
      
      const newScenarios = await db
        .select()
        .from(scenarios)
        .where(
          !completedScenarioIds.size
            ? sql`1=1` // Return any scenarios if user hasn't completed any
            : sql`${scenarios.id} NOT IN (${Array.from(completedScenarioIds).join(',')})`
        )
        .limit(limit - recommendedScenarios.length);
      
      recommendedScenarios.push(...newScenarios);
    }
    
    return recommendedScenarios;
  }
  
  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }
}

export const storage = new DatabaseStorage();
