import { Link } from "wouter";
import {
  Target, Users, Zap, Globe, Award, CheckCircle2,
  Building2, Lightbulb, TrendingUp, MessageCircle, ArrowRight, Rocket, Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import teamImage from "@assets/Gemini_Generated_Image_nmk9wvnmk9wvnmk9_1766483159475.png";

const values = [
  {
    icon: Target,
    title: "Expertise Multi-disciplinaire",
    description: "Une équipe pluridisciplinaire combinant conseil stratégique, expertise technique SAP et accompagnement au changement.",
  },
  {
    icon: Zap,
    title: "Approche Agile",
    description: "Méthodologies flexibles et itératives pour des résultats rapides et une adaptation continue à vos besoins.",
  },
  {
    icon: Users,
    title: "Proximité Client",
    description: "Un accompagnement personnalisé avec des consultants dédiés qui comprennent votre métier et vos enjeux.",
  },
  {
    icon: Globe,
    title: "Présence Régionale",
    description: "Ancrage fort en Afrique de l'Ouest avec une connaissance approfondie du tissu économique local.",
  },
];

const methodology = [
  {
    step: "01",
    title: "Écoute & Diagnostic",
    description: "Analyse approfondie de votre contexte, vos enjeux et vos objectifs stratégiques.",
  },
  {
    step: "02",
    title: "Conception & Stratégie",
    description: "Élaboration d'une feuille de route adaptée avec des solutions pragmatiques.",
  },
  {
    step: "03",
    title: "Implémentation",
    description: "Déploiement progressif avec transfert de compétences vers vos équipes.",
  },
  {
    step: "04",
    title: "Accompagnement",
    description: "Support continu et optimisation pour garantir le succès durable de votre transformation.",
  },
];

const differentiators = [
  "15+ années d'expertise en transformation digitale",
  "Partenaire certifié SAP",
  "Plus de 200 projets menés avec succès",
  "Équipe de 50+ consultants experts",
  "Présence dans 5 pays d'Afrique de l'Ouest",
  "Équipe commerciale disponible pour vos questions",
];

export default function PourquoiAsap() {
  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary via-primary to-dark-blue py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl" data-testid="text-pourquoi-title">
            Pourquoi choisir A.SAP ?
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/80">
            Un partenaire de confiance pour piloter votre transformation digitale
            avec expertise, innovation et engagement.
          </p>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 md:py-24">
        <img 
          src={teamImage} 
          alt="Équipe A.SAP Consulting en réunion" 
          className="absolute inset-0 h-full w-full object-cover blur-[1px] scale-105"
          data-testid="img-team"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/85 to-dark-blue/90" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Notre <span className="text-gold">Vision</span></h2>
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              A.SAP est né de la conviction que la transformation digitale doit être accessible,
              pragmatique et centrée sur la valeur métier. Notre mission est d'accompagner
              les entreprises africaines dans leur modernisation en combinant expertise
              internationale et connaissance locale.
            </p>
            <p className="text-white/80 text-lg leading-relaxed">
              Basés au Sénégal et présents dans toute l'Afrique de l'Ouest, nous sommes 
              votre partenaire de confiance pour les projets SAP et de transformation digitale.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <Card key={index} className="text-center" data-testid={`card-value-${index}`}>
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="mb-2 font-semibold">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Notre <span className="text-gold">Méthodologie</span></h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Une approche structurée et éprouvée pour garantir le succès de vos projets
              de transformation.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 md:grid-cols-2">
              {methodology.map((item, index) => (
                <Card key={index} className="relative overflow-hidden" data-testid={`card-methodology-${index}`}>
                  <CardContent className="p-6">
                    <div className="absolute -right-4 -top-4 text-8xl font-bold text-primary/5">
                      {item.step}
                    </div>
                    <div className="relative">
                      <div className="mb-2 text-sm font-semibold text-primary">Étape {item.step}</div>
                      <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold">
                Ce qui nous <span className="text-primary">différencie</span>
              </h2>
              <div className="space-y-4">
                {differentiators.map((item, index) => (
                  <div key={index} className="flex items-start gap-3" data-testid={`differentiator-${index}`}>
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/agent">
                  <Button className="bg-gold text-gold-foreground" data-testid="button-differentiators-cta">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Discuter avec un commercial
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6 text-center">
                  <div className="mb-2 text-4xl font-bold">15+</div>
                  <div className="text-sm opacity-90">Années d'expertise</div>
                </CardContent>
              </Card>
              <Card className="bg-gold text-gold-foreground">
                <CardContent className="p-6 text-center">
                  <div className="mb-2 text-4xl font-bold">200+</div>
                  <div className="text-sm">Projets réalisés</div>
                </CardContent>
              </Card>
              <Card className="bg-gold text-gold-foreground">
                <CardContent className="p-6 text-center">
                  <div className="mb-2 text-4xl font-bold">50+</div>
                  <div className="text-sm">Consultants experts</div>
                </CardContent>
              </Card>
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6 text-center">
                  <div className="mb-2 text-4xl font-bold">98%</div>
                  <div className="text-sm opacity-90">Clients satisfaits</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            Prêt à <span className="text-gold">démarrer</span> votre projet ?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Notre équipe commerciale est disponible pour analyser votre besoin et vous proposer
            les solutions les plus adaptées à votre contexte.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/agent">
              <Button size="lg" className="bg-gold text-gold-foreground" data-testid="button-cta-pourquoi">
                <Rocket className="mr-2 h-5 w-5" />
                Parler à un commercial
              </Button>
            </Link>
            <Link href="/expertises">
              <Button size="lg" variant="outline" data-testid="button-expertises-pourquoi">
                <Compass className="mr-2 h-5 w-5" />
                Découvrir nos expertises
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
