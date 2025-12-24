import {
  type Conversation, type InsertConversation,
  type Message, type InsertMessage,
  type Formation, type InsertFormation,
  type Faq, type InsertFaq,
  type Lead, type InsertLead,
  type LeadActivity, type InsertLeadActivity,
  type CourseModule, type InsertCourseModule,
  type Enrollment, type InsertEnrollment,
  type ModuleProgress, type InsertModuleProgress,
  conversations, messages, formations, faqs, leads, leadActivities,
  courseModules, enrollments, moduleProgress,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, lte, isNotNull, sql } from "drizzle-orm";

export interface IStorage {
  // Conversations
  getConversation(id: number): Promise<Conversation | undefined>;
  getAllConversations(): Promise<Conversation[]>;
  createConversation(data: InsertConversation): Promise<Conversation>;
  deleteConversation(id: number): Promise<void>;
  
  // Messages
  getMessagesByConversation(conversationId: number): Promise<Message[]>;
  createMessage(data: InsertMessage): Promise<Message>;
  
  // Formations
  getFormation(id: number): Promise<Formation | undefined>;
  getAllFormations(): Promise<Formation[]>;
  getPublishedFormations(): Promise<Formation[]>;
  createFormation(data: InsertFormation): Promise<Formation>;
  
  // FAQs
  getFaq(id: number): Promise<Faq | undefined>;
  getAllFaqs(): Promise<Faq[]>;
  getPublishedFaqs(): Promise<Faq[]>;
  createFaq(data: InsertFaq): Promise<Faq>;
  
  // Leads
  getLead(id: number): Promise<Lead | undefined>;
  getLeadByEmail(email: string): Promise<Lead | undefined>;
  getAllLeads(): Promise<Lead[]>;
  getLeadsToFollowUp(): Promise<Lead[]>;
  createLead(data: InsertLead): Promise<Lead>;
  updateLead(id: number, data: Partial<InsertLead>): Promise<Lead | undefined>;
  upsertLeadByEmail(email: string, data: InsertLead): Promise<Lead>;
  
  // Lead Activities
  getLeadActivities(leadId: number): Promise<LeadActivity[]>;
  createLeadActivity(data: InsertLeadActivity): Promise<LeadActivity>;
  
  // Conversations with Lead
  getConversationsByLead(leadId: number): Promise<Conversation[]>;
  updateConversation(id: number, data: Partial<InsertConversation>): Promise<Conversation | undefined>;
  
  // Course Modules
  getCourseModules(formationId: number): Promise<CourseModule[]>;
  getCourseModule(id: number): Promise<CourseModule | undefined>;
  createCourseModule(data: InsertCourseModule): Promise<CourseModule>;
  
  // Enrollments
  getEnrollment(userId: string, formationId: number): Promise<Enrollment | undefined>;
  getUserEnrollments(userId: string): Promise<Enrollment[]>;
  createEnrollment(data: InsertEnrollment): Promise<Enrollment>;
  updateEnrollment(id: number, data: Partial<InsertEnrollment>): Promise<Enrollment | undefined>;
  
  // Module Progress
  getModuleProgress(userId: string, moduleId: number): Promise<ModuleProgress | undefined>;
  getUserProgressForFormation(userId: string, formationId: number): Promise<ModuleProgress[]>;
  updateModuleProgress(userId: string, moduleId: number, data: Partial<InsertModuleProgress>): Promise<ModuleProgress>;
}

