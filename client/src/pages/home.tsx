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
import logoMinistere from "@assets/logo_ministere_guinee.jpg";

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
      link: "/expertises",
    },
    {
      icon: Database,
      title: t("home.problem.sap"),
      description: t("home.problem.sapDesc"),
      color: "bg-gold/20 text-gold-foreground dark:text-gold",
      link: "/formations",
    },
    {
      icon: GraduationCap,
      title: t("home.problem.training"),
      description: t("home.problem.trainingDesc"),
      color: "bg-primary/10 text-primary",
      link: "/formations",
    },
    {
      icon: FolderKanban,
      title: t("home.problem.project"),
      description: t("home.problem.projectDesc"),
      color: "bg-gold/20 text-gold-foreground dark:text-gold",
      link: "/expertises",
    },
  ];

  const stats = [
    { value: "15+", label: "years", icon: Compass },
    { value: "50+", label: "projects", icon: Rocket },
    { value: "10+", label: "consultants", icon: MessageCircle },
    { value: "98%", label: "satisfaction", icon: Sparkles },
  ];

  return (
    <>
      <SEO
        title="A.SAP Académie | Formation SAP en Afrique de l'Ouest"
        description="Formez-vous à SAP et accélérez votre carrière. La première académie digitale SAP avec formation en ligne, IA et accompagnement personnalisé."
        canonical="/"
        schema={homeBreadcrumb}
      />

      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-background via-background to-background" data-testid="hero-section">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            className="h-full w-full object-cover opacity-20"
            preload="none"
            loading="lazy"
            data-testid="hero-video"
          >
            <source src={heroVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary" data-testid="hero-badge">
                {t("home.hero.badge")}
              </span>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl" data-testid="hero-title">
              Formez-vous à SAP et accélérez votre carrière en Afrique
            </h1>

            <p className="mb-8 text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto" data-testid="hero-subtitle">
              La première académie digitale SAP en Afrique de l'Ouest — Formation en ligne, IA et accompagnement personnalisé
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center" data-testid="hero-cta">
              <Link href="/formations">
                <Button size="lg" className="gap-2" data-testid="cta-primary">
                  {t("common.getStarted")} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" data-testid="cta-secondary">
                  {t("common.contact")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-4" data-testid="hero-stats">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="mx-auto mb-2 h-6 w-6 text-primary" />
                  <p className="text-2xl font-bold text-foreground sm:text-3xl">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{t(`home.stats.${stat.label}`)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Problem Cards Section */}
      <section className="bg-muted/30 px-4 py-20 sm:px-6 lg:px-8" data-testid="problem-cards-section">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl" data-testid="problem-cards-title">
            {t("home.problems.title")}
          </h2>
          <p className="mb-12 text-center text-lg text-muted-foreground" data-testid="problem-cards-subtitle">
            {t("home.problems.subtitle")}
          </p>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4" data-testid="problem-cards-grid">
            {problemCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <Link key={index} href={card.link}>
                  <Card className="group h-full cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 dark:hover:border-primary/50" data-testid={`problem-card-${index}`}>
                    <CardContent className="pt-6">
                      <div className={`mb-4 inline-flex rounded-lg p-3 ${card.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mb-2 font-semibold text-foreground">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="px-4 py-20 sm:px-6 lg:px-8" data-testid="partners-section">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-2xl font-bold tracking-tight text-foreground sm:text-3xl" data-testid="partners-title">
            {t("home.partners.title")}
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 items-center" data-testid="partners-grid">
            <div className="flex justify-center">
              <img src={logoSap} alt="SAP" className="h-12 object-contain opacity-70 transition-opacity hover:opacity-100" data-testid="partner-logo-sap" />
            </div>
            <div className="flex justify-center">
              <img src={logoAtos} alt="Atos" className="h-12 object-contain opacity-70 transition-opacity hover:opacity-100" data-testid="partner-logo-atos" />
            </div>
            <div className="flex justify-center">
              <img src={logoDpWorld} alt="DP World" className="h-12 object-contain opacity-70 transition-opacity hover:opacity-100" data-testid="partner-logo-dpworld" />
            </div>
            <div className="flex justify-center">
              <img src={logoPasteur} alt="Pasteur" className="h-12 object-contain opacity-70 transition-opacity hover:opacity-100" data-testid="partner-logo-pasteur" />
            </div>
            <div className="flex justify-center">
              <img src={logoMinistere} alt="Ministère" className="h-12 object-contain opacity-70 transition-opacity hover:opacity-100" data-testid="partner-logo-ministere" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/90 to-primary/80 px-4 py-20 sm:px-6 lg:px-8" data-testid="cta-section">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute h-80 w-80 rounded-full bg-white/20 blur-3xl" style={{ top: "-100px", right: "-100px" }} />
          <div className="absolute h-80 w-80 rounded-full bg-white/20 blur-3xl" style={{ bottom: "-100px", left: "-100px" }} />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-white sm:text-4xl" data-testid="cta-title">
            {t("home.cta.title")}
          </h2>
          <p className="mb-8 text-lg text-white/90" data-testid="cta-description">
            {t("home.cta.description")}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/formations">
              <Button size="lg" variant="secondary" className="gap-2" data-testid="cta-button">
                {t("common.getStarted")} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/20" data-testid="cta-contact-button">
                {t("common.contact")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
