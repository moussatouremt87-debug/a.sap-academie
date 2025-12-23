import { db } from "./db";
import { formations, faqs } from "@shared/schema";

const sampleFormations = [
  {
    title: "SAP FI - Finance et Comptabilité",
    description: "Formation complète au module SAP FI pour maîtriser la gestion financière et comptable. Apprenez à configurer et utiliser les fonctionnalités de comptabilité générale, clients, fournisseurs et gestion de trésorerie.",
    category: "FI",
    level: "Intermediaire",
    format: "Hybride",
    duration: 40,
    price: 150000,
    badge: "Certifiant",
    objectives: ["Maîtriser la comptabilité générale SAP", "Configurer les comptes clients et fournisseurs", "Gérer la trésorerie et les rapprochements bancaires"],
    modules: ["Introduction SAP FI", "Comptabilité générale", "Comptes clients (AR)", "Comptes fournisseurs (AP)", "Gestion de trésorerie"],
    prerequisites: "Connaissances de base en comptabilité",
    certification: "SAP Certified Application Associate - Financial Accounting",
    isPublished: true,
  },
  {
    title: "SAP MM - Gestion des Achats et Stocks",
    description: "Devenez expert du module SAP MM (Materials Management). Cette formation couvre l'ensemble du processus d'approvisionnement, de la gestion des fournisseurs à l'inventaire.",
    category: "MM",
    level: "Debutant",
    format: "Online",
    duration: 35,
    price: 120000,
    badge: "Populaire",
    objectives: ["Gérer le cycle d'approvisionnement complet", "Maîtriser la gestion des stocks", "Configurer les processus d'achat"],
    modules: ["Fondamentaux SAP MM", "Gestion des achats", "Gestion des stocks", "Valorisation et inventaire", "Intégration avec FI"],
    prerequisites: "Aucun prérequis technique",
    certification: "SAP Certified Application Associate - Procurement",
    isPublished: true,
  },
  {
    title: "SAP SD - Ventes et Distribution",
    description: "Formation approfondie au module SAP SD pour optimiser vos processus de vente. Du devis à la facturation, maîtrisez toute la chaîne commerciale SAP.",
    category: "SD",
    level: "Intermediaire",
    format: "Presentiel",
    duration: 35,
    price: 140000,
    badge: "Nouveau",
    objectives: ["Configurer le cycle de vente complet", "Gérer les tarifications et conditions", "Maîtriser la facturation et le reporting"],
    modules: ["Introduction SAP SD", "Gestion des commandes", "Expédition et livraison", "Facturation", "Tarification avancée"],
    prerequisites: "Notions de base en vente et logistique",
    certification: "SAP Certified Application Associate - Sales and Distribution",
    isPublished: true,
  },
  {
    title: "ABAP - Développement SAP",
    description: "Apprenez à développer en ABAP, le langage de programmation SAP. Formation pratique avec exercices concrets pour créer des programmes, rapports et interfaces.",
    category: "ABAP",
    level: "Avance",
    format: "Hybride",
    duration: 60,
    price: 200000,
    badge: "Certifiant",
    objectives: ["Maîtriser la syntaxe ABAP", "Développer des rapports et interfaces", "Créer des programmes orientés objet"],
    modules: ["Fondamentaux ABAP", "Programmation procédurale", "ABAP Objects", "ALV Reports", "BAPIs et RFCs"],
    prerequisites: "Expérience en programmation recommandée",
    certification: "SAP Certified Development Associate - ABAP",
    isPublished: true,
  },
  {
    title: "SAP Analytics Cloud",
    description: "Découvrez SAP Analytics Cloud, la solution BI cloud de SAP. Créez des tableaux de bord interactifs et des analyses prédictives.",
    category: "Analytics",
    level: "Debutant",
    format: "Online",
    duration: 25,
    price: 95000,
    badge: "Nouveau",
    objectives: ["Créer des visualisations de données", "Développer des tableaux de bord", "Utiliser les fonctionnalités prédictives"],
    modules: ["Introduction SAC", "Connexion aux données", "Visualisations", "Stories et tableaux de bord", "Analytics avancées"],
    prerequisites: "Aucun prérequis",
    certification: null,
    isPublished: true,
  },
  {
    title: "SAP Basis - Administration Système",
    description: "Formation pour administrateurs SAP. Apprenez à installer, configurer et maintenir les systèmes SAP en production.",
    category: "Basis",
    level: "Avance",
    format: "Presentiel",
    duration: 45,
    price: 180000,
    badge: null,
    objectives: ["Administrer les systèmes SAP", "Gérer les transports et migrations", "Assurer la sécurité et performance"],
    modules: ["Architecture SAP", "Installation et configuration", "Gestion des utilisateurs", "Transports", "Monitoring et tuning"],
    prerequisites: "Expérience en administration système Linux/Windows",
    certification: "SAP Certified Technology Associate - System Administration",
    isPublished: true,
  },
];

