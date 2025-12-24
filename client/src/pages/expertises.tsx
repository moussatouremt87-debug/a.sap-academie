import { useState } from "react";
import { Link } from "wouter";
import {
  Lightbulb, Building, Monitor, GraduationCap, Briefcase,
  TrendingUp, Search, Users, FileText, Shield, Server, Database,
  Settings, Wrench, BookOpen, UserCheck, Handshake, MapPin, ShoppingCart,
  Sparkles, ArrowRight, CheckCircle2, MessageCircle, Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/lib/i18n";
import transformationImage from "@assets/Gemini_Generated_Image_e2646ke2646ke264_(1)_1766483159475.png";

interface Service {
  name: string;
  icon: any;
  description: string;
  benefits: string[];
  deliverables: string[];
}

interface ExpertiseCategory {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  services: Service[];
}

const getCategoryData = (t: (key: string) => string): ExpertiseCategory[] => [
  {
    id: "conseil",
    title: t("expertises.cat.conseil"),
    description: t("expertises.cat.conseil.desc"),
    icon: Lightbulb,
    color: "bg-primary/10 text-primary",
    services: [
      { 
        name: "Conseil stratégique", 
        icon: TrendingUp,
        description: "Accompagnement dans la définition et la mise en oeuvre de votre stratégie d'entreprise. Nous analysons votre environnement, identifions les opportunités et élaborons des plans d'action concrets.",
        benefits: ["Vision claire de votre positionnement", "Feuille de route actionnable", "Alignement des équipes"],
        deliverables: ["Diagnostic stratégique", "Plan stratégique 3-5 ans", "KPIs et tableaux de bord"]
      },
      { 
        name: "Étude & veille stratégique", 
        icon: Search,
        description: "Surveillance continue de votre environnement concurrentiel et technologique. Identification des tendances et opportunités pour anticiper les évolutions du marché.",
        benefits: ["Anticipation des tendances", "Avantage concurrentiel", "Décisions éclairées"],
        deliverables: ["Rapports de veille mensuels", "Analyses sectorielles", "Alertes personnalisées"]
      },
      { 
        name: "Pilotage transformation", 
        icon: Users,
        description: "Gouvernance et suivi de vos programmes de transformation. Coordination des parties prenantes et gestion des risques pour garantir l'atteinte des objectifs.",
        benefits: ["Maîtrise des délais et budgets", "Gestion proactive des risques", "Visibilité en temps réel"],
        deliverables: ["PMO dédié", "Reporting projet", "Comités de pilotage"]
      },
      { 
        name: "Politiques publiques", 
        icon: FileText,
        description: "Accompagnement des institutions publiques dans la conception et mise en oeuvre de leurs politiques. Expertise en transformation du secteur public.",
        benefits: ["Conformité réglementaire", "Optimisation des ressources", "Impact mesurable"],
        deliverables: ["Études d'impact", "Plans de mise en oeuvre", "Évaluation des politiques"]
      },
      { 
        name: "Conduite du changement", 
        icon: Users,
        description: "Accompagnement humain des transformations. Formation, communication et engagement des équipes pour assurer l'adoption des nouveaux processus.",
        benefits: ["Adhésion des équipes", "Réduction des résistances", "Adoption accélérée"],
        deliverables: ["Plan de change management", "Formations", "Communication interne"]
      },
      { 
        name: "Gestion de projet", 
        icon: Briefcase,
        description: "Pilotage opérationnel de vos projets avec des méthodologies éprouvées (Agile, Prince2, PMI). Garantie de livraison dans les délais et budgets.",
        benefits: ["Respect des engagements", "Qualité des livrables", "Maîtrise des coûts"],
        deliverables: ["Planning projet", "Suivi d'avancement", "Documentation projet"]
      },
    ],
  },
  {
    id: "transformation-si",
    title: t("expertises.cat.transformation-si"),
    description: t("expertises.cat.transformation-si.desc"),
    icon: Monitor,
    color: "bg-gold/20 text-gold-foreground dark:text-gold",
    services: [
      { 
        name: "Schéma Directeur SI", 
        icon: FileText,
        description: "Élaboration de votre feuille de route technologique sur 3-5 ans. Alignement du SI avec la stratégie métier et priorisation des investissements.",
        benefits: ["Vision SI claire", "ROI optimisé", "Évolutivité garantie"],
        deliverables: ["SDSI complet", "Trajectoire de transformation", "Budget pluriannuel"]
      },
      { 
        name: "Urbanisation SI", 
        icon: Building,
        description: "Rationalisation et optimisation de votre architecture applicative. Réduction de la dette technique et amélioration de l'agilité du SI.",
        benefits: ["SI cohérent et agile", "Coûts optimisés", "Interopérabilité"],
        deliverables: ["Cartographie applicative", "Plan d'urbanisation", "Règles d'architecture"]
      },
      { 
        name: "AMOA / AMOE", 
        icon: Users,
        description: "Assistance à maîtrise d'ouvrage et d'oeuvre pour vos projets SI. Interface entre métiers et IT, cadrage et suivi des réalisations.",
        benefits: ["Besoins bien exprimés", "Qualité des livrables", "Coordination fluide"],
        deliverables: ["Cahier des charges", "Recette fonctionnelle", "Suivi projet"]
      },
      { 
        name: "Transformation digitale", 
        icon: Monitor,
        description: "Accompagnement global dans votre transformation numérique. Digitalisation des processus, nouveaux business models et expérience client.",
        benefits: ["Compétitivité accrue", "Nouveaux revenus", "Efficacité opérationnelle"],
        deliverables: ["Diagnostic digital", "Roadmap transformation", "POC et pilotes"]
      },
      { 
        name: "Dématérialisation", 
        icon: FileText,
        description: "Numérisation de vos documents et processus papier. Mise en place de workflows digitaux et archivage électronique.",
        benefits: ["Gain de temps", "Réduction des coûts", "Traçabilité"],
        deliverables: ["Solution GED", "Workflows dématérialisés", "Archivage légal"]
      },
      { 
        name: "Audit SI", 
        icon: Search,
        description: "Évaluation complète de votre système d'information. Identification des forces, faiblesses et recommandations d'amélioration.",
        benefits: ["Vision objective", "Risques identifiés", "Plan d'action clair"],
        deliverables: ["Rapport d'audit", "Analyse des écarts", "Recommandations priorisées"]
      },
      { 
        name: "Sécurité systèmes et réseaux", 
        icon: Shield,
        description: "Protection de votre SI contre les cybermenaces. Audit de sécurité, mise en conformité et formation des équipes.",
        benefits: ["Protection des données", "Conformité RGPD", "Résilience"],
        deliverables: ["Audit sécurité", "PSSI", "Tests d'intrusion"]
      },
      { 
        name: "Infogérance & TMA", 
        icon: Wrench,
        description: "Prise en charge de l'exploitation et maintenance de votre SI. Support utilisateur et évolutions applicatives.",
        benefits: ["Disponibilité garantie", "Coûts maîtrisés", "Focus métier"],
        deliverables: ["Contrat SLA", "Support N1/N2/N3", "Reporting mensuel"]
      },
      { 
        name: "Hébergement & infrastructures", 
        icon: Server,
        description: "Solutions d'hébergement sécurisées et haute disponibilité. Cloud privé, public ou hybride selon vos besoins.",
        benefits: ["Haute disponibilité", "Scalabilité", "Sécurité renforcée"],
        deliverables: ["Infrastructure cloud", "PRA/PCA", "Supervision 24/7"]
      },
    ],
  },
  {
    id: "sap",
    title: t("expertises.cat.sap"),
    description: t("expertises.cat.sap.desc"),
    icon: Database,
    color: "bg-primary/10 text-primary",
    services: [
      { 
        name: "SAP Consulting", 
        icon: Lightbulb,
        description: "Conseil expert pour optimiser votre investissement SAP. Audit de votre existant, recommandations d'évolution et accompagnement stratégique.",
        benefits: ["ROI maximisé", "Best practices SAP", "Évolutivité"],
        deliverables: ["Audit SAP", "Roadmap évolution", "Business case"]
      },
      { 
        name: "SAP Integration", 
        icon: Settings,
        description: "Implémentation complète de SAP dans votre organisation. Méthodologie SAP Activate, paramétrage et déploiement.",
        benefits: ["Délais maîtrisés", "Qualité garantie", "Adoption réussie"],
        deliverables: ["Blueprint", "Configuration", "Formation utilisateurs"]
      },
      { 
        name: "Vente solutions ERP", 
        icon: ShoppingCart,
        description: "Conseil et vente de licences SAP et solutions ERP partenaires. Accompagnement dans le choix de la solution adaptée.",
        benefits: ["Solution adaptée", "Tarifs compétitifs", "Support continu"],
        deliverables: ["Étude comparative", "Proposition commerciale", "Contrat licence"]
      },
      { 
        name: "Paramétrage & personnalisation", 
        icon: Wrench,
        description: "Adaptation de SAP à vos processus métier spécifiques. Développements ABAP et configuration avancée.",
        benefits: ["SAP sur-mesure", "Processus optimisés", "Productivité accrue"],
        deliverables: ["Spécifications", "Développements", "Documentation"]
      },
      { 
        name: "Maintenance & support", 
        icon: Wrench,
        description: "Support continu de votre environnement SAP. Résolution des incidents, évolutions et optimisation des performances.",
        benefits: ["Continuité de service", "Expertise dédiée", "Évolutions continues"],
        deliverables: ["Contrat support", "Hotline", "Évolutions mineures"]
      },
      { 
        name: "SAP Training entreprises", 
        icon: GraduationCap,
        description: "Formations SAP sur-mesure pour vos équipes. Programmes adaptés à vos modules et processus métier.",
        benefits: ["Équipes autonomes", "Productivité accrue", "Maîtrise de l'outil"],
        deliverables: ["Programme formation", "Sessions pratiques", "Certification"]
      },
    ],
  },
  {
    id: "formation",
    title: t("expertises.cat.formation"),
    description: t("expertises.cat.formation.desc"),
    icon: GraduationCap,
    color: "bg-gold/20 text-gold-foreground dark:text-gold",
    services: [
      { 
        name: "Formation SAP Particuliers", 
        icon: UserCheck,
        description: "Programmes de reconversion professionnelle vers les métiers SAP. Formations certifiantes pour lancer votre carrière dans l'écosystème SAP.",
        benefits: ["Certification officielle", "Employabilité garantie", "Accompagnement carrière"],
        deliverables: ["Formation complète", "Préparation certification", "Aide au placement"]
      },
      { 
        name: "Formation SAP Entreprises", 
        icon: Building,
        description: "Formations SAP sur-mesure pour vos collaborateurs. Montée en compétences de vos équipes sur les modules SAP utilisés.",
        benefits: ["Équipes performantes", "ROI formation", "Sessions flexibles"],
        deliverables: ["Programme adapté", "Formation sur site", "Suivi post-formation"]
      },
      { 
        name: "Coaching & accompagnement", 
        icon: Users,
        description: "Accompagnement individuel pour consultants SAP juniors ou en transition. Mentoring par des experts seniors.",
        benefits: ["Progression rapide", "Expertise senior", "Réseau professionnel"],
        deliverables: ["Sessions de coaching", "Feedback personnalisé", "Plan de développement"]
      },
    ],
  },
  {
    id: "business",
    title: t("expertises.cat.business"),
    description: t("expertises.cat.business.desc"),
    icon: Briefcase,
    color: "bg-primary/10 text-primary",
    services: [
      { 
        name: "Allocation ressources", 
        icon: Users,
        description: "Mise à disposition de consultants experts pour vos projets. Flexibilité et expertise pour renforcer vos équipes.",
        benefits: ["Flexibilité", "Expertise immédiate", "Coûts maîtrisés"],
        deliverables: ["Profils qualifiés", "Contrat régie", "Suivi mission"]
      },
      { 
        name: "Recrutement IT", 
        icon: UserCheck,
        description: "Service de recrutement spécialisé dans les profils IT et SAP. Sourcing, évaluation et accompagnement à l'intégration.",
        benefits: ["Candidats qualifiés", "Gain de temps", "Intégration réussie"],
        deliverables: ["Shortlist candidats", "Évaluation technique", "Onboarding"]
      },
      { 
        name: "Représentation commerciale", 
        icon: Handshake,
        description: "Représentation de votre entreprise sur le marché ouest-africain. Prospection, négociation et développement commercial.",
        benefits: ["Accès au marché", "Réseau local", "Croissance accélérée"],
        deliverables: ["Stratégie commerciale", "Actions de prospection", "Reporting"]
      },
      { 
        name: "Implantation au Sénégal", 
        icon: MapPin,
        description: "Accompagnement complet pour votre implantation au Sénégal. Aspects juridiques, administratifs et opérationnels.",
        benefits: ["Implantation sécurisée", "Connaissance locale", "Démarrage rapide"],
        deliverables: ["Étude de marché", "Création entité", "Support opérationnel"]
      },
      { 
        name: "Mise en relation business", 
        icon: Handshake,
        description: "Facilitation de partenariats et opportunités d'affaires. Accès à notre réseau de décideurs et entreprises.",
        benefits: ["Opportunités business", "Partenariats stratégiques", "Crédibilité locale"],
        deliverables: ["Introductions qualifiées", "Événements networking", "Suivi opportunités"]
      },
      { 
        name: "Achat/vente/location matériel IT", 
        icon: ShoppingCart,
        description: "Fourniture de matériel informatique et équipements IT. Solutions d'achat, location ou leasing selon vos besoins.",
        benefits: ["Tarifs négociés", "Qualité garantie", "Flexibilité financière"],
        deliverables: ["Catalogue produits", "Devis compétitifs", "Support technique"]
      },
    ],
  },
];

export default function Expertises() {
  const { t } = useTranslation();
  const [selectedService, setSelectedService] = useState<{category: ExpertiseCategory, service: Service} | null>(null);
  const expertiseCategories = getCategoryData(t);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary via-primary to-dark-blue py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl" data-testid="text-expertises-title">
            {t("expertises.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/80">
            {t("expertises.subtitle")}
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 md:py-24">
        <img 
          src={transformationImage} 
          alt="Transformation digitale - de l'industrie au numérique" 
          className="absolute inset-0 h-full w-full object-cover blur-[1px] scale-105"
          data-testid="img-transformation"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-dark-blue/90 via-primary/85 to-primary/90" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">{t("expertises.transformation.badge")}</Badge>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              {t("expertises.transformation.title").split(" ").slice(0, 2).join(" ")} <span className="text-gold">{t("expertises.transformation.title").split(" ").slice(2, 3)}</span> {t("expertises.transformation.title").split(" ").slice(3, 4)} <span className="text-gold">{t("expertises.transformation.title").split(" ").slice(4).join(" ")}</span>
            </h2>
            <p className="mb-8 text-white/80 text-lg">
              {t("expertises.transformation.desc")}
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0" />
                <span>{t("expertises.transformation.digitalization")}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0" />
                <span>{t("expertises.transformation.sap")}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0" />
                <span>{t("expertises.transformation.change")}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {expertiseCategories.map((category) => (
              <div key={category.id} className="scroll-mt-20" id={category.id} data-testid={`section-expertise-${category.id}`}>
                <div className="mb-8 flex items-start gap-4">
                  <div className={`rounded-lg p-3 ${category.color}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold md:text-3xl">{category.title}</h2>
                    <p className="mt-2 text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.services.map((service, serviceIndex) => (
                    <Card 
                      key={serviceIndex} 
                      className="group cursor-pointer transition-all hover:shadow-md hover-elevate"
                      onClick={() => setSelectedService({ category, service })}
                      data-testid={`card-service-${category.id}-${serviceIndex}`}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className={`rounded-lg p-2 ${category.color}`}>
                          <service.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">{service.name}</span>
                          <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                            {t("expertises.clickMore")}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-6">
                  <Link href="/agent">
                    <Button variant="outline" data-testid={`button-agent-${category.id}`}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {t("expertises.talkToSales")}
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={selectedService !== null} onOpenChange={() => setSelectedService(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedService && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${selectedService.category.color}`}>
                    <selectedService.service.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedService.service.name}</DialogTitle>
                    <DialogDescription className="text-sm">
                      {selectedService.category.title}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <div className="space-y-6 pt-4">
                <div>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedService.service.description}
                  </p>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    {t("expertises.keyBenefits")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.service.benefits.map((benefit, i) => (
                      <Badge key={i} variant="secondary">{benefit}</Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 font-semibold">{t("expertises.deliverables")}</h4>
                  <ul className="space-y-2">
                    {selectedService.service.deliverables.map((deliverable, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {deliverable}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-3 pt-4 border-t sm:flex-row">
                  <Link href="/agent" className="flex-1">
                    <Button className="w-full bg-gold text-gold-foreground" data-testid="button-dialog-agent">
                      <Sparkles className="mr-2 h-4 w-4" />
                      {t("expertises.discussService")}
                    </Button>
                  </Link>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedService(null)}
                    data-testid="button-dialog-close"
                  >
                    {t("expertises.close")}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <section className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            {t("expertises.cta.title").split(" ").slice(0, -1).join(" ")} <span className="text-gold">{t("expertises.cta.title").split(" ").slice(-1)}</span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            {t("expertises.cta.subtitle")}
          </p>
          <Link href="/agent">
            <Button size="lg" className="bg-gold text-gold-foreground" data-testid="button-cta-expertises">
              <Rocket className="mr-2 h-5 w-5" />
              {t("expertises.cta.button")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
