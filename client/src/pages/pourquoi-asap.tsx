import { Link } from "wouter";
import {
  Target, Users, Zap, Globe, CheckCircle2,
  MessageCircle, Rocket, Compass
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "@/lib/i18n";
import teamImage from "@assets/Gemini_Generated_Image_nmk9wvnmk9wvnmk9_1766483159475.png";

export default function PourquoiAsap() {
  const { t } = useTranslation();

  const values = [
    {
      icon: Target,
      title: t("whyAsap.value1.title"),
      description: t("whyAsap.value1.desc"),
    },
    {
      icon: Zap,
      title: t("whyAsap.value2.title"),
      description: t("whyAsap.value2.desc"),
    },
    {
      icon: Users,
      title: t("whyAsap.value3.title"),
      description: t("whyAsap.value3.desc"),
    },
    {
      icon: Globe,
      title: t("whyAsap.value4.title"),
      description: t("whyAsap.value4.desc"),
    },
  ];

  const methodology = [
    {
      step: "01",
      title: t("whyAsap.step1.title"),
      description: t("whyAsap.step1.desc"),
    },
    {
      step: "02",
      title: t("whyAsap.step2.title"),
      description: t("whyAsap.step2.desc"),
    },
    {
      step: "03",
      title: t("whyAsap.step3.title"),
      description: t("whyAsap.step3.desc"),
    },
    {
      step: "04",
      title: t("whyAsap.step4.title"),
      description: t("whyAsap.step4.desc"),
    },
  ];

  const differentiators = [
    t("whyAsap.diff1"),
    t("whyAsap.diff2"),
    t("whyAsap.diff3"),
    t("whyAsap.diff4"),
    t("whyAsap.diff5"),
    t("whyAsap.diff6"),
  ];

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary via-primary to-dark-blue py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl" data-testid="text-pourquoi-title">
            {t("whyAsap.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/80">
            {t("whyAsap.subtitle")}
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
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">{t("whyAsap.vision").split(" ")[0]} <span className="text-gold">{t("whyAsap.vision").split(" ").slice(1).join(" ")}</span></h2>
            <p className="text-white/80 text-lg leading-relaxed mb-6">
              {t("whyAsap.visionDesc1")}
            </p>
            <p className="text-white/80 text-lg leading-relaxed">
              {t("whyAsap.visionDesc2")}
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
            <h2 className="mb-4 text-3xl font-bold">{t("whyAsap.methodology").split(" ")[0]} <span className="text-gold">{t("whyAsap.methodology").split(" ").slice(1).join(" ")}</span></h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {t("whyAsap.methodologySubtitle")}
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
                      <div className="mb-2 text-sm font-semibold text-primary">{t("whyAsap.step")} {item.step}</div>
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
                {t("whyAsap.differentiators").split(" ").slice(0, -1).join(" ")} <span className="text-primary">{t("whyAsap.differentiators").split(" ").slice(-1)}</span>
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
                    {t("whyAsap.talkToSales")}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6 text-center">
                  <div className="mb-2 text-4xl font-bold">15+</div>
                  <div className="text-sm opacity-90">{t("home.stats.years")}</div>
                </CardContent>
              </Card>
              <Card className="bg-gold text-gold-foreground">
                <CardContent className="p-6 text-center">
                  <div className="mb-2 text-4xl font-bold">200+</div>
                  <div className="text-sm">{t("home.stats.projects")}</div>
                </CardContent>
              </Card>
              <Card className="bg-gold text-gold-foreground">
                <CardContent className="p-6 text-center">
                  <div className="mb-2 text-4xl font-bold">50+</div>
                  <div className="text-sm">{t("home.stats.consultants")}</div>
                </CardContent>
              </Card>
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="p-6 text-center">
                  <div className="mb-2 text-4xl font-bold">98%</div>
                  <div className="text-sm opacity-90">{t("home.stats.satisfaction")}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            {t("whyAsap.cta.title").split(" ").slice(0, -1).join(" ")} <span className="text-gold">{t("whyAsap.cta.title").split(" ").slice(-1)}</span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            {t("whyAsap.cta.subtitle")}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/agent">
              <Button size="lg" className="bg-gold text-gold-foreground" data-testid="button-cta-pourquoi">
                <Rocket className="mr-2 h-5 w-5" />
                {t("whyAsap.cta.button")}
              </Button>
            </Link>
            <Link href="/expertises">
              <Button size="lg" variant="outline" data-testid="button-expertises-pourquoi">
                <Compass className="mr-2 h-5 w-5" />
                {t("whyAsap.cta.expertises")}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
