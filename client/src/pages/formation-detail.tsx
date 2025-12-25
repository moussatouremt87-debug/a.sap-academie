import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Users, GraduationCap, Award, Target, BookOpen, CheckCircle, Calendar, MapPin, Euro } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SEO } from "@/components/seo";
import { useI18n } from "@/lib/i18n";
import type { Formation } from "@shared/schema";

const levelLabels: Record<string, { fr: string; en: string; color: string }> = {
  Debutant: { fr: "Débutant", en: "Beginner", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  Intermediaire: { fr: "Intermédiaire", en: "Intermediate", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  Avance: { fr: "Avancé", en: "Advanced", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
};

const formatLabels: Record<string, { fr: string; en: string; icon: string }> = {
  Online: { fr: "En ligne", en: "Online", icon: "💻" },
  Presentiel: { fr: "Présentiel à Dakar", en: "On-site in Dakar", icon: "🏢" },
  Hybride: { fr: "Hybride", en: "Hybrid", icon: "🔄" },
};

const modulesDetailsFI = [
  { title: "Module 1: Introduction à SAP", content: ["Qu'est-ce que SAP?", "SAP Financial Accounting", "Structure Organisationnelle SAP"] },
  { title: "Module 2: Paramètres globaux FI", content: ["Field Status Variant", "Clés de comptabilisation", "Types de documents et plages de numéros", "Tolérances"] },
  { title: "Module 3: Données de base FI", content: ["Vue d'ensemble", "Blocage de comptes", "Suppression de comptes", "Groupes de comptes clients", "Clients ponctuels"] },
  { title: "Module 4: Contrôle des écritures", content: ["Introduction", "Parking", "Holding", "Comptabilisation avec référence"] },
  { title: "Module 5: Grand Livre (GL)", content: ["Introduction", "Comptes clients (AR)", "Comptes fournisseurs (AP)", "Comptabilité des immobilisations", "Comptabilité bancaire", "Création compte GL", "Affichage des modifications", "Blocage/Suppression compte GL"] },
  { title: "Module 6: Programme de paiement", content: ["Codes société", "Société payante", "Méthode de paiement pays", "Méthode de paiement société", "Détermination bancaire", "Banques maison"] },
  { title: "Module 7: Opérations de clôture", content: ["Vue d'ensemble", "Clôture journalière", "Clôture mensuelle", "Pré-clôture", "Clôture managériale", "Clôture financière", "Clôture annuelle"] },
  { title: "Module 8: Reporting", content: ["Exécution des rapports SAP", "Rapports Grand Livre"] },
  { title: "Module 9: Nouveau Grand Livre", content: ["Introduction", "Avantages", "Codes de transaction pour migration"] },
  { title: "Module 10: Comptabilité de gestion", content: ["Vue d'ensemble", "Gestion des centres de coûts", "Absorption des frais généraux"] },
  { title: "Module 11: Intégration SAP", content: ["Intégration FI-CO", "Intégration SD-FI", "Intégration FI-MM"] },
];

export default function FormationDetail() {
  const [, params] = useRoute("/formation/:id");
  const { t, language } = useI18n();
  
  const { data: formation, isLoading } = useQuery<Formation>({
    queryKey: ["/api/formations", params?.id],
    enabled: !!params?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-48 mb-8" />
          <Skeleton className="h-64 w-full mb-8" />
          <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Formation non trouvée</h1>
          <Link href="/formations">
            <Button>Retour aux formations</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isCertifying = formation.badge === "Certifiant";
  const isLongFormation = formation.duration >= 90;
  const levelConfig = levelLabels[formation.level] || levelLabels.Debutant;
  const formatConfig = formatLabels[formation.format] || formatLabels.Online;
  
  const priceEur = isLongFormation 
    ? Math.round(formation.price / 3 / 1000 / 100) * 100 
    : Math.round(formation.price / 656 / 100) * 100;

  return (
    <>
      <SEO
        title={`${formation.title} | A.SAP Formation`}
        description={formation.description}
        type="article"
      />
      <div className="min-h-screen bg-background">
        <section className="bg-gradient-to-br from-primary via-primary to-dark-blue py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Link href="/formations" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {language === "fr" ? "Retour aux formations" : "Back to courses"}
            </Link>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge className="bg-gold text-gold-foreground">{formation.category}</Badge>
              <Badge variant="outline" className={levelConfig.color}>{language === "fr" ? levelConfig.fr : levelConfig.en}</Badge>
              {formation.badge && (
                <Badge variant="secondary">{formation.badge}</Badge>
              )}
            </div>
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4" data-testid="text-formation-title">
              {formation.title}
            </h1>
            <p className="text-lg text-white/80 max-w-3xl mb-6">
              {formation.description}
            </p>
            <div className="flex flex-wrap gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span>{formation.duration} {language === "fr" ? "jours" : "days"}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <span>{formatConfig.icon} {language === "fr" ? formatConfig.fr : formatConfig.en}</span>
              </div>
              {isCertifying && (
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-gold" />
                  <span className="text-gold font-medium">{language === "fr" ? "Certifiant" : "Certifying"}</span>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              {formation.objectives && formation.objectives.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      {language === "fr" ? "Objectifs de la formation" : "Course objectives"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {formation.objectives.map((obj, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    {language === "fr" ? "Programme de formation" : "Course curriculum"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {formation.category === "FI" && isLongFormation ? (
                    <div className="space-y-4">
                      {modulesDetailsFI.map((mod, idx) => (
                        <div key={idx} className="border-l-2 border-primary/30 pl-4">
                          <h4 className="font-semibold text-sm mb-2">{mod.title}</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {mod.content.map((item, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary/50" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {formation.modules?.map((mod, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <span className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary text-xs font-medium shrink-0">
                            {idx + 1}
                          </span>
                          <span>{mod}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {isLongFormation && (
                <Card className="border-gold/30 bg-gold/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-gold" />
                      {language === "fr" ? "Stage et certification" : "Internship and certification"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">{language === "fr" ? "Stage obligatoire" : "Mandatory internship"}</h4>
                      <p className="text-muted-foreground">
                        {language === "fr" 
                          ? "1 à 2 mois de stage en entreprise pour mettre en pratique les compétences acquises. Nous vous accompagnons dans la recherche de stage avec nos partenaires."
                          : "1 to 2 months internship to apply your new skills. We help you find internships with our partner companies."}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">{language === "fr" ? "Préparation à la certification SAP" : "SAP certification preparation"}</h4>
                      <p className="text-muted-foreground">
                        {language === "fr"
                          ? "Sessions de révision intensive et examens blancs pour vous préparer à la certification SAP officielle."
                          : "Intensive review sessions and mock exams to prepare you for the official SAP certification."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="sticky top-4 border-primary/20">
                <CardHeader className="bg-primary/5">
                  <CardTitle className="flex items-center justify-between gap-4">
                    <span>{language === "fr" ? "Tarif" : "Pricing"}</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {isLongFormation ? `${priceEur}€` : `${priceEur}€`}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {isLongFormation 
                          ? (language === "fr" ? "/mois (3 mois)" : "/month (3 months)")
                          : (language === "fr" ? "/session" : "/session")}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{formation.duration} {language === "fr" ? "jours" : "days"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{language === "fr" ? formatConfig.fr : formatConfig.en}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{isLongFormation ? "10-20" : "5-10"} {language === "fr" ? "participants" : "participants"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{isLongFormation 
                        ? (language === "fr" ? "2 sessions/an" : "2 sessions/year")
                        : (language === "fr" ? "Sessions régulières" : "Regular sessions")}</span>
                    </div>
                  </div>

                  {formation.prerequisites && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-sm mb-2">{language === "fr" ? "Prérequis" : "Prerequisites"}</h4>
                      <p className="text-sm text-muted-foreground">{formation.prerequisites}</p>
                    </div>
                  )}

                  {formation.certification && (
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-sm mb-2">{language === "fr" ? "Certification" : "Certification"}</h4>
                      <p className="text-sm text-muted-foreground">{formation.certification}</p>
                    </div>
                  )}

                  <Link href={`/inscription?formation=${formation.id}`} className="block pt-4">
                    <Button className="w-full bg-gold text-gold-foreground" size="lg" data-testid="button-enroll">
                      <GraduationCap className="mr-2 h-5 w-5" />
                      {language === "fr" ? "S'inscrire maintenant" : "Enroll now"}
                    </Button>
                  </Link>
                  
                  <Link href="/agent" className="block">
                    <Button variant="outline" className="w-full" data-testid="button-ask-question">
                      {language === "fr" ? "Poser une question" : "Ask a question"}
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3">{language === "fr" ? "Inclus dans la formation" : "Included in the course"}</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {language === "fr" ? "Accès environnement SAP" : "SAP environment access"}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {language === "fr" ? "Support de cours" : "Course materials"}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {language === "fr" ? "Wi-Fi gratuit" : "Free Wi-Fi"}
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {language === "fr" ? "Salle climatisée" : "Air-conditioned room"}
                    </li>
                    {isLongFormation && (
                      <>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {language === "fr" ? "Stage en entreprise" : "Company internship"}
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {language === "fr" ? "Préparation certification" : "Certification prep"}
                        </li>
                      </>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
