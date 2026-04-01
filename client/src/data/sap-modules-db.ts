/**
 * A.SAP Académie - Base de Données des Modules SAP
 * Plateforme de Formation SAP pour l'Afrique de l'Ouest
 *
 * Ce fichier contient une base de données complète des modules SAP,
 * des transactions clés et du glossaire des termes SAP en français.
 */

// ============================================================================
// INTERFACES ET TYPES
// ============================================================================

export interface SubModule {
  id: string;
  code: string;
  name: string;
  description: string;
  lessonCount: number;
}

export interface SAPModule {
  id: string;
  code: string;
  name: string;
  description: string;
  longDescription: string;
  icon: string;
  color: string;
  subModules: SubModule[];
  lessonCount: number;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  duration: string;
  prerequisites: string[];
}

export interface SAPTransaction {
  code: string;
  name: string; // Titre en français
  description: string; // Description en français
  module: string;
  subModule: string;
  category: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
  example: string;
  relatedTcodes: string[];
  menu?: string;
  notes?: string;
}

export interface SAPGlossaryTerm {
  term: string;
  definition: string;
  module: string;
  example: string;
  relatedTerms?: string[];
}

export interface AIChatPrompt {
  id: string;
  category: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Pratique';
  question: string;
  module?: string;
  difficulty: 'Débutant' | 'Intermédiaire' | 'Avancé';
}

// ============================================================================
// MODULES SAP
// ============================================================================

export const SAP_MODULES: SAPModule[] = [
  {
    id: 'fi',
    code: 'FI',
    name: 'Finance (Comptabilité)',
    description: 'Gestion de la comptabilité générale, fournisseurs et clients',
    longDescription: 'Le module Finance (FI) gère toutes les transactions comptables, la comptabilité générale, les comptes de tiers, les immobilisations et la clôture comptable. C\'est le cœur financier de tout système SAP.',
    icon: '💰',
    color: 'bg-green-100',
    lessonCount: 48,
    difficulty: 'Débutant',
    duration: '4-6 semaines',
    prerequisites: [],
    subModules: [
      {
        id: 'fi-gl',
        code: 'FI-GL',
        name: 'Comptabilité Générale',
        description: 'Grand livre et écritures comptables',
        lessonCount: 12
      },
      {
        id: 'fi-ap',
        code: 'FI-AP',
        name: 'Comptes Fournisseurs',
        description: 'Gestion des dettes fournisseurs et paiements',
        lessonCount: 10
      },
      {
        id: 'fi-ar',
        code: 'FI-AR',
        name: 'Comptes Clients',
        description: 'Gestion des créances clients et encaissements',
        lessonCount: 10
      },
      {
        id: 'fi-aa',
        code: 'FI-AA',
        name: 'Gestion des Immobilisations',
        description: 'Comptabilité des immobilisations et amortissements',
        lessonCount: 8
      },
      {
        id: 'fi-bl',
        code: 'FI-BL',
        name: 'Clôture Comptable',
        description: 'Clôture de période et processus comptables',
        lessonCount: 8
      }
    ]
  },
  {
    id: 'co',
    code: 'CO',
    name: 'Contrôle de Gestion',
    description: 'Comptabilité analytique et contrôle des coûts',
    longDescription: 'Le module Contrôle de Gestion (CO) fournit les outils pour analyser les coûts, les centres de coûts, les centres de profit et la comptabilité analytique. Il permet de suivre la rentabilité par domaine d\'activité.',
    icon: '📊',
    color: 'bg-blue-100',
    lessonCount: 40,
    difficulty: 'Intermédiaire',
    duration: '4-5 semaines',
    prerequisites: ['fi'],
    subModules: [
      {
        id: 'co-cca',
        code: 'CO-CCA',
        name: 'Comptabilité par Centres de Coûts',
        description: 'Gestion des centres de coûts et allocations',
        lessonCount: 10
      },
      {
        id: 'co-cel',
        code: 'CO-CEL',
        name: 'Comptabilité par Éléments',
        description: 'Analyse des coûts par élément de coût',
        lessonCount: 8
      },
      {
        id: 'co-pca',
        code: 'CO-PCA',
        name: 'Comptabilité par Centres de Profit',
        description: 'Analyse de rentabilité par centre de profit',
        lessonCount: 10
      },
      {
        id: 'co-pa',
        code: 'CO-PA',
        name: 'Comptabilité par Domaines d\'Activité',
        description: 'Analyse de rentabilité par produit/marché',
        lessonCount: 12
      }
    ]
  },
  {
    id: 'mm',
    code: 'MM',
    name: 'Gestion des Matériaux',
    description: 'Gestion des stocks, achats et mouvements de matériaux',
    longDescription: 'Le module Gestion des Matériaux (MM) couvre l\'intégralité de la chaîne logistique d\'approvisionnement : achat, réception, stockage, inventaire et mouvements de matériaux. C\'est un module clé dans tout environnement manufacturier.',
    icon: '📦',
    color: 'bg-yellow-100',
    lessonCount: 52,
    difficulty: 'Débutant',
    duration: '5-6 semaines',
    prerequisites: [],
    subModules: [
      {
        id: 'mm-pur',
        code: 'MM-PUR',
        name: 'Achats',
        description: 'Gestion des commandes d\'achat et fournisseurs',
        lessonCount: 14
      },
      {
        id: 'mm-im',
        code: 'MM-IM',
        name: 'Réception et Inspection',
        description: 'Réception des articles et inspection qualité',
        lessonCount: 10
      },
      {
        id: 'mm-iv',
        code: 'MM-IV',
        name: 'Inventaire',
        description: 'Gestion des stocks et inventaires physiques',
        lessonCount: 14
      },
      {
        id: 'mm-cbp',
        code: 'MM-CBP',
        name: 'Mouvements de Stock',
        description: 'Mouvements internes et transferts de matériaux',
        lessonCount: 14
      }
    ]
  },
  {
    id: 'sd',
    code: 'SD',
    name: 'Administration des Ventes',
    description: 'Gestion des commandes, livraisons et facturations',
    longDescription: 'Le module Administration des Ventes (SD) gère l\'intégralité du cycle de vente : création de commandes, gestion des stocks de distribution, livraisons et facturation des clients.',
    icon: '🚚',
    color: 'bg-red-100',
    lessonCount: 48,
    difficulty: 'Débutant',
    duration: '4-6 semaines',
    prerequisites: [],
    subModules: [
      {
        id: 'sd-sls',
        code: 'SD-SLS',
        name: 'Ventes',
        description: 'Commandes clients et gestion des ventes',
        lessonCount: 12
      },
      {
        id: 'sd-shp',
        code: 'SD-SHP',
        name: 'Livraisons',
        description: 'Planification et exécution des livraisons',
        lessonCount: 12
      },
      {
        id: 'sd-bil',
        code: 'SD-BIL',
        name: 'Facturation',
        description: 'Créations de factures et gestion des revenus',
        lessonCount: 12
      },
      {
        id: 'sd-md',
        code: 'SD-MD',
        name: 'Données Maîtres',
        description: 'Clients, articles et conditions commerciales',
        lessonCount: 12
      }
    ]
  },
  {
    id: 'pp',
    code: 'PP',
    name: 'Planification de Production',
    description: 'Planification et ordonnancement de la production',
    longDescription: 'Le module Planification de Production (PP) gère la planification de la production, les ordres de fabrication, la gestion des nomenclatures et les gammes de production. Il optimise les ressources de production.',
    icon: '🏭',
    color: 'bg-orange-100',
    lessonCount: 45,
    difficulty: 'Intermédiaire',
    duration: '5-6 semaines',
    prerequisites: ['mm'],
    subModules: [
      {
        id: 'pp-mrp',
        code: 'PP-MRP',
        name: 'Planification MRP',
        description: 'Planification des besoins en matières',
        lessonCount: 12
      },
      {
        id: 'pp-sfc',
        code: 'PP-SFC',
        name: 'Ordres de Fabrication',
        description: 'Création et gestion des ordres de fabrication',
        lessonCount: 12
      },
      {
        id: 'pp-bd',
        code: 'PP-BD',
        name: 'Nomenclatures et Gammes',
        description: 'Gestion des nomenclatures et gammes opératoires',
        lessonCount: 12
      },
      {
        id: 'pp-wcm',
        code: 'PP-WCM',
        name: 'Gestion des Ressources',
        description: 'Postes de travail et planification des capacités',
        lessonCount: 9
      }
    ]
  },
  {
    id: 'hcm',
    code: 'HCM',
    name: 'Gestion du Capital Humain',
    description: 'Paie, effectifs et gestion du personnel',
    longDescription: 'Le module Gestion du Capital Humain (HCM) gère tous les processus RH : dossiers du personnel, paie, temps, absences et rapports statutaires. Il couvre la totalité du cycle de vie du collaborateur.',
    icon: '👥',
    color: 'bg-purple-100',
    lessonCount: 44,
    difficulty: 'Intermédiaire',
    duration: '4-6 semaines',
    prerequisites: [],
    subModules: [
      {
        id: 'hcm-pa',
        code: 'HCM-PA',
        name: 'Gestion du Personnel',
        description: 'Dossiers personnels et actions du personnel',
        lessonCount: 12
      },
      {
        id: 'hcm-py',
        code: 'HCM-PY',
        name: 'Paie',
        description: 'Gestion de la paie et bulletins de salaire',
        lessonCount: 12
      },
      {
        id: 'hcm-om',
        code: 'HCM-OM',
        name: 'Organisation',
        description: 'Structure organisationnelle et positions',
        lessonCount: 10
      },
      {
        id: 'hcm-tm',
        code: 'HCM-TM',
        name: 'Gestion du Temps',
        description: 'Horaires, absences et congés',
        lessonCount: 10
      }
    ]
  },
  {
    id: 'abap',
    code: 'ABAP',
    name: 'Développement (ABAP)',
    description: 'Programmation et développement SAP',
    longDescription: 'Le module ABAP couvre la programmation SAP avec le langage ABAP/4. Il inclut le développement de rapports, de formulaires et de modules fonctionnels personnalisés.',
    icon: '💻',
    color: 'bg-gray-100',
    lessonCount: 56,
    difficulty: 'Avancé',
    duration: '6-8 semaines',
    prerequisites: [],
    subModules: [
      {
        id: 'abap-dic',
        code: 'ABAP-DIC',
        name: 'Dictionnaire de Données',
        description: 'Éléments de données et structures SAP',
        lessonCount: 12
      },
      {
        id: 'abap-wb',
        code: 'ABAP-WB',
        name: 'Workbench et Rapports',
        description: 'Développement de rapports ABAP',
        lessonCount: 16
      },
      {
        id: 'abap-alv',
        code: 'ABAP-ALV',
        name: 'Rapports ALV',
        description: 'ALV (ABAP List Viewer) pour affichage de données',
        lessonCount: 14
      },
      {
        id: 'abap-oo',
        code: 'ABAP-OO',
        name: 'Programmation Orientée Objet',
        description: 'OOP en ABAP et patterns de développement',
        lessonCount: 14
      }
    ]
  },
  {
    id: 'basis',
    code: 'BASIS',
    name: 'Administration Système',
    description: 'Administration et configuration de SAP',
    longDescription: 'Le module BASIS couvre l\'administration technique de SAP : infrastructure, sécurité, maintenance, monitoring et gestion des transports. C\'est le fondement technique du système.',
    icon: '⚙️',
    color: 'bg-indigo-100',
    lessonCount: 50,
    difficulty: 'Avancé',
    duration: '6-7 semaines',
    prerequisites: [],
    subModules: [
      {
        id: 'basis-adm',
        code: 'BASIS-ADM',
        name: 'Administration du Système',
        description: 'Configuration et maintenance du système SAP',
        lessonCount: 14
      },
      {
        id: 'basis-sec',
        code: 'BASIS-SEC',
        name: 'Sécurité',
        description: 'Authentification, autorisations et sécurité',
        lessonCount: 12
      },
      {
        id: 'basis-tms',
        code: 'BASIS-TMS',
        name: 'Gestion des Transports',
        description: 'Transports et gestion des changements',
        lessonCount: 12
      },
      {
        id: 'basis-mon',
        code: 'BASIS-MON',
        name: 'Monitoring et Performance',
        description: 'Monitoring du système et optimisation',
        lessonCount: 12
      }
    ]
  }
];

