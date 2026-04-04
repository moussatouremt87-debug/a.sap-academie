import { QueryClient } from "@tanstack/react-query";

// Mock SAP course data for demo
const MOCK_COURSES = [
  { id: "1", title: "SAP FI - ComptabilitÃ© FinanciÃ¨re", description: "MaÃ®trisez la comptabilitÃ© financiÃ¨re SAP : grand livre, comptes clients/fournisseurs, clÃ´tures et reporting.", longDescription: "Formation complÃ¨te sur le module SAP FI couvrant la comptabilitÃ© gÃ©nÃ©rale, les comptes auxiliaires, la gestion des immobilisations et le reporting financier. AdaptÃ©e au contexte OHADA et aux normes comptables ouest-africaines.", category: "FI/CO", level: "DÃ©butant" as const, format: "En ligne", duration: 40, price: 350, badge: "Certifiant" as const, instructor: "Amadou Diallo", rating: 4.8, reviews: 127, prerequisites: "Connaissances de base en comptabilitÃ© gÃ©nÃ©rale", certificationInfo: "Certification SAP FI Associate reconnue internationalement", objectives: ["Configurer le grand livre SAP FI", "GÃ©rer les comptes clients et fournisseurs", "Effectuer les clÃ´tures mensuelles et annuelles", "Produire les Ã©tats financiers conformes OHADA"], modules: [{ id: "m1", title: "Introduction Ã  SAP FI", duration: 120, hasQuiz: true, lessons: [{ id: "l1", title: "PrÃ©sentation de SAP ERP", duration: 30, isFree: true }, { id: "l2", title: "Navigation dans SAP GUI", duration: 45, isFree: true }, { id: "l3", title: "Structure organisationnelle FI", duration: 45, isFree: false }] }, { id: "m2", title: "ComptabilitÃ© GÃ©nÃ©rale", duration: 180, hasQuiz: true, lessons: [{ id: "l4", title: "Plan comptable et comptes gÃ©nÃ©raux", duration: 60, isFree: false }, { id: "l5", title: "Ãcritures comptables", duration: 60, isFree: false }, { id: "l6", title: "Rapprochement bancaire", duration: 60, isFree: false }] }, { id: "m3", title: "Comptes Auxiliaires", duration: 150, hasQuiz: true, lessons: [{ id: "l7", title: "Gestion des clients (AR)", duration: 50, isFree: false }, { id: "l8", title: "Gestion des fournisseurs (AP)", duration: 50, isFree: false }, { id: "l9", title: "Gestion des relances", duration: 50, isFree: false }] }] },
AP CO", duration: 30, isFree: true }, { id: "l2", title: "Structure de CO", duration: 45, isFree: false }, { id: "l3", title: "Types de coÃ»ts", duration: 45, isFree: false }] }, { id: "m2", title: "Centres de coÃ»ts et ordres internes", duration: 180, hasQuiz: true, lessons: [{ id: "l4", title: "Gestion des centres de coÃ»ts", duration: 60, isFree: false }, { id: "l5", title: "Ordres internes", duration: 60, isFree: false }, { id: "l6", title: "Imputation et rÃ©partition", duration: 60, isFree: false }] }] },
  { id: "3", title: "SAP MM - Gestion des Articles", description: "DÃ©couvrez la gestion des achats et stocks SAP : approvisionnement, gestion des stocks, Ã©valuation.", longDescription: "Formation complÃ¨te sur le module SAP MM couvrant tout le cycle d'approvisionnement, de la demande d'achat Ã  la rÃ©ception des marchandises.", category: "MM", level: "DÃ©butant" as const, format: "Hybride", duration: 45, price: 380, badge: "Populaire" as const, instructor: "Ibrahima Ndiaye", rating: 4.9, reviews: 156, prerequisites: "Aucun prÃ©requis technique nÃ©cessaire", certificationInfo: "Certification SAP MM Associate", objectives: ["GÃ©rer le cycle complet d'approvisionnement", "Configurer la gestion des stocks", "MaÃ®triser l'Ã©valuation des stocks", "Automatiser les processus d'achat"], modules: [{ id: "m1", title: "Introduction Ã  SAP MM", duration: 90, hasQuiz: true, lessons: [{ id: "l1", title: "Vue d'ensemble de SAP MM", duration: 30, isFree: true }, { id: "l2", title: "DonnÃ©es de base articles", duration: 30, isFree: true }, { id: "l3", title: "Fiches fournisseurs", duration: 30, isFree: false }] }, { id: "m2", title: "Processus d'achat", duration: 180, hasQuiz: true, lessons: [{ id: "l4", title: "Demandes d'achat", duration: 60, isFree: false }, { id: "l5", title: "Commandes d'achat", duration: 60, isFree: false }, { id: "l6", title: "RÃ©ception de marchandises", duration: 60, isFree: false }] }] },
  { id: "4", title: "SAP SD - Administration des Ventes", description: "MaÃ®trisez le cycle de vente SAP : commandes clients, livraisons, facturation et gestion des prix.", longDescription: "Formation sur le module SAP SD couvrant l'ensemble du processus commercial, de la commande Ã  la facturation.", category: "SD", level: "IntermÃ©diaire" as const, format: "En ligne", duration: 40, price: 380, badge: "Nouveau" as const, instructor: "Mariama Ba", rating: 4.6, reviews: 72, prerequisites: "Connaissances de base en gestion commerciale", certificationInfo: "Certification SAP SD Associate", objectives: ["Configurer le cycle de vente complet", "GÃ©rer les conditions de prix", "MaÃ®triser les livraisons et la facturation", "Personnaliser les documents commerciaux"], modules: [{ id: "m1", title: "Fondamentaux SAP SD", duration: 120, hasQuiz: true, lessons: [{ id: "l1", title: "Introduction Ã  SAP SD", duration: 30, isFree: true }, { id: "l2", title: "DonnÃ©es de base SD", duration: 45, isFree: false }, { id: "l3", title: "Processus de vente standard", duration: 45, isFree: false }] }] },
  { id: "5", title: "SAP HCM - Ressources Humaines", description: "GÃ©rez les ressources humaines avec SAP : administration du personnel, paie, gestion des temps.", longDescription: "Formation sur le module SAP HCM pour la gestion complÃ¨te des ressources humaines dans un contexte ouest-africain.", category: "HCM", level: "DÃ©butant" as const, format: "En ligne", duration: 35, price: 320, instructor: "Ousmane Diop", rating: 4.5, reviews: 64, prerequisites: "Connaissances de base en gestion RH", certificationInfo: "Certification SAP HCM", objectives: ["Configurer l'administration du personnel", "GÃ©rer la paie conforme Ã  la lÃ©gislation locale", "MaÃ®triser la gestion des temps", "Produire les dÃ©clarations sociales"], modules: [{ id: "m1", title: "Administration du personnel", duration: 150, hasQuiz: true, lessons: [{ id: "l1", title: "Structure organisationnelle RH", duration: 30, isFree: true }, { id: "l2", title: "Infotypes et donnÃ©es personnelles", duration: 60, isFree: false }, { id: "l3", title: "Gestion des Ã©vÃ©nements RH", duration: 60, isFree: false }] }] },
  { id: "6", title: "SAP ABAP - DÃ©veloppement", description: "Apprenez la programmation ABAP : syntaxe, ALV, dynpros, interfaces et dÃ©veloppement orientÃ© objet.", longDescription: "Formation intensive sur le langage de programmation ABAP pour le dÃ©veloppement d'applications SAP personnalisÃ©es.", category: "ABAP", level: "AvancÃ©" as const, format: "En ligne", duration: 60, price: 500, badge: "Certifiant" as const, instructor: "Moussa TraorÃ©", rating: 4.8, reviews: 93, prerequisites: "ExpÃ©rience en programmation (tout langage)", certificationInfo: "Certification SAP ABAP Developer", objectives: ["MaÃ®triser la syntaxe ABAP", "DÃ©velopper des rapports ALV", "CrÃ©er des interfaces utilisateur", "Programmer en ABAP orientÃ© objet"], modules: [{ id: "m1", title: "Bases ABAP", duration: 180, hasQuiz: true, lessons: [{ id: "l1", title: "Environnement de dÃ©veloppement ABAP", duration: 30, isFree: true }, { id: "l2", title: "Types de donnÃ©es et variables", duration: 45, isFree: true }, { id: "l3", title: "Structures de contrÃ´le", duration: 45, isFree: false }, { id: "l4", title: "Tables internes", duration: 60, isFree: false }] }, { id: "m2", title: "ABAP AvancÃ©", duration: 240, hasQuiz: true, lessons: [{ id: "l5", title: "Modularisation du code", duration: 60, isFree: false }, { id: "l6", title: "ABAP orientÃ© objet", duration: 60, isFree: false }, { id: "l7", title: "Rapports ALV", duration: 60, isFree: false }, { id: "l8", title: "Interfaces et BAPIs", duration: 60, isFree: false }] }] },
  { id: "7", title: "SAP BASIS - Administration SystÃ¨me", description: "Administrez les systÃ¨mes SAP : installation, transport, monitoring, sÃ©curitÃ© et gestion des utilisateurs.", longDescription: "Formation technique sur l'administration des systÃ¨mes SAP pour les administrateurs et consultants BASIS.", category: "BASIS", level: "AvancÃ©" as const, format: "PrÃ©sentiel", duration: 50, price: 450, instructor: "Cheikh Fall", rating: 4.7, reviews: 58, prerequisites: "Connaissances en administration systÃ¨me Linux/Windows", certificationInfo: "Certification SAP BASIS Administrator", objectives: ["Installer et configurer un systÃ¨me SAP", "GÃ©rer les transports et les mandants", "Monitorer les performances systÃ¨me", "Administrer la sÃ©curitÃ© et les autorisations"], modules: [{ id: "m1", title: "Fondamentaux BASIS", duration: 150, hasQuiz: true, lessons: [{ id: "l1", title: "Architecture SAP NetWeaver", duration: 45, isFree: true }, { id: "l2", title: "Gestion des mandants", duration: 45, isFree: false }, { id: "l3", title: "SystÃ¨me de transport", duration: 60, isFree: false }] }] },
  { id: "8", title: "SAP Analytics - Business Intelligence", description: "Exploitez la puissance analytique SAP : SAP BW, SAC, tableaux de bord et reporting avancÃ©.", longDescription: "Formation sur les outils analytiques SAP pour la crÃ©ation de rapports, tableaux de bord et analyses dÃ©cisionnelles.", category: "Analytics", level: "IntermÃ©diaire" as const, format: "En ligne", duration: 30, price: 350, badge: "Nouveau" as const, instructor: "Aissatou Camara", rating: 4.6, reviews: 45, prerequisites: "Connaissances de base en analyse de donnÃ©es", certificationInfo: "Certification SAP Analytics Cloud", objectives: ["CrÃ©er des rapports avec SAP BW", "Concevoir des tableaux de bord SAC", "MaÃ®triser l'analyse prÃ©dictive", "Automatiser le reporting"], modules: [{ id: "m1", title: "Introduction Ã  SAP Analytics", duration: 120, hasQuiz: true, lessons: [{ id: "l1", title: "ÃcosystÃ¨me analytique SAP", duration: 30, isFree: true }, { id: "l2", title: "SAP Analytics Cloud - Bases", duration: 45, isFree: true }, { id: "l3", title: "CrÃ©ation de stories et rapports", duration: 45, isFree: false }] }] },
  { id: "9", title: "SAP PP - Planification de Production", description: "Optimisez la production avec SAP PP : planification, ordres de fabrication, MRP et gestion des capacitÃ©s.", longDescription: "Formation sur le module SAP PP pour la planification et le pilotage de la production industrielle.", category: "PP", level: "IntermÃ©diaire" as const, format: "Hybride", duration: 40, price: 380, badge: "Populaire" as const, instructor: "Amadou Diallo", rating: 4.7, reviews: 67, prerequisites: "Connaissances en gestion de production", certificationInfo: "Certification SAP PP Associate", objectives: ["Configurer les donnÃ©es de base production", "MaÃ®triser le MRP et la planification", "GÃ©rer les ordres de fabrication", "Optimiser les capacitÃ©s de production"], modules: [{ id: "m1", title: "Fondamentaux SAP PP", duration: 150, hasQuiz: true, lessons: [{ id: "l1", title: "Introduction Ã  SAP PP", duration: 30, isFree: true }, { id: "l2", title: "Nomenclatures et gammes", duration: 60, isFree: false }, { id: "l3", title: "Planification MRP", duration: 60, isFree: false }] }] }
];

function getMockData(url: string): unknown | null {
  if (url === "/api/courses") {
    return MOCK_COURSES;
  }
  const match = url.match(/^\/api\/courses\/(\d+)$/);
  if (match) {
    const course = MOCK_COURSES.find((c: any) => c.id === match[1]);
    if (!course) return null;
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
