import {
  type User, type InsertUser,
  type Conversation, type InsertConversation,
  type Message, type InsertMessage,
  type Formation, type InsertFormation,
  type Faq, type InsertFaq,
  type Lead, type InsertLead,
  users, conversations, messages, formations, faqs, leads,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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
  getAllLeads(): Promise<Lead[]>;
  createLead(data: InsertLead): Promise<Lead>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

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

  async getAllLeads(): Promise<Lead[]> {
    return db.select().from(leads).orderBy(desc(leads.createdAt));
  }

  async createLead(data: InsertLead): Promise<Lead> {
    const [lead] = await db.insert(leads).values(data).returning();
    return lead;
  }
}

export const storage = new DatabaseStorage();
