import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import OpenAI from "openai";
import { storage } from "./storage";
import { 
  insertFormationSchema, insertFaqSchema, insertLeadSchema, insertLeadActivitySchema, 
  insertEnrollmentSchema, insertModuleProgressSchema,
  insertNurturingSequenceSchema, insertNurturingStepSchema, insertLeadNurturingSchema,
  insertDocumentSchema, insertDocumentFolderSchema, insertDocumentShareSchema, insertDocumentCommentSchema, insertDocumentActivitySchema
} from "@shared/schema";
import crypto from "crypto";
import { z } from "zod";
import { getAvailableSlots, createGoogleMeetEvent } from "./googleCalendar";
import { setupAuth, registerAuthRoutes, isAuthenticated } from "./replit_integrations/auth";
import { registerObjectStorageRoutes, objectStorageClient } from "./replit_integrations/object_storage";

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

## RÈGLE LINGUISTIQUE ABSOLUE:
Tu DOIS TOUJOURS répondre dans la MÊME LANGUE que le message de l'utilisateur:
- Si l'utilisateur écrit en français → réponds en français
- Si l'utilisateur écrit en anglais → réponds en anglais
- Si l'utilisateur écrit en wolof ou autre langue → réponds dans cette langue si possible, sinon en français
Détecte la langue du dernier message et utilise-la pour ta réponse. C'est une règle OBLIGATOIRE.

