import { sql } from "drizzle-orm";
import {
  pgTable,
  text,
  varchar,
  serial,
  integer,
  timestamp,
  boolean,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { formations, courseModules } from "./schema";

// ============================================================================
// QUIZZES TABLE
// ============================================================================

export const quizzes = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id")
    .notNull()
    .references(() => courseModules.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  passingScore: integer("passing_score").default(70),
  timeLimitMinutes: integer("time_limit_minutes"),
  maxAttempts: integer("max_attempts").default(3),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuizzesSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true,
});

export type InsertQuiz = z.infer<typeof insertQuizzesSchema>;
export type SelectQuiz = typeof quizzes.$inferSelect;

// ============================================================================
// QUIZ QUESTIONS TABLE
// ============================================================================

export const quizQuestions = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // 'mcq', 'true_false', 'case_study'
  text: text("text").notNull(),
  points: integer("points").default(1),
  order: integer("order").notNull(),
  explanation: text("explanation"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertQuizQuestionsSchema = createInsertSchema(quizQuestions).omit({
  id: true,
  createdAt: true,
});

export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionsSchema>;
export type SelectQuizQuestion = typeof quizQuestions.$inferSelect;

// ============================================================================
// QUIZ ANSWERS TABLE
// ============================================================================

export const quizAnswers = pgTable("quiz_answers", {
  id: serial("id").primaryKey(),
  questionId: integer("question_id")
    .notNull()
    .references(() => quizQuestions.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  isCorrect: boolean("is_correct").notNull(),
  order: integer("order").notNull(),
});

export const insertQuizAnswersSchema = createInsertSchema(quizAnswers).omit({
  id: true,
});

export type InsertQuizAnswer = z.infer<typeof insertQuizAnswersSchema>;
export type SelectQuizAnswer = typeof quizAnswers.$inferSelect;

// ============================================================================
// QUIZ ATTEMPTS TABLE
// ============================================================================

export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  quizId: integer("quiz_id")
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  score: integer("score").notNull(),
  totalPoints: integer("total_points").notNull(),
  passed: boolean("passed").notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  answersJson: text("answers_json"), // JSON string of student answers
});

export const insertQuizAttemptsSchema = createInsertSchema(quizAttempts).omit({
  id: true,
});

export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptsSchema>;
export type SelectQuizAttempt = typeof quizAttempts.$inferSelect;

// ============================================================================
// CERTIFICATES TABLE
// ============================================================================

export const certificates = pgTable(
  "certificates",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(),
    formationId: integer("formation_id")
      .notNull()
      .references(() => formations.id, { onDelete: "cascade" }),
    verificationCode: text("verification_code").notNull().unique(),
    score: integer("score").notNull(),
    pdfUrl: text("pdf_url").notNull(),
    issuedAt: timestamp("issued_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at"),
  },
  (table) => ({
    verificationCodeIdx: uniqueIndex("certificates_verification_code_idx").on(
      table.verificationCode
    ),
  })
);

export const insertCertificatesSchema = createInsertSchema(certificates).omit({
  id: true,
  issuedAt: true,
});

export type InsertCertificate = z.infer<typeof insertCertificatesSchema>;
export type SelectCertificate = typeof certificates.$inferSelect;

// ============================================================================
// BADGES TABLE
// ============================================================================

export const badges = pgTable("badges", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  iconUrl: text("icon_url").notNull(),
  criteriaType: text("criteria_type").notNull(), // 'course_complete', 'quiz_perfect', 'streak', 'first_enrollment', 'modules_count'
  criteriaValue: integer("criteria_value").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBadgesSchema = createInsertSchema(badges).omit({
  id: true,
  createdAt: true,
});

export type InsertBadge = z.infer<typeof insertBadgesSchema>;
export type SelectBadge = typeof badges.$inferSelect;

// ============================================================================
// USER BADGES TABLE
// ============================================================================

export const userBadges = pgTable("user_badges", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  badgeId: integer("badge_id")
    .notNull()
    .references(() => badges.id, { onDelete: "cascade" }),
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
});

