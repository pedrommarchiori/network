import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  varchar,
  timestamp,
  jsonb,
  index,
  foreignKey,
  decimal,
  primaryKey,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  score: decimal("score", { precision: 4, scale: 2 }).default("0"),
  rank: integer("rank"),
  practiceCount: integer("practice_count").default(0),
  studyTimeMinutes: integer("study_time_minutes").default(0),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Medical specialties
export const specialties = pgTable("specialties", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  description: text("description"),
  iconPath: text("icon_path"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSpecialtySchema = createInsertSchema(specialties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSpecialty = z.infer<typeof insertSpecialtySchema>;
export type Specialty = typeof specialties.$inferSelect;

// Scenarios for practice
export const scenarios = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  specialtyId: integer("specialty_id").notNull().references(() => specialties.id),
  difficulty: text("difficulty").notNull(), // easy, medium, hard
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertScenarioSchema = createInsertSchema(scenarios).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type Scenario = typeof scenarios.$inferSelect;

// Categories of evaluation (anamnesis, physical exam, etc.)
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Checklists for practical exams
export const checklists = pgTable("checklists", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  scenarioId: integer("scenario_id").notNull().references(() => scenarios.id),
  timeLimit: integer("time_limit"), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertChecklistSchema = createInsertSchema(checklists).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertChecklist = z.infer<typeof insertChecklistSchema>;
export type Checklist = typeof checklists.$inferSelect;

// Checklist items
export const checklistItems = pgTable("checklist_items", {
  id: serial("id").primaryKey(),
  checklistId: integer("checklist_id").notNull().references(() => checklists.id),
  categoryId: integer("category_id").references(() => categories.id),
  description: text("description").notNull(),
  weight: decimal("weight", { precision: 3, scale: 1 }).default("1"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertChecklistItemSchema = createInsertSchema(checklistItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertChecklistItem = z.infer<typeof insertChecklistItemSchema>;
export type ChecklistItem = typeof checklistItems.$inferSelect;

// User practice attempts
export const attempts = pgTable("attempts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  checklistId: integer("checklist_id").notNull().references(() => checklists.id),
  startTime: timestamp("start_time").defaultNow(),
  endTime: timestamp("end_time"),
  score: decimal("score", { precision: 4, scale: 2 }),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAttemptSchema = createInsertSchema(attempts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAttempt = z.infer<typeof insertAttemptSchema>;
export type Attempt = typeof attempts.$inferSelect;

// User responses to checklist items
export const responses = pgTable("responses", {
  id: serial("id").primaryKey(),
  attemptId: integer("attempt_id").notNull().references(() => attempts.id),
  checklistItemId: integer("checklist_item_id").notNull().references(() => checklistItems.id),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertResponseSchema = createInsertSchema(responses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertResponse = z.infer<typeof insertResponseSchema>;
export type Response = typeof responses.$inferSelect;

// Performance metrics by category
export const performanceMetrics = pgTable(
  "performance_metrics",
  {
    userId: varchar("user_id").notNull().references(() => users.id),
    categoryId: integer("category_id").notNull().references(() => categories.id),
    score: decimal("score", { precision: 4, scale: 2 }).default("0"),
    attemptCount: integer("attempt_count").default(0),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.categoryId] }),
    };
  }
);

export const insertPerformanceMetricSchema = createInsertSchema(performanceMetrics).omit({
  updatedAt: true,
});

export type InsertPerformanceMetric = z.infer<typeof insertPerformanceMetricSchema>;
export type PerformanceMetric = typeof performanceMetrics.$inferSelect;

// Performance metrics by specialty
export const specialtyPerformance = pgTable(
  "specialty_performance",
  {
    userId: varchar("user_id").notNull().references(() => users.id),
    specialtyId: integer("specialty_id").notNull().references(() => specialties.id),
    score: decimal("score", { precision: 4, scale: 2 }).default("0"),
    attempts: integer("attempts").default(0),
    lastAttempt: timestamp("last_attempt"),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.specialtyId] }),
    };
  }
);

export const insertSpecialtyPerformanceSchema = createInsertSchema(specialtyPerformance).omit({
  updatedAt: true,
});

export type InsertSpecialtyPerformance = z.infer<typeof insertSpecialtyPerformanceSchema>;
export type SpecialtyPerformance = typeof specialtyPerformance.$inferSelect;