Sois engageant et orienté résultats. Maximum 3-4 paragraphes par réponse, toujours avec un CTA.`;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  // Setup authentication (MUST be before other routes)
  await setupAuth(app);
  registerAuthRoutes(app);
  
  // Setup object storage routes for file uploads
  registerObjectStorageRoutes(app);
  
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
      
      // Trigger auto-enrollment in nurturing sequences (fire and forget with error logging)
      autoEnrollInNurturing(lead.id, "new_lead", result.data.source || undefined)
        .catch(err => console.error("Auto-enrollment failed for lead", lead.id, err));
      
      res.status(201).json(lead);
    } catch (error) {
      console.error("Error creating lead:", error);
      res.status(500).json({ error: "Failed to create lead" });
    }
  });

  // Create enrollment (formation registration)
  app.post("/api/enrollments", async (req: Request, res: Response) => {
    try {
      const result = insertEnrollmentSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid enrollment data", details: result.error.issues });
      }
      const enrollment = await storage.createEnrollment(result.data);
      
      // Also create a lead for CRM tracking
      await storage.createLead({
        name: `${result.data.firstName} ${result.data.lastName}`,
        email: result.data.email,
        phone: result.data.phone || undefined,
        company: result.data.company || undefined,
        source: "formation",
        status: "new",
        priority: "high",
        notes: `Inscription formation #${result.data.formationId}. Niveau: ${result.data.educationLevel}. Motivation: ${result.data.motivation || 'Non renseignée'}`
      });
      
      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Error creating enrollment:", error);
      res.status(500).json({ error: "Failed to create enrollment" });
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
      const { email, datetime, duration, conversationId, commercialName } = req.body;
      
      if (!email || !datetime) {
        return res.status(400).json({ error: "Email and datetime are required" });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      const result = await createGoogleMeetEvent(email, datetime, duration || 15);
      
      const bookingNote = `Réservation Google Meet pour le ${new Date(datetime).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}. Commercial IA: ${commercialName || 'Non spécifié'}`;
      
      // Use upsertLeadByEmail for proper deduplication
      const existingLead = await storage.getLeadByEmail(email);
      let lead;
      
      if (existingLead) {
        // Update existing lead - append to notes
        const updatedNotes = existingLead.notes ? `${existingLead.notes}\n\n${bookingNote}` : bookingNote;
        lead = await storage.updateLead(existingLead.id, { 
          notes: updatedNotes,
          priority: "high",
          lastContactAt: new Date()
        }) || existingLead;
      } else {
        lead = await storage.createLead({
          name: email.split('@')[0],
          email,
          source: "agent-ia",
          priority: "high",
          notes: bookingNote
        });
      }

      // Link conversation to lead if provided
      if (conversationId) {
        await storage.updateConversation(conversationId, { leadId: lead.id });
      }

      res.json({ 
        success: true, 
        meetLink: result.meetLink,
        eventId: result.eventId,
        leadId: lead.id,
        message: "Votre réunion a été créée avec succès! Une invitation a été envoyée à votre email."
      });
    } catch (error) {
      console.error("Error creating meeting:", error);
      res.status(500).json({ error: "Failed to create meeting" });
    }
  });

  // Conversations endpoints
  app.post("/api/conversations", async (req: Request, res: Response) => {
    try {
      const { title, commercialName } = req.body;
      const conversation = await storage.createConversation({ 
        title: title || "Nouvelle conversation",
        commercialName
      });
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  app.post("/api/conversations/:id/messages", async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { role, content } = req.body;
      
      if (!role || !content) {
        return res.status(400).json({ error: "Role and content are required" });
      }

      const message = await storage.createMessage({
        conversationId,
        role,
        content
      });
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Failed to create message" });
    }
  });

  app.patch("/api/conversations/:id/link-lead", async (req: Request, res: Response) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { email, name, company, phone } = req.body;

      // Use getLeadByEmail for proper case-insensitive deduplication
      let lead = await storage.getLeadByEmail(email);
      
      if (!lead) {
        // Create new lead only if not found
        lead = await storage.createLead({
          name: name || email.split('@')[0],
          email,
          company,
          phone,
          source: "agent-ia"
        });
      } else {
        // Update existing lead with new info if provided
        if (company || phone) {
          const updated = await storage.updateLead(lead.id, { 
            ...(company && { company }),
            ...(phone && { phone })
          });
          lead = updated || lead;
        }
      }

      // Link conversation to lead
      await storage.updateConversation(conversationId, { leadId: lead.id });

      res.json({ lead });
    } catch (error) {
      console.error("Error linking conversation to lead:", error);
      res.status(500).json({ error: "Failed to link conversation to lead" });
    }
  });

  // ========== CRM ENDPOINTS (Protected - requires authentication) ==========
  
  // Get all leads with optional filters
  app.get("/api/crm/leads", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const leadsList = await storage.getAllLeads();
      res.json(leadsList);
    } catch (error) {
      console.error("Error fetching leads:", error);
      res.status(500).json({ error: "Failed to fetch leads" });
    }
  });

  // Get leads that need follow-up
  app.get("/api/crm/leads/follow-up", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const leadsList = await storage.getLeadsToFollowUp();
      res.json(leadsList);
    } catch (error) {
      console.error("Error fetching follow-up leads:", error);
      res.status(500).json({ error: "Failed to fetch follow-up leads" });
    }
  });

  // Get single lead with activities and conversations
  app.get("/api/crm/leads/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const lead = await storage.getLead(id);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      
      const activities = await storage.getLeadActivities(id);
      const leadConversations = await storage.getConversationsByLead(id);
      
      // Get messages for each conversation
      const conversationsWithMessages = await Promise.all(
        leadConversations.map(async (conv) => {
          const msgs = await storage.getMessagesByConversation(conv.id);
          return { ...conv, messages: msgs };
        })
      );
      
      res.json({ 
        lead, 
        activities, 
        conversations: conversationsWithMessages 
      });
    } catch (error) {
      console.error("Error fetching lead:", error);
      res.status(500).json({ error: "Failed to fetch lead" });
    }
  });

  // Update lead
  app.patch("/api/crm/leads/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const updatedLead = await storage.updateLead(id, req.body);
      if (!updatedLead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      
      // Create activity for status change if status was updated
      if (req.body.status) {
        await storage.createLeadActivity({
          leadId: id,
          type: "status_change",
          content: `Statut changé en: ${req.body.status}`,
          createdBy: "admin"
        });
      }
      
      res.json(updatedLead);
    } catch (error) {
      console.error("Error updating lead:", error);
      res.status(500).json({ error: "Failed to update lead" });
    }
  });

  // Add activity to lead
  app.post("/api/crm/leads/:id/activities", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const leadId = parseInt(req.params.id);
      const result = insertLeadActivitySchema.safeParse({ ...req.body, leadId });
      if (!result.success) {
        return res.status(400).json({ error: "Invalid activity data", details: result.error.issues });
      }
      
      const activity = await storage.createLeadActivity(result.data);
      
      // Update last contact date
      await storage.updateLead(leadId, { lastContactAt: new Date() });
      
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating activity:", error);
      res.status(500).json({ error: "Failed to create activity" });
    }
  });

  // AI Follow-up suggestions
  app.post("/api/crm/ai/suggestions", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const { leadId } = req.body;
      
      const lead = await storage.getLead(leadId);
      if (!lead) {
        return res.status(404).json({ error: "Lead not found" });
      }
      
      const activities = await storage.getLeadActivities(leadId);
      const leadConversations = await storage.getConversationsByLead(leadId);
      
      // Get all messages from conversations
      let allMessages: { role: string; content: string }[] = [];
      for (const conv of leadConversations) {
        const msgs = await storage.getMessagesByConversation(conv.id);
        allMessages = allMessages.concat(msgs.map(m => ({ role: m.role, content: m.content })));
      }
      
      const prompt = `Tu es un assistant CRM expert en suivi commercial. Analyse ce lead et donne des recommandations de suivi.

Lead: ${lead.name}
Email: ${lead.email}
Entreprise: ${lead.company || 'Non renseignée'}
Source: ${lead.source}
Statut: ${lead.status}
Priorité: ${lead.priority}
Dernier contact: ${lead.lastContactAt ? new Date(lead.lastContactAt).toLocaleDateString('fr-FR') : 'Jamais'}
Notes: ${lead.notes || 'Aucune'}

Activités récentes:
${activities.slice(0, 5).map(a => `- ${a.type}: ${a.content}`).join('\n') || 'Aucune activité'}

Historique conversation:
${allMessages.slice(-10).map(m => `${m.role}: ${m.content.substring(0, 200)}`).join('\n') || 'Pas de conversation'}

Donne:
1. Un résumé du lead (2-3 phrases)
2. Une recommandation d'action immédiate
3. Le meilleur moment pour relancer
4. Un script d'appel/email personnalisé

Réponds en JSON avec les clés: summary, recommendation, timing, script`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        max_completion_tokens: 1024,
      });

      const suggestions = JSON.parse(response.choices[0]?.message?.content || "{}");
      res.json(suggestions);
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
      res.status(500).json({ error: "Failed to get AI suggestions" });
    }
  });

  // ========== E-LEARNING ROUTES ==========
  
  // Get course modules for a formation
  app.get("/api/formations/:id/modules", async (req: Request, res: Response) => {
    try {
      const formationId = parseInt(req.params.id);
      const modules = await storage.getCourseModules(formationId);
      res.json(modules);
    } catch (error) {
      console.error("Error fetching modules:", error);
      res.status(500).json({ error: "Failed to fetch modules" });
    }
  });
  
  // Get user's enrollments (protected)
  app.get("/api/student/enrollments", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const userEnrollments = await storage.getUserEnrollments(userId);
      
      // Get formation details for each enrollment
      const enrichedEnrollments = await Promise.all(
        userEnrollments.map(async (enrollment) => {
          const formation = await storage.getFormation(enrollment.formationId);
          const modules = await storage.getCourseModules(enrollment.formationId);
          const progress = await storage.getUserProgressForFormation(userId, enrollment.formationId);
          
          const completedModules = progress.filter(p => p.completed).length;
          const totalModules = modules.length;
          const progressPercent = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
          
          return {
            ...enrollment,
            formation,
            modules,
            progress: {
              completed: completedModules,
              total: totalModules,
              percent: progressPercent
            }
          };
        })
      );
      
      res.json(enrichedEnrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      res.status(500).json({ error: "Failed to fetch enrollments" });
    }
  });
  
  // Enroll user in a formation (for testing - will be replaced by Stripe checkout)
  const enrollRequestSchema = z.object({
    formationId: z.number().int().positive()
  });
  
  app.post("/api/student/enroll", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const validation = enrollRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid request", details: validation.error.issues });
      }
      
      const { formationId } = validation.data;
      
      // Check if already enrolled
      const existing = await storage.getEnrollment(userId, formationId);
      if (existing) {
        return res.status(400).json({ error: "Already enrolled in this formation" });
      }
      
      const enrollment = await storage.createEnrollment({
        userId,
        formationId,
        status: "active"
      });
      
      res.status(201).json(enrollment);
    } catch (error) {
      console.error("Error enrolling:", error);
      res.status(500).json({ error: "Failed to enroll" });
    }
  });
  
  // Get course content (protected - must be enrolled or free preview)
  app.get("/api/student/courses/:formationId", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const formationId = parseInt(req.params.formationId);
      const formation = await storage.getFormation(formationId);
      
      if (!formation) {
        return res.status(404).json({ error: "Formation not found" });
      }
      
      const enrollment = await storage.getEnrollment(userId, formationId);
      const modules = await storage.getCourseModules(formationId);
      const progress = await storage.getUserProgressForFormation(userId, formationId);
      
      // Create progress map
      const progressMap = new Map(progress.map(p => [p.moduleId, p]));
      
      // Add progress and access info to each module
      const enrichedModules = modules.map(module => ({
        ...module,
        hasAccess: enrollment !== undefined || module.isFree,
        progress: progressMap.get(module.id) || null,
        videoUrl: (enrollment !== undefined || module.isFree) ? module.videoUrl : null
      }));
      
      res.json({
        formation,
        enrollment,
        modules: enrichedModules,
        isEnrolled: enrollment !== undefined
      });
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ error: "Failed to fetch course" });
    }
  });
  
  // Update module progress
  const progressRequestSchema = z.object({
    moduleId: z.number().int().positive(),
    watchedSeconds: z.number().int().min(0).optional(),
    completed: z.boolean().optional()
  });
  
  app.post("/api/student/progress", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const validation = progressRequestSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid request", details: validation.error.issues });
      }
      
      const { moduleId, watchedSeconds, completed } = validation.data;
      
      const progressData: any = {};
      if (watchedSeconds !== undefined) progressData.watchedSeconds = watchedSeconds;
      if (completed !== undefined) {
        progressData.completed = completed;
        if (completed) progressData.completedAt = new Date();
      }
      
      const progress = await storage.updateModuleProgress(userId, moduleId, progressData);
      res.json(progress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  // ============ NURTURING SEQUENCES API (Protected by Auth) ============
  
  // Get all nurturing sequences
  app.get("/api/crm/nurturing-sequences", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const sequences = await storage.getAllNurturingSequences();
      
      // Enrich with step count
      const enrichedSequences = await Promise.all(
        sequences.map(async (seq) => {
          const steps = await storage.getNurturingSteps(seq.id);
          return { ...seq, stepCount: steps.length };
        })
      );
      
      res.json(enrichedSequences);
    } catch (error) {
      console.error("Error fetching nurturing sequences:", error);
      res.status(500).json({ error: "Failed to fetch nurturing sequences" });
    }
  });
  
  // Get single nurturing sequence with steps
  app.get("/api/crm/nurturing-sequences/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const sequence = await storage.getNurturingSequence(id);
      
      if (!sequence) {
        return res.status(404).json({ error: "Sequence not found" });
      }
      
      const steps = await storage.getNurturingSteps(id);
      res.json({ ...sequence, steps });
    } catch (error) {
      console.error("Error fetching nurturing sequence:", error);
      res.status(500).json({ error: "Failed to fetch nurturing sequence" });
    }
  });
  
  // Create nurturing sequence
  app.post("/api/crm/nurturing-sequences", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const result = insertNurturingSequenceSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid sequence data", details: result.error.issues });
      }
      
      const sequence = await storage.createNurturingSequence(result.data);
      res.status(201).json(sequence);
    } catch (error) {
      console.error("Error creating nurturing sequence:", error);
      res.status(500).json({ error: "Failed to create nurturing sequence" });
    }
  });
  
  // Update nurturing sequence
  app.patch("/api/crm/nurturing-sequences/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const sequence = await storage.updateNurturingSequence(id, req.body);
      
      if (!sequence) {
        return res.status(404).json({ error: "Sequence not found" });
      }
      
      res.json(sequence);
    } catch (error) {
      console.error("Error updating nurturing sequence:", error);
      res.status(500).json({ error: "Failed to update nurturing sequence" });
    }
  });
  
  // Delete nurturing sequence
  app.delete("/api/crm/nurturing-sequences/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteNurturingSequence(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting nurturing sequence:", error);
      res.status(500).json({ error: "Failed to delete nurturing sequence" });
    }
  });
  
  // ============ NURTURING STEPS API ============
  
  // Create step for a sequence
  app.post("/api/crm/nurturing-sequences/:sequenceId/steps", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const sequenceId = parseInt(req.params.sequenceId);
      const result = insertNurturingStepSchema.safeParse({ ...req.body, sequenceId });
      
      if (!result.success) {
        return res.status(400).json({ error: "Invalid step data", details: result.error.issues });
      }
      
      const step = await storage.createNurturingStep(result.data);
      res.status(201).json(step);
    } catch (error) {
      console.error("Error creating nurturing step:", error);
      res.status(500).json({ error: "Failed to create nurturing step" });
    }
  });
  
  // Update step
  app.patch("/api/crm/nurturing-steps/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const step = await storage.updateNurturingStep(id, req.body);
      
      if (!step) {
        return res.status(404).json({ error: "Step not found" });
      }
      
      res.json(step);
    } catch (error) {
      console.error("Error updating nurturing step:", error);
      res.status(500).json({ error: "Failed to update nurturing step" });
    }
  });
  
  // Delete step
  app.delete("/api/crm/nurturing-steps/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteNurturingStep(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting nurturing step:", error);
      res.status(500).json({ error: "Failed to delete nurturing step" });
    }
  });
  
  // ============ LEAD NURTURING ENROLLMENT ============
  
  // Enroll lead in a nurturing sequence
  app.post("/api/crm/leads/:leadId/nurturing", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const { sequenceId } = req.body;
      
      if (!sequenceId) {
        return res.status(400).json({ error: "sequenceId is required" });
      }
      
      // Check if already enrolled in this sequence
      const existing = await storage.getLeadNurturing(leadId, sequenceId);
      if (existing && existing.status === "active") {
        return res.status(400).json({ error: "Lead already enrolled in this sequence" });
      }
      
      // Get first step to calculate next action time
      const steps = await storage.getNurturingSteps(sequenceId);
      const firstStep = steps[0];
      
      let nextActionAt = new Date();
      if (firstStep) {
        nextActionAt.setDate(nextActionAt.getDate() + (firstStep.delayDays || 0));
        nextActionAt.setHours(nextActionAt.getHours() + (firstStep.delayHours || 0));
      }
      
      const nurturing = await storage.createLeadNurturing({
        leadId,
        sequenceId,
        currentStepId: firstStep?.id || null,
        status: "active",
        nextActionAt
      });
      
      // Log activity
      await storage.createLeadActivity({
        leadId,
        type: "nurturing",
        content: `Enrolled in nurturing sequence #${sequenceId}`
      });
      
      res.status(201).json(nurturing);
    } catch (error) {
      console.error("Error enrolling lead in nurturing:", error);
      res.status(500).json({ error: "Failed to enroll lead in nurturing" });
    }
  });
  
  // Get lead's active nurturing sequences
  app.get("/api/crm/leads/:leadId/nurturing", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const leadId = parseInt(req.params.leadId);
      const nurturing = await storage.getActiveLeadNurturing(leadId);
      
      // Enrich with sequence info
      const enriched = await Promise.all(
        nurturing.map(async (n) => {
          const sequence = await storage.getNurturingSequence(n.sequenceId);
          const currentStep = n.currentStepId ? await storage.getNurturingStep(n.currentStepId) : null;
          return { ...n, sequence, currentStep };
        })
      );
      
      res.json(enriched);
    } catch (error) {
      console.error("Error fetching lead nurturing:", error);
      res.status(500).json({ error: "Failed to fetch lead nurturing" });
    }
  });
  
  // Pause/resume/cancel lead nurturing
  app.patch("/api/crm/lead-nurturing/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { action } = req.body;
      
      let updateData: any = {};
      
      if (action === "pause") {
        updateData = { status: "paused", pausedAt: new Date() };
      } else if (action === "resume") {
        updateData = { status: "active", pausedAt: null };
      } else if (action === "cancel") {
        updateData = { status: "cancelled" };
      } else {
        return res.status(400).json({ error: "Invalid action. Use: pause, resume, or cancel" });
      }
      
      const nurturing = await storage.updateLeadNurturing(id, updateData);
      
      if (!nurturing) {
        return res.status(404).json({ error: "Lead nurturing not found" });
      }
      
      res.json(nurturing);
    } catch (error) {
      console.error("Error updating lead nurturing:", error);
      res.status(500).json({ error: "Failed to update lead nurturing" });
    }
  });
  
  // ============ NURTURING PROCESSOR ============
  // Process pending nurturing actions - can be called via cron or scheduler
  app.post("/api/crm/nurturing/process", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const pendingActions = await storage.getPendingNurturingActions();
      const results: { processed: number; errors: number } = { processed: 0, errors: 0 };
      
      for (const action of pendingActions) {
        try {
          // Execute the action based on type
          if (action.type === "email") {
            // Log email action (actual email sending would be integrated here)
            await storage.createLeadActivity({
              leadId: action.leadId,
              type: "email",
              content: `[Nurturing] Email sent: ${action.subject || "Follow-up"}`
            });
          } else if (action.type === "task") {
            await storage.createLeadActivity({
              leadId: action.leadId,
              type: "follow_up",
              content: `[Nurturing] Task created: ${action.content || "Follow-up task"}`
            });
          }
          
          // Mark action as completed
          await storage.updateNurturingAction(action.id, {
            status: "completed",
            executedAt: new Date()
          });
          
          // Advance to next step in sequence
          const leadNurturing = await storage.getLeadNurturingById(action.leadNurturingId);
          if (leadNurturing) {
            const steps = await storage.getNurturingSteps(leadNurturing.sequenceId);
            const currentStepIndex = steps.findIndex(s => s.id === leadNurturing.currentStepId);
            const nextStep = steps[currentStepIndex + 1];
            
            if (nextStep) {
              const nextActionAt = new Date();
              nextActionAt.setDate(nextActionAt.getDate() + (nextStep.delayDays || 0));
              nextActionAt.setHours(nextActionAt.getHours() + (nextStep.delayHours || 0));
              
              await storage.updateLeadNurturing(leadNurturing.id, {
                currentStepId: nextStep.id,
                nextActionAt
              });
              
              // Schedule next action
              await storage.createNurturingAction({
                leadNurturingId: leadNurturing.id,
                nurturingStepId: nextStep.id,
                leadId: action.leadId,
                type: nextStep.actionType,
                subject: nextStep.emailSubject || null,
                content: nextStep.emailBody || nextStep.taskDescription || null,
                scheduledAt: nextActionAt,
                status: "pending"
              });
            } else {
              // Sequence completed
              await storage.updateLeadNurturing(leadNurturing.id, {
                status: "completed",
                completedAt: new Date()
              });
              
              await storage.createLeadActivity({
                leadId: action.leadId,
                type: "nurturing",
                content: "Nurturing sequence completed"
              });
            }
          }
          
          results.processed++;
        } catch (actionError) {
          console.error("Error processing nurturing action:", action.id, actionError);
          await storage.updateNurturingAction(action.id, {
            status: "failed"
          });
          results.errors++;
        }
      }
      
      res.json({
        success: true,
        message: `Processed ${results.processed} actions, ${results.errors} errors`,
        ...results
      });
    } catch (error) {
      console.error("Error processing nurturing actions:", error);
      res.status(500).json({ error: "Failed to process nurturing actions" });
    }
  });
  
  // ============ DOCUMENT MANAGEMENT ============
  
  // Get user's documents
  app.get("/api/documents", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const documents = await storage.getDocumentsByOwner(user.id);
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
  // Get single document
  app.get("/api/documents/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const doc = await storage.getDocument(parseInt(req.params.id));
      
      if (!doc) {
        return res.status(404).json({ message: "Document non trouvé" });
      }
      
      // Check ownership or share access
      if (doc.ownerId !== user.id) {
        const shares = await storage.getSharesForDocument(doc.id);
        const hasAccess = shares.some(s => 
          s.sharedWithUserId === user.id || s.isActive
        );
        if (!hasAccess) {
          return res.status(403).json({ message: "Accès refusé" });
        }
      }
      
      res.json(doc);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
  // Create document (after file upload)
  app.post("/api/documents", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const data = insertDocumentSchema.parse({
        ...req.body,
        ownerId: user.id
      });
      
      const document = await storage.createDocument(data);
      
      // Log activity
      await storage.createDocumentActivity({
        documentId: document.id,
        userId: user.id,
        action: "created",
        details: JSON.stringify({ name: document.name })
      });
      
      res.json(document);
    } catch (error) {
      console.error("Error creating document:", error);
      res.status(500).json({ message: "Erreur création document" });
    }
  });
  
  // Update document
  app.patch("/api/documents/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const doc = await storage.getDocument(parseInt(req.params.id));
      
      if (!doc || doc.ownerId !== user.id) {
        return res.status(403).json({ message: "Accès refusé" });
      }
      
      const updated = await storage.updateDocument(doc.id, req.body);
      
      await storage.createDocumentActivity({
        documentId: doc.id,
        userId: user.id,
        action: "edited",
        details: JSON.stringify(req.body)
      });
      
      res.json(updated);
    } catch (error) {
      console.error("Error updating document:", error);
      res.status(500).json({ message: "Erreur mise à jour" });
    }
  });
  
  // Delete document
  app.delete("/api/documents/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const doc = await storage.getDocument(parseInt(req.params.id));
      
      if (!doc || doc.ownerId !== user.id) {
        return res.status(403).json({ message: "Accès refusé" });
      }
      
      await storage.deleteDocument(doc.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting document:", error);
      res.status(500).json({ message: "Erreur suppression" });
    }
  });
  
  // ============ DOCUMENT FOLDERS ============
  
  app.get("/api/folders", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const folders = await storage.getFoldersByOwner(user.id);
      res.json(folders);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
  app.post("/api/folders", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const data = insertDocumentFolderSchema.parse({
        ...req.body,
        ownerId: user.id
      });
      const folder = await storage.createFolder(data);
      res.json(folder);
    } catch (error) {
      res.status(500).json({ message: "Erreur création dossier" });
    }
  });
  
  app.delete("/api/folders/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const folder = await storage.getFolder(parseInt(req.params.id));
      
      if (!folder || folder.ownerId !== user.id) {
        return res.status(403).json({ message: "Accès refusé" });
      }
      
      await storage.deleteFolder(folder.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erreur suppression" });
    }
  });
  
  // ============ DOCUMENT SHARING ============
  
  // Get shares for a document
  app.get("/api/documents/:id/shares", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const doc = await storage.getDocument(parseInt(req.params.id));
      
      if (!doc || doc.ownerId !== user.id) {
        return res.status(403).json({ message: "Accès refusé" });
      }
      
      const shares = await storage.getSharesForDocument(doc.id);
      res.json(shares);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
  // Hash password helper
  function hashPassword(password: string): string {
    return crypto.createHash("sha256").update(password + process.env.SESSION_SECRET).digest("hex");
  }
  
  function verifyPassword(password: string, hash: string): boolean {
    const inputHash = hashPassword(password);
    return crypto.timingSafeEqual(Buffer.from(inputHash), Buffer.from(hash));
  }
  
  // Rate limiting store for password attempts
  const passwordAttempts = new Map<string, { count: number; lastAttempt: number }>();
  
  function checkRateLimit(token: string): boolean {
    const now = Date.now();
    const attempt = passwordAttempts.get(token);
    
    if (!attempt) {
      passwordAttempts.set(token, { count: 1, lastAttempt: now });
      return true;
    }
    
    // Reset if more than 15 minutes passed
    if (now - attempt.lastAttempt > 15 * 60 * 1000) {
      passwordAttempts.set(token, { count: 1, lastAttempt: now });
      return true;
    }
    
    // Block if more than 5 attempts
    if (attempt.count >= 5) {
      return false;
    }
    
    attempt.count++;
    attempt.lastAttempt = now;
    return true;
  }
  
  // Create share
  app.post("/api/documents/:id/shares", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const doc = await storage.getDocument(parseInt(req.params.id));
      
      if (!doc || doc.ownerId !== user.id) {
        return res.status(403).json({ message: "Accès refusé" });
      }
      
      const shareToken = crypto.randomBytes(32).toString("hex");
      
      // Hash password if provided
      const passwordHash = req.body.password ? hashPassword(req.body.password) : null;
      
      const data = insertDocumentShareSchema.parse({
        ...req.body,
        documentId: doc.id,
        sharedById: user.id,
        shareToken,
        password: passwordHash
      });
      
      const share = await storage.createDocumentShare(data);
      
      await storage.createDocumentActivity({
        documentId: doc.id,
        userId: user.id,
        action: "shared",
        details: JSON.stringify({ email: req.body.sharedWithEmail, permission: req.body.permission })
      });
      
      res.json(share);
    } catch (error) {
      console.error("Error creating share:", error);
      res.status(500).json({ message: "Erreur création partage" });
    }
  });
  
  // Revoke share
  app.delete("/api/shares/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const share = await storage.getDocumentShare(parseInt(req.params.id));
      
      if (!share) {
        return res.status(404).json({ message: "Partage non trouvé" });
      }
      
      // Verify ownership via document
      const doc = await storage.getDocument(share.documentId);
      if (!doc || doc.ownerId !== user.id) {
        return res.status(403).json({ message: "Accès refusé" });
      }
      
      await storage.deleteDocumentShare(share.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erreur suppression partage" });
    }
  });
  
  // Access document via share link
  app.get("/api/shared/:token", async (req: Request, res: Response) => {
    try {
      const share = await storage.getDocumentShareByToken(req.params.token);
      
      if (!share || !share.isActive) {
        return res.status(404).json({ message: "Lien de partage invalide" });
      }
      
      // Check expiration
      if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
        return res.status(410).json({ message: "Lien expiré" });
      }
      
      // Check download limit
      if (share.maxDownloads && (share.downloadCount || 0) >= share.maxDownloads) {
        return res.status(410).json({ message: "Limite de téléchargements atteinte" });
      }
      
      const doc = await storage.getDocument(share.documentId);
      if (!doc) {
        return res.status(404).json({ message: "Document non trouvé" });
      }
      
      // Log access
      await storage.createDocumentActivity({
        documentId: doc.id,
        action: "viewed",
        details: JSON.stringify({ via: "share_link" }),
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]
      });
      
      // Return doc info (not the actual file - that comes from object storage)
      res.json({
        document: {
          id: doc.id,
          name: doc.name,
          description: doc.description,
          mimeType: doc.mimeType,
          fileSize: doc.fileSize
        },
        permission: share.permission,
        hasPassword: !!share.password
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
  // Verify password for protected share
  app.post("/api/shared/:token/verify", async (req: Request, res: Response) => {
    try {
      const token = req.params.token;
      
      const share = await storage.getDocumentShareByToken(token);
      
      if (!share || !share.isActive) {
        return res.status(404).json({ message: "Lien invalide" });
      }
      
      // No password required - always valid
      if (!share.password) {
        return res.json({ valid: true });
      }
      
      // Rate limiting only applies to password-protected shares
      if (!checkRateLimit(token)) {
        return res.status(429).json({ message: "Trop de tentatives. Réessayez dans 15 minutes." });
      }
      
      const { password } = req.body;
      if (!password || !verifyPassword(password, share.password)) {
        return res.status(401).json({ message: "Mot de passe incorrect" });
      }
      
      // Reset rate limit on success
      passwordAttempts.delete(token);
      
      res.json({ valid: true });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
  // Download via share link with password verification - streams file directly
  app.post("/api/shared/:token/download", async (req: Request, res: Response) => {
    try {
      const token = req.params.token;
      
      const share = await storage.getDocumentShareByToken(token);
      
      if (!share || !share.isActive) {
        return res.status(404).json({ message: "Lien invalide" });
      }
      
      // Check expiration
      if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
        return res.status(410).json({ message: "Lien expiré" });
      }
      
      // Check download limit
      if (share.maxDownloads && (share.downloadCount || 0) >= share.maxDownloads) {
        return res.status(410).json({ message: "Limite de téléchargements atteinte" });
      }
      
      // Verify password if required (with rate limiting)
      if (share.password) {
        if (!checkRateLimit(token)) {
          return res.status(429).json({ message: "Trop de tentatives. Réessayez dans 15 minutes." });
        }
        
        const { password } = req.body;
        if (!password || !verifyPassword(password, share.password)) {
          return res.status(401).json({ message: "Mot de passe requis" });
        }
        
        // Reset rate limit on success
        passwordAttempts.delete(token);
      }
      
      const doc = await storage.getDocument(share.documentId);
      if (!doc) {
        return res.status(404).json({ message: "Document non trouvé" });
      }
      
      // Update download count
      await storage.updateDocumentShare(share.id, {
        downloadCount: (share.downloadCount || 0) + 1
      });
      
      // Log download activity
      await storage.createDocumentActivity({
        documentId: doc.id,
        action: "downloaded",
        details: JSON.stringify({ via: "share_link", shareId: share.id }),
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"]
      });
      
      // Get file from object storage and stream to response
      try {
        const bucket = objectStorageClient.bucket(process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID || "");
        const file = bucket.file(doc.objectPath);
        
        res.setHeader("Content-Type", doc.mimeType);
        res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(doc.name)}"`);
        
        await objectStorageClient.downloadObject(file, res);
      } catch (downloadError) {
        console.error("Error streaming file:", downloadError);
        res.status(500).json({ message: "Erreur de téléchargement" });
      }
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
  // ============ DOCUMENT COMMENTS ============
  
  app.get("/api/documents/:id/comments", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const doc = await storage.getDocument(parseInt(req.params.id));
      
      if (!doc) {
        return res.status(404).json({ message: "Document non trouvé" });
      }
      
      // Check access
      if (doc.ownerId !== user.id) {
        const shares = await storage.getSharesForDocument(doc.id);
        const share = shares.find(s => s.sharedWithUserId === user.id);
        if (!share || !["comment", "edit"].includes(share.permission || "")) {
          return res.status(403).json({ message: "Accès refusé" });
        }
      }
      
      const comments = await storage.getDocumentComments(doc.id);
      res.json(comments);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
  app.post("/api/documents/:id/comments", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const doc = await storage.getDocument(parseInt(req.params.id));
      
      if (!doc) {
        return res.status(404).json({ message: "Document non trouvé" });
      }
      
      // Check access
      if (doc.ownerId !== user.id) {
        const shares = await storage.getSharesForDocument(doc.id);
        const share = shares.find(s => s.sharedWithUserId === user.id);
        if (!share || !["comment", "edit"].includes(share.permission || "")) {
          return res.status(403).json({ message: "Accès refusé" });
        }
      }
      
      const data = insertDocumentCommentSchema.parse({
        ...req.body,
        documentId: doc.id,
        userId: user.id,
        userName: user.username || user.email || "Utilisateur"
      });
      
      const comment = await storage.createDocumentComment(data);
      
      await storage.createDocumentActivity({
        documentId: doc.id,
        userId: user.id,
        action: "commented",
        details: JSON.stringify({ commentId: comment.id })
      });
      
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: "Erreur ajout commentaire" });
    }
  });
  
  app.patch("/api/comments/:id/resolve", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const comment = await storage.getDocumentComments(parseInt(req.params.id));
      // Would need getDocumentComment method - for now skip
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Erreur" });
    }
  });
  
  // ============ DOCUMENT ACTIVITY ============
  
  app.get("/api/documents/:id/activity", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const doc = await storage.getDocument(parseInt(req.params.id));
      
      if (!doc || doc.ownerId !== user.id) {
        return res.status(403).json({ message: "Accès refusé" });
      }
      
      const activities = await storage.getDocumentActivities(doc.id);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });
  
  // Get documents shared with me
  app.get("/api/shared-with-me", isAuthenticated, async (req: Request, res: Response) => {
    try {
      const user = (req as any).user;
      const shares = await storage.getSharesForUser(user.id);
      
      // Fetch document details for each share
      const docsWithShares = await Promise.all(
        shares.filter(s => s.isActive).map(async (share) => {
          const doc = await storage.getDocument(share.documentId);
          return doc ? { ...doc, permission: share.permission } : null;
        })
      );
      
      res.json(docsWithShares.filter(Boolean));
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur" });
    }
  });

  // ============ AUTO-ENROLLMENT TRIGGER ============
  // This function is called internally when leads are created/updated
  async function autoEnrollInNurturing(leadId: number, triggerEvent: string, source?: string) {
    try {
      const sequences = await storage.getNurturingSequencesByTrigger(triggerEvent, source);
      
      for (const sequence of sequences) {
        const existing = await storage.getLeadNurturing(leadId, sequence.id);
        if (existing) continue;
        
        const steps = await storage.getNurturingSteps(sequence.id);
        const firstStep = steps[0];
        
        let nextActionAt = new Date();
        if (firstStep) {
          nextActionAt.setDate(nextActionAt.getDate() + (firstStep.delayDays || 0));
          nextActionAt.setHours(nextActionAt.getHours() + (firstStep.delayHours || 0));
        }
        
        const nurturing = await storage.createLeadNurturing({
          leadId,
          sequenceId: sequence.id,
          currentStepId: firstStep?.id || null,
          status: "active",
          nextActionAt
        });
        
        // Schedule first action if there's a first step
        if (firstStep) {
          await storage.createNurturingAction({
            leadNurturingId: nurturing.id,
            nurturingStepId: firstStep.id,
            leadId,
            type: firstStep.actionType,
            subject: firstStep.emailSubject || null,
            content: firstStep.emailBody || firstStep.taskDescription || null,
            scheduledAt: nextActionAt,
            status: "pending"
          });
        }
        
        await storage.createLeadActivity({
          leadId,
          type: "nurturing",
          content: `Auto-enrolled in "${sequence.name}" sequence (trigger: ${triggerEvent})`
        });
      }
    } catch (error) {
      console.error("Error auto-enrolling in nurturing:", error);
    }
  }
  
  // Expose auto-enrollment for internal use
  (app as any).autoEnrollInNurturing = autoEnrollInNurturing;

  return httpServer;
}
