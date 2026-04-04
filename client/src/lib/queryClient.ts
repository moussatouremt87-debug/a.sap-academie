import { QueryClient } from "@tanstack/react-query";

// Mock SAP course data for demo
const MOCK_COURSES = [
  { id: "1", title: "SAP FI - Comptabilité Financière", description: "Maîtrisez la comptabilité financière SAP : grand livre, comptes clients/fournisseurs, clôtures et reporting.", longDescription: "Formation complète sur le module SAP FI couvrant la comptabilité générale, les comptes auxiliaires, la gestion des immobilisations et le reporting financier. Adaptée au contexte OHADA et aux normes comptables ouest-africaines.", category: "FI/CO", level: "Débutant" as const, format: "En ligne", duration: 40, price: 350, badge: "Certifiant" as const, instructor: "Amadou Diallo", rating: 4.8, reviews: 127, prerequisites: "Connaissances de base en comptabilité générale", certificationInfo: "Certification SAP FI Associate reconnue internationalement", objectives: ["Configurer le grand livre SAP FI", "Gérer les comptes clients et fournisseurs", "Effectuer les clôtures mensuelles et annuelles", "Produire les états financiers conformes OHADA"], modules: [{ id: "m1", title: "Introduction à SAP FI", duration: 120, hasQuiz: true, lessons: [{ id: "l1", title: "Présentation de SAP ERP", duration: 30, isFree: true }, { id: "l2", title: "Navigation dans SAP GUI", duration: 45, isFree: true }, { id: "l3", title: "Structure organisationnelle FI", duration: 45, isFree: false }] }, { id: "m2", title: "Comptabilité Générale", duration: 180, hasQuiz: true, lessons: [{ id: "l4", title: "Plan comptable et comptes généraux", duration: 60, isFree: false }, { id: "l5", title: "Écritures comptables", duration: 60, isFree: false }, { id: "l6", title: "Rapprochement bancaire", duration: 60, isFree: false }] }, { id: "m3", title: "Comptes Auxiliaires", duration: 150, hasQuiz: true, lessons: [{ id: "l7", title: "Gestion des clients (AR)", duration: 50, isFree: false }, { id: "l8", title: "Gestion des fournisseurs (AP)", duration: 50, isFree: false }, { id: "l9", title: "Gestion des relances", duration: 50, isFree: false }] }] },
  { id: "2", title: "SAP CO - Contrôle de Gestion", description: "Apprenez le contrôle de gestion SAP : centres de coûts, ordres internes, analyse de rentabilité.", longDescription: "Formation approfondie sur le module SAP CO pour maîtriser le contrôle de gestion, l'analyse des coûts et la planification budgétaire.", category: "FI/CO", level: "Intermédiaire" as const, format: "En ligne", duration: 35, price: 400, badge: "Certifiant" as const, instructor: "Fatou Sow", rating: 4.7, reviews: 89, prerequisites: "Connaissances de base en SAP FI recommandées", certificationInfo: "Certification SAP CO Associate", objectives: ["Configurer les centres de coûts", "Gérer les ordres internes", "Réaliser l'analyse de rentabilité", "Maîtriser la planification budgétaire"], modules: [{ id: "m1", title: "Fondamentaux du contrôle de gestion SAP", duration: 120, hasQuiz: true, lessons: [{ id: "l1", title: "Introduction à SAP CO", duration: 30, isFree: true }, { id: "l2", title: "Structure de CO", duration: 45, isFree: false }, { id: "l3", title: "Types de coûts", duration: 45, isFree: false }] }, { id: "m2", title: "Centres de coûts et ordres internes", duration: 180, hasQuiz: true, lessons: [{ id: "l4", title: "Gestion des centres de coûts", duration: 60, isFree: false }, { id: "l5", title: "Ordres internes", duration: 60, isFree: false }, { id: "l6", title: "Imputation et répartition", duration: 60, isFree: false }] }] },
  { id: "3", title: "SAP MM - Gestion des Articles", description: "Découvrez la gestion des achats et stocks SAP : approvisionnement, gestion des stocks, évaluation.", longDescription: "Formation complète sur le module SAP MM couvrant tout le cycle d'approvisionnement, de la demande d'achat à la réception des marchandises.", category: "MM", level: "Débutant" as const, format: "Hybride", duration: 45, price: 380, badge: "Populaire" as const, instructor: "Ibrahima Ndiaye", rating: 4.9, reviews: 156, prerequisites: "Aucun prérequis technique nécessaire", certificationInfo: "Certification SAP MM Associate", objectives: ["Gérer le cycle complet d'approvisionnement", "Configurer la gestion des stocks", "Maîtriser l'évaluation des stocks", "Automatiser les processus d'achat"], modules: [{ id: "m1", title: "Introduction à SAP MM", duration: 90, hasQuiz: true, lessons: [{ id: "l1", title: "Vue d'ensemble de SAP MM", duration: 30, isFree: true }, { id: "l2", title: "Données de base articles", duration: 30, isFree: true }, { id: "l3", title: "Fiches fournisseurs", duration: 30, isFree: false }] }, { id: "m2", title: "Processus d'achat", duration: 180, hasQuiz: true, lessons: [{ id: "l4", title: "Demandes d'achat", duration: 60, isFree: false }, { id: "l5", title: "Commandes d'achat", duration: 60, isFree: false }, { id: "l6", title: "Réception de marchandises", duration: 60, isFree: false }] }] },
  { id: "4", title: "SAP SD - Administration des Ventes", description: "Maîtrisez le cycle de vente SAP : commandes clients, livraisons, facturation et gestion des prix.", longDescription: "Formation sur le module SAP SD couvrant l'ensemble du processus commercial, de la commande à la facturation.", category: "SD", level: "Intermédiaire" as const, format: "En ligne", duration: 40, price: 380, badge: "Nouveau" as const, instructor: "Mariama Ba", rating: 4.6, reviews: 72, prerequisites: "Connaissances de base en gestion commerciale", certificationInfo: "Certification SAP SD Associate", objectives: ["Configurer le cycle de vente complet", "Gérer les conditions de prix", "Maîtriser les livraisons et la facturation", "Personnaliser les documents commerciaux"], modules: [{ id: "m1", title: "Fondamentaux SAP SD", duration: 120, hasQuiz: true, lessons: [{ id: "l1", title: "Introduction à SAP SD", duration: 30, isFree: true }, { id: "l2", title: "Données de base SD", duration: 45, isFree: false }, { id: "l3", title: "Processus de vente standard", duration: 45, isFree: false }] }] },
  { id: "5", title: "SAP HCM - Ressources Humaines", description: "Gérez les ressources humaines avec SAP : administration du personnel, paie, gestion des temps.", longDescription: "Formation sur le module SAP HCM pour la gestion complète des ressources humaines dans un contexte ouest-africain.", category: "HCM", level: "Débutant" as const, format: "En ligne", duration: 35, price: 320, instructor: "Ousmane Diop", rating: 4.5, reviews: 64, prerequisites: "Connaissances de base en gestion RH", certificationInfo: "Certification SAP HCM", objectives: ["Configurer l'administration du personnel", "Gérer la paie conforme à la législation locale", "Maîtriser la gestion des temps", "Produire les déclarations sociales"], modules: [{ id: "m1", title: "Administration du personnel", duration: 150, hasQuiz: true, lessons: [{ id: "l1", title: "Structure organisationnelle RH", duration: 30, isFree: true }, { id: "l2", title: "Infotypes et données personnelles", duration: 60, isFree: false }, { id: "l3", title: "Gestion des événements RH", duration: 60, isFree: false }] }] },
  { id: "6", title: "SAP ABAP - Développement", description: "Apprenez la programmation ABAP : syntaxe, ALV, dynpros, interfaces et développement orienté objet.", longDescription: "Formation intensive sur le langage de programmation ABAP pour le développement d'applications SAP personnalisées.", category: "ABAP", level: "Avancé" as const, format: "En ligne", duration: 60, price: 500, badge: "Certifiant" as const, instructor: "Moussa Traoré", rating: 4.8, reviews: 93, prerequisites: "Expérience en programmation (tout langage)", certificationInfo: "Certification SAP ABAP Developer", objectives: ["Maîtriser la syntaxe ABAP", "Développer des rapports ALV", "Créer des interfaces utilisateur", "Programmer en ABAP orienté objet"], modules: [{ id: "m1", title: "Bases ABAP", duration: 180, hasQuiz: true, lessons: [{ id: "l1", title: "Environnement de développement ABAP", duration: 30, isFree: true }, { id: "l2", title: "Types de données et variables", duration: 45, isFree: true }, { id: "l3", title: "Structures de contrôle", duration: 45, isFree: false }, { id: "l4", title: "Tables internes", duration: 60, isFree: false }] }, { id: "m2", title: "ABAP Avancé", duration: 240, hasQuiz: true, lessons: [{ id: "l5", title: "Modularisation du code", duration: 60, isFree: false }, { id: "l6", title: "ABAP orienté objet", duration: 60, isFree: false }, { id: "l7", title: "Rapports ALV", duration: 60, isFree: false }, { id: "l8", title: "Interfaces et BAPIs", duration: 60, isFree: false }] }] },
  { id: "7", title: "SAP BASIS - Administration Système", description: "Administrez les systèmes SAP : installation, transport, monitoring, sécurité et gestion des utilisateurs.", longDescription: "Formation technique sur l'administration des systèmes SAP pour les administrateurs et consultants BASIS.", category: "BASIS", level: "Avancé" as const, format: "Présentiel", duration: 50, price: 450, instructor: "Cheikh Fall", rating: 4.7, reviews: 58, prerequisites: "Connaissances en administration système Linux/Windows", certificationInfo: "Certification SAP BASIS Administrator", objectives: ["Installer et configurer un système SAP", "Gérer les transports et les mandants", "Monitorer les performances système", "Administrer la sécurité et les autorisations"], modules: [{ id: "m1", title: "Fondamentaux BASIS", duration: 150, hasQuiz: true, lessons: [{ id: "l1", title: "Architecture SAP NetWeaver", duration: 45, isFree: true }, { id: "l2", title: "Gestion des mandants", duration: 45, isFree: false }, { id: "l3", title: "Système de transport", duration: 60, isFree: false }] }] },
  { id: "8", title: "SAP Analytics - Business Intelligence", description: "Exploitez la puissance analytique SAP : SAP BW, SAC, tableaux de bord et reporting avancé.", longDescription: "Formation sur les outils analytiques SAP pour la création de rapports, tableaux de bord et analyses décisionnelles.", category: "Analytics", level: "Intermédiaire" as const, format: "En ligne", duration: 30, price: 350, badge: "Nouveau" as const, instructor: "Aissatou Camara", rating: 4.6, reviews: 45, prerequisites: "Connaissances de base en analyse de données", certificationInfo: "Certification SAP Analytics Cloud", objectives: ["Créer des rapports avec SAP BW", "Concevoir des tableaux de bord SAC", "Maîtriser l'analyse prédictive", "Automatiser le reporting"], modules: [{ id: "m1", title: "Introduction à SAP Analytics", duration: 120, hasQuiz: true, lessons: [{ id: "l1", title: "Écosystème analytique SAP", duration: 30, isFree: true }, { id: "l2", title: "SAP Analytics Cloud - Bases", duration: 45, isFree: true }, { id: "l3", title: "Création de stories et rapports", duration: 45, isFree: false }] }] },
  { id: "9", title: "SAP PP - Planification de Production", description: "Optimisez la production avec SAP PP : planification, ordres de fabrication, MRP et gestion des capacités.", longDescription: "Formation sur le module SAP PP pour la planification et le pilotage de la production industrielle.", category: "PP", level: "Intermédiaire" as const, format: "Hybride", duration: 40, price: 380, badge: "Populaire" as const, instructor: "Amadou Diallo", rating: 4.7, reviews: 67, prerequisites: "Connaissances en gestion de production", certificationInfo: "Certification SAP PP Associate", objectives: ["Configurer les données de base production", "Maîtriser le MRP et la planification", "Gérer les ordres de fabrication", "Optimiser les capacités de production"], modules: [{ id: "m1", title: "Fondamentaux SAP PP", duration: 150, hasQuiz: true, lessons: [{ id: "l1", title: "Introduction à SAP PP", duration: 30, isFree: true }, { id: "l2", title: "Nomenclatures et gammes", duration: 60, isFree: false }, { id: "l3", title: "Planification MRP", duration: 60, isFree: false }] }] }
];

