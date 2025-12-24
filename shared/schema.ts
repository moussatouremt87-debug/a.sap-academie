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

// Student enrollments with education background
export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  formationId: integer("formation_id").notNull().references(() => formations.id, { onDelete: "cascade" }),
  userId: varchar("user_id"),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  educationLevel: text("education_level").notNull(),
  educationField: text("education_field"),
  currentPosition: text("current_position"),
  company: text("company"),
  experience: text("experience"),
  motivation: text("motivation"),
  cvUrl: text("cv_url"),
  status: text("status").default("pending"), // pending, active, completed, expired, rejected
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

// Nurturing sequences for automated lead follow-up
export const nurturingSequences = pgTable("nurturing_sequences", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  triggerEvent: text("trigger_event").notNull(), // new_lead, form_submission, chat_interaction, meeting_booked, enrollment
  targetSource: text("target_source"), // agent-ia, formation, contact, google_meet_booking - null means all
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertNurturingSequenceSchema = createInsertSchema(nurturingSequences).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNurturingSequence = z.infer<typeof insertNurturingSequenceSchema>;
export type NurturingSequence = typeof nurturingSequences.$inferSelect;

// Steps within a nurturing sequence
export const nurturingSteps = pgTable("nurturing_steps", {
  id: serial("id").primaryKey(),
  sequenceId: integer("sequence_id").notNull().references(() => nurturingSequences.id, { onDelete: "cascade" }),
  stepOrder: integer("step_order").notNull(),
  delayDays: integer("delay_days").default(0), // Days to wait after previous step
  delayHours: integer("delay_hours").default(0), // Additional hours to wait
  actionType: text("action_type").notNull(), // email, task, status_change, notification
  subject: text("subject"), // Email subject
  content: text("content").notNull(), // Email body or task description
  templateVars: text("template_vars"), // JSON string of available variables
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertNurturingStepSchema = createInsertSchema(nurturingSteps).omit({
  id: true,
  createdAt: true,
});

export type InsertNurturingStep = z.infer<typeof insertNurturingStepSchema>;
export type NurturingStep = typeof nurturingSteps.$inferSelect;

// Lead enrollment in nurturing sequences
export const leadNurturing = pgTable("lead_nurturing", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  sequenceId: integer("sequence_id").notNull().references(() => nurturingSequences.id, { onDelete: "cascade" }),
  currentStepId: integer("current_step_id"),
  status: text("status").default("active"), // active, paused, completed, cancelled
  startedAt: timestamp("started_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  nextActionAt: timestamp("next_action_at"),
  completedAt: timestamp("completed_at"),
  pausedAt: timestamp("paused_at"),
});

export const insertLeadNurturingSchema = createInsertSchema(leadNurturing).omit({
  id: true,
  startedAt: true,
});

export type InsertLeadNurturing = z.infer<typeof insertLeadNurturingSchema>;
export type LeadNurturing = typeof leadNurturing.$inferSelect;

// Nurturing action log - track what actions were taken
export const nurturingActions = pgTable("nurturing_actions", {
  id: serial("id").primaryKey(),
  leadNurturingId: integer("lead_nurturing_id").notNull().references(() => leadNurturing.id, { onDelete: "cascade" }),
  nurturingStepId: integer("nurturing_step_id").references(() => nurturingSteps.id, { onDelete: "cascade" }),
  leadId: integer("lead_id").notNull().references(() => leads.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // email, task, sms, wait
  subject: text("subject"),
  content: text("content"),
  status: text("status").default("pending"), // pending, completed, failed, skipped
  scheduledAt: timestamp("scheduled_at").notNull(),
  executedAt: timestamp("executed_at"),
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertNurturingActionSchema = createInsertSchema(nurturingActions).omit({
  id: true,
  createdAt: true,
});

export type InsertNurturingAction = z.infer<typeof insertNurturingActionSchema>;
export type NurturingAction = typeof nurturingActions.$inferSelect;
