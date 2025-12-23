import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { storage } from "./storage";
import { insertFormationSchema, insertFaqSchema, insertLeadSchema } from "@shared/schema";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SYSTEM_PROMPT = `Tu es l'Agent IA d'A.SAP, cabinet de conseil en transformation digitale et SAP basé au Sénégal.

Expertises A.SAP:
1. Conseil stratégique & transformation - Accompagnement stratégique, veille, pilotage, conduite du changement
2. Transformation SI & digitale - Schéma directeur, urbanisation, AMOA/AMOE, audit SI, sécurité, infogérance
3. SAP Consulting - Intégration, paramétrage, personnalisation, maintenance, support SAP
4. Formation SAP - Formations certifiantes pour particuliers (reconversion) et entreprises
5. Business Services - Allocation ressources, recrutement IT, représentation commerciale, implantation Sénégal

Ton rôle:
- Comprendre le besoin client avec des questions ciblées et pertinentes
- Qualifier le projet (budget approximatif, urgence, niveau de maturité)
- Proposer des solutions adaptées parmi nos expertises
- Orienter vers le service le plus approprié
- Faciliter la prise de RDV (Google Meet ou Microsoft Teams)

Ton style:
- Professionnel mais accessible et bienveillant
- Questions courtes et précises, une à la fois
- Reformule pour confirmer ta compréhension
- Proactif dans la suggestion de prochaines étapes
- Utilise des bullet points pour la clarté

Réponds en français par défaut. Si le client écrit en anglais, réponds en anglais.
Sois concis mais complet. Maximum 3-4 paragraphes par réponse.`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // AI Chat endpoint with streaming
  app.post("/api/chat", async (req: Request, res: Response) => {
    try {
      const { message, messages: chatHistory } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Build messages array for OpenAI
      const chatMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
        { role: "system", content: SYSTEM_PROMPT },
      ];

      // Add chat history if available
      if (chatHistory && Array.isArray(chatHistory)) {
        for (const msg of chatHistory) {
          if (msg.role === "user" || msg.role === "assistant") {
            chatMessages.push({ role: msg.role, content: msg.content });
          }
        }
      }

      // Add current message
      chatMessages.push({ role: "user", content: message });

      // Set up SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      // Stream response from OpenAI
      const stream = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: chatMessages,
        stream: true,
        max_completion_tokens: 1024,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
      res.end();
    } catch (error) {
      console.error("Chat error:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "An error occurred" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to process chat" });
      }
    }
  });

  // Formations endpoints
  app.get("/api/formations", async (req: Request, res: Response) => {
    try {
      const formationsList = await storage.getPublishedFormations();
      res.json(formationsList);
    } catch (error) {
      console.error("Error fetching formations:", error);
      res.status(500).json({ error: "Failed to fetch formations" });
    }
  });

  app.get("/api/formations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const formation = await storage.getFormation(id);
      if (!formation) {
        return res.status(404).json({ error: "Formation not found" });
      }
      res.json(formation);
    } catch (error) {
      console.error("Error fetching formation:", error);
      res.status(500).json({ error: "Failed to fetch formation" });
    }
  });

  // FAQs endpoints
  app.get("/api/faqs", async (req: Request, res: Response) => {
    try {
      const faqsList = await storage.getPublishedFaqs();
      res.json(faqsList);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      res.status(500).json({ error: "Failed to fetch FAQs" });
    }
  });

  // Leads endpoint
  app.post("/api/leads", async (req: Request, res: Response) => {
    try {
      const result = insertLeadSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid lead data", details: result.error.issues });
      }
      const lead = await storage.createLead(result.data);
      res.status(201).json(lead);
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  return httpServer;
}
