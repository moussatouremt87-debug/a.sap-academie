import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Export auth models (users and sessions tables)
export * from "./models/auth";

// Conversations table for AI Chat
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  sessionId: text("session_id"),
  leadId: integer("lead_id"),
  commercialName: text("commercial_name"),
  status: text("status").default("active"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type Conversation = typeof conversations.$inferSelect;

// Messages table for AI Chat
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").notNull().references(() => conversations.id, { onDelete: "cascade" }),
  role: text("role").notNull(), // 'user' | 'assistant' | 'system'
  content: text("content").notNull(),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;

// Formations (Training courses)
export const formations = pgTable("formations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // FI, MM, SD, ABAP, Analytics, etc.
  level: text("level").notNull(), // Debutant, Intermediaire, Avance
  format: text("format").notNull(), // Online, Presentiel, Hybride
  duration: integer("duration").notNull(), // hours
  price: integer("price").notNull(), // EUR in cents
  badge: text("badge"), // Certifiant, Nouveau, Populaire
  objectives: text("objectives").array(),
  modules: text("modules").array(),
  prerequisites: text("prerequisites"),
  certification: text("certification"),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertFormationSchema = createInsertSchema(formations).omit({
  id: true,
  createdAt: true,
});

export type InsertFormation = z.infer<typeof insertFormationSchema>;
export type Formation = typeof formations.$inferSelect;

// FAQs
export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  questionFr: text("question_fr").notNull(),
  questionEn: text("question_en"),
  answerFr: text("answer_fr").notNull(),
  answerEn: text("answer_en"),
  category: text("category").notNull(), // General, Agent IA, Services, SAP, Formation, Pricing, RDV
  order: integer("order").default(0),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  createdAt: true,
});

export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqs.$inferSelect;

// Leads for CRM
export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  company: text("company"),
  source: text("source"), // agent-ia, formation, contact, google_meet_booking
  status: text("status").default("new"), // new, to_follow_up, in_progress, qualified, converted, lost
  priority: text("priority").default("medium"), // low, medium, high, urgent
  notes: text("notes"),
  lastContactAt: timestamp("last_contact_at"),
  nextFollowUpAt: timestamp("next_follow_up_at"),
  assignedTo: text("assigned_to"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

// Lead notes/activities for CRM
export const leadActivities = pgTable("lead_activities", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // note, call, email, meeting, follow_up, status_change
  content: text("content").notNull(),
  createdBy: text("created_by"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertLeadActivitySchema = createInsertSchema(leadActivities).omit({
  id: true,
  createdAt: true,
});

export type InsertLeadActivity = z.infer<typeof insertLeadActivitySchema>;
export type LeadActivity = typeof leadActivities.$inferSelect;

// Course modules (video content for each formation)
export const courseModules = pgTable("course_modules", {
  id: serial("id").primaryKey(),
  formationId: integer("formation_id").notNull().references(() => formations.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  videoUrl: text("video_url"), // YouTube, Vimeo URL or direct video link
  duration: integer("duration"), // minutes
  order: integer("order").default(0),
  isFree: boolean("is_free").default(false), // Preview module
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertCourseModuleSchema = createInsertSchema(courseModules).omit({
  id: true,
  createdAt: true,
});

export type InsertCourseModule = z.infer<typeof insertCourseModuleSchema>;
export type CourseModule = typeof courseModules.$inferSelect;

// Student enrollments
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  formationId: integer("formation_id").notNull().references(() => formations.id, { onDelete: "cascade" }),
  status: text("status").default("active"), // active, completed, expired
  enrolledAt: timestamp("enrolled_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  completedAt: timestamp("completed_at"),
  expiresAt: timestamp("expires_at"),
});

export const insertEnrollmentSchema = createInsertSchema(enrollments).omit({
  id: true,
  enrolledAt: true,
});

export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;
export type Enrollment = typeof enrollments.$inferSelect;

// Progress tracking per module
export const moduleProgress = pgTable("module_progress", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  moduleId: integer("module_id").notNull().references(() => courseModules.id, { onDelete: "cascade" }),
  completed: boolean("completed").default(false),
  watchedSeconds: integer("watched_seconds").default(0),
  lastWatchedAt: timestamp("last_watched_at"),
  completedAt: timestamp("completed_at"),
});

export const insertModuleProgressSchema = createInsertSchema(moduleProgress).omit({
  id: true,
});

export type InsertModuleProgress = z.infer<typeof insertModuleProgressSchema>;
export type ModuleProgress = typeof moduleProgress.$inferSelect;