const sampleFaqs = [
  // General
  {
    questionFr: "Qu'est-ce qu'A.SAP ?",
    questionEn: "What is A.SAP?",
    answerFr: "A.SAP est un cabinet de conseil spécialisé en transformation digitale, SAP et formation, basé au Sénégal avec une présence en Afrique de l'Ouest. Nous accompagnons les entreprises dans leur modernisation avec une expertise combinant conseil stratégique, solutions technologiques et développement des compétences.",
    answerEn: "A.SAP is a consulting firm specialized in digital transformation, SAP and training, based in Senegal with a presence in West Africa.",
    category: "General",
    order: 1,
    isPublished: true,
  },
  {
    questionFr: "À qui s'adressent vos services ?",
    questionEn: "Who are your services for?",
    answerFr: "Nos services s'adressent aux entreprises de toutes tailles - PME, grandes entreprises et institutions publiques - qui souhaitent moderniser leurs systèmes d'information, déployer SAP ou former leurs équipes. Nous travaillons également avec des particuliers en reconversion professionnelle via nos formations SAP.",
    answerEn: "Our services are for businesses of all sizes - SMEs, large enterprises and public institutions - who want to modernize their information systems.",
    category: "General",
    order: 2,
    isPublished: true,
  },
  // Agent IA
  {
    questionFr: "L'Agent IA remplace-t-il un consultant humain ?",
    questionEn: "Does the AI Agent replace a human consultant?",
    answerFr: "Non, l'Agent IA ne remplace pas nos consultants. Il est conçu pour vous accueillir, comprendre votre besoin initial et vous orienter vers le bon interlocuteur. Pour les projets complexes, vous serez toujours accompagné par nos experts humains qui apportent leur expérience et leur expertise métier.",
    answerEn: "No, the AI Agent does not replace our consultants. It is designed to welcome you and direct you to the right contact.",
    category: "Agent IA",
    order: 3,
    isPublished: true,
  },
  {
    questionFr: "Mes données sont-elles sécurisées avec l'Agent IA ?",
    questionEn: "Is my data secure with the AI Agent?",
    answerFr: "Oui, la sécurité de vos données est notre priorité. Les conversations avec l'Agent IA sont chiffrées et nous ne partageons jamais vos informations avec des tiers. Nous respectons les normes de protection des données personnelles.",
    answerEn: "Yes, data security is our priority. Conversations with the AI Agent are encrypted.",
    category: "Agent IA",
    order: 4,
    isPublished: true,
  },
  // Services
  {
    questionFr: "Travaillez-vous avec des PME ou uniquement des grandes entreprises ?",
    questionEn: "Do you work with SMEs or only large companies?",
    answerFr: "Nous accompagnons des entreprises de toutes tailles. Notre approche s'adapte à vos besoins et votre budget. Pour les PME, nous proposons des solutions pragmatiques et accessibles. Pour les grandes entreprises, nous déployons des programmes complets de transformation.",
    answerEn: "We work with businesses of all sizes. Our approach adapts to your needs and budget.",
    category: "Services",
    order: 5,
    isPublished: true,
  },
  {
    questionFr: "Intervenez-vous en dehors du Sénégal ?",
    questionEn: "Do you work outside of Senegal?",
    answerFr: "Oui, nous intervenons dans toute l'Afrique de l'Ouest et au-delà. Nous avons des consultants présents dans plusieurs pays et pouvons intervenir à distance ou sur site selon vos besoins.",
    answerEn: "Yes, we operate throughout West Africa and beyond.",
    category: "Services",
    order: 6,
    isPublished: true,
  },
  // SAP
  {
    questionFr: "Êtes-vous un intégrateur SAP certifié ?",
    questionEn: "Are you a certified SAP integrator?",
    answerFr: "Oui, A.SAP est partenaire certifié SAP. Notre équipe compte des consultants certifiés sur les principaux modules SAP (FI, CO, MM, SD, PP, etc.) et nous suivons les méthodologies SAP Activate pour nos projets d'implémentation.",
    answerEn: "Yes, A.SAP is a certified SAP partner.",
    category: "SAP",
    order: 7,
    isPublished: true,
  },
  {
    questionFr: "Proposez-vous d'autres ERP que SAP ?",
    questionEn: "Do you offer other ERPs besides SAP?",
    answerFr: "SAP est notre expertise principale, mais nous pouvons vous conseiller sur le choix d'un ERP adapté à vos besoins. Si SAP n'est pas la solution idéale pour votre contexte, nous vous orienterons vers des alternatives pertinentes.",
    answerEn: "SAP is our main expertise, but we can advise on choosing the right ERP for your needs.",
    category: "SAP",
    order: 8,
    isPublished: true,
  },
  // Formation
  {
    questionFr: "Vos formations sont-elles certifiantes ?",
    questionEn: "Are your trainings certified?",
    answerFr: "Oui, la plupart de nos formations préparent aux certifications officielles SAP. Nous proposons également des formations pratiques non certifiantes pour ceux qui souhaitent acquérir des compétences opérationnelles sans passer la certification.",
    answerEn: "Yes, most of our trainings prepare for official SAP certifications.",
    category: "Formation",
    order: 9,
    isPublished: true,
  },
  {
    questionFr: "Quels sont les prérequis pour suivre une formation SAP ?",
    questionEn: "What are the prerequisites for SAP training?",
    answerFr: "Les prérequis varient selon les formations. Certaines sont accessibles aux débutants complets, d'autres nécessitent des connaissances préalables en comptabilité, logistique ou informatique. Chaque fiche formation détaille les prérequis spécifiques.",
    answerEn: "Prerequisites vary by training. Some are accessible to complete beginners.",
    category: "Formation",
    order: 10,
    isPublished: true,
  },
  // Pricing
  {
    questionFr: "Pourquoi les tarifs ne sont-ils pas affichés sur le site ?",
    questionEn: "Why are prices not displayed on the website?",
    answerFr: "Chaque projet est unique et nos tarifs sont personnalisés en fonction de vos besoins spécifiques, de la complexité du projet et de sa durée. Parlez à notre Agent IA pour obtenir une première estimation ou contactez-nous pour un devis détaillé.",
    answerEn: "Each project is unique and our rates are customized based on your specific needs.",
    category: "Pricing",
    order: 11,
    isPublished: true,
  },
  // RDV
  {
    questionFr: "Comment réserver un rendez-vous ?",
    questionEn: "How do I book an appointment?",
    answerFr: "Vous pouvez réserver un rendez-vous directement via notre Agent IA qui vous proposera des créneaux disponibles en Google Meet ou Microsoft Teams. Vous pouvez également nous contacter par email ou téléphone.",
    answerEn: "You can book an appointment directly through our AI Agent.",
    category: "RDV",
    order: 12,
    isPublished: true,
  },
];

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingFormations = await db.select().from(formations);
    if (existingFormations.length === 0) {
      console.log("Seeding formations...");
      await db.insert(formations).values(sampleFormations);
      console.log(`Inserted ${sampleFormations.length} formations`);
    } else {
      console.log("Formations already exist, skipping seed");
    }

    const existingFaqs = await db.select().from(faqs);
    if (existingFaqs.length === 0) {
      console.log("Seeding FAQs...");
      await db.insert(faqs).values(sampleFaqs);
      console.log(`Inserted ${sampleFaqs.length} FAQs`);
    } else {
      console.log("FAQs already exist, skipping seed");
    }

    console.log("Database seeding complete!");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}
