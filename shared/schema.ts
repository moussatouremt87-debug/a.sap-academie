import { sql } from "drizzle-orm";
import { pgTable, text, varchar, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Conversations table for AI Chat
export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  sessionId: text("session_id"),
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
  source: text("source"), // agent-ia, formation, contact
  status: text("status").default("new"), // new, contacted, qualified, converted
  notes: text("notes"),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
});

export const insertLeadSchema = createInsertSchema(leads).omit({
  id: true,
  createdAt: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;
