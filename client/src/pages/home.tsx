import { Link } from "wouter";
import { ArrowRight, Sparkles, Cpu, Database, GraduationCap, FolderKanban, Compass, MessageCircle, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroVideo from "@assets/generated_videos/corporate_consulting_meeting_ambiance.mp4";

const problemCards = [
  {
    icon: Cpu,
    title: "Je veux transformer mon SI",
    description: "Modernisez votre système d'information avec une approche structurée et agile.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Database,
    title: "Je veux déployer/optimiser SAP",
    description: "Intégration, paramétrage et optimisation de votre environnement SAP.",
    color: "bg-gold/20 text-gold-foreground dark:text-gold",
  },
  {
    icon: GraduationCap,
    title: "Je veux former mes équipes",
    description: "Formations certifiantes SAP pour particuliers et entreprises.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: FolderKanban,
    title: "Je veux gérer un projet SI",
    description: "Pilotage de bout en bout de vos projets de transformation digitale.",
    color: "bg-gold/20 text-gold-foreground dark:text-gold",
  },
];

const stats = [
  { value: "15+", label: "Années d'expertise" },
  { value: "200+", label: "Projets réalisés" },
  { value: "50+", label: "Consultants certifiés" },
  { value: "98%", label: "Clients satisfaits" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden py-20 md:py-32">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover blur-[1px] scale-105"
          data-testid="video-hero-background"
        >
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/90 to-dark-blue/95" />
        <div className="container relative mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl" data-testid="text-hero-title">
              Conseil, Transformation & SAP
              <span className="block text-gold">pilotés par l'IA</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80 md:text-xl" data-testid="text-hero-description">
              A.SAP accompagne votre transformation digitale avec expertise et innovation.
              Nos commerciaux vous guident vers les solutions adaptées à vos besoins.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/agent">
                <Button size="lg" className="bg-gold text-gold-foreground text-lg px-8" data-testid="button-hero-agent">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  Parler à un commercial
                </Button>
              </Link>
              <Link href="/expertises">
                <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white backdrop-blur-sm text-lg px-8" data-testid="button-hero-expertises">
                  <Compass className="mr-2 h-5 w-5" />
                  Découvrir nos expertises
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl" data-testid="text-problems-title">
              Quel est votre <span className="text-primary">besoin</span> ?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Sélectionnez votre problématique pour être orienté vers la meilleure solution.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
            {problemCards.map((card, index) => (
              <Link href="/agent" key={index}>
                <Card className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1" data-testid={`card-problem-${index}`}>
                  <CardContent className="flex items-start gap-4 p-6">
                    <div className={`rounded-lg p-3 ${card.color}`}>
                      <card.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-1" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center" data-testid={`stat-${index}`}>
                <div className="mb-2 text-4xl font-bold text-primary md:text-5xl">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Prêt à <span className="text-gold">transformer</span> votre entreprise ?
            </h2>
            <p className="mb-8 text-muted-foreground">
              Notre équipe commerciale est disponible pour analyser votre besoin et vous proposer
              les meilleures solutions. Commencez la conversation dès maintenant.
            </p>
            <Link href="/agent">
              <Button size="lg" className="bg-gold text-gold-foreground" data-testid="button-cta-bottom">
                <Rocket className="mr-2 h-5 w-5" />
                Contacter un commercial
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
