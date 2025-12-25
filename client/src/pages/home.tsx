import { Link } from "wouter";
import { ArrowRight, Sparkles, Cpu, Database, GraduationCap, FolderKanban, Compass, MessageCircle, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";
import { SEO, generateBreadcrumbSchema } from "@/components/seo";
import heroVideo from "@assets/generated_videos/corporate_consulting_meeting_ambiance.mp4";
import logoAtos from "@assets/OIP_1766654334099.webp";
import logoDpWorld from "@assets/OIP_(2)_1766654334098.webp";
import logoSap from "@assets/sap-logo-269309_1766654334110.png";
import logoPasteur from "@assets/OIP_(1)_1766654334097.webp";

export default function Home() {
  const { t, language } = useTranslation();

  const homeBreadcrumb = generateBreadcrumbSchema([
    { name: language === "fr" ? "Accueil" : "Home", url: "/" }
  ]);

  const problemCards = [
    {
      icon: Cpu,
      title: t("home.problem.si"),
      description: t("home.problem.siDesc"),
      color: "bg-primary/10 text-primary",
    },
    {
      icon: Database,
      title: t("home.problem.sap"),
      description: t("home.problem.sapDesc"),
      color: "bg-gold/20 text-gold-foreground dark:text-gold",
    },
    {
      icon: GraduationCap,
      title: t("home.problem.training"),
      description: t("home.problem.trainingDesc"),
      color: "bg-primary/10 text-primary",
    },
    {
      icon: FolderKanban,
      title: t("home.problem.project"),
      description: t("home.problem.projectDesc"),
      color: "bg-gold/20 text-gold-foreground dark:text-gold",
    },
  ];

  const stats = [
    { value: "15+", label: t("home.stats.years") },
    { value: "200+", label: t("home.stats.projects") },
    { value: "50+", label: t("home.stats.consultants") },
    { value: "98%", label: t("home.stats.satisfaction") },
  ];

  return (
    <>
      <SEO
        title={language === "fr" ? "Accueil" : "Home"}
        description={language === "fr" 
          ? "A.SAP SARL, expert en conseil SAP, transformation digitale et formations certifiantes à Dakar. Accompagnement personnalisé pour votre réussite numérique."
          : "A.SAP SARL, expert in SAP consulting, digital transformation and certified training in Dakar. Personalized support for your digital success."}
        keywords="SAP, conseil, consulting, transformation digitale, formation SAP, Dakar, Sénégal, ERP, S/4HANA, certification"
        url="/"
        schema={homeBreadcrumb}
        includeOrgSchema={true}
      />
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
            <h1 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl leading-tight" data-testid="text-hero-title">
              Développement et intégration des systèmes d'information <span className="text-gold">SAP ERP</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-base text-white/90 sm:text-lg md:text-xl font-medium" data-testid="text-hero-description">
              Conseil et Gestion de projet
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Link href="/expertises">
                <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white backdrop-blur-sm text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto" data-testid="button-hero-expertises">
                  <Compass className="mr-2 h-5 w-5" />
                  {t("home.hero.discover")}
                </Button>
              </Link>
              <Link href="/agent">
                <Button size="lg" className="bg-gold text-gold-foreground text-base sm:text-lg px-6 sm:px-8 w-full sm:w-auto" data-testid="button-hero-agent">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {t("home.hero.cta")}
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
              {t("home.problems.title").split(" ").slice(0, -1).join(" ")} <span className="text-primary">{t("home.problems.title").split(" ").slice(-1)}</span>
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t("home.problems.subtitle")}
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
              {t("home.cta.title").split(" ").slice(0, -1).join(" ")} <span className="text-gold">{t("home.cta.title").split(" ").slice(-1)}</span>
            </h2>
            <p className="mb-8 text-muted-foreground">
              {t("home.cta.subtitle")}
            </p>
            <Link href="/agent">
              <Button size="lg" className="bg-gold text-gold-foreground" data-testid="button-cta-bottom">
                <Rocket className="mr-2 h-5 w-5" />
                {t("home.cta.button")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider font-medium">
            {language === "fr" ? "Ils nous font confiance" : "They trust us"}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="h-16 w-32 flex items-center justify-center" data-testid="partner-sap">
              <img src={logoSap} alt="SAP" className="max-h-12 max-w-full object-contain" />
            </div>
            <div className="h-16 w-32 flex items-center justify-center" data-testid="partner-atos">
              <img src={logoAtos} alt="Atos" className="max-h-10 max-w-full object-contain" />
            </div>
            <div className="h-16 w-32 flex items-center justify-center" data-testid="partner-dpworld">
              <img src={logoDpWorld} alt="DP World" className="max-h-14 max-w-full object-contain" />
            </div>
            <div className="h-16 w-40 flex items-center justify-center" data-testid="partner-pasteur">
              <img src={logoPasteur} alt="Institut Pasteur de Dakar" className="max-h-14 max-w-full object-contain" />
            </div>
            <div className="h-16 w-40 flex items-center justify-center bg-background/50 rounded-lg px-4" data-testid="partner-guinee">
              <span className="text-xs font-semibold text-muted-foreground text-center leading-tight">Ministère des Finances<br/>Guinée Conakry</span>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
}
