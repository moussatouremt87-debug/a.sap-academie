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
  type NurturingSequence, type InsertNurturingSequence,
  type NurturingStep, type InsertNurturingStep,
  type LeadNurturing, type InsertLeadNurturing,
  type NurturingAction, type InsertNurturingAction,
  type Document, type InsertDocument,
  type DocumentFolder, type InsertDocumentFolder,
  type DocumentShare, type InsertDocumentShare,
  type DocumentComment, type InsertDocumentComment,
  type DocumentActivity, type InsertDocumentActivity,
  conversations, messages, formations, faqs, leads, leadActivities,
  courseModules, enrollments, moduleProgress,
  nurturingSequences, nurturingSteps, leadNurturing, nurturingActions,
  documents, documentFolders, documentShares, documentComments, documentActivities,
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
  
  // Nurturing Sequences
  getNurturingSequence(id: number): Promise<NurturingSequence | undefined>;
  getAllNurturingSequences(): Promise<NurturingSequence[]>;
  getActiveNurturingSequences(): Promise<NurturingSequence[]>;
  getNurturingSequencesByTrigger(triggerEvent: string, source?: string): Promise<NurturingSequence[]>;
  createNurturingSequence(data: InsertNurturingSequence): Promise<NurturingSequence>;
  updateNurturingSequence(id: number, data: Partial<InsertNurturingSequence>): Promise<NurturingSequence | undefined>;
  deleteNurturingSequence(id: number): Promise<void>;
  
  // Nurturing Steps
  getNurturingSteps(sequenceId: number): Promise<NurturingStep[]>;
  getNurturingStep(id: number): Promise<NurturingStep | undefined>;
  createNurturingStep(data: InsertNurturingStep): Promise<NurturingStep>;
  updateNurturingStep(id: number, data: Partial<InsertNurturingStep>): Promise<NurturingStep | undefined>;
  deleteNurturingStep(id: number): Promise<void>;
  
  // Lead Nurturing
  getLeadNurturing(leadId: number, sequenceId: number): Promise<LeadNurturing | undefined>;
  getLeadNurturingById(id: number): Promise<LeadNurturing | undefined>;
  getActiveLeadNurturing(leadId: number): Promise<LeadNurturing[]>;
  getPendingNurturingActions(): Promise<NurturingAction[]>;
  createLeadNurturing(data: InsertLeadNurturing): Promise<LeadNurturing>;
  updateLeadNurturing(id: number, data: Partial<InsertLeadNurturing>): Promise<LeadNurturing | undefined>;
  
  // Nurturing Actions
  getNurturingActions(leadNurturingId: number): Promise<NurturingAction[]>;
  createNurturingAction(data: InsertNurturingAction): Promise<NurturingAction>;
  updateNurturingAction(id: number, data: Partial<InsertNurturingAction>): Promise<NurturingAction | undefined>;
  
  // Documents
  getDocument(id: number): Promise<Document | undefined>;
  getDocumentsByOwner(ownerId: string): Promise<Document[]>;
  getDocumentsByFolder(folderId: number): Promise<Document[]>;
  createDocument(data: InsertDocument): Promise<Document>;
  updateDocument(id: number, data: Partial<InsertDocument>): Promise<Document | undefined>;
  deleteDocument(id: number): Promise<void>;
  
  // Document Folders
  getFolder(id: number): Promise<DocumentFolder | undefined>;
  getFoldersByOwner(ownerId: string): Promise<DocumentFolder[]>;
  createFolder(data: InsertDocumentFolder): Promise<DocumentFolder>;
  deleteFolder(id: number): Promise<void>;
  
  // Document Shares
  getDocumentShare(id: number): Promise<DocumentShare | undefined>;
  getDocumentShareByToken(token: string): Promise<DocumentShare | undefined>;
  getSharesForDocument(documentId: number): Promise<DocumentShare[]>;
  getSharesForUser(userId: string): Promise<DocumentShare[]>;
  createDocumentShare(data: InsertDocumentShare): Promise<DocumentShare>;
  updateDocumentShare(id: number, data: Partial<InsertDocumentShare>): Promise<DocumentShare | undefined>;
  deleteDocumentShare(id: number): Promise<void>;
  
  // Document Comments
  getDocumentComments(documentId: number): Promise<DocumentComment[]>;
  createDocumentComment(data: InsertDocumentComment): Promise<DocumentComment>;
  updateDocumentComment(id: number, data: Partial<InsertDocumentComment>): Promise<DocumentComment | undefined>;
  deleteDocumentComment(id: number): Promise<void>;
  
  // Document Activities
  getDocumentActivities(documentId: number): Promise<DocumentActivity[]>;
  createDocumentActivity(data: InsertDocumentActivity): Promise<DocumentActivity>;
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
  
  // Nurturing Sequences
  async getNurturingSequence(id: number): Promise<NurturingSequence | undefined> {
    const [sequence] = await db.select().from(nurturingSequences).where(eq(nurturingSequences.id, id));
    return sequence || undefined;
  }
  
  async getAllNurturingSequences(): Promise<NurturingSequence[]> {
    return db.select().from(nurturingSequences).orderBy(desc(nurturingSequences.createdAt));
  }
  
  async getActiveNurturingSequences(): Promise<NurturingSequence[]> {
    return db.select().from(nurturingSequences)
      .where(eq(nurturingSequences.isActive, true))
      .orderBy(desc(nurturingSequences.createdAt));
  }
  
  async getNurturingSequencesByTrigger(triggerEvent: string, source?: string): Promise<NurturingSequence[]> {
    if (source) {
      return db.select().from(nurturingSequences)
        .where(and(
          eq(nurturingSequences.isActive, true),
          eq(nurturingSequences.triggerEvent, triggerEvent),
          sql`(${nurturingSequences.targetSource} IS NULL OR ${nurturingSequences.targetSource} = ${source})`
        ));
    }
    return db.select().from(nurturingSequences)
      .where(and(
        eq(nurturingSequences.isActive, true),
        eq(nurturingSequences.triggerEvent, triggerEvent)
      ));
  }
  
  async createNurturingSequence(data: InsertNurturingSequence): Promise<NurturingSequence> {
    const [sequence] = await db.insert(nurturingSequences).values(data).returning();
    return sequence;
  }
  
  async updateNurturingSequence(id: number, data: Partial<InsertNurturingSequence>): Promise<NurturingSequence | undefined> {
    const [sequence] = await db.update(nurturingSequences)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(nurturingSequences.id, id))
      .returning();
    return sequence || undefined;
  }
  
  async deleteNurturingSequence(id: number): Promise<void> {
    await db.delete(nurturingSequences).where(eq(nurturingSequences.id, id));
  }
  
  // Nurturing Steps
  async getNurturingSteps(sequenceId: number): Promise<NurturingStep[]> {
    return db.select().from(nurturingSteps)
      .where(eq(nurturingSteps.sequenceId, sequenceId))
      .orderBy(nurturingSteps.stepOrder);
  }
  
  async getNurturingStep(id: number): Promise<NurturingStep | undefined> {
    const [step] = await db.select().from(nurturingSteps).where(eq(nurturingSteps.id, id));
    return step || undefined;
  }
  
  async createNurturingStep(data: InsertNurturingStep): Promise<NurturingStep> {
    const [step] = await db.insert(nurturingSteps).values(data).returning();
    return step;
  }
  
  async updateNurturingStep(id: number, data: Partial<InsertNurturingStep>): Promise<NurturingStep | undefined> {
    const [step] = await db.update(nurturingSteps)
      .set(data)
      .where(eq(nurturingSteps.id, id))
      .returning();
    return step || undefined;
  }
  
  async deleteNurturingStep(id: number): Promise<void> {
    await db.delete(nurturingSteps).where(eq(nurturingSteps.id, id));
  }
  
  // Lead Nurturing
  async getLeadNurturing(leadId: number, sequenceId: number): Promise<LeadNurturing | undefined> {
    const [nurturing] = await db.select().from(leadNurturing)
      .where(and(
        eq(leadNurturing.leadId, leadId),
        eq(leadNurturing.sequenceId, sequenceId)
      ));
    return nurturing || undefined;
  }
  
  async getLeadNurturingById(id: number): Promise<LeadNurturing | undefined> {
    const [nurturing] = await db.select().from(leadNurturing)
      .where(eq(leadNurturing.id, id));
    return nurturing || undefined;
  }
  
  async getActiveLeadNurturing(leadId: number): Promise<LeadNurturing[]> {
    return db.select().from(leadNurturing)
      .where(and(
        eq(leadNurturing.leadId, leadId),
        eq(leadNurturing.status, "active")
      ));
  }
  
  async getPendingNurturingActions(): Promise<NurturingAction[]> {
    return db.select().from(nurturingActions)
      .where(and(
        eq(nurturingActions.status, "pending"),
        lte(nurturingActions.scheduledAt, new Date())
      ))
      .orderBy(nurturingActions.scheduledAt);
  }
  
  async createLeadNurturing(data: InsertLeadNurturing): Promise<LeadNurturing> {
    const [nurturing] = await db.insert(leadNurturing).values(data).returning();
    return nurturing;
  }
  
  async updateLeadNurturing(id: number, data: Partial<InsertLeadNurturing>): Promise<LeadNurturing | undefined> {
    const [nurturing] = await db.update(leadNurturing)
      .set(data)
      .where(eq(leadNurturing.id, id))
      .returning();
    return nurturing || undefined;
  }
  
  // Nurturing Actions
  async getNurturingActions(leadNurturingId: number): Promise<NurturingAction[]> {
    return db.select().from(nurturingActions)
      .where(eq(nurturingActions.leadNurturingId, leadNurturingId))
      .orderBy(nurturingActions.scheduledAt);
  }
  
  async createNurturingAction(data: InsertNurturingAction): Promise<NurturingAction> {
    const [action] = await db.insert(nurturingActions).values(data).returning();
    return action;
  }
  
  async updateNurturingAction(id: number, data: Partial<InsertNurturingAction>): Promise<NurturingAction | undefined> {
    const [action] = await db.update(nurturingActions)
      .set(data)
      .where(eq(nurturingActions.id, id))
      .returning();
    return action || undefined;
  }
  
  // ============ DOCUMENT MANAGEMENT ============
  
  async getDocument(id: number): Promise<Document | undefined> {
    const [doc] = await db.select().from(documents).where(eq(documents.id, id));
    return doc || undefined;
  }
  
  async getDocumentsByOwner(ownerId: string): Promise<Document[]> {
    return db.select().from(documents)
      .where(eq(documents.ownerId, ownerId))
      .orderBy(desc(documents.createdAt));
  }
  
  async getDocumentsByFolder(folderId: number): Promise<Document[]> {
    return db.select().from(documents)
      .where(eq(documents.folderId, folderId))
      .orderBy(desc(documents.createdAt));
  }
  
  async createDocument(data: InsertDocument): Promise<Document> {
    const [doc] = await db.insert(documents).values(data).returning();
    return doc;
  }
  
  async updateDocument(id: number, data: Partial<InsertDocument>): Promise<Document | undefined> {
    const [doc] = await db.update(documents)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(documents.id, id))
      .returning();
    return doc || undefined;
  }
  
  async deleteDocument(id: number): Promise<void> {
    await db.delete(documents).where(eq(documents.id, id));
  }
  
  // Document Folders
  async getFolder(id: number): Promise<DocumentFolder | undefined> {
    const [folder] = await db.select().from(documentFolders).where(eq(documentFolders.id, id));
    return folder || undefined;
  }
  
  async getFoldersByOwner(ownerId: string): Promise<DocumentFolder[]> {
    return db.select().from(documentFolders)
      .where(eq(documentFolders.ownerId, ownerId))
      .orderBy(documentFolders.name);
  }
  
  async createFolder(data: InsertDocumentFolder): Promise<DocumentFolder> {
    const [folder] = await db.insert(documentFolders).values(data).returning();
    return folder;
  }
  
  async deleteFolder(id: number): Promise<void> {
    await db.delete(documentFolders).where(eq(documentFolders.id, id));
  }
  
  // Document Shares
  async getDocumentShare(id: number): Promise<DocumentShare | undefined> {
    const [share] = await db.select().from(documentShares).where(eq(documentShares.id, id));
    return share || undefined;
  }
  
  async getDocumentShareByToken(token: string): Promise<DocumentShare | undefined> {
    const [share] = await db.select().from(documentShares).where(eq(documentShares.shareToken, token));
    return share || undefined;
  }
  
  async getSharesForDocument(documentId: number): Promise<DocumentShare[]> {
    return db.select().from(documentShares)
      .where(eq(documentShares.documentId, documentId))
      .orderBy(desc(documentShares.createdAt));
  }
  
  async getSharesForUser(userId: string): Promise<DocumentShare[]> {
    return db.select().from(documentShares)
      .where(eq(documentShares.sharedWithUserId, userId))
      .orderBy(desc(documentShares.createdAt));
  }
  
  async createDocumentShare(data: InsertDocumentShare): Promise<DocumentShare> {
    const [share] = await db.insert(documentShares).values(data).returning();
    return share;
  }
  
  async updateDocumentShare(id: number, data: Partial<InsertDocumentShare>): Promise<DocumentShare | undefined> {
    const [share] = await db.update(documentShares)
      .set(data)
      .where(eq(documentShares.id, id))
      .returning();
    return share || undefined;
  }
  
  async deleteDocumentShare(id: number): Promise<void> {
    await db.delete(documentShares).where(eq(documentShares.id, id));
  }
  
  // Document Comments
  async getDocumentComments(documentId: number): Promise<DocumentComment[]> {
    return db.select().from(documentComments)
      .where(eq(documentComments.documentId, documentId))
      .orderBy(documentComments.createdAt);
  }
  
  async createDocumentComment(data: InsertDocumentComment): Promise<DocumentComment> {
    const [comment] = await db.insert(documentComments).values(data).returning();
    return comment;
  }
  
  async updateDocumentComment(id: number, data: Partial<InsertDocumentComment>): Promise<DocumentComment | undefined> {
    const [comment] = await db.update(documentComments)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(documentComments.id, id))
      .returning();
    return comment || undefined;
  }
  
  async deleteDocumentComment(id: number): Promise<void> {
    await db.delete(documentComments).where(eq(documentComments.id, id));
  }
  
  // Document Activities
  async getDocumentActivities(documentId: number): Promise<DocumentActivity[]> {
    return db.select().from(documentActivities)
      .where(eq(documentActivities.documentId, documentId))
      .orderBy(desc(documentActivities.createdAt));
  }
  
  async createDocumentActivity(data: InsertDocumentActivity): Promise<DocumentActivity> {
    const [activity] = await db.insert(documentActivities).values(data).returning();
    return activity;
  }
}

export const storage = new DatabaseStorage();