export const insertUserBadgesSchema = createInsertSchema(userBadges).omit({
  id: true,
  earnedAt: true,
});

export type InsertUserBadge = z.infer<typeof insertUserBadgesSchema>;
export type SelectUserBadge = typeof userBadges.$inferSelect;

// ============================================================================
// USER XP TABLE
// ============================================================================

export const userXp = pgTable(
  "user_xp",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull().unique(),
    xpTotal: integer("xp_total").default(0),
    currentStreak: integer("current_streak").default(0),
    longestStreak: integer("longest_streak").default(0),
    lastActivityAt: timestamp("last_activity_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: uniqueIndex("user_xp_user_id_idx").on(table.userId),
  })
);

export const insertUserXpSchema = createInsertSchema(userXp).omit({
  id: true,
  lastActivityAt: true,
});

export type InsertUserXp = z.infer<typeof insertUserXpSchema>;
export type SelectUserXp = typeof userXp.$inferSelect;

// ============================================================================
// XP EVENTS TABLE
// ============================================================================

export const xpEvents = pgTable("xp_events", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  eventType: text("event_type").notNull(), // 'lesson_complete', 'quiz_pass', 'quiz_perfect', 'daily_login', 'streak_bonus', 'course_complete'
  xpEarned: integer("xp_earned").notNull(),
  sourceId: text("source_id"), // ID of the related resource (lesson, quiz, course)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertXpEventsSchema = createInsertSchema(xpEvents).omit({
  id: true,
  createdAt: true,
});

export type InsertXpEvent = z.infer<typeof insertXpEventsSchema>;
export type SelectXpEvent = typeof xpEvents.$inferSelect;

// ============================================================================
// FORUM THREADS TABLE
// ============================================================================

export const forumThreads = pgTable("forum_threads", {
  id: serial("id").primaryKey(),
  formationId: integer("formation_id")
    .notNull()
    .references(() => formations.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 }).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isResolved: boolean("is_resolved").default(false),
  isPinned: boolean("is_pinned").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertForumThreadsSchema = createInsertSchema(forumThreads).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertForumThread = z.infer<typeof insertForumThreadsSchema>;
export type SelectForumThread = typeof forumThreads.$inferSelect;

// ============================================================================
// FORUM REPLIES TABLE
// ============================================================================

export const forumReplies = pgTable("forum_replies", {
  id: serial("id").primaryKey(),
  threadId: integer("thread_id")
    .notNull()
    .references(() => forumThreads.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 }).notNull(),
  userName: text("user_name").notNull(),
  content: text("content").notNull(),
  isInstructor: boolean("is_instructor").default(false),
  isAiGenerated: boolean("is_ai_generated").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertForumRepliesSchema = createInsertSchema(forumReplies).omit({
  id: true,
  createdAt: true,
});

export type InsertForumReply = z.infer<typeof insertForumRepliesSchema>;
export type SelectForumReply = typeof forumReplies.$inferSelect;

// ============================================================================
// NOTIFICATIONS TABLE
// ============================================================================

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  type: text("type").notNull(), // 'badge_earned', 'certificate_ready', 'streak_warning', 'new_module', 'quiz_result', 'forum_reply'
  title: text("title").notNull(),
  message: text("message").notNull(),
  link: text("link"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertNotificationsSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationsSchema>;
export type SelectNotification = typeof notifications.$inferSelect;

// ============================================================================
// BARREL EXPORTS FOR CONVENIENCE
// ============================================================================

export const elearningTables = {
  quizzes,
  quizQuestions,
  quizAnswers,
  quizAttempts,
  certificates,
  badges,
  userBadges,
  userXp,
  xpEvents,
  forumThreads,
  forumReplies,
  notifications,
};

export const elearningSchemas = {
  insertQuizzesSchema,
  insertQuizQuestionsSchema,
  insertQuizAnswersSchema,
  insertQuizAttemptsSchema,
  insertCertificatesSchema,
  insertBadgesSchema,
  insertUserBadgesSchema,
  insertUserXpSchema,
  insertXpEventsSchema,
  insertForumThreadsSchema,
  insertForumRepliesSchema,
  insertNotificationsSchema,
};