// ============================================================================
// TRANSACTIONS SAP
// ============================================================================

export const SAP_TRANSACTIONS: SAPTransaction[] = [
  // ========== FINANCE (FI) ==========
  {
    code: 'FS00',
    name: 'Créer une Société',
    description: 'Transaction pour créer une nouvelle société dans le mandant SAP',
    module: 'FI',
    subModule: 'FI-GL',
    category: 'Configuration',
    difficulty: 'Avancé',
    example: 'Création d\'une filiale pour une nouvelle succursale',
    relatedTcodes: ['FS01', 'FS02', 'OX02'],
    menu: 'SAP Menu > Comptabilité générale > Données maîtres > Sociétés',
    notes: 'Accès limité aux administrateurs système'
  },
  {
    code: 'FB01',
    name: 'Écriture Comptable Simple',
    description: 'Saisie d\'écritures comptables simples au journal',
    module: 'FI',
    subModule: 'FI-GL',
    category: 'Transactions',
    difficulty: 'Débutant',
    example: 'Saisie d\'une écriture de journal standard avec deux lignes',
    relatedTcodes: ['FB02', 'FB03', 'FB50']
  },
  {
    code: 'FB50',
    name: 'Écriture Comptable Générale',
    description: 'Saisie des écritures comptables complexes avec plusieurs lignes',
    module: 'FI',
    subModule: 'FI-GL',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Écriture multi-devise avec allocation de coûts',
    relatedTcodes: ['FB01', 'FB02', 'FB03', 'FAGLB03']
  },
  {
    code: 'F-02',
    name: 'Paiement Fournisseur',
    description: 'Effectuer des paiements aux fournisseurs',
    module: 'FI',
    subModule: 'FI-AP',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Paiement partiel d\'une facture fournisseur existante',
    relatedTcodes: ['F-03', 'F-04', 'F-05', 'F-53']
  },
  {
    code: 'F-03',
    name: 'Afficher Paiements Fournisseurs',
    description: 'Afficher et analyser les paiements effectués',
    module: 'FI',
    subModule: 'FI-AP',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Consultation des paiements d\'une période comptable',
    relatedTcodes: ['F-02', 'FBL1N']
  },
  {
    code: 'F-04',
    name: 'Reverser un Paiement',
    description: 'Annuler un paiement fournisseur (crédit)',
    module: 'FI',
    subModule: 'FI-AP',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Reversal d\'un paiement erroné',
    relatedTcodes: ['F-02', 'F-05']
  },
  {
    code: 'F-05',
    name: 'Afficher Réceptions Factures',
    description: 'Afficher les factures reçues de fournisseurs',
    module: 'FI',
    subModule: 'FI-AP',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Consultation des factures non payées',
    relatedTcodes: ['F-02', 'F-04', 'FBL1N']
  },
  {
    code: 'F-06',
    name: 'Encaissement Client',
    description: 'Saisie des encaissements clients',
    module: 'FI',
    subModule: 'FI-AR',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Encaissement partiel d\'une facture client',
    relatedTcodes: ['F-07', 'F-32', 'F-08']
  },
  {
    code: 'F-07',
    name: 'Afficher Encaissements',
    description: 'Afficher les encaissements effectués',
    module: 'FI',
    subModule: 'FI-AR',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Analyse des encaissements d\'une période',
    relatedTcodes: ['F-06', 'FBL3N']
  },
  {
    code: 'FBL1N',
    name: 'Extrait Compte Fournisseur',
    description: 'Afficher l\'extrait de compte détaillé d\'un fournisseur',
    module: 'FI',
    subModule: 'FI-AP',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Réconciliation compte fournisseur',
    relatedTcodes: ['FBL3N', 'FBL5N', 'F-04']
  },
  {
    code: 'FBL3N',
    name: 'Extrait Compte Client',
    description: 'Afficher l\'extrait de compte détaillé d\'un client',
    module: 'FI',
    subModule: 'FI-AR',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Suivi du crédit d\'un client',
    relatedTcodes: ['FBL1N', 'FBL5N', 'F-06']
  },
  {
    code: 'FBL5N',
    name: 'Extrait Compte Général',
    description: 'Afficher l\'extrait de compte d\'un compte général',
    module: 'FI',
    subModule: 'FI-GL',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Vérification des mouvements d\'un compte de charge',
    relatedTcodes: ['FBL1N', 'FBL3N']
  },
  {
    code: 'FK01',
    name: 'Créer Fournisseur',
    description: 'Créer un enregistrement de fournisseur',
    module: 'FI',
    subModule: 'FI-AP',
    category: 'Données maîtres',
    difficulty: 'Débutant',
    example: 'Création d\'une fiche fournisseur nouvelle',
    relatedTcodes: ['FK02', 'FK03', 'XK01']
  },
  {
    code: 'FK02',
    name: 'Modifier Fournisseur',
    description: 'Modifier les données d\'un fournisseur existant',
    module: 'FI',
    subModule: 'FI-AP',
    category: 'Données maîtres',
    difficulty: 'Débutant',
    example: 'Mise à jour de l\'adresse d\'un fournisseur',
    relatedTcodes: ['FK01', 'FK03']
  },
  {
    code: 'FD01',
    name: 'Créer Client',
    description: 'Créer un enregistrement de client',
    module: 'FI',
    subModule: 'FI-AR',
    category: 'Données maîtres',
    difficulty: 'Débutant',
    example: 'Création d\'une fiche client nouvelle',
    relatedTcodes: ['FD02', 'FD03', 'XD01']
  },
  {
    code: 'FD02',
    name: 'Modifier Client',
    description: 'Modifier les données d\'un client existant',
    module: 'FI',
    subModule: 'FI-AR',
    category: 'Données maîtres',
    difficulty: 'Débutant',
    example: 'Mise à jour des conditions de paiement d\'un client',
    relatedTcodes: ['FD01', 'FD03']
  },
  {
    code: 'FS10N',
    name: 'Afficher Compte Général',
    description: 'Afficher les données maîtres d\'un compte général',
    module: 'FI',
    subModule: 'FI-GL',
    category: 'Données maîtres',
    difficulty: 'Débutant',
    example: 'Consultation de la configuration d\'un compte',
    relatedTcodes: ['FS01', 'FS02']
  },
  {
    code: 'FAGLB03',
    name: 'Bilan de Trésorerie',
    description: 'Afficher les comptes généraux et mouvements',
    module: 'FI',
    subModule: 'FI-GL',
    category: 'Rapports',
    difficulty: 'Intermédiaire',
    example: 'Rapport de synthèse des comptes généraux',
    relatedTcodes: ['FB50', 'FB01']
  },
  {
    code: 'OB52',
    name: 'Créer Plage de Numéros',
    description: 'Créer des plages de numéros de documents',
    module: 'FI',
    subModule: 'FI-GL',
    category: 'Configuration',
    difficulty: 'Avancé',
    example: 'Création de plage de numéros pour les factures',
    relatedTcodes: ['OB10']
  },
  {
    code: 'FBRA',
    name: 'Validation et Reversement',
    description: 'Valider ou reverser des écritures comptables',
    module: 'FI',
    subModule: 'FI-GL',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Reversal d\'écritures comptables',
    relatedTcodes: ['FB01', 'FB50']
  },
  {
    code: 'F.13',
    name: 'Relevé de Rapprochement',
    description: 'Créer des relevés de rapprochement compte',
    module: 'FI',
    subModule: 'FI-GL',
    category: 'Rapports',
    difficulty: 'Intermédiaire',
    example: 'Rapprochement bancaire',
    relatedTcodes: ['FB01', 'FBL5N']
  },
  {
    code: 'AS01',
    name: 'Créer Immobilisation',
    description: 'Créer un enregistrement d\'immobilisation',
    module: 'FI',
    subModule: 'FI-AA',
    category: 'Données maîtres',
    difficulty: 'Intermédiaire',
    example: 'Création d\'une fiche d\'immobilisation pour un équipement',
    relatedTcodes: ['AS02', 'AS03', 'AS11']
  },
  {
    code: 'AS02',
    name: 'Modifier Immobilisation',
    description: 'Modifier les données d\'une immobilisation',
    module: 'FI',
    subModule: 'FI-AA',
    category: 'Données maîtres',
    difficulty: 'Intermédiaire',
    example: 'Modification du montant d\'amortissement',
    relatedTcodes: ['AS01', 'AS03']
  },
  {
    code: 'AFAB',
    name: 'Enregistrement Initial',
    description: 'Enregistrement comptable initial des immobilisations',
    module: 'FI',
    subModule: 'FI-AA',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Enregistrement comptable d\'une acquisition',
    relatedTcodes: ['AS01', 'AS02']
  },

  // ========== CONTRÔLE DE GESTION (CO) ==========
  {
    code: 'KS01',
    name: 'Créer Centre de Coûts',
    description: 'Créer un nouveau centre de coûts',
    module: 'CO',
    subModule: 'CO-CCA',
    category: 'Données maîtres',
    difficulty: 'Intermédiaire',
    example: 'Création d\'un centre de coûts pour un département',
    relatedTcodes: ['KS02', 'KS03']
  },
  {
    code: 'KS02',
    name: 'Modifier Centre de Coûts',
    description: 'Modifier les données d\'un centre de coûts',
    module: 'CO',
    subModule: 'CO-CCA',
    category: 'Données maîtres',
    difficulty: 'Intermédiaire',
    example: 'Mise à jour du responsable d\'un centre de coûts',
    relatedTcodes: ['KS01', 'KS03']
  },
  {
    code: 'KS03',
    name: 'Afficher Centre de Coûts',
    description: 'Afficher les données maîtres d\'un centre de coûts',
    module: 'CO',
    subModule: 'CO-CCA',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Consultation des informations d\'un centre de coûts',
    relatedTcodes: ['KS01', 'KS02']
  },
  {
    code: 'KP06',
    name: 'Allocation de Coûts',
    description: 'Exécuter une allocation de coûts planifiée',
    module: 'CO',
    subModule: 'CO-CCA',
    category: 'Transactions',
    difficulty: 'Avancé',
    example: 'Allocation des frais généraux aux centres de coûts',
    relatedTcodes: ['KP26', 'KSU1']
  },
  {
    code: 'KP26',
    name: 'Paramètres d\'Allocation',
    description: 'Créer et modifier les paramètres d\'allocation',
    module: 'CO',
    subModule: 'CO-CCA',
    category: 'Configuration',
    difficulty: 'Avancé',
    example: 'Configuration des clés d\'allocation',
    relatedTcodes: ['KP06']
  },
  {
    code: 'KSU1',
    name: 'Rapport Centres de Coûts',
    description: 'Afficher le rapport d\'analyse des centres de coûts',
    module: 'CO',
    subModule: 'CO-CCA',
    category: 'Rapports',
    difficulty: 'Intermédiaire',
    example: 'Analyse des dépenses par centre de coûts',
    relatedTcodes: ['KP06']
  },
  {
    code: 'KEA0',
    name: 'Éléments de Coûts',
    description: 'Créer et gérer les éléments de coûts',
    module: 'CO',
    subModule: 'CO-CEL',
    category: 'Données maîtres',
    difficulty: 'Intermédiaire',
    example: 'Création d\'un élément de coût pour les salaires',
    relatedTcodes: ['KEA1']
  },
  {
    code: 'KSPI',
    name: 'Informations Planification',
    description: 'Afficher les informations de planification d\'un centre',
    module: 'CO',
    subModule: 'CO-CCA',
    category: 'Interrogation',
    difficulty: 'Intermédiaire',
    example: 'Consultation des dépenses planifiées',
    relatedTcodes: ['KS01', 'KSU1']
  },
  {
    code: 'CJ20N',
    name: 'Créer Projet WBS',
    description: 'Créer un projet avec structure WBS',
    module: 'CO',
    subModule: 'CO-PA',
    category: 'Données maîtres',
    difficulty: 'Avancé',
    example: 'Création d\'un projet multiannuel avec jalons',
    relatedTcodes: ['CJ02', 'CJ03']
  },
  {
    code: 'KE51',
    name: 'Écritures Réelles',
    description: 'Saisir des écritures de coûts réels',
    module: 'CO',
    subModule: 'CO-PA',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Saisie d\'une charge pour une ligne de produit',
    relatedTcodes: ['KE52']
  },
  {
    code: 'KE52',
    name: 'Afficher Écritures Réelles',
    description: 'Afficher les écritures de coûts saisies',
    module: 'CO',
    subModule: 'CO-PA',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Consultation des coûts réels par ligne',
    relatedTcodes: ['KE51']
  },
  {
    code: 'KB21N',
    name: 'Profit and Loss Rapports',
    description: 'Afficher les rapports de profit et perte',
    module: 'CO',
    subModule: 'CO-PA',
    category: 'Rapports',
    difficulty: 'Avancé',
    example: 'Analyse de rentabilité par produit',
    relatedTcodes: ['KE51']
  },
  {
    code: 'KO01',
    name: 'Créer Variante Coûts',
    description: 'Créer une variante de coûts',
    module: 'CO',
    subModule: 'CO-CEL',
    category: 'Données maîtres',
    difficulty: 'Avancé',
    example: 'Variante pour scenario budgétaire',
    relatedTcodes: ['KO02', 'KO03']
  },
  {
    code: 'S_ALR_87013611',
    name: 'Rapport Écarts Coûts',
    description: 'Rapport d\'analyse des écarts de coûts',
    module: 'CO',
    subModule: 'CO-PA',
    category: 'Rapports',
    difficulty: 'Avancé',
    example: 'Analyse des écarts réel vs planifié',
    relatedTcodes: ['KE51', 'KB21N']
  },

  // ========== GESTION DES MATÉRIAUX (MM) ==========
  {
    code: 'MM01',
    name: 'Créer Article',
    description: 'Créer un nouvel article dans le catalogue',
    module: 'MM',
    subModule: 'MM-PUR',
    category: 'Données maîtres',
    difficulty: 'Débutant',
    example: 'Création d\'une fiche article pour une matière première',
    relatedTcodes: ['MM02', 'MM03']
  },
  {
    code: 'MM02',
    name: 'Modifier Article',
    description: 'Modifier les données d\'un article existant',
    module: 'MM',
    subModule: 'MM-PUR',
    category: 'Données maîtres',
    difficulty: 'Débutant',
    example: 'Mise à jour du prix standard d\'un article',
    relatedTcodes: ['MM01', 'MM03']
  },
  {
    code: 'MM03',
    name: 'Afficher Article',
    description: 'Afficher les données maîtres d\'un article',
    module: 'MM',
    subModule: 'MM-PUR',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Consultation des informations d\'un article',
    relatedTcodes: ['MM01', 'MM02']
  },
  {
    code: 'ME21N',
    name: 'Créer Commande d\'Achat',
    description: 'Créer une nouvelle commande d\'achat',
    module: 'MM',
    subModule: 'MM-PUR',
    category: 'Transactions',
    difficulty: 'Débutant',
    example: 'Création d\'une commande pour achat de matières',
    relatedTcodes: ['ME22N', 'ME23N', 'ME51N']
  },
  {
    code: 'ME22N',
    name: 'Modifier Commande d\'Achat',
    description: 'Modifier une commande d\'achat existante',
    module: 'MM',
    subModule: 'MM-PUR',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Modification de la quantité ou du prix',
    relatedTcodes: ['ME21N', 'ME23N']
  },
  {
    code: 'ME23N',
    name: 'Afficher Commande d\'Achat',
    description: 'Afficher une commande d\'achat',
    module: 'MM',
    subModule: 'MM-PUR',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Consultation du statut d\'une commande',
    relatedTcodes: ['ME21N', 'ME22N']
  },
  {
    code: 'ME51N',
    name: 'Créer Demande d\'Achat',
    description: 'Créer une demande d\'achat',
    module: 'MM',
    subModule: 'MM-PUR',
    category: 'Transactions',
    difficulty: 'Débutant',
    example: 'Création d\'une demande d\'achat depuis un ordre',
    relatedTcodes: ['ME52N', 'ME21N']
  },
  {
    code: 'ME52N',
    name: 'Afficher Demande d\'Achat',
    description: 'Afficher les demandes d\'achat',
    module: 'MM',
    subModule: 'MM-PUR',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Consultation des demandes en attente',
    relatedTcodes: ['ME51N']
  },
  {
    code: 'MIGO',
    name: 'Mouvement de Stock Goods',
    description: 'Enregistrer les mouvements de marchandises',
    module: 'MM',
    subModule: 'MM-IM',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Réception de marchandises d\'une commande',
    relatedTcodes: ['MB01', 'MB1A', 'MB1C']
  },
  {
    code: 'MIRO',
    name: 'Réception/Facture d\'Achat',
    description: 'Enregistrer la réception de facture fournisseur',
    module: 'MM',
    subModule: 'MM-IM',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Enregistrement d\'une facture avec reçu de marchandises',
    relatedTcodes: ['MIGO', 'MIR4']
  },
  {
    code: 'MB51',
    name: 'Mouvements de Stock (Réception)',
    description: 'Afficher les mouvements de réception',
    module: 'MM',
    subModule: 'MM-IV',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Consultations des réceptions d\'une période',
    relatedTcodes: ['MB52', 'MMBE']
  },
  {
    code: 'MB52',
    name: 'Stock Disponible',
    description: 'Afficher le stock disponible par article',
    module: 'MM',
    subModule: 'MM-IV',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Consultation du stock disponible actuellement',
    relatedTcodes: ['MB51', 'MMBE']
  },
  {
    code: 'MMBE',
    name: 'Stock Disponible Étendu',
    description: 'Afficher l\'état du stock détaillé',
    module: 'MM',
    subModule: 'MM-IV',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Vue détaillée du stock par emplacement',
    relatedTcodes: ['MB51', 'MB52']
  },
  {
    code: 'MI01',
    name: 'Créer Inventaire',
    description: 'Créer un document d\'inventaire physique',
    module: 'MM',
    subModule: 'MM-IV',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Création d\'inventaire annuel',
    relatedTcodes: ['MI02', 'MI04']
  },
  {
    code: 'MI04',
    name: 'Saisie Inventaire',
    description: 'Saisir les quantités d\'inventaire physique',
    module: 'MM',
    subModule: 'MM-IV',
    category: 'Transactions',
    difficulty: 'Débutant',
    example: 'Saisie des quantités comptées',
    relatedTcodes: ['MI01', 'MI07']
  },
  {
    code: 'MI07',
    name: 'Afficher Inventaire',
    description: 'Afficher les documents d\'inventaire',
    module: 'MM',
    subModule: 'MM-IV',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Consultation des inventaires réalisés',
    relatedTcodes: ['MI01', 'MI04']
  },
  {
    code: 'MK01',
    name: 'Créer Emplacement de Stock',
    description: 'Créer un nouvel emplacement de stockage',
    module: 'MM',
    subModule: 'MM-CBP',
    category: 'Données maîtres',
    difficulty: 'Intermédiaire',
    example: 'Création d\'un nouvel emplacement dans un entrepôt',
    relatedTcodes: ['MK02']
  },
  {
    code: 'MK02',
    name: 'Modifier Emplacement de Stock',
    description: 'Modifier un emplacement de stockage',
    module: 'MM',
    subModule: 'MM-CBP',
    category: 'Données maîtres',
    difficulty: 'Intermédiaire',
    example: 'Mise à jour de la capacité d\'un emplacement',
    relatedTcodes: ['MK01']
  },

  // ========== ADMINISTRATION DES VENTES (SD) ==========
  {
    code: 'VA01',
    name: 'Créer Commande Client',
    description: 'Créer une nouvelle commande client',
    module: 'SD',
    subModule: 'SD-SLS',
    category: 'Transactions',
    difficulty: 'Débutant',
    example: 'Création d\'une commande de vente standard',
    relatedTcodes: ['VA02', 'VA03', 'VA05']
  },
  {
    code: 'VA02',
    name: 'Modifier Commande Client',
    description: 'Modifier une commande client existante',
    module: 'SD',
    subModule: 'SD-SLS',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Modification de la quantité avant livraison',
    relatedTcodes: ['VA01', 'VA03']
  },
  {
    code: 'VA03',
    name: 'Afficher Commande Client',
    description: 'Afficher une commande client',
    module: 'SD',
    subModule: 'SD-SLS',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Consultation du statut d\'une commande',
    relatedTcodes: ['VA01', 'VA02']
  },
  {
    code: 'VA11',
    name: 'Créer Devis',
    description: 'Créer un devis pour un client',
    module: 'SD',
    subModule: 'SD-SLS',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Création d\'un devis pour appel d\'offres',
    relatedTcodes: ['VA12', 'VA13']
  },
  {
    code: 'VA21',
    name: 'Créer Bon de Livraison',
    description: 'Créer une commande de livraison partielle',
    module: 'SD',
    subModule: 'SD-SHP',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Création d\'une livraison partielle',
    relatedTcodes: ['VA22', 'VA23']
  },
  {
    code: 'VL01N',
    name: 'Créer Bon de Livraison',
    description: 'Créer un bon de livraison',
    module: 'SD',
    subModule: 'SD-SHP',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Création d\'un bon de livraison depuis une commande',
    relatedTcodes: ['VL02N', 'VL03N']
  },
  {
    code: 'VL02N',
    name: 'Modifier Bon de Livraison',
    description: 'Modifier un bon de livraison',
    module: 'SD',
    subModule: 'SD-SHP',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Modification d\'un bon de livraison en cours',
    relatedTcodes: ['VL01N', 'VL03N']
  },
  {
    code: 'VF01',
    name: 'Créer Facture Client',
    description: 'Créer une facture client',
    module: 'SD',
    subModule: 'SD-BIL',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Création d\'une facture depuis une livraison',
    relatedTcodes: ['VF02', 'VF03']
  },
  {
    code: 'VF02',
    name: 'Modifier Facture Client',
    description: 'Modifier une facture client',
    module: 'SD',
    subModule: 'SD-BIL',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Modification d\'une facture brouillon',
    relatedTcodes: ['VF01', 'VF03']
  },
  {
    code: 'VF11',
    name: 'Créer Facture Avoir',
    description: 'Créer une facture d\'avoir (Crédit)',
    module: 'SD',
    subModule: 'SD-BIL',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Création d\'un avoir pour retour marchandise',
    relatedTcodes: ['VF01', 'VF02']
  },
  {
    code: 'XD01',
    name: 'Créer Client (Général)',
    description: 'Créer un client de manière simple',
    module: 'SD',
    subModule: 'SD-MD',
    category: 'Données maîtres',
    difficulty: 'Débutant',
    example: 'Création d\'une fiche client simplifiée',
    relatedTcodes: ['XD02', 'FD01']
  },
  {
    code: 'XD02',
    name: 'Modifier Client (Général)',
    description: 'Modifier les données d\'un client',
    module: 'SD',
    subModule: 'SD-MD',
    category: 'Données maîtres',
    difficulty: 'Débutant',
    example: 'Mise à jour des coordonnées d\'un client',
    relatedTcodes: ['XD01', 'FD02']
  },
  {
    code: 'VK11',
    name: 'Créer Condition de Prix',
    description: 'Créer une condition tarifaire',
    module: 'SD',
    subModule: 'SD-MD',
    category: 'Données maîtres',
    difficulty: 'Avancé',
    example: 'Création d\'une gamme de remise client',
    relatedTcodes: ['VK12', 'VK13']
  },
  {
    code: 'VA05',
    name: 'Lister Commandes',
    description: 'Afficher la liste des commandes',
    module: 'SD',
    subModule: 'SD-SLS',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Consultation de toutes les commandes',
    relatedTcodes: ['VA01', 'VA03']
  },
  {
    code: 'VL06O',
    name: 'Liste de Livraison',
    description: 'Afficher la liste des bons de livraison',
    module: 'SD',
    subModule: 'SD-SHP',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Consultation des bons de livraison à traiter',
    relatedTcodes: ['VL01N']
  },
  {
    code: 'VF04',
    name: 'Lister Factures',
    description: 'Afficher la liste des factures',
    module: 'SD',
    subModule: 'SD-BIL',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Consultation des factures en attente de validation',
    relatedTcodes: ['VF01']
  },

  // ========== PLANIFICATION DE PRODUCTION (PP) ==========
  {
    code: 'CO01',
    name: 'Créer Ordre de Fabrication',
    description: 'Créer un ordre de production',
    module: 'PP',
    subModule: 'PP-SFC',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Création d\'un ordre de fabrication planifié',
    relatedTcodes: ['CO02', 'CO03']
  },
  {
    code: 'CO02',
    name: 'Modifier Ordre de Fabrication',
    description: 'Modifier un ordre de production',
    module: 'PP',
    subModule: 'PP-SFC',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Modification des quantités d\'un ordre',
    relatedTcodes: ['CO01', 'CO03']
  },
  {
    code: 'CO03',
    name: 'Afficher Ordre de Fabrication',
    description: 'Afficher les détails d\'un ordre',
    module: 'PP',
    subModule: 'PP-SFC',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Consultation du statut d\'un ordre',
    relatedTcodes: ['CO01', 'CO02']
  },
  {
    code: 'CO11N',
    name: 'Créer Confirmation de Production',
    description: 'Créer une confirmation de production',
    module: 'PP',
    subModule: 'PP-SFC',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Enregistrement de la production réalisée',
    relatedTcodes: ['CO12', 'CO13']
  },
  {
    code: 'CO15',
    name: 'Clôturer Ordre de Fabrication',
    description: 'Clôturer un ordre terminé',
    module: 'PP',
    subModule: 'PP-SFC',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Clôture d\'un ordre terminé',
    relatedTcodes: ['CO01', 'CO11N']
  },
  {
    code: 'MD01',
    name: 'Créer Nomenclature',
    description: 'Créer une nomenclature de produit',
    module: 'PP',
    subModule: 'PP-BD',
    category: 'Données maîtres',
    difficulty: 'Intermédiaire',
    example: 'Création d\'une nomenclature de produit fini',
    relatedTcodes: ['MD02', 'MD03']
  },
  {
    code: 'MD02',
    name: 'Modifier Nomenclature',
    description: 'Modifier une nomenclature',
    module: 'PP',
    subModule: 'PP-BD',
    category: 'Données maîtres',
    difficulty: 'Intermédiaire',
    example: 'Mise à jour des composants d\'une nomenclature',
    relatedTcodes: ['MD01', 'MD03']
  },
  {
    code: 'MD04',
    name: 'Créer Gamme Opératoire',
    description: 'Créer une gamme de fabrication',
    module: 'PP',
    subModule: 'PP-BD',
    category: 'Données maîtres',
    difficulty: 'Avancé',
    example: 'Création d\'une gamme avec postes de travail',
    relatedTcodes: ['MD05', 'CA01']
  },
  {
    code: 'MD05',
    name: 'Modifier Gamme Opératoire',
    description: 'Modifier une gamme de fabrication',
    module: 'PP',
    subModule: 'PP-BD',
    category: 'Données maîtres',
    difficulty: 'Avancé',
    example: 'Modification des temps opératoires',
    relatedTcodes: ['MD04']
  },
  {
    code: 'CR01',
    name: 'Créer Poste de Travail',
    description: 'Créer un poste de travail',
    module: 'PP',
    subModule: 'PP-WCM',
    category: 'Données maîtres',
    difficulty: 'Avancé',
    example: 'Création d\'un poste de travail de production',
    relatedTcodes: ['CR02', 'CA01']
  },
  {
    code: 'CS01',
    name: 'Créer Famille de Produits',
    description: 'Créer une famille de planification',
    module: 'PP',
    subModule: 'PP-MRP',
    category: 'Données maîtres',
    difficulty: 'Avancé',
    example: 'Création d\'une famille pour MRP',
    relatedTcodes: ['CS02']
  },
  {
    code: 'CS02',
    name: 'Modifier Famille de Produits',
    description: 'Modifier une famille de planification',
    module: 'PP',
    subModule: 'PP-MRP',
    category: 'Données maîtres',
    difficulty: 'Avancé',
    example: 'Modification des paramètres de planification',
    relatedTcodes: ['CS01']
  },
  {
    code: 'CA01',
    name: 'Créer Ressource',
    description: 'Créer une ressource de production',
    module: 'PP',
    subModule: 'PP-WCM',
    category: 'Données maîtres',
    difficulty: 'Avancé',
    example: 'Création d\'une machine de production',
    relatedTcodes: ['CA02']
  },
  {
    code: 'CA02',
    name: 'Modifier Ressource',
    description: 'Modifier une ressource de production',
    module: 'PP',
    subModule: 'PP-WCM',
    category: 'Données maîtres',
    difficulty: 'Avancé',
    example: 'Modification des capacités d\'une machine',
    relatedTcodes: ['CA01']
  },
  {
    code: 'CM01',
    name: 'Planification Hors-Usine',
    description: 'Créer un ordre d\'externalisation',
    module: 'PP',
    subModule: 'PP-SFC',
    category: 'Transactions',
    difficulty: 'Avancé',
    example: 'Création d\'un ordre de sous-traitance',
    relatedTcodes: ['CO01']
  },

  // ========== GESTION DU CAPITAL HUMAIN (HCM) ==========
  {
    code: 'PA20',
    name: 'Afficher Dossier Personnel',
    description: 'Afficher les données du dossier personnel',
    module: 'HCM',
    subModule: 'HCM-PA',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Consultation du dossier d\'un employé',
    relatedTcodes: ['PA30', 'PA40']
  },
  {
    code: 'PA30',
    name: 'Modifier Dossier Personnel',
    description: 'Modifier les données personnelles d\'un employé',
    module: 'HCM',
    subModule: 'HCM-PA',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Mise à jour des coordonnées d\'un employé',
    relatedTcodes: ['PA20', 'PA40']
  },
  {
    code: 'PA40',
    name: 'Créer Actions Personnelles',
    description: 'Créer une action personnelle',
    module: 'HCM',
    subModule: 'HCM-PA',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Enregistrement d\'une promotion',
    relatedTcodes: ['PA20', 'PA30']
  },
  {
    code: 'PA41',
    name: 'Modifier Actions Personnelles',
    description: 'Modifier une action personnelle',
    module: 'HCM',
    subModule: 'HCM-PA',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Modification d\'une date d\'action',
    relatedTcodes: ['PA40']
  },
  {
    code: 'PA61',
    name: 'Rapports Gestion Personnel',
    description: 'Afficher les rapports de gestion du personnel',
    module: 'HCM',
    subModule: 'HCM-PA',
    category: 'Rapports',
    difficulty: 'Intermédiaire',
    example: 'Rapport d\'effectifs par département',
    relatedTcodes: ['PA20']
  },
  {
    code: 'PA71',
    name: 'Infotypes',
    description: 'Créer et gérer les infotypes du personnel',
    module: 'HCM',
    subModule: 'HCM-PA',
    category: 'Données maîtres',
    difficulty: 'Avancé',
    example: 'Gestion des infotypes personnalisés',
    relatedTcodes: ['PA30']
  },
  {
    code: 'PT01',
    name: 'Créer Relevé de Temps',
    description: 'Créer un relevé de temps de travail',
    module: 'HCM',
    subModule: 'HCM-TM',
    category: 'Transactions',
    difficulty: 'Intermédiaire',
    example: 'Saisie des heures de travail',
    relatedTcodes: ['PT60']
  },
  {
    code: 'PT60',
    name: 'Afficher Relevé de Temps',
    description: 'Afficher les relevés de temps saisis',
    module: 'HCM',
    subModule: 'HCM-TM',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Consultation des heures travaillées',
    relatedTcodes: ['PT01']
  },
  {
    code: 'PC00_M99_CIPE',
    name: 'Rapport Paie',
    description: 'Afficher les rapports de paie',
    module: 'HCM',
    subModule: 'HCM-PY',
    category: 'Rapports',
    difficulty: 'Intermédiaire',
    example: 'Rapport d\'analyse des masses salariales',
    relatedTcodes: ['PT01']
  },
  {
    code: 'PU00',
    name: 'Afficher Fiche Paie',
    description: 'Afficher la fiche de paie d\'un employé',
    module: 'HCM',
    subModule: 'HCM-PY',
    category: 'Interrogation',
    difficulty: 'Débutant',
    example: 'Consultation du bulletin de salaire',
    relatedTcodes: ['PT01', 'PC00_M99_CIPE']
  },

  // ========== DÉVELOPPEMENT (ABAP) ==========
  {
    code: 'SE38',
    name: 'Éditeur de Rapport ABAP',
    description: 'Créer et éditer des programmes ABAP',
    module: 'ABAP',
    subModule: 'ABAP-WB',
    category: 'Développement',
    difficulty: 'Avancé',
    example: 'Créer un rapport personnalisé de ventes',
    relatedTcodes: ['SE80', 'SE37']
  },
  {
    code: 'SE80',
    name: 'ABAP Workbench',
    description: 'Environnement de développement ABAP complet',
    module: 'ABAP',
    subModule: 'ABAP-WB',
    category: 'Développement',
    difficulty: 'Avancé',
    example: 'Développement intégré de modules ABAP',
    relatedTcodes: ['SE38', 'SE11']
  },
  {
    code: 'SE11',
    name: 'Dictionnaire de Données',
    description: 'Créer et modifier les structures de données',
    module: 'ABAP',
    subModule: 'ABAP-DIC',
    category: 'Développement',
    difficulty: 'Avancé',
    example: 'Création d\'une table personnalisée',
    relatedTcodes: ['SE80', 'SE37']
  },
  {
    code: 'SE37',
    name: 'Éditeur de Fonction',
    description: 'Créer et modifier des modules fonctionnels',
    module: 'ABAP',
    subModule: 'ABAP-WB',
    category: 'Développement',
    difficulty: 'Avancé',
    example: 'Créer une fonction réutilisable',
    relatedTcodes: ['SE38', 'SE80']
  },
  {
    code: 'SE24',
    name: 'Class Builder',
    description: 'Créer et modifier des classes ABAP OO',
    module: 'ABAP',
    subModule: 'ABAP-OO',
    category: 'Développement',
    difficulty: 'Avancé',
    example: 'Création d\'une classe de gestion',
    relatedTcodes: ['SE80']
  },
  {
    code: 'SE16N',
    name: 'Éditeur de Table',
    description: 'Consulter et éditer les données des tables',
    module: 'ABAP',
    subModule: 'ABAP-DIC',
    category: 'Utilitaires',
    difficulty: 'Débutant',
    example: 'Consultation d\'une table de données',
    relatedTcodes: ['SE11']
  },
  {
    code: 'ST22',
    name: 'Dump d\'Erreurs',
    description: 'Afficher les erreurs ABAP runtime',
    module: 'ABAP',
    subModule: 'ABAP-WB',
    category: 'Debugging',
    difficulty: 'Avancé',
    example: 'Analyse d\'une erreur d\'exécution',
    relatedTcodes: ['SE38']
  },
  {
    code: 'SMARTFORMS',
    name: 'SmartForms',
    description: 'Créer des formulaires SAP',
    module: 'ABAP',
    subModule: 'ABAP-WB',
    category: 'Développement',
    difficulty: 'Avancé',
    example: 'Création d\'un formulaire de bon de commande',
    relatedTcodes: ['SE38']
  },
  {
    code: 'SE91',
    name: 'Messages',
    description: 'Créer et gérer les messages ABAP',
    module: 'ABAP',
    subModule: 'ABAP-WB',
    category: 'Développement',
    difficulty: 'Intermédiaire',
    example: 'Création d\'un message d\'erreur personnalisé',
    relatedTcodes: ['SE38']
  },
  {
    code: 'SM30',
    name: 'Maintenance de Table',
    description: 'Générer des écrans de maintenance',
    module: 'ABAP',
    subModule: 'ABAP-WB',
    category: 'Utilitaires',
    difficulty: 'Intermédiaire',
    example: 'Création d\'un écran de saisie simple',
    relatedTcodes: ['SE11', 'SE16N']
  },

  // ========== ADMINISTRATION SYSTÈME (BASIS) ==========
  {
    code: 'SM21',
    name: 'Logs Système',
    description: 'Afficher les logs système du SAP',
    module: 'BASIS',
    subModule: 'BASIS-MON',
    category: 'Monitoring',
    difficulty: 'Avancé',
    example: 'Consultation des logs d\'erreurs système',
    relatedTcodes: ['SM50', 'ST05']
  },
  {
    code: 'SM37',
    name: 'Job Scheduler',
    description: 'Créer et gérer les jobs de batch',
    module: 'BASIS',
    subModule: 'BASIS-ADM',
    category: 'Administration',
    difficulty: 'Avancé',
    example: 'Planification d\'un job de clôture mensuelle',
    relatedTcodes: ['SM36']
  },
  {
    code: 'SM50',
    name: 'Process Overview',
    description: 'Afficher les processus en cours',
    module: 'BASIS',
    subModule: 'BASIS-MON',
    category: 'Monitoring',
    difficulty: 'Avancé',
    example: 'Monitoring des processus actifs',
    relatedTcodes: ['SM51', 'SM21']
  },
  {
    code: 'SM51',
    name: 'Instances du Système',
    description: 'Afficher les instances SAP actives',
    module: 'BASIS',
    subModule: 'BASIS-ADM',
    category: 'Administration',
    difficulty: 'Avancé',
    example: 'Vérification des instances en cours d\'exécution',
    relatedTcodes: ['SM50']
  },
  {
    code: 'SM59',
    name: 'RFC Destinations',
    description: 'Créer et modifier les destinations RFC',
    module: 'BASIS',
    subModule: 'BASIS-ADM',
    category: 'Configuration',
    difficulty: 'Avancé',
    example: 'Configuration d\'une connexion RFC',
    relatedTcodes: ['SM50']
  },
  {
    code: 'STMS',
    name: 'Transport Management',
    description: 'Gérer les transports de développement',
    module: 'BASIS',
    subModule: 'BASIS-TMS',
    category: 'Transports',
    difficulty: 'Avancé',
    example: 'Gestion des ordres de transport',
    relatedTcodes: ['SE10']
  },
  {
    code: 'SU01',
    name: 'Créer Utilisateur',
    description: 'Créer un nouvel utilisateur SAP',
    module: 'BASIS',
    subModule: 'BASIS-SEC',
    category: 'Sécurité',
    difficulty: 'Avancé',
    example: 'Création d\'un compte utilisateur',
    relatedTcodes: ['SU02', 'SU03']
  },
  {
    code: 'SU53',
    name: 'Analyse Autorisation',
    description: 'Analyser les autorisations d\'un utilisateur',
    module: 'BASIS',
    subModule: 'BASIS-SEC',
    category: 'Sécurité',
    difficulty: 'Avancé',
    example: 'Diagnostic d\'un refus d\'accès',
    relatedTcodes: ['SU01', 'SU02']
  },
  {
    code: 'ST05',
    name: 'Performance Trace',
    description: 'Analyser les traces de performance',
    module: 'BASIS',
    subModule: 'BASIS-MON',
    category: 'Performance',
    difficulty: 'Avancé',
    example: 'Analyse des requêtes lentes',
    relatedTcodes: ['ST12', 'SM50']
  },
  {
    code: 'SE06',
    name: 'CTS Project',
    description: 'Gérer les projets de transport',
    module: 'BASIS',
    subModule: 'BASIS-TMS',
    category: 'Transports',
    difficulty: 'Avancé',
    example: 'Création d\'un projet de transport',
    relatedTcodes: ['STMS']
  }
];

