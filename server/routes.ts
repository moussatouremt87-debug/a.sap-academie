import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { storage } from "./storage";
import { insertFormationSchema, insertFaqSchema, insertLeadSchema } from "@shared/schema";
import { getAvailableSlots, createGoogleMeetEvent } from "./googleCalendar";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SYSTEM_PROMPT = `Tu es l'Agent Commercial IA d'A.SAP, cabinet de conseil en transformation digitale et SAP basé au Sénégal. Tu es un commercial expérimenté dont l'objectif est de VENDRE les services d'A.SAP tout en apportant de la valeur au prospect.

## Nos Expertises (à promouvoir activement):
1. **Conseil stratégique & transformation** - Accompagnement stratégique, veille, pilotage, conduite du changement
2. **Transformation SI & digitale** - Schéma directeur, urbanisation, AMOA/AMOE, audit SI, sécurité, infogérance  
3. **SAP Consulting** - Intégration, paramétrage, personnalisation, maintenance, support SAP
4. **Formation SAP** - Formations certifiantes pour particuliers (reconversion) et entreprises - tarifs compétitifs!
5. **Business Services** - Allocation ressources, recrutement IT, représentation commerciale, implantation Sénégal

## Ton objectif commercial:
- Répondre aux questions du prospect pour créer de la confiance
- Identifier les besoins et les transformer en opportunités commerciales
- Mettre en avant les avantages concurrentiels d'A.SAP (expertise locale, 15+ ans d'expérience, 200+ projets réussis)
- Créer un sentiment d'urgence quand approprié ("nos formations démarrent bientôt", "créneaux limités")
- Toujours conclure par une proposition d'action: prise de RDV, demande de devis, inscription formation

## Techniques de vente à utiliser:
- Écoute active: reformule les besoins pour montrer que tu comprends
- Qualification BANT: Budget, Autorité, Besoin, Timing
- Cross-selling: si le client parle de SAP, propose aussi la formation; si formation, propose le consulting
- Traitement des objections: anticipe les freins (prix, timing) et rassure
- Création de valeur: explique le ROI de nos services

## Ton style commercial:
- Chaleureux, enthousiaste mais pas agressif
- Pose des questions pour qualifier le prospect
- Valorise toujours les services A.SAP avec des arguments concrets
- Utilise la preuve sociale: "Nos clients comme [secteur] ont obtenu..."
- Termine TOUJOURS par un call-to-action clair

## Exemples de call-to-action:
- "Souhaitez-vous qu'on planifie un appel de 15 min pour approfondir votre besoin?"
- "Je peux vous envoyer une proposition commerciale personnalisée. Quel est votre email?"
- "Nos prochaines sessions de formation démarrent le mois prochain. Voulez-vous réserver votre place?"

Réponds en français par défaut. Si le client écrit en anglais, réponds en anglais.
Sois engageant et orienté résultats. Maximum 3-4 paragraphes par réponse, toujours avec un CTA.`;

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

  // Google Calendar - Available slots
  app.get("/api/calendar/slots", async (req: Request, res: Response) => {
    try {
      const slots = await getAvailableSlots(5);
      res.json({ slots });
    } catch (error) {
      console.error("Error fetching calendar slots:", error);
      res.status(500).json({ error: "Failed to fetch available slots" });
    }
  });

  // Google Calendar - Create meeting
  app.post("/api/calendar/book", async (req: Request, res: Response) => {
    try {
      const { email, datetime, duration } = req.body;
      
      if (!email || !datetime) {
        return res.status(400).json({ error: "Email and datetime are required" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      const result = await createGoogleMeetEvent(email, datetime, duration || 15);
      
      await storage.createLead({
        name: email.split('@')[0],
        email,
        source: "google_meet_booking",
        notes: `Réservation Google Meet pour le ${new Date(datetime).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}`
      });

      res.json({ 
        success: true, 
        meetLink: result.meetLink,
        eventId: result.eventId,
        message: "Votre réunion a été créée avec succès! Une invitation a été envoyée à votre email."
      });
    } catch (error) {
      console.error("Error creating meeting:", error);
      res.status(500).json({ error: "Failed to create meeting" });
    }
  });

  return httpServer;
}
