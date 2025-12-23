import { Link } from "wouter";
import {
  Lightbulb, Building, Monitor, GraduationCap, Briefcase,
  TrendingUp, Search, Users, FileText, Shield, Server, Database,
  Settings, Wrench, BookOpen, UserCheck, Handshake, MapPin, ShoppingCart,
  Bot, ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const expertiseCategories = [
  {
    id: "conseil",
    title: "Conseil, Stratégie & Transformation",
    description: "Accompagnement stratégique pour piloter vos transformations avec succès.",
    icon: Lightbulb,
    color: "bg-primary/10 text-primary",
    services: [
      { name: "Conseil stratégique", icon: TrendingUp },
      { name: "Étude & veille stratégique", icon: Search },
      { name: "Pilotage transformation", icon: Users },
      { name: "Politiques publiques", icon: FileText },
      { name: "Conduite du changement", icon: Users },
      { name: "Gestion de projet", icon: Briefcase },
    ],
  },
  {
    id: "transformation-si",
    title: "Transformation SI & Digitale",
    description: "Modernisation complète de vos systèmes d'information et processus digitaux.",
    icon: Monitor,
    color: "bg-gold/20 text-gold-foreground dark:text-gold",
    services: [
      { name: "Schéma Directeur SI", icon: FileText },
      { name: "Urbanisation SI", icon: Building },
      { name: "AMOA / AMOE", icon: Users },
      { name: "Transformation digitale", icon: Monitor },
      { name: "Dématérialisation", icon: FileText },
      { name: "Audit SI", icon: Search },
      { name: "Sécurité systèmes et réseaux", icon: Shield },
      { name: "Infogérance & TMA", icon: Wrench },
      { name: "Hébergement & infrastructures", icon: Server },
    ],
  },
  {
    id: "sap",
    title: "SAP, ERP & Solutions",
    description: "Expertise complète SAP : intégration, personnalisation et support continu.",
    icon: Database,
    color: "bg-primary/10 text-primary",
    services: [
      { name: "SAP Consulting", icon: Lightbulb },
      { name: "SAP Integration", icon: Settings },
      { name: "Vente solutions ERP", icon: ShoppingCart },
      { name: "Paramétrage & personnalisation", icon: Wrench },
      { name: "Maintenance & support", icon: Wrench },
      { name: "SAP Training entreprises", icon: GraduationCap },
    ],
  },
  {
    id: "formation",
    title: "Formation & Compétences",
    description: "Programmes de formation SAP certifiants pour particuliers et entreprises.",
    icon: GraduationCap,
    color: "bg-gold/20 text-gold-foreground dark:text-gold",
    services: [
      { name: "Formation SAP Particuliers", icon: UserCheck },
      { name: "Formation SAP Entreprises", icon: Building },
      { name: "Coaching & accompagnement", icon: Users },
    ],
  },
  {
    id: "business",
    title: "Business Services",
    description: "Services d'appui business pour optimiser vos opérations et ressources.",
    icon: Briefcase,
    color: "bg-primary/10 text-primary",
    services: [
      { name: "Allocation ressources", icon: Users },
      { name: "Recrutement IT", icon: UserCheck },
      { name: "Représentation commerciale", icon: Handshake },
      { name: "Implantation au Sénégal", icon: MapPin },
      { name: "Mise en relation business", icon: Handshake },
      { name: "Achat/vente/location matériel IT", icon: ShoppingCart },
    ],
  },
];

export default function Expertises() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary via-primary to-dark-blue py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl" data-testid="text-expertises-title">
            Nos Expertises
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/80">
            Un éventail complet de services pour accompagner votre transformation digitale,
            de la stratégie à l'implémentation.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="space-y-16">
            {expertiseCategories.map((category, index) => (
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
                    <Card key={serviceIndex} className="group transition-all hover:shadow-md" data-testid={`card-service-${category.id}-${serviceIndex}`}>
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className={`rounded-lg p-2 ${category.color}`}>
                          <service.icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium">{service.name}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <div className="mt-6">
                  <Link href="/agent">
                    <Button variant="outline" data-testid={`button-agent-${category.id}`}>
                      <Bot className="mr-2 h-4 w-4" />
                      Parler à l'Agent IA pour ce service
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            Besoin d'un <span className="text-gold">accompagnement personnalisé</span> ?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Notre Agent IA analyse votre besoin et vous oriente vers l'expertise adaptée.
            Commencez la conversation pour découvrir nos solutions.
          </p>
          <Link href="/agent">
            <Button size="lg" className="bg-gold text-gold-foreground" data-testid="button-cta-expertises">
              <Bot className="mr-2 h-5 w-5" />
              Démarrer avec l'Agent IA
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
