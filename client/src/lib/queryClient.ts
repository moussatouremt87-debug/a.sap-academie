import { QueryClient } from "@tanstack/react-query";

// Mock SAP course data for demo
const MOCK_COURSES = [
  { id: "1", title: "SAP FI - Comptabilité Financière", description: "Maîtrisez la comptabilité financière SAP : grand livre, comptes fournisseurs/clients, gestion des actifs et clôtures.", longDescription: "Formation complète couvrant tous les aspects de la comptabilité financière dans SAP ERP.", category: "FI/CO", level: "Débutant", format: "En ligne", duration: 2400, price: 35000, badge: "Certifiant", instructor: "Amadou Diallo", rating: 4.8, reviews: 127, prerequisites: "Notions de base en comptabilité générale.\nConnaissance de l'environnement Windows.", certificationInfo: "Cette formation prépare à la certification SAP C_TS4FI.", objectives: ["Naviguer dans SAP FI", "Créer et gérer le plan comptable", "Enregistrer les écritures comptables", "Effectuer les clôtures", "Gérer les comptes fournisseurs et clients"], modules: [{ id: "m1", title: "Introduction à SAP FI", duration: 120, hasQuiz: true, lessons: [{ id: "l1", title: "Présentation de SAP ERP", duration: 30, isFree: true }, { id: "l2", title: "Navigation dans SAP GUI", duration: 45, isFree: true }, { id: "l3", title: "Structure organisationnelle FI", duration: 45, isFree: false }] }, { id: "m2", title: "Grand Livre (GL)", duration: 180, hasQuiz: true, lessons: [{ id: "l4", title: "Plan comptable et comptes GL", duration: 60, isFree: false }, { id: "l5", title: "Enregistrement d'écritures", duration: 60, isFree: false }, { id: "l6", title: "Documents et pièces comptables", duration: 60, isFree: false }] }, { id: "m3", title: "Comptabilité Fournisseurs (AP)", duration: 150, hasQuiz: true, lessons: [{ id: "l7", title: "Fiche fournisseur", duration: 45, isFree: false }, { id: "l8", title: "Factures et avoirs", duration: 60, isFree: false }, { id: "l9", title: "Paiements automatiques", duration: 45, isFree: false }] }] },
  { id: "2", title: "SAP CO - Contrôle de Gestion", description: "Apprenez le contrôle de gestion SAP : centres de coûts, ordres internes, analyse de rentabilité et reporting.", longDescription: "Formation approfondie sur le module CO.", category: "FI/CO", level: "Intermédiaire", format: "En ligne", duration: 2100, price: 40000, badge: "Populaire", instructor: "Fatou Sow", rating: 4.6, reviews: 89, prerequisites: "Connaissance de SAP FI recommandée.", certificationInfo: "Préparation à la certification SAP CO.", objectives: ["Maîtriser les centres de coûts", "Gérer les ordres internes", "Analyser la rentabilité"], modules: [{ id: "m1", title: "Bases du contrôle de gestion", duration: 120, hasQuiz: true, lessons: [{ id: "l1", title: "Introduction au module CO", duration: 40, isFree: true }, { id: "l2", title: "Centres de coûts", duration: 40, isFree: false }, { id: "l3", title: "Types d'activités", duration: 40, isFree: false }] }] },
  { id: "3", title: "SAP MM - Gestion des Achats et Stocks", description: "Formation complète sur les achats SAP : demandes, commandes, réception, gestion des stocks et inventaires.", longDescription: "Maîtrisez le cycle complet des achats.", category: "MM", level: "Débutant", format: "En ligne", duration: 2700, price: 37500, badge: "Nouveau", instructor: "Ibrahima Ndiaye", rating: 4.7, reviews: 64, prerequisites: "Aucun prérequis technique.", certificationInfo: "Préparation à la certification SAP MM.", objectives: ["Gérer les données de base articles", "Créer des commandes d'achat", "Gérer les stocks et inventaires"], modules: [{ id: "m1", title: "Introduction à SAP MM", duration: 90, hasQuiz: true, lessons: [{ id: "l1", title: "Vue d'ensemble MM", duration: 30, isFree: true }, { id: "l2", title: "Données de base", duration: 30, isFree: false }, { id: "l3", title: "Fiches articles", duration: 30, isFree: false }] }] },
  { id: "4", title: "SAP SD - Administration des Ventes", description: "Gérez le cycle de vente complet : offres, commandes, livraisons, facturation et retours.", longDescription: "Formation sur le cycle de vente SAP SD.", category: "SD", level: "Intermédiaire", format: "Hybride", duration: 2400, price: 38000, badge: "Certifiant", instructor: "Mariama Ba", rating: 4.5, reviews: 73, prerequisites: "Connaissance de base de SAP.", certificationInfo: "Certification SAP SD incluse.", objectives: ["Gérer le cycle de vente", "Créer des offres et commandes", "Traiter les livraisons"], modules: [{ id: "m1", title: "Fondamentaux SD", duration: 120, hasQuiz: true, lessons: [{ id: "l1", title: "Processus de vente", duration: 40, isFree: true }, { id: "l2", title: "Données de base SD", duration: 40, isFree: false }, { id: "l3", title: "Offres commerciales", duration: 40, isFree: false }] }] },
  { id: "5", title: "SAP HCM - Ressources Humaines", description: "Administrez les RH dans SAP : gestion du personnel, paie, temps de travail et recrutement.", longDescription: "Formation RH dans SAP.", category: "HCM", level: "Débutant", format: "En ligne", duration: 2100, price: 35000, prerequisites: "Aucun.", certificationInfo: "Certificat de formation.", objectives: ["Gérer le personnel", "Configurer la paie", "Suivre les temps"], modules: [{ id: "m1", title: "Introduction HCM", duration: 90, hasQuiz: true, lessons: [{ id: "l1", title: "Vue d'ensemble HCM", duration: 30, isFree: true }, { id: "l2", title: "Gestion du personnel", duration: 30, isFree: false }] }] },
  { id: "6", title: "SAP ABAP - Programmation", description: "Développez en ABAP : syntaxe, dictionnaire de données, ALV, interfaces et POO.", longDescription: "Formation développement ABAP.", category: "ABAP", level: "Avancé", format: "En ligne", duration: 3600, price: 50000, badge: "Certifiant", instructor: "Ousmane Diop", rating: 4.9, reviews: 156, prerequisites: "Notions de programmation.", certificationInfo: "Certification ABAP.", objectives: ["Programmer en ABAP", "Utiliser le dictionnaire de données", "Créer des ALV et interfaces"], modules: [{ id: "m1", title: "Bases ABAP", duration: 180, hasQuiz: true, lessons: [{ id: "l1", title: "Syntaxe ABAP", duration: 60, isFree: true }, { id: "l2", title: "Types de données", duration: 60, isFree: false }, { id: "l3", title: "Structures de contrôle", duration: 60, isFree: false }] }] },
  { id: "7", title: "SAP BASIS - Administration Système", description: "Administrez les systèmes SAP : installation, configuration, transports, sécurité et monitoring.", longDescription: "Formation administration SAP.", category: "BASIS", level: "Avancé", format: "Hybride", duration: 3000, price: 45000, badge: "Populaire", instructor: "Cheikh Fall", rating: 4.7, reviews: 98, prerequisites: "Connaissances système Linux/Windows.", certificationInfo: "Certification BASIS.", objectives: ["Installer SAP", "Gérer les transports", "Sécuriser le système"], modules: [{ id: "m1", title: "Architecture SAP", duration: 120, hasQuiz: true, lessons: [{ id: "l1", title: "Composants SAP", duration: 40, isFree: true }, { id: "l2", title: "Landscape", duration: 40, isFree: false }, { id: "l3", title: "Administration de base", duration: 40, isFree: false }] }] },
  { id: "8", title: "SAP Analytics Cloud", description: "Créez des dashboards et rapports analytiques puissants avec SAP Analytics Cloud.", longDescription: "Formation analytics SAP.", category: "Analytics", level: "Intermédiaire", format: "En ligne", duration: 1800, price: 32000, badge: "Nouveau", instructor: "Awa Diagne", rating: 4.4, reviews: 41, prerequisites: "Bases Excel.", certificationInfo: "Certificat Analytics.", objectives: ["Créer des dashboards", "Connecter des sources", "Analyser les tendances"], modules: [{ id: "m1", title: "Découverte SAC", duration: 90, hasQuiz: true, lessons: [{ id: "l1", title: "Interface SAC", duration: 30, isFree: true }, { id: "l2", title: "Connexions", duration: 30, isFree: false }] }] },
  { id: "9", title: "SAP PP - Planification de Production", description: "Maîtrisez la planification : MRP, ordres de fabrication, gammes et nomenclatures.", longDescription: "Formation production SAP.", category: "PP", level: "Intermédiaire", format: "En ligne", duration: 2400, price: 38000, prerequisites: "Connaissance SAP de base.", certificationInfo: "Certificat PP.", objectives: ["Configurer le MRP", "Gérer les ordres", "Maîtriser les nomenclatures"], modules: [{ id: "m1", title: "Bases PP", duration: 120, hasQuiz: true, lessons: [{ id: "l1", title: "Processus de production", duration: 40, isFree: true }, { id: "l2", title: "Nomenclatures", duration: 40, isFree: false }, { id: "l3", title: "Gammes", duration: 40, isFree: false }] }] }
];

function getMockData(url: string): unknown | null {
  if (url === "/api/courses") return MOCK_COURSES;
  const match = url.match(/^\/api\/courses\/(\d+)$/);
  if (match) return MOCK_COURSES.find((c: any) => c.id === match[1]) || null;
  return null;
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(method: string, url: string, data?: unknown): Promise<Response> {
  const mock = getMockData(url);
  if (mock) {
    return new Response(JSON.stringify(mock), {
      status: 200,
      headers: { "Content-Type": "application/json" },
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

export function getQueryFn({ on401 }: { on401?: "returnNull" | "throw" } = {}) {
  return async ({ queryKey }: { queryKey: string[] }) => {
    const url = queryKey[0];
    const mock = getMockData(url);
    if (mock) return mock;
    const res = await fetch(url, { credentials: "include" });
    if (on401 === "returnNull" && res.status === 401) return null;
    await throwIfResNotOk(res);
    return res.json();
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