// ============================================================================
// GLOSSAIRE SAP
// ============================================================================

export const SAP_GLOSSARY: SAPGlossaryTerm[] = [
  {
    term: 'Mandant',
    definition: 'Unité organisationnelle indépendante, complète et autonome au sein d\'une instance SAP. Un mandant dispose de ses propres données maîtres (chart of accounts, customers, vendors) et données de transactions.',
    module: 'FI',
    example: 'La société Mère (mandant 100) est distincte de sa filiale en Afrique (mandant 200)',
    relatedTerms: ['Société', 'Exercice', 'Période comptable']
  },
  {
    term: 'Société',
    definition: 'Entité juridique et comptable dans un mandant, créée pour gérer les éléments comptables généraux comme les documents d\'intérêt légal (factures, paiements).',
    module: 'FI',
    example: 'Une société française, une société sénégalaise, une société ivoirienne',
    relatedTerms: ['Mandant', 'Centre d\'activité']
  },
  {
    term: 'Centre de Coûts',
    definition: 'Unité de contrôle des frais généraux où les coûts d\'exploitation sont assemblés et imputés pour des fins d\'analyse et de planification des frais.',
    module: 'CO',
    example: 'Centre de coûts Département IT, Département Production, Département RH',
    relatedTerms: ['Centre de Profit', 'Domaine d\'activité', 'Allocation']
  },
  {
    term: 'Centre de Profit',
    definition: 'Unité de contrôle responsable des revenus et des dépenses pour lesquels il peut être considéré comme responsable à titre de centre de profit autonome.',
    module: 'CO',
    example: 'Division Produits Pharmaceutiques, Division Services Informatiques',
    relatedTerms: ['Centre de Coûts', 'Comptabilité par Domaines d\'Activité']
  },
  {
    term: 'Domaine d\'Activité',
    definition: 'Unité de profit au sein d\'un mandant utilisée pour la comptabilité interne orientée produits/marchés. Elle permet une analyse de rentabilité détaillée par produit ou client.',
    module: 'CO',
    example: 'Domaine d\'activité Ventes Nationales, Ventes Export, Service Client',
    relatedTerms: ['Centre de Profit', 'Centre de Coûts']
  },
  {
    term: 'Écriture Comptable',
    definition: 'Enregistrement des opérations commerciales au journal. Comprend au minimum deux lignes (débit/crédit) qui affectent un ou plusieurs comptes de grand livre.',
    module: 'FI',
    example: 'Achat de fournitures : Débit Fournitures / Crédit Fournisseurs',
    relatedTerms: ['Grand Livre', 'Journal', 'Bilan']
  },
  {
    term: 'Grand Livre',
    definition: 'Registre comptable principal contenant tous les comptes généraux d\'une société, enregistrant tous les mouvements comptables et permettant de générer les états financiers.',
    module: 'FI',
    example: 'Comptes d\'actif, passif, revenus et dépenses consolidés',
    relatedTerms: ['Compte Général', 'Bilan', 'Compte de Résultat']
  },
  {
    term: 'Compte de Résultat',
    description: 'État financier présentant les revenus moins les dépenses pour une période donnée, montrant le profit ou la perte nette.',
    module: 'FI',
    example: 'Revenus 10 millions, Dépenses 7 millions, Bénéfice 3 millions',
    relatedTerms: ['Bilan', 'Grand Livre', 'Exercice']
  },
  {
    term: 'Bilan',
    definition: 'État financier présentant les actifs, passifs et capitaux propres d\'une entité à une date spécifique.',
    module: 'FI',
    example: 'Actif total: 100M | Passif: 60M | Capitaux propres: 40M',
    relatedTerms: ['Compte de Résultat', 'Grand Livre', 'Période comptable']
  },
  {
    term: 'Devise',
    definition: 'Monnaie utilisée pour enregistrer les transactions. SAP peut gérer plusieurs devises dans une même transaction avec conversion automatique.',
    module: 'FI',
    example: 'XOF (Franc CFA Ouest), EUR (Euro), USD (Dollar US)',
    relatedTerms: ['Taux de Change', 'Mandant']
  },
  {
    term: 'Exercice',
    definition: 'Période de 12 mois pour laquelle un bilan et un compte de résultat sont préparés. Peut être différent de l\'année calendaire.',
    module: 'FI',
    example: 'Exercice 2024: 01.01.2024 - 31.12.2024 ou 01.04.2024 - 31.03.2025',
    relatedTerms: ['Période Comptable', 'Clôture Comptable']
  },
  {
    term: 'Période Comptable',
    definition: 'Subdivision d\'un exercice, généralement mensuelle, utilisée pour clôturer les comptes et préparer les rapports gestion.',
    module: 'FI',
    example: 'Janvier 2024 (période 01/2024), Février 2024 (période 02/2024)',
    relatedTerms: ['Exercice', 'Clôture Comptable']
  },
  {
    term: 'Plan Comptable',
    definition: 'Structure de tous les comptes généraux utilisés dans une société SAP, classés et numérotés selon un système logique.',
    module: 'FI',
    example: 'Comptes 100000-199999: Actif | 200000-299999: Passif',
    relatedTerms: ['Compte Général', 'Grand Livre']
  },
  {
    term: 'Fiche Article',
    definition: 'Enregistrement maître contenant toutes les informations sur un produit ou service: description, prix, stocks, unités, fournisseurs.',
    module: 'MM',
    example: 'Article STAB001: Stabilisateur tension 5kVA, Prix 250000 XOF',
    relatedTerms: ['Nomenclature', 'Magasin', 'Stock']
  },
  {
    term: 'Unité Logistique',
    definition: 'Entité organisationnelle qui gère les stocks. Peut être un entrepôt, un centre de distribution ou une usine.',
    module: 'MM',
    example: 'Entrepôt Dakar, Usine de Production Abidjan',
    relatedTerms: ['Magasin', 'Emplacement', 'Stock']
  },
  {
    term: 'Magasin',
    definition: 'Zone de stockage dans une unité logistique où les articles sont physiquement entreposés et gérés.',
    module: 'MM',
    example: 'Magasin Matières Premières, Magasin Produits Finis',
    relatedTerms: ['Unité Logistique', 'Emplacement', 'Stock']
  },
  {
    term: 'Mouvement de Stock',
    definition: 'Enregistrement de toute augmentation ou diminution du stock (réception, sortie, transfer, déchet).',
    module: 'MM',
    example: 'Réception 100 unités, Sortie pour production 50 unités, Déchet 2 unités',
    relatedTerms: ['Stock', 'Réception', 'Inventaire']
  },
  {
    term: 'Commande d\'Achat',
    definition: 'Document contractuel établi avec un fournisseur pour l\'achat de matériaux ou services à un prix et délai convenus.',
    module: 'MM',
    example: 'Commande 4500012345 au fournisseur ALUM-TRADING pour 500kg d\'aluminium',
    relatedTerms: ['Demande d\'Achat', 'Facture Fournisseur', 'Réception']
  },
  {
    term: 'Bon de Commande',
    definition: 'Document de transmission interne indiquant la demande d\'une quantité spécifique d\'articles pour un besoin particulier.',
    module: 'SD',
    example: 'BC-2024-0567 : 20 unités de produit XYZ pour client ACME',
    relatedTerms: ['Commande Client', 'Livraison']
  },
  {
    term: 'Facture Fournisseur',
    definition: 'Document établi par le fournisseur réclamant le paiement pour les marchandises livrées ou services fournis.',
    module: 'MM',
    example: 'Facture F-202400123 du 15/04/2024, montant 5 000 000 XOF',
    relatedTerms: ['Réception', 'Commande d\'Achat', 'Paiement']
  },
  {
    term: 'Commande Client',
    definition: 'Document établi par un client demandant la livraison de produits ou services à un prix et conditions convenus.',
    module: 'SD',
    example: 'Commande client 0000123456 de 100 unités livrables dans 2 semaines',
    relatedTerms: ['Bon de Livraison', 'Facturation', 'Condition de Vente']
  },
  {
    term: 'Livraison',
    definition: 'Transfert physique de marchandises du fournisseur au client, documenté par un bon de livraison.',
    module: 'SD',
    example: 'Bon de livraison 80123456 du 20/04/2024 pour commande client',
    relatedTerms: ['Commande Client', 'Facturation', 'Réception']
  },
  {
    term: 'Facturation',
    definition: 'Création et envoi au client d\'un document (facture) demandant le paiement des marchandises livrées ou services rendus.',
    module: 'SD',
    example: 'Facture client 0000567890 du 21/04/2024, montant 2 500 000 XOF',
    relatedTerms: ['Commande Client', 'Livraison', 'Encaissement']
  },
  {
    term: 'Condition de Prix',
    definition: 'Paramétrisation des tarifs et remises appliquées automatiquement lors de la création de commandes client ou d\'achat.',
    module: 'SD',
    example: 'Remise 2% pour commandes > 10 unités, Remise 5% pour clients fidèles',
    relatedTerms: ['Facturation', 'Commande Client']
  },
  {
    term: 'Ordre de Fabrication',
    definition: 'Document de production autorisant et documentant la fabrication d\'une quantité spécifique d\'un article selon une nomenclature et gamme.',
    module: 'PP',
    example: 'Ordre 123456 : Fabriquer 1000 unités de produit XYZ, livrable 15/04/2024',
    relatedTerms: ['Nomenclature', 'Gamme', 'Confirmation Production']
  },
  {
    term: 'Nomenclature',
    definition: 'Liste hiérarchique de tous les composants et matières nécessaires pour fabriquer un produit fini avec leurs quantités.',
    module: 'PP',
    example: 'Nomenclature du produit MOTEUR-2HP : 1x Stator, 2x Bobines, 3x Roulements',
    relatedTerms: ['Ordre de Fabrication', 'Gamme', 'Matière Première']
  },
  {
    term: 'Gamme Opératoire',
    definition: 'Séquence et description des opérations de production requises pour fabriquer un article, avec temps, postes de travail et ressources.',
    module: 'PP',
    example: 'Gamme MOTEUR: Opération 10 Usinage (2h), Opération 20 Assemblage (1.5h)',
    relatedTerms: ['Ordre de Fabrication', 'Nomenclature', 'Poste de Travail']
  },
  {
    term: 'Poste de Travail',
    definition: 'Lieu physique ou logique d\'exécution d\'une opération de fabrication, avec ses capacités, heures d\'ouverture et coûts.',
    module: 'PP',
    example: 'Poste d\'usinage #01, Poste d\'assemblage manuel #15, Robot soudure #08',
    relatedTerms: ['Gamme Opératoire', 'Ressource', 'Capacité']
  },
  {
    term: 'MRP',
    definition: 'Planification des Besoins en Matières : processus de calcul automatique des quantités et dates de commande basé sur la demande client.',
    module: 'PP',
    example: 'MRP calcule que pour produire 1000 units, il faut commander 2000 kg de matière première avec délai 1 semaine',
    relatedTerms: ['Commande d\'Achat', 'Ordre de Fabrication', 'Stock']
  },
  {
    term: 'Infotype',
    definition: 'Catégorie d\'informations personnelles dans le module HCM, organisée par thème temporel (historique, actuel, futur).',
    module: 'HCM',
    example: 'Infotype 0000 Actions (embauche, départ), Infotype 0001 Données Org, Infotype 0008 Rémunération',
    relatedTerms: ['Dossier Personnel', 'Action Personnelle']
  },
  {
    term: 'Action du Personnel',
    definition: 'Événement important dans la vie professionnelle d\'un employé enregistré dans SAP avec date et détails.',
    module: 'HCM',
    example: 'Promotion du 15/04/2024, Mutation du 01/05/2024, Démission du 30/06/2024',
    relatedTerms: ['Infotype', 'Dossier Personnel']
  },
  {
    term: 'Fiche de Paie',
    definition: 'Document mensuel (ou périodique) détaillant tous les éléments du salaire d\'un employé (brut, charges, net).',
    module: 'HCM',
    example: 'Fiche de paie avril 2024: Salaire base 500.000, Primes 50.000, Charges 75.000, Net 475.000',
    relatedTerms: ['Paie', 'Masse Salariale']
  },
  {
    term: 'Clôture Comptable',
    definition: 'Ensemble des opérations de fin de période/exercice permettant de consolider, valider et arrêter les comptes.',
    module: 'FI',
    example: 'Clôture avril : réserves, écritures de régularisation, mouvements comptables, rapport de clôture',
    relatedTerms: ['Période Comptable', 'Exercice', 'Grand Livre']
  },
  {
    term: 'Rapprochement Bancaire',
    definition: 'Processus de vérification que les mouvements bancaires correspondent aux mouvements comptables pour la réconciliation.',
    module: 'FI',
    example: 'Comparaison des paiements enregistrés dans SAP avec le relevé bancaire du mois',
    relatedTerms: ['Compte Général', 'Trésorerie', 'Grand Livre']
  },
  {
    term: 'Provision',
    definition: 'Montant comptabilisé pour couvrir un passif probable mais dont le montant exact ou la date sont incertains.',
    module: 'FI',
    example: 'Provision pour litiges : 5 000 000 XOF pour différend client possible',
    relatedTerms: ['Bilan', 'Compte de Résultat', 'Passif']
  },
  {
    term: 'Amortissement',
    definition: 'Répartition du coût d\'une immobilisation sur sa durée de vie utile par écritures périodiques.',
    module: 'FI',
    example: 'Machine 100M amortie sur 10 ans = 10M XOF d\'amortissement annuel',
    relatedTerms: ['Immobilisation', 'Actif', 'Résultat']
  },
  {
    term: 'Immobilisation',
    definition: 'Actif à long terme acquis pour utilisation continue dans l\'entreprise (terrains, bâtiments, machines).',
    module: 'FI',
    example: 'Bâtiment usine 500M XOF, Machines de production 150M XOF',
    relatedTerms: ['Amortissement', 'Actif', 'Bilan']
  },
  {
    term: 'Tiers',
    definition: 'Entité externe (client ou fournisseur) avec laquelle l\'entreprise réalise des transactions commerciales.',
    module: 'FI',
    example: 'Clients: Entreprise ACME, Gouvernement, ONG | Fournisseurs: Aluminerie, Transport',
    relatedTerms: ['Compte Fournisseur', 'Compte Client']
  },
  {
    term: 'Compte Client',
    definition: 'Compte de la comptabilité générale suivi au détail de chaque client individuel, enregistrant tous crédits et débits.',
    module: 'FI',
    example: 'Client 0001234 ACME: Facture 2,5M, Paiement partiel 1M, Solde dû 1,5M',
    relatedTerms: ['Compte Fournisseur', 'Compte Général', 'Tiers']
  },
  {
    term: 'Compte Fournisseur',
    definition: 'Compte de la comptabilité générale suivi au détail de chaque fournisseur, enregistrant dettes et paiements.',
    module: 'FI',
    example: 'Fournisseur 0005678 ALUMEX: Facture 3,2M, Paiement 2M, Solde dû 1,2M',
    relatedTerms: ['Compte Client', 'Compte Général', 'Tiers']
  },
  {
    term: 'Compte Général',
    definition: 'Compte du grand livre enregistrant tous les mouvements relatifs à un sujet spécifique (actif, passif, revenu, dépense).',
    module: 'FI',
    example: 'Compte 600000 Achats, Compte 700000 Ventes, Compte 110000 Trésorerie',
    relatedTerms: ['Grand Livre', 'Plan Comptable', 'Mouvement']
  },
  {
    term: 'Devise Locale',
    definition: 'Devise de facturation et d\'opération principale d\'une société (par défaut pour les transactions).',
    module: 'FI',
    example: 'Devise locale Senégal: XOF (Franc CFA), Devise locale Ghana: GHS (Cedi)',
    relatedTerms: ['Devise', 'Taux de Change', 'Société']
  },
  {
    term: 'Taux de Change',
    definition: 'Rapport de conversion entre deux devises, utilisé automatiquement par SAP pour les transactions multi-devises.',
    module: 'FI',
    example: 'EUR/XOF 655,957 : 1 EUR = 655,957 XOF',
    relatedTerms: ['Devise', 'Transaction Multi-Devise']
  },
  {
    term: 'Allocation de Coûts',
    definition: 'Processus de répartition des coûts indirects d\'un centre vers d\'autres centres ou domaines d\'activité.',
    module: 'CO',
    example: 'Les 10M XOF de frais généraux sont alloués proportionnellement aux centres de coûts',
    relatedTerms: ['Centre de Coûts', 'Centre de Profit', 'Surcharge']
  },
  {
    term: 'Surcharge',
    definition: 'Taux appliqué pour allouer les frais indirects (généraux, administration) aux objets de coûts.',
    module: 'CO',
    example: 'Surcharge frais généraux 25%, appliquée à tous les ordres de fabrication',
    relatedTerms: ['Allocation de Coûts', 'Centre de Coûts']
  },
  {
    term: 'Coût Standard',
    definition: 'Coût théorique préétabli d\'un article basé sur les prix d\'achat et les temps de production normatifs.',
    module: 'CO',
    example: 'Coût standard du produit XYZ: 50.000 XOF (matières 30.000 + main-d\'oeuvre 20.000)',
    relatedTerms: ['Coût Réel', 'Écart', 'Nomenclature']
  },
  {
    term: 'Coût Réel',
    definition: 'Coût effectif d\'une production enregistré après réception des factures et confirmation de production.',
    module: 'CO',
    example: 'Coût réel produit XYZ : 52.500 XOF (écart 2.500 XOF vs standard)',
    relatedTerms: ['Coût Standard', 'Écart', 'Analyse Variance']
  },
  {
    term: 'Écart',
    definition: 'Différence entre le coût standard préétabli et le coût réel effectif pour une production.',
    module: 'CO',
    example: 'Écart défavorable matière -2000 XOF (prix matière plus cher que prévu)',
    relatedTerms: ['Coût Standard', 'Coût Réel', 'Analyse']
  },
  {
    term: 'Confirmation de Production',
    definition: 'Enregistrement dans SAP de la quantité effectivement produite et des ressources utilisées dans un ordre de fabrication.',
    module: 'PP',
    example: 'Confirmation: 95 unités produites avec 47 heures de main-d\'oeuvre',
    relatedTerms: ['Ordre de Fabrication', 'Coût Réel']
  },
  {
    term: 'Plan Comptable Analytique',
    definition: 'Structure des éléments de coûts utilisée pour la comptabilité analytique (frais directs, indirects, variables).',
    module: 'CO',
    example: 'Éléments: Matière première, Main-d\'oeuvre, Frais généraux, Amortissement',
    relatedTerms: ['Élément de Coût', 'Comptabilité Analytique']
  },
  {
    term: 'Domaine de Contrôle',
    definition: 'Zone organisationnelle pour laquelle les coûts sont accumulés et rapportés (centre de coûts, centre de profit).',
    module: 'CO',
    example: 'Domaines de contrôle: IT, Production, Vente, Administration',
    relatedTerms: ['Centre de Coûts', 'Centre de Profit']
  },
  {
    term: 'Réception (MM)',
    definition: 'Enregistrement dans SAP de l\'arrivée de marchandises commandées, créant le mouvement de réception en stocks.',
    module: 'MM',
    example: 'Réception de la commande 4500012345 : 500kg d\'aluminium reçus et contrôlés',
    relatedTerms: ['Commande d\'Achat', 'Mouvement de Stock', 'Inspection']
  },
  {
    term: 'Inspection Qualité',
    definition: 'Vérification des marchandises reçues pour s\'assurer qu\'elles répondent aux normes et spécifications.',
    module: 'MM',
    example: 'Inspection réception: 500kg demandés, 485kg acceptés, 15kg rejetés pour défaut',
    relatedTerms: ['Réception', 'Mouvement de Stock']
  },
  {
    term: 'Stock de Sécurité',
    definition: 'Quantité minimale de stock maintenue pour faire face aux variations de demande et délais d\'approvisionnement.',
    module: 'MM',
    example: 'Stock de sécurité article XYZ: 100 unités (consommation 20/jour, délai 10 jours)',
    relatedTerms: ['Point de Commande', 'MRP', 'Stock']
  },
  {
    term: 'Point de Commande',
    definition: 'Niveau de stock à partir duquel une nouvelle commande d\'achat doit être déclenchée.',
    module: 'MM',
    example: 'Point de commande article XYZ: 200 unités (stock de sécurité 100 + consommation 10jours)',
    relatedTerms: ['Stock de Sécurité', 'Commande d\'Achat', 'MRP']
  }
];

