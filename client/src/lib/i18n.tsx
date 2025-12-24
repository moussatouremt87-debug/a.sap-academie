import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "fr" | "en";

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  fr: {
    "nav.home": "Accueil",
    "nav.expertises": "Nos Expertises",
    "nav.formations": "Formations",
    "nav.faq": "FAQ",
    "nav.whyAsap": "Pourquoi A.SAP",
    "nav.contact": "Contact Commercial",
    "nav.legal": "Mentions Légales & RGPD",
    
    "home.hero.title": "Votre Partenaire en Transformation Digitale & SAP",
    "home.hero.subtitle": "Cabinet de conseil spécialisé dans la transformation digitale, l'intégration SAP et la formation professionnelle en Afrique de l'Ouest",
    "home.hero.cta": "Parler à un Expert",
    "home.hero.discover": "Découvrir nos services",
    
    "home.services.title": "Nos Domaines d'Expertise",
    "home.services.subtitle": "Des solutions complètes pour accompagner votre transformation",
    
    "home.cta.title": "Prêt à Transformer Votre Entreprise ?",
    "home.cta.subtitle": "Discutez avec notre agent commercial intelligent disponible 24/7 pour répondre à vos questions et planifier une consultation.",
    "home.cta.button": "Démarrer une Conversation",
    
    "expertises.title": "Nos Expertises",
    "expertises.subtitle": "Des compétences pointues pour accompagner votre transformation digitale",
    
    "formations.title": "Formations SAP",
    "formations.subtitle": "Développez vos compétences avec nos formations certifiantes",
    "formations.investment.title": "Investissement & Potentiel de Revenus",
    "formations.investment.subtitle": "Un consultant SAP est l'un des profils IT les mieux rémunérés. Le TJM moyen :",
    "formations.junior": "Junior",
    "formations.confirmed": "Confirmé",
    "formations.senior": "Senior",
    "formations.perDay": "/jour",
    "formations.duration": "Durée",
    "formations.level": "Niveau",
    "formations.price": "Prix",
    "formations.viewDetails": "Voir les détails",
    "formations.all": "Toutes",
    
    "faq.title": "Questions Fréquentes",
    "faq.subtitle": "Trouvez rapidement les réponses à vos questions",
    "faq.search": "Rechercher une question...",
    "faq.noResults": "Aucun résultat trouvé",
    
    "agent.title": "Agent Commercial A.SAP",
    "agent.subtitle": "Notre agent IA est disponible 24/7 pour répondre à vos questions",
    "agent.placeholder": "Posez votre question...",
    "agent.send": "Envoyer",
    "agent.welcome": "Bonjour ! Je suis l'agent commercial A.SAP. Comment puis-je vous aider ?",
    
    "footer.services": "Services",
    "footer.resources": "Ressources",
    "footer.contact": "Contact",
    "footer.rights": "Tous droits réservés.",
    "footer.description": "Cabinet de conseil en transformation digitale, SAP et formation. Votre partenaire pour la modernisation de vos systèmes d'information.",
    
    "legal.title": "Mentions Légales & Protection des Données",
    "legal.subtitle": "Votre confiance est notre priorité. Découvrez comment nous protégeons vos données.",
    "legal.company": "Informations Légales",
    "legal.companyName": "Raison Sociale",
    "legal.headquarters": "Siège Social",
    "legal.activity": "Activité",
    "legal.activityDesc": "Conseil en transformation digitale, intégration SAP et formation professionnelle",
    "legal.hosting": "Hébergement",
    "legal.hostingDesc": "Ce site est hébergé par Replit, Inc. - San Francisco, CA, USA",
    "legal.dataProtection": "Protection des Données Personnelles",
    "legal.dataProtectionIntro": "Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi sénégalaise n°2008-12 du 25 janvier 2008 sur la protection des données personnelles, nous nous engageons à protéger vos informations.",
    "legal.dataCollected": "Données Collectées",
    "legal.processingPurpose": "Finalité du Traitement",
    "legal.security": "Mesures de Sécurité",
    "legal.securityIntro": "Nous mettons en œuvre les mesures techniques et organisationnelles suivantes :",
    "legal.ssl": "Chiffrement SSL/TLS",
    "legal.sslDesc": "Toutes les communications sont chiffrées",
    "legal.auth": "Authentification Sécurisée",
    "legal.authDesc": "Accès CRM protégé par Replit Auth",
    "legal.db": "Base de Données Sécurisée",
    "legal.dbDesc": "PostgreSQL avec accès restreint",
    "legal.access": "Accès Contrôlé",
    "legal.accessDesc": "Seuls les utilisateurs autorisés accèdent aux données",
    "legal.rights": "Vos Droits",
    "legal.rightsIntro": "Conformément à la réglementation, vous disposez des droits suivants :",
    "legal.rightAccess": "Droit d'accès : Obtenir une copie de vos données personnelles",
    "legal.rightRectification": "Droit de rectification : Corriger vos données inexactes",
    "legal.rightErasure": "Droit à l'effacement : Demander la suppression de vos données",
    "legal.rightObjection": "Droit d'opposition : Vous opposer au traitement de vos données",
    "legal.rightPortability": "Droit à la portabilité : Recevoir vos données dans un format structuré",
    "legal.rightWithdraw": "Droit de retrait du consentement : Retirer votre consentement à tout moment",
    "legal.rightsExercise": "Pour exercer ces droits, contactez-nous à l'adresse indiquée ci-dessous.",
    "legal.retention": "Conservation des Données",
    "legal.retentionIntro": "Vos données personnelles sont conservées pendant la durée nécessaire à la réalisation des finalités pour lesquelles elles ont été collectées :",
    "legal.contactTitle": "Contact",
    "legal.contactIntro": "Pour toute question concernant la protection de vos données personnelles ou pour exercer vos droits, contactez-nous :",
    "legal.lastUpdate": "Dernière mise à jour : Décembre 2024",
    
    "whyAsap.title": "Pourquoi Choisir A.SAP ?",
    "whyAsap.subtitle": "Découvrez ce qui fait notre différence",
    
    "common.learnMore": "En savoir plus",
    "common.getStarted": "Commencer",
    "common.back": "Retour",
    "common.scrollTop": "Retour en haut",
  },
  en: {
    "nav.home": "Home",
    "nav.expertises": "Our Expertise",
    "nav.formations": "Training",
    "nav.faq": "FAQ",
    "nav.whyAsap": "Why A.SAP",
    "nav.contact": "Sales Contact",
    "nav.legal": "Legal Notice & GDPR",
    
    "home.hero.title": "Your Partner in Digital Transformation & SAP",
    "home.hero.subtitle": "Consulting firm specialized in digital transformation, SAP integration and professional training in West Africa",
    "home.hero.cta": "Talk to an Expert",
    "home.hero.discover": "Discover our services",
    
    "home.services.title": "Our Areas of Expertise",
    "home.services.subtitle": "Complete solutions to support your transformation",
    
    "home.cta.title": "Ready to Transform Your Business?",
    "home.cta.subtitle": "Chat with our intelligent sales agent available 24/7 to answer your questions and schedule a consultation.",
    "home.cta.button": "Start a Conversation",
    
    "expertises.title": "Our Expertise",
    "expertises.subtitle": "Expert skills to support your digital transformation",
    
    "formations.title": "SAP Training",
    "formations.subtitle": "Develop your skills with our certified training programs",
    "formations.investment.title": "Investment & Earning Potential",
    "formations.investment.subtitle": "SAP consultants are among the best-paid IT professionals. Average daily rate:",
    "formations.junior": "Junior",
    "formations.confirmed": "Experienced",
    "formations.senior": "Senior",
    "formations.perDay": "/day",
    "formations.duration": "Duration",
    "formations.level": "Level",
    "formations.price": "Price",
    "formations.viewDetails": "View details",
    "formations.all": "All",
    
    "faq.title": "Frequently Asked Questions",
    "faq.subtitle": "Quickly find answers to your questions",
    "faq.search": "Search for a question...",
    "faq.noResults": "No results found",
    
    "agent.title": "A.SAP Sales Agent",
    "agent.subtitle": "Our AI agent is available 24/7 to answer your questions",
    "agent.placeholder": "Ask your question...",
    "agent.send": "Send",
    "agent.welcome": "Hello! I'm the A.SAP sales agent. How can I help you?",
    
    "footer.services": "Services",
    "footer.resources": "Resources",
    "footer.contact": "Contact",
    "footer.rights": "All rights reserved.",
    "footer.description": "Digital transformation, SAP consulting and training firm. Your partner for modernizing your information systems.",
    
    "legal.title": "Legal Notice & Data Protection",
    "legal.subtitle": "Your trust is our priority. Discover how we protect your data.",
    "legal.company": "Legal Information",
    "legal.companyName": "Company Name",
    "legal.headquarters": "Headquarters",
    "legal.activity": "Activity",
    "legal.activityDesc": "Digital transformation consulting, SAP integration and professional training",
    "legal.hosting": "Hosting",
    "legal.hostingDesc": "This site is hosted by Replit, Inc. - San Francisco, CA, USA",
    "legal.dataProtection": "Personal Data Protection",
    "legal.dataProtectionIntro": "In accordance with the General Data Protection Regulation (GDPR) and Senegalese law n°2008-12 of January 25, 2008 on personal data protection, we are committed to protecting your information.",
    "legal.dataCollected": "Data Collected",
    "legal.processingPurpose": "Processing Purpose",
    "legal.security": "Security Measures",
    "legal.securityIntro": "We implement the following technical and organizational measures:",
    "legal.ssl": "SSL/TLS Encryption",
    "legal.sslDesc": "All communications are encrypted",
    "legal.auth": "Secure Authentication",
    "legal.authDesc": "CRM access protected by Replit Auth",
    "legal.db": "Secure Database",
    "legal.dbDesc": "PostgreSQL with restricted access",
    "legal.access": "Controlled Access",
    "legal.accessDesc": "Only authorized users can access data",
    "legal.rights": "Your Rights",
    "legal.rightsIntro": "In accordance with regulations, you have the following rights:",
    "legal.rightAccess": "Right of access: Obtain a copy of your personal data",
    "legal.rightRectification": "Right of rectification: Correct your inaccurate data",
    "legal.rightErasure": "Right to erasure: Request deletion of your data",
    "legal.rightObjection": "Right to object: Object to processing of your data",
    "legal.rightPortability": "Right to portability: Receive your data in a structured format",
    "legal.rightWithdraw": "Right to withdraw consent: Withdraw your consent at any time",
    "legal.rightsExercise": "To exercise these rights, contact us at the address below.",
    "legal.retention": "Data Retention",
    "legal.retentionIntro": "Your personal data is kept for the time necessary to achieve the purposes for which it was collected:",
    "legal.contactTitle": "Contact",
    "legal.contactIntro": "For any questions regarding the protection of your personal data or to exercise your rights, contact us:",
    "legal.lastUpdate": "Last update: December 2024",
    
    "whyAsap.title": "Why Choose A.SAP?",
    "whyAsap.subtitle": "Discover what makes us different",
    
    "common.learnMore": "Learn more",
    "common.getStarted": "Get started",
    "common.back": "Back",
    "common.scrollTop": "Back to top",
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("asap-language");
      if (saved === "fr" || saved === "en") return saved;
    }
    return "fr";
  });

  useEffect(() => {
    localStorage.setItem("asap-language", language);
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function useTranslation() {
  return useI18n();
}
