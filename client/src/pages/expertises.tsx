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
import { SEO, generateBreadcrumbSchema } from "@/components/seo";
import transformationImage from "@assets/Gemini_Generated_Image_e2646ke2646ke264_(1)_1766483159475.png";

interface Service {
  id: string;
  icon: any;
}

interface ExpertiseCategory {
  id: string;
  icon: any;
  color: string;
  services: Service[];
}

const categoryData: ExpertiseCategory[] = [
  {
    id: "sap",
    icon: Database,
    color: "bg-primary/10 text-primary",
    services: [
      { id: "sap-consulting", icon: Lightbulb },
      { id: "sap-integration", icon: Settings },
      { id: "vente-erp", icon: ShoppingCart },
      { id: "parametrage", icon: Wrench },
      { id: "maintenance", icon: Wrench },
      { id: "amoa", icon: Users },
    ],
  },
  {
    id: "conseil",
    icon: Lightbulb,
    color: "bg-gold/20 text-gold-foreground dark:text-gold",
    services: [
      { id: "conseil-strategique", icon: TrendingUp },
      { id: "veille-strategique", icon: Search },
      { id: "pilotage-transformation", icon: Users },
      { id: "politiques-publiques", icon: FileText },
      { id: "conduite-changement", icon: Users },
      { id: "gestion-projet", icon: Briefcase },
    ],
  },
  {
    id: "transformation-si",
    icon: Monitor,
    color: "bg-primary/10 text-primary",
    services: [
      { id: "schema-directeur-si", icon: FileText },
      { id: "urbanisation-si", icon: Building },
      { id: "amoa-amoe", icon: Users },
      { id: "transformation-digitale", icon: Monitor },
      { id: "dematerialisation", icon: FileText },
      { id: "audit-si", icon: Search },
      { id: "securite-reseaux", icon: Shield },
      { id: "infogerance-tma", icon: Wrench },
      { id: "hebergement", icon: Server },
    ],
  },
  {
    id: "formation",
    icon: GraduationCap,
    color: "bg-gold/20 text-gold-foreground dark:text-gold",
    services: [
      { id: "formation-particuliers", icon: UserCheck },
      { id: "formation-entreprises", icon: Building },
      { id: "coaching", icon: Users },
    ],
  },
  {
    id: "business",
    icon: Briefcase,
    color: "bg-primary/10 text-primary",
    services: [
      { id: "allocation-ressources", icon: Users },
      { id: "recrutement-it", icon: UserCheck },
      { id: "representation-commerciale", icon: Handshake },
      { id: "implantation-senegal", icon: MapPin },
      { id: "mise-en-relation", icon: Handshake },
      { id: "materiel-it", icon: ShoppingCart },
    ],
  },
];

const categoryIdToKey: Record<string, string> = {
  "conseil": "expertises.cat.conseil",
  "transformation-si": "expertises.cat.transformation-si",
  "sap": "expertises.cat.sap",
  "formation": "expertises.cat.formation",
  "business": "expertises.cat.business",
};

export default function Expertises() {
  const { t, language } = useTranslation();
  const [selectedService, setSelectedService] = useState<{categoryId: string, serviceId: string, serviceIcon: any, categoryColor: string} | null>(null);

  const getServiceName = (serviceId: string) => t(`expertises.service.${serviceId}`);
  const getServiceDesc = (serviceId: string) => t(`expertises.service.${serviceId}.desc`);
  const getServiceBenefits = (serviceId: string) => t(`expertises.service.${serviceId}.benefits`).split(",");
  const getServiceDeliverables = (serviceId: string) => t(`expertises.service.${serviceId}.deliverables`).split(",");

  const expertisesBreadcrumb = generateBreadcrumbSchema([
    { name: language === "fr" ? "Accueil" : "Home", url: "/" },
    { name: language === "fr" ? "Nos Expertises" : "Our Expertise", url: "/expertises" }
  ]);

  return (
    <>
      <SEO
        title={language === "fr" ? "Nos Expertises" : "Our Expertise"}
        description={language === "fr"
          ? "Découvrez nos expertises en conseil stratégique, transformation digitale, SAP, formation et développement commercial au Sénégal."
          : "Discover our expertise in strategic consulting, digital transformation, SAP, training and business development in Senegal."}
        keywords="conseil stratégique, transformation digitale, SAP consulting, formation, développement commercial, Dakar, Sénégal"
        url="/expertises"
        schema={expertisesBreadcrumb}
        includeOrgSchema={false}
      />
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
            {categoryData.map((category) => (
              <div key={category.id} className="scroll-mt-20" id={category.id} data-testid={`section-expertise-${category.id}`}>
                <div className="mb-8 flex items-start gap-4">
                  <div className={`rounded-lg p-3 ${category.color}`}>
                    <category.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold md:text-3xl">{t(categoryIdToKey[category.id])}</h2>
                    <p className="mt-2 text-muted-foreground">{t(`${categoryIdToKey[category.id]}.desc`)}</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.services.map((service, serviceIndex) => (
                    <Card 
                      key={serviceIndex} 
                      className="group cursor-pointer transition-all hover:shadow-md hover-elevate"
                      onClick={() => setSelectedService({ 
                        categoryId: category.id, 
                        serviceId: service.id, 
                        serviceIcon: service.icon,
                        categoryColor: category.color 
                      })}
                      data-testid={`card-service-${category.id}-${serviceIndex}`}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className={`rounded-lg p-2 ${category.color}`}>
                          <service.icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">{getServiceName(service.id)}</span>
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
                    <Button className="bg-gold text-gold-foreground" data-testid={`button-agent-${category.id}`}>
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
                <div className="flex items-center gap-3 mb-2">
                  <div className={`rounded-lg p-2 ${selectedService.categoryColor}`}>
                    <selectedService.serviceIcon className="h-5 w-5" />
                  </div>
                  <DialogTitle className="text-xl">{getServiceName(selectedService.serviceId)}</DialogTitle>
                </div>
                <DialogDescription className="text-base">
                  {getServiceDesc(selectedService.serviceId)}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-gold" />
                    {t("expertises.keyBenefits")}
                  </h4>
                  <ul className="space-y-2">
                    {getServiceBenefits(selectedService.serviceId).map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-primary" />
                    {t("expertises.deliverables")}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {getServiceDeliverables(selectedService.serviceId).map((deliverable, i) => (
                      <Badge key={i} variant="secondary">{deliverable.trim()}</Badge>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  <Link href="/agent" className="flex-1">
                    <Button className="w-full" data-testid="button-service-contact">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {t("expertises.discussService")}
                    </Button>
                  </Link>
                  <Button variant="outline" onClick={() => setSelectedService(null)}>
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
            {t("expertises.cta.title")}
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
    </>
  );
}