// ============================================================================
// PROMPTS POUR LE TUTEUR IA
// ============================================================================

export const AI_TUTOR_PROMPTS: AIChatPrompt[] = [
  {
    id: 'pmt_001',
    category: 'Débutant',
    question: 'Comment créer une écriture comptable simple avec FB01 ?',
    module: 'FI',
    difficulty: 'Débutant'
  },
  {
    id: 'pmt_002',
    category: 'Débutant',
    question: 'Quelle est la différence entre FB01 et FB50 ?',
    module: 'FI',
    difficulty: 'Débutant'
  },
  {
    id: 'pmt_003',
    category: 'Débutant',
    question: 'Comment consulter le solde d\'un client avec FBL3N ?',
    module: 'FI',
    difficulty: 'Débutant'
  },
  {
    id: 'pmt_004',
    category: 'Débutant',
    question: 'Étapes pour créer une fiche article avec MM01',
    module: 'MM',
    difficulty: 'Débutant'
  },
  {
    id: 'pmt_005',
    category: 'Débutant',
    question: 'Comment enregistrer une réception de marchandises avec MIGO ?',
    module: 'MM',
    difficulty: 'Débutant'
  },
  {
    id: 'pmt_006',
    category: 'Débutant',
    question: 'Comment créer une commande client avec VA01 ?',
    module: 'SD',
    difficulty: 'Débutant'
  },
  {
    id: 'pmt_007',
    category: 'Débutant',
    question: 'Qu\'est-ce que le tiers et pourquoi est-ce important en SAP ?',
    module: 'FI',
    difficulty: 'Débutant'
  },
  {
    id: 'pmt_008',
    category: 'Intermédiaire',
    question: 'Comment utiliser l\'allocation de coûts (KP06) pour répartir les frais généraux ?',
    module: 'CO',
    difficulty: 'Intermédiaire'
  },
  {
    id: 'pmt_009',
    category: 'Intermédiaire',
    question: 'Quelle est la procédure pour effectuer un paiement fournisseur avec F-02 ?',
    module: 'FI',
    difficulty: 'Intermédiaire'
  },
  {
    id: 'pmt_010',
    category: 'Intermédiaire',
    question: 'Comment créer et confirmer un ordre de fabrication (CO01 et CO11N) ?',
    module: 'PP',
    difficulty: 'Intermédiaire'
  },
  {
    id: 'pmt_011',
    category: 'Intermédiaire',
    question: 'Expliquez le processus de commande d\'achat d\'un fournisseur (ME21N) ',
    module: 'MM',
    difficulty: 'Intermédiaire'
  },
  {
    id: 'pmt_012',
    category: 'Intermédiaire',
    question: 'Comment gérer les conditions de prix pour les clients (VK11) ?',
    module: 'SD',
    difficulty: 'Intermédiaire'
  },
  {
    id: 'pmt_013',
    category: 'Intermédiaire',
    question: 'Quelle est la différence entre un centre de coûts et un centre de profit ?',
    module: 'CO',
    difficulty: 'Intermédiaire'
  },
  {
    id: 'pmt_014',
    category: 'Intermédiaire',
    question: 'Comment enregistrer une facture fournisseur avec MIRO ?',
    module: 'MM',
    difficulty: 'Intermédiaire'
  },
  {
    id: 'pmt_015',
    category: 'Avancé',
    question: 'Comment configurer et exécuter une planification MRP complète ?',
    module: 'PP',
    difficulty: 'Avancé'
  },
  {
    id: 'pmt_016',
    category: 'Avancé',
    question: 'Expliquez le processus de clôture comptable mensuelle en détail',
    module: 'FI',
    difficulty: 'Avancé'
  },
  {
    id: 'pmt_017',
    category: 'Avancé',
    question: 'Comment analyser les écarts de coûts entre réel et standard ?',
    module: 'CO',
    difficulty: 'Avancé'
  },
  {
    id: 'pmt_018',
    category: 'Avancé',
    question: 'Comment créer et gérer les workflows SAP avec le Transport Management (STMS) ?',
    module: 'BASIS',
    difficulty: 'Avancé'
  },
  {
    id: 'pmt_019',
    category: 'Pratique',
    question: 'Scénario: Un client commande 100 unités. Montrez-moi la chaîne complète VA01 -> VL01N -> VF01',
    module: 'SD',
    difficulty: 'Intermédiaire'
  },
  {
    id: 'pmt_020',
    category: 'Pratique',
    question: 'Scénario: Créez une nomenclature, un ordre de fabrication et confirmez la production',
    module: 'PP',
    difficulty: 'Avancé'
  },
  {
    id: 'pmt_021',
    category: 'Pratique',
    question: 'Comment créer un rapport d\'écarts de coûts avec K-ALR-87013611 ?',
    module: 'CO',
    difficulty: 'Avancé'
  },
  {
    id: 'pmt_022',
    category: 'Débutant',
    question: 'Qu\'est-ce qu\'un mandant et pourquoi les multinationales en ont plusieurs ?',
    module: 'FI',
    difficulty: 'Débutant'
  },
  {
    id: 'pmt_023',
    category: 'Débutant',
    question: 'Comment afficher le stock disponible avec MB52 ?',
    module: 'MM',
    difficulty: 'Débutant'
  },
  {
    id: 'pmt_024',
    category: 'Intermédiaire',
    question: 'Quels sont les mécanismes de contrôle de la comptabilité générale dans FI-GL ?',
    module: 'FI',
    difficulty: 'Intermédiaire'
  },
  {
    id: 'pmt_025',
    category: 'Avancé',
    question: 'Comment intégrer les données ABAP dans les rapports SAP avec SE38 et SE80 ?',
    module: 'ABAP',
    difficulty: 'Avancé'
  }
];

// ============================================================================
// EXPORT PAR DÉFAUT
// ============================================================================

export default {
  SAP_MODULES,
  SAP_TRANSACTIONS,
  SAP_GLOSSARY,
  AI_TUTOR_PROMPTS
};