function getMockData(url: string): unknown | null {
  if (url === "/api/courses") {
    return MOCK_COURSES;
  }
  const match = url.match(/^\/api\/courses\/(\d+)$/);
  if (match) {
    const course = MOCK_COURSES.find((c: any) => c.id === match[1]);
    if (!course) 
  // Formations routes (alias for courses)
  if (url.includes('/api/formations/')) {
    const id = url.split('/api/formations/')[1];
    const course = MOCK_COURSES.find(c => c.id === parseInt(id));
    if (course) return course;
  }
  if (url === '/api/formations' || url.endsWith('/api/formations')) {
    return MOCK_COURSES;
  }
  return null;
    // Detail page expects price in centimes and duration in minutes
    return { ...course, price: course.price * 100, duration: course.duration * 60 };
  }
  return null;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    let text: string;
    try { text = await res.text(); } catch { text = res.statusText; }
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(method: string, url: string, data?: unknown): Promise<Response> {
  const mock = getMockData(url);
  if (mock) {
    return new Response(JSON.stringify(mock), {
      status: 200, headers: { "Content-Type": "application/json" },
    });
  }
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";

export function getQueryFn({ on401 }: { on401?: UnauthorizedBehavior } = {}) {
  return async ({ queryKey }: { queryKey: string[] }) => {
    const url = queryKey[0];
    const mock = getMockData(url);
    if (mock) return mock;
    const res = await fetch(url, { credentials: "include" });
    if (on401 === "returnNull" && res.status === 401) return null;
    await throwIfResNotOk(res);
    return await res.json();
  };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
  },
});
