import { formations, courseModules, courseLessons } from "../shared/schema";
import {
  quizzes,
  quizQuestions,
  quizAnswers,
  badges,
} from "../shared/models/elearning";

export async function seedElearning(db: any) {
  console.log("Seeding e-learning platform...");

  // Insert badges first
  const badgesData = [
    {
      id: "premier-pas",
      name: "Premier Pas",
      description: "Première inscription à une formation",
      icon: "🚀",
      trigger_type: "first_enrollment",
      trigger_value: 1,
      points: 10,
    },
    {
      id: "quiz-parfait",
      name: "Quiz Parfait",
      description: "Réussi un quiz avec 100%",
      icon: "🎯",
      trigger_type: "quiz_perfect",
      trigger_value: 100,
      points: 25,
    },
    {
      id: "semaine-feu",
      name: "Semaine de Feu",
      description: "7 jours d'apprentissage consécutifs",
      icon: "🔥",
      trigger_type: "streak",
      trigger_value: 7,
      points: 50,
    },
    {
      id: "expert-module",
      name: "Expert Module",
      description: "Complété 5 modules",
      icon: "⭐",
      trigger_type: "modules_count",
      trigger_value: 5,
      points: 40,
    },
    {
      id: "diplome-sap",
      name: "Diplômé SAP",
      description: "Formation complétée avec certification",
      icon: "🏆",
      trigger_type: "course_complete",
      trigger_value: 1,
      points: 100,
    },
  ];

  const insertedBadges = await db.insert(badges).values(badgesData);
  console.log("Badges inserted:", insertedBadges);

  // Course 1: SAP FI/CO
  const corso1 = await db.insert(formations).values({
    title: "SAP FI/CO - Finance & Controlling",
    description:
      "Maîtrisez les modules Financier et Contrôle de gestion de SAP. Cette formation intermédiaire couvre la comptabilité générale, la comptabilité clients et fournisseurs, et le controlling avec les centres de coûts. Idéale pour les contrôleurs de gestion et analystes financiers.",
    category: "Finance & Comptabilité",
    level: "Intermédiaire",
    format: "Hybride",
    duration: 40,
    price: 850000, // 8500€ in cents
    badge: "diplome-sap",
    objectives: [
      "Configurer et exploiter le module FI (Finance) dans SAP",
      "Maîtriser la comptabilité générale, clients et fournisseurs",
      "Implémenter et gérer les centres de coûts en CO",
      "Générer des états financiers et analyses",
      "Assurer la conformité comptable et audit trail",
    ],
    modules: [
      "Introduction à SAP FI",
      "Comptabilité Générale (GL)",
      "Comptabilité Clients (AR)",
      "Comptabilité Fournisseurs (AP)",
      "Controlling - Centres de coûts",
    ],
    prerequisites: "Connaissance de SAP fondamentale, expérience comptable",
    certification: true,
    instructor: "Pierre Dubois",
    image_url:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500&h=300&fit=crop",
  });

  const formationId1 = corso1[0];

  // Modules for FI/CO
  const ficoModules = await db.insert(courseModules).values([
    {
      formation_id: formationId1,
      title: "Introduction à SAP FI",
      description:
        "Découvrez l'architecture du module FI, les concepts clés et la navigation dans le système SAP Finance. Prise en main des transactions principales.",
      duration: 6,
      order: 1,
      is_free: true,
    },
    {
      formation_id: formationId1,
      title: "Comptabilité Générale (GL)",
      description:
        "Maîtrisez la comptabilité générale SAP: comptes, écritures, clôture et balances de vérification. Configuration des journaux et gestion des soldes.",
      duration: 10,
      order: 2,
      is_free: false,
    },
    {
      formation_id: formationId1,
      title: "Comptabilité Clients (AR)",
      description:
        "Gestion complète de la comptabilité clients: factures, relances, lettrage des comptes clients et gestion des créances. Traitement des avoirs.",
      duration: 8,
      order: 3,
      is_free: false,
    },
    {
      formation_id: formationId1,
      title: "Comptabilité Fournisseurs (AP)",
      description:
        "Maîtrisez la comptabilité fournisseurs: factures reçues, paiements, relances et gestion des dettes. Optimisation des délais de paiement.",
      duration: 8,
      order: 4,
      is_free: false,
    },
    {
      formation_id: formationId1,
      title: "Controlling - Centres de coûts",
      description:
        "Configuration et gestion des centres de coûts, imputations comptables et analyses de performance. Rapports de controlling et drill-down.",
      duration: 8,
      order: 5,
      is_free: false,
    },
  ]);

  // Lessons for FI/CO modules
  const ficoLessons = [
    // Module 1 lessons
    {
      module_id: ficoModules[0],
      title: "Structure et organisation de FI",
      duration: 15,
      order: 1,
    },
    {
      module_id: ficoModules[0],
      title: "Navigation et transactions principales",
      duration: 20,
      order: 2,
    },
    {
      module_id: ficoModules[0],
      title: "Quiz - Concepts fondamentaux",
      duration: 10,
      order: 3,
    },
    // Module 2 lessons
    {
      module_id: ficoModules[1],
      title: "Configuration du grand livre",
      duration: 25,
      order: 1,
    },
    {
      module_id: ficoModules[1],
      title: "Création et comptabilisation d'écritures",
      duration: 30,
      order: 2,
    },
    {
      module_id: ficoModules[1],
      title: "Clôture comptable et balances",
      duration: 20,
      order: 3,
    },
    // Module 3 lessons
    {
      module_id: ficoModules[2],
      title: "Paramétrage des factures clients",
      duration: 20,
      order: 1,
    },
    {
      module_id: ficoModules[2],
      title: "Relances et lettrage des comptes",
      duration: 25,
      order: 2,
    },
    {
      module_id: ficoModules[2],
      title: "Gestion des créances douteuses",
      duration: 15,
      order: 3,
    },
    // Module 4 lessons
    {
      module_id: ficoModules[3],
      title: "Factures fournisseurs et paiements",
      duration: 25,
      order: 1,
    },
    {
      module_id: ficoModules[3],
      title: "Lettrage et rapprochement",
      duration: 20,
      order: 2,
    },
    {
      module_id: ficoModules[3],
      title: "Stratégies de paiement",
      duration: 15,
      order: 3,
    },
    // Module 5 lessons
    {
      module_id: ficoModules[4],
      title: "Hiérarchie et codification des centres",
      duration: 20,
      order: 1,
    },
    {
      module_id: ficoModules[4],
      title: "Imputations analytiques et analyses",
      duration: 25,
      order: 2,
    },
    {
      module_id: ficoModules[4],
      title: "Rapports et KPIs de controlling",
      duration: 15,
      order: 3,
    },
  ];

  await db.insert(courseLessons).values(ficoLessons);

  // Quiz for FI/CO
  const ficoQuiz = await db.insert(quizzes).values({
    formation_id: formationId1,
    title: "Quiz Certification - SAP FI/CO",
    description: "Évaluation finale couvrant tous les modules de la formation",
    total_questions: 5,
    passing_score: 70,
    duration_minutes: 60,
  });

  const ficoQuizId = ficoQuiz[0];

  // Questions and answers for FI/CO Quiz
  await db.insert(quizQuestions).values([
    {
      quiz_id: ficoQuizId,
      question_text:
        "Quel est le rôle principal du module FI (Finance) dans SAP?",
      question_type: "multiple_choice",
      order: 1,
    },
    {
      quiz_id: ficoQuizId,
      question_text:
        "Comment lettrez-vous une facture client dans le module AR?",
      question_type: "multiple_choice",
      order: 2,
    },
    {
      quiz_id: ficoQuizId,
      question_text:
        "Quel code transaction utilisez-vous pour créer un centre de coûts?",
      question_type: "multiple_choice",
      order: 3,
    },
    {
      quiz_id: ficoQuizId,
      question_text:
        "Quelle est la différence entre la comptabilité générale et la comptabilité analytique?",
      question_type: "multiple_choice",
      order: 4,
    },
    {
      quiz_id: ficoQuizId,
      question_text: "Comment gérez-vous les avoirs clients dans le module AR?",
      question_type: "multiple_choice",
      order: 5,
    },
  ]);

  // Get the inserted question IDs and add answers
  const ficoQuestions = await db
    .select()
    .from(quizQuestions)
    .where({ quiz_id: ficoQuizId });

  for (let i = 0; i < ficoQuestions.length; i++) {
    const q = ficoQuestions[i];
    let answers: any[] = [];

    switch (i) {
      case 0:
        answers = [
          {
            quiz_question_id: q.id,
            answer_text:
              "Gérer la comptabilité financière et les états financiers",
            is_correct: true,
            order: 1,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Gérer les stocks et les achats",
            is_correct: false,
            order: 2,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Gérer les ventes et la distribution",
            is_correct: false,
            order: 3,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Gérer les ressources humaines",
            is_correct: false,
            order: 4,
          },
        ];
        break;
      case 1:
        answers = [
          {
            quiz_question_id: q.id,
            answer_text: "Via le rapport de riscontrés de vente (F150)",
            is_correct: true,
            order: 1,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Via le bon de livraison (transaction LT03)",
            is_correct: false,
            order: 2,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Via le bon de commande (transaction ME21N)",
            is_correct: false,
            order: 3,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Via le module MM uniquement",
            is_correct: false,
            order: 4,
          },
        ];
        break;
      case 2:
        answers = [
          {
            quiz_question_id: q.id,
            answer_text: "KS01",
            is_correct: true,
            order: 1,
          },
          {
            quiz_question_id: q.id,
            answer_text: "FK01",
            is_correct: false,
            order: 2,
          },
          {
            quiz_question_id: q.id,
            answer_text: "FI01",
            is_correct: false,
            order: 3,
          },
          {
            quiz_question_id: q.id,
            answer_text: "CO01",
            is_correct: false,
            order: 4,
          },
        ];
        break;
      case 3:
        answers = [
          {
            quiz_question_id: q.id,
            answer_text:
              "La comptabilité générale enregistre tous les faits, la comptabilité analytique les analyse par centre de coût",
            is_correct: true,
            order: 1,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Elles sont identiques dans SAP",
            is_correct: false,
            order: 2,
          },
          {
            quiz_question_id: q.id,
            answer_text:
              "La comptabilité analytique est obligatoire, la générale optionnelle",
            is_correct: false,
            order: 3,
          },
          {
            quiz_question_id: q.id,
            answer_text:
              "La comptabilité générale est pour les fournisseurs uniquement",
            is_correct: false,
            order: 4,
          },
        ];
        break;
      case 4:
        answers = [
          {
            quiz_question_id: q.id,
            answer_text:
              "Via la note de crédit (Storno) ou la transaction RE201",
            is_correct: true,
            order: 1,
          },
          {
            quiz_question_id: q.id,
            answer_text: "En supprimant simplement la facture",
            is_correct: false,
            order: 2,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Via la transaction DM01",
            is_correct: false,
            order: 3,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Impossible dans le module AR",
            is_correct: false,
            order: 4,
          },
        ];
        break;
    }

    await db.insert(quizAnswers).values(answers);
  }

  // Course 2: SAP MM
  const corso2 = await db.insert(formations).values({
    title: "SAP MM - Gestion des Achats et Stocks",
    description:
      "Formation complète sur la gestion des matières et des achats dans SAP. Couvrez la création de matières, la gestion des stocks, les commandes d'achat, et l'optimisation des approvisionnements. Essentielle pour les responsables achats et logistique.",
    category: "Supply Chain & Logistique",
    level: "Débutant",
    format: "Hybride",
    duration: 35,
    price: 650000, // 6500€ in cents
    badge: "diplome-sap",
    objectives: [
      "Créer et maintenir les données de base des matières",
      "Gérer les stocks et les mouvements de matières",
      "Créer et traiter les commandes d'achat",
      "Optimiser les niveaux de stock et de réapprovisionnement",
      "Effectuer les opérations de réception et de facturation",
    ],
    modules: [
      "Fondamentaux de SAP MM",
      "Données de base et nomenclatures",
      "Gestion des stocks",
      "Commandes d'achat",
      "Réception et facturation",
    ],
    prerequisites:
      "Aucune expérience SAP requise, connaissance de base en logistique",
    certification: true,
    instructor: "Marie Laurent",
    image_url:
      "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=500&h=300&fit=crop",
  });

  const formationId2 = corso2[0];

  // Modules for MM
  const mmModules = await db.insert(courseModules).values([
    {
      formation_id: formationId2,
      title: "Fondamentaux de SAP MM",
      description:
        "Introduction aux concepts clés du module Materials Management: architecture, organisation et navigation.",
      duration: 6,
      order: 1,
      is_free: true,
    },
    {
      formation_id: formationId2,
      title: "Données de base et nomenclatures",
      description:
        "Création et gestion des matières, des nomenclatures produits et des centres de distribution.",
      duration: 7,
      order: 2,
      is_free: false,
    },
    {
      formation_id: formationId2,
      title: "Gestion des stocks",
      description:
        "Mouvements de stock, valorisation, inventaires et gestion des variances de stock.",
      duration: 8,
      order: 3,
      is_free: false,
    },
    {
      formation_id: formationId2,
      title: "Commandes d'achat",
      description:
        "Création des commandes d'achat, gestion des fournisseurs et traçabilité des achats.",
      duration: 8,
      order: 4,
      is_free: false,
    },
    {
      formation_id: formationId2,
      title: "Réception et facturation",
      description:
        "Réception des marchandises, contrôle de conformité et rapprochement des factures.",
      duration: 6,
      order: 5,
      is_free: false,
    },
  ]);

  // Lessons for MM modules
  const mmLessons = [
    { module_id: mmModules[0], title: "Vue d'ensemble du module MM", duration: 15, order: 1 },
    { module_id: mmModules[0], title: "Navigation et transactions", duration: 20, order: 2 },
    { module_id: mmModules[0], title: "Quiz - Concepts fondamentaux", duration: 10, order: 3 },
    { module_id: mmModules[1], title: "Création et maintenance de matières", duration: 20, order: 1 },
    { module_id: mmModules[1], title: "Nomenclatures produits", duration: 20, order: 2 },
    { module_id: mmModules[1], title: "Centres de distribution", duration: 15, order: 3 },
    { module_id: mmModules[2], title: "Types de mouvements de stock", duration: 20, order: 1 },
    { module_id: mmModules[2], title: "Valorisation des stocks", duration: 25, order: 2 },
    { module_id: mmModules[2], title: "Contrôle d'inventaire", duration: 20, order: 3 },
    { module_id: mmModules[3], title: "Processus d'achat intégré", duration: 25, order: 1 },
    { module_id: mmModules[3], title: "Création et suivi des commandes", duration: 20, order: 2 },
    { module_id: mmModules[3], title: "Gestion des fournisseurs", duration: 15, order: 3 },
    { module_id: mmModules[4], title: "Réception des biens", duration: 15, order: 1 },
    { module_id: mmModules[4], title: "Contrôle de qualité", duration: 15, order: 2 },
    { module_id: mmModules[4], title: "Rapprochement facture-commande", duration: 15, order: 3 },
  ];

  await db.insert(courseLessons).values(mmLessons);

  // Quiz for MM
  const mmQuiz = await db.insert(quizzes).values({
    formation_id: formationId2,
    title: "Quiz Certification - SAP MM",
    description: "Évaluation finale couvrant tous les modules de la formation",
    total_questions: 5,
    passing_score: 70,
    duration_minutes: 45,
  });

  const mmQuizId = mmQuiz[0];

  await db.insert(quizQuestions).values([
    {
      quiz_id: mmQuizId,
      question_text: "Quel type de document utilisez-vous pour commander des matières?",
      question_type: "multiple_choice",
      order: 1,
    },
    {
      quiz_id: mmQuizId,
      question_text: "Qu'est-ce qu'une nomenclature (BOM) dans SAP MM?",
      question_type: "multiple_choice",
      order: 2,
    },
    {
      quiz_id: mmQuizId,
      question_text: "Comment enregistrez-vous une réception de marchandises?",
      question_type: "multiple_choice",
      order: 3,
    },
    {
      quiz_id: mmQuizId,
      question_text:
        "Quel est le code transaction pour créer une matière dans le module MM?",
      question_type: "multiple_choice",
      order: 4,
    },
    {
      quiz_id: mmQuizId,
      question_text: "Comment gérez-vous les stocks faibles (minimum stock)?",
      question_type: "multiple_choice",
      order: 5,
    },
  ]);

  const mmQuestions = await db
    .select()
    .from(quizQuestions)
    .where({ quiz_id: mmQuizId });

  for (let i = 0; i < mmQuestions.length; i++) {
    const q = mmQuestions[i];
    let answers: any[] = [];

    switch (i) {
      case 0:
        answers = [
          {
            quiz_question_id: q.id,
            answer_text: "Bon de commande (Purchase Order - PO)",
            is_correct: true,
            order: 1,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Bon de livraison",
            is_correct: false,
            order: 2,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Facture",
            is_correct: false,
            order: 3,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Demande de devis",
            is_correct: false,
            order: 4,
          },
        ];
        break;
      case 1:
        answers = [
          {
            quiz_question_id: q.id,
            answer_text:
              "Liste des matières et composants nécessaires pour fabriquer un produit fini",
            is_correct: true,
            order: 1,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Un centre de distribution",
            is_correct: false,
            order: 2,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Un type de bon de commande",
            is_correct: false,
            order: 3,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Un fournisseur",
            is_correct: false,
            order: 4,
          },
        ];
        break;
      case 2:
        answers = [
          {
            quiz_question_id: q.id,
            answer_text: "Via la transaction MIGO (Goods Receipt)",
            is_correct: true,
            order: 1,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Via la transaction MMBE",
            is_correct: false,
            order: 2,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Via la transaction ME21N",
            is_correct: false,
            order: 3,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Via la transaction FB50",
            is_correct: false,
            order: 4,
          },
        ];
        break;
      case 3:
        answers = [
          {
            quiz_question_id: q.id,
            answer_text: "MM01",
            is_correct: true,
            order: 1,
          },
          {
            quiz_question_id: q.id,
            answer_text: "ME01",
            is_correct: false,
            order: 2,
          },
          {
            quiz_question_id: q.id,
            answer_text: "FI01",
            is_correct: false,
            order: 3,
          },
          {
            quiz_question_id: q.id,
            answer_text: "SD01",
            is_correct: false,
            order: 4,
          },
        ];
        break;
      case 4:
        answers = [
          {
            quiz_question_id: q.id,
            answer_text:
              "Par la configuration de niveaux minimum et maximum de stock avec reorder points",
            is_correct: true,
            order: 1,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Manuellement chaque jour",
            is_correct: false,
            order: 2,
          },
          {
            quiz_question_id: q.id,
            answer_text: "C'est géré automatiquement par le module SD",
            is_correct: false,
            order: 3,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Ce n'est pas possible dans SAP",
            is_correct: false,
            order: 4,
          },
        ];
        break;
    }

    await db.insert(quizAnswers).values(answers);
  }

  // Course 3: SAP SD
  const corso3 = await db.insert(formations).values({
    title: "SAP SD - Ventes et Distribution",
    description:
      "Maîtrisez le processus complet de ventes et distribution dans SAP. Gestion des clients, création des devis, traitement des commandes, expédition et facturation. Optimisez votre cycle de vente de bout en bout.",
    category: "Ventes & Distribution",
    level: "Intermédiaire",
    format: "Hybride",
    duration: 38,
    price: 750000, // 7500€ in cents
    badge: "diplome-sap",
    objectives: [
      "Créer et gérer les données maîtres clients",
      "Traiter les devis et les commandes client",
      "Gérer la préparation et l'expédition des marchandises",
      "Facturer et gérer les retours clients",
      "Analyser la performance des ventes",
    ],
    modules: [
      "Introduction à SAP SD",
      "Données maîtres clients",
      "Commandes de vente",
      "Expédition et logistique",
      "Facturation et retours",
    ],
    prerequisites:
      "Connaissance de SAP fondamentale, expérience en ventes recommandée",
    certification: true,
    instructor: "Jean Moreau",
    image_url:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
  });

  const formationId3 = corso3[0];

  // Modules for SD
  const sdModules = await db.insert(courseModules).values([
    {
      formation_id: formationId3,
      title: "Introduction à SAP SD",
      description:
        "Vue d'ensemble du module Ventes et Distribution: architecture, flux et concepts clés.",
      duration: 6,
      order: 1,
      is_free: true,
    },
    {
      formation_id: formationId3,
      title: "Données maîtres clients",
      description:
        "Création et maintenance des clients, conditions commerciales et programmes de tarification.",
      duration: 8,
      order: 2,
      is_free: false,
    },
    {
      formation_id: formationId3,
      title: "Commandes de vente",
      description:
        "Processus de commande complet: devis, commandes client et gestion des modifications.",
      duration: 10,
      order: 3,
      is_free: false,
    },
    {
      formation_id: formationId3,
      title: "Expédition et logistique",
      description:
        "Préparation, emballage et expédition des commandes. Suivi du transport et documents d'expédition.",
      duration: 8,
      order: 4,
      is_free: false,
    },
    {
      formation_id: formationId3,
      title: "Facturation et retours",
      description:
        "Création des factures, avoirs clients et gestion des retours de marchandises.",
      duration: 6,
      order: 5,
      is_free: false,
    },
  ]);

  // Lessons for SD modules
  const sdLessons = [
    { module_id: sdModules[0], title: "Architecture du module SD", duration: 15, order: 1 },
    { module_id: sdModules[0], title: "Flux de processus SD", duration: 20, order: 2 },
    { module_id: sdModules[0], title: "Navigation et transactions", duration: 10, order: 3 },
    { module_id: sdModules[1], title: "Création de clients master", duration: 20, order: 1 },
    { module_id: sdModules[1], title: "Conditions commerciales", duration: 20, order: 2 },
    { module_id: sdModules[1], title: "Stratégies de tarification", duration: 15, order: 3 },
    { module_id: sdModules[2], title: "Devis et demandes", duration: 20, order: 1 },
    { module_id: sdModules[2], title: "Commandes client - Création et suivi", duration: 30, order: 2 },
    { module_id: sdModules[2], title: "Gestion des modifications", duration: 15, order: 3 },
    { module_id: sdModules[3], title: "Préparation des marchandises", duration: 20, order: 1 },
    { module_id: sdModules[3], title: "Documents d'expédition", duration: 20, order: 2 },
    { module_id: sdModules[3], title: "Suivi du transport", duration: 15, order: 3 },
    { module_id: sdModules[4], title: "Création des factures", duration: 15, order: 1 },
    { module_id: sdModules[4], title: "Avoirs et retours", duration: 20, order: 2 },
    { module_id: sdModules[4], title: "Rapports de ventes", duration: 10, order: 3 },
  ];

  await db.insert(courseLessons).values(sdLessons);

  // Quiz for SD
  const sdQuiz = await db.insert(quizzes).values({
    formation_id: formationId3,
    title: "Quiz Certification - SAP SD",
    description: "Évaluation finale couvrant tous les modules de la formation",
    total_questions: 5,
    passing_score: 70,
    duration_minutes: 50,
  });

  const sdQuizId = sdQuiz[0];

  await db.insert(quizQuestions).values([
    {
      quiz_id: sdQuizId,
      question_text: "Quel document lancez-vous pour une demande de prix client?",
      question_type: "multiple_choice",
      order: 1,
    },
    {
      quiz_id: sdQuizId,
      question_text: "Qu'est-ce qu'une condition commerciale dans SAP SD?",
      question_type: "multiple_choice",
      order: 2,
    },
    {
      quiz_id: sdQuizId,
      question_text:
        "Quel code transaction utilisez-vous pour créer une commande de vente?",
      question_type: "multiple_choice",
      order: 3,
    },
    {
      quiz_id: sdQuizId,
      question_text:
        "Comment traitez-vous un retour de marchandise du client dans SAP SD?",
      question_type: "multiple_choice",
      order: 4,
    },
    {
      quiz_id: sdQuizId,
      question_text: "Quel est le flux complet d'une commande de vente?",
      question_type: "multiple_choice",
      order: 5,
    },
  ]);

  const sdQuestions = await db
    .select()
    .from(quizQuestions)
    .where({ quiz_id: sdQuizId });

  for (let i = 0; i < sdQuestions.length; i++) {
    const q = sdQuestions[i];
    let answers: any[] = [];

    switch (i) {
      case 0:
        answers = [
          {
            quiz_question_id: q.id,
            answer_text: "Demande de devis (Quotation - RFQ)",
            is_correct: true,
            order: 1,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Commande d'achat",
            is_correct: false,
            order: 2,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Bon de livraison",
            is_correct: false,
            order: 3,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Facture",
            is_correct: false,
            order: 4,
          },
        ];
        break;
      case 1:
        answers = [
          {
            quiz_question_id: q.id,
            answer_text:
              "Une règle de calcul des prix, remises, taxes et frais de port",
            is_correct: true,
            order: 1,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Une condition de paiement",
            is_correct: false,
            order: 2,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Une entente client",
            is_correct: false,
            order: 3,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Une période de livraison",
            is_correct: false,
            order: 4,
          },
        ];
        break;
      case 2:
        answers = [
          {
            quiz_question_id: q.id,
            answer_text: "VA01",
            is_correct: true,
            order: 1,
          },
          {
            quiz_question_id: q.id,
            answer_text: "VA02",
            is_correct: false,
            order: 2,
          },
          {
            quiz_question_id: q.id,
            answer_text: "MM01",
            is_correct: false,
            order: 3,
          },
          {
            quiz_question_id: q.id,
            answer_text: "FB01",
            is_correct: false,
            order: 4,
          },
        ];
        break;
      case 3:
        answers = [
          {
            quiz_question_id: q.id,
            answer_text:
              "Via un retour de vente (transaction VA01 avec type retour)",
            is_correct: true,
            order: 1,
          },
          {
            quiz_question_id: q.id,
            answer_text: "En supprimant la commande originale",
            is_correct: false,
            order: 2,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Via le module MM uniquement",
            is_correct: false,
            order: 3,
          },
          {
            quiz_question_id: q.id,
            answer_text: "C'est géré automatiquement",
            is_correct: false,
            order: 4,
          },
        ];
        break;
      case 4:
        answers = [
          {
            quiz_question_id: q.id,
            answer_text:
              "Commande → Préparation → Expédition → Facturation → Retour si nécessaire",
            is_correct: true,
            order: 1,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Commande → Facturation → Expédition",
            is_correct: false,
            order: 2,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Commande → Retour → Expédition → Facturation",
            is_correct: false,
            order: 3,
          },
          {
            quiz_question_id: q.id,
            answer_text: "Expédition → Commande → Facturation",
            is_correct: false,
            order: 4,
          },
        ];
        break;
    }

    await db.insert(quizAnswers).values(answers);
  }

  console.log("E-learning platform seeded successfully!");
  console.log(`- 3 formations created (IDs: ${formationId1}, ${formationId2}, ${formationId3})`);
  console.log("- 15 course modules created");
  console.log("- 45 lessons created");
  console.log("- 3 quizzes with 15 questions created");
  console.log("- 5 badges created");

  return {
    formations: [formationId1, formationId2, formationId3],
    badges: badgesData,
  };
}