export class DatabaseStorage implements IStorage {
  // Conversations
  async getConversation(id: number): Promise<Conversation | undefined> {
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, id));
    return conversation || undefined;
  }

  async getAllConversations(): Promise<Conversation[]> {
    return db.select().from(conversations).orderBy(desc(conversations.createdAt));
  }

  async createConversation(data: InsertConversation): Promise<Conversation> {
    const [conversation] = await db.insert(conversations).values(data).returning();
    return conversation;
  }

  async deleteConversation(id: number): Promise<void> {
    await db.delete(messages).where(eq(messages.conversationId, id));
    await db.delete(conversations).where(eq(conversations.id, id));
  }

  // Messages
  async getMessagesByConversation(conversationId: number): Promise<Message[]> {
    return db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
  }

  async createMessage(data: InsertMessage): Promise<Message> {
    const [message] = await db.insert(messages).values(data).returning();
    return message;
  }

  // Formations
  async getFormation(id: number): Promise<Formation | undefined> {
    const [formation] = await db.select().from(formations).where(eq(formations.id, id));
    return formation || undefined;
  }

  async getAllFormations(): Promise<Formation[]> {
    return db.select().from(formations).orderBy(desc(formations.createdAt));
  }

  async getPublishedFormations(): Promise<Formation[]> {
    return db.select().from(formations).where(eq(formations.isPublished, true)).orderBy(desc(formations.createdAt));
  }

  async createFormation(data: InsertFormation): Promise<Formation> {
    const [formation] = await db.insert(formations).values(data).returning();
    return formation;
  }

  // FAQs
  async getFaq(id: number): Promise<Faq | undefined> {
    const [faq] = await db.select().from(faqs).where(eq(faqs.id, id));
    return faq || undefined;
  }

  async getAllFaqs(): Promise<Faq[]> {
    return db.select().from(faqs).orderBy(faqs.order);
  }

  async getPublishedFaqs(): Promise<Faq[]> {
    return db.select().from(faqs).where(eq(faqs.isPublished, true)).orderBy(faqs.order);
  }

  async createFaq(data: InsertFaq): Promise<Faq> {
    const [faq] = await db.insert(faqs).values(data).returning();
    return faq;
  }

  // Leads
  async getLead(id: number): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads).where(eq(leads.id, id));
    return lead || undefined;
  }

  async getLeadByEmail(email: string): Promise<Lead | undefined> {
    const [lead] = await db.select().from(leads)
      .where(sql`LOWER(${leads.email}) = LOWER(${email})`);
    return lead || undefined;
  }

  async getAllLeads(): Promise<Lead[]> {
    return db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async getLeadsToFollowUp(): Promise<Lead[]> {
    const now = new Date();
    return db.select().from(leads)
      .where(and(
        isNotNull(leads.nextFollowUpAt),
        lte(leads.nextFollowUpAt, now)
      ))
      .orderBy(leads.nextFollowUpAt);
  }

  async createLead(data: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(data).returning();
    return lead;
  }

  async updateLead(id: number, data: Partial<InsertLead>): Promise<Lead | undefined> {
    const [lead] = await db.update(leads)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(leads.id, id))
      .returning();
    return lead || undefined;
  }

  async upsertLeadByEmail(email: string, data: InsertLead): Promise<Lead> {
    const existingLead = await this.getLeadByEmail(email);
    if (existingLead) {
      const updated = await this.updateLead(existingLead.id, data);
      return updated || existingLead;
    }
    return this.createLead(data);
  }

  // Lead Activities
  async getLeadActivities(leadId: number): Promise<LeadActivity[]> {
    return db.select().from(leadActivities)
      .where(eq(leadActivities.leadId, leadId))
      .orderBy(desc(leadActivities.createdAt));
  }

  async createLeadActivity(data: InsertLeadActivity): Promise<LeadActivity> {
    const [activity] = await db.insert(leadActivities).values(data).returning();
    return activity;
  }

  // Conversations with Lead
  async getConversationsByLead(leadId: number): Promise<Conversation[]> {
    return db.select().from(conversations)
      .where(eq(conversations.leadId, leadId))
      .orderBy(desc(conversations.createdAt));
  }

  async updateConversation(id: number, data: Partial<InsertConversation>): Promise<Conversation | undefined> {
    const [conversation] = await db.update(conversations)
      .set(data)
      .where(eq(conversations.id, id))
      .returning();
    return conversation || undefined;
  }
  
  // Course Modules
  async getCourseModules(formationId: number): Promise<CourseModule[]> {
    return db.select().from(courseModules)
      .where(eq(courseModules.formationId, formationId))
      .orderBy(courseModules.order);
  }
  
  async getCourseModule(id: number): Promise<CourseModule | undefined> {
    const [module] = await db.select().from(courseModules).where(eq(courseModules.id, id));
    return module || undefined;
  }
  
  async createCourseModule(data: InsertCourseModule): Promise<CourseModule> {
    const [module] = await db.insert(courseModules).values(data).returning();
    return module;
  }
  
  // Enrollments
  async getEnrollment(userId: string, formationId: number): Promise<Enrollment | undefined> {
    const [enrollment] = await db.select().from(enrollments)
      .where(and(
        eq(enrollments.userId, userId),
        eq(enrollments.formationId, formationId)
      ));
    return enrollment || undefined;
  }
  
  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    return db.select().from(enrollments)
      .where(eq(enrollments.userId, userId))
      .orderBy(desc(enrollments.enrolledAt));
  }
  
  async createEnrollment(data: InsertEnrollment): Promise<Enrollment> {
    const [enrollment] = await db.insert(enrollments).values(data).returning();
    return enrollment;
  }
  
  async updateEnrollment(id: number, data: Partial<InsertEnrollment>): Promise<Enrollment | undefined> {
    const [enrollment] = await db.update(enrollments)
      .set(data)
      .where(eq(enrollments.id, id))
      .returning();
    return enrollment || undefined;
  }
  
  // Module Progress
  async getModuleProgress(userId: string, moduleId: number): Promise<ModuleProgress | undefined> {
    const [progress] = await db.select().from(moduleProgress)
      .where(and(
        eq(moduleProgress.userId, userId),
        eq(moduleProgress.moduleId, moduleId)
      ));
    return progress || undefined;
  }
  
  async getUserProgressForFormation(userId: string, formationId: number): Promise<ModuleProgress[]> {
    const modules = await this.getCourseModules(formationId);
    const moduleIds = modules.map(m => m.id);
    if (moduleIds.length === 0) return [];
    
    return db.select().from(moduleProgress)
      .where(and(
        eq(moduleProgress.userId, userId),
        sql`${moduleProgress.moduleId} IN (${sql.join(moduleIds.map(id => sql`${id}`), sql`, `)})`
      ));
  }
  
  async updateModuleProgress(userId: string, moduleId: number, data: Partial<InsertModuleProgress>): Promise<ModuleProgress> {
    const existing = await this.getModuleProgress(userId, moduleId);
    
    if (existing) {
      const [updated] = await db.update(moduleProgress)
        .set({ ...data, lastWatchedAt: new Date() })
        .where(eq(moduleProgress.id, existing.id))
        .returning();
      return updated;
    }
    
    const [created] = await db.insert(moduleProgress).values({
      userId,
      moduleId,
      ...data,
      lastWatchedAt: new Date(),
    }).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
