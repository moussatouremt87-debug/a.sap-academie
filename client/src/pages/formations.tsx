import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Filter, Clock, BarChart3, Users, Award, Search, X, CheckCircle2, MessageCircle, Rocket, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation, type Language } from "@/lib/i18n";
import { SEO, generateBreadcrumbSchema } from "@/components/seo";
import type { Formation } from "@shared/schema";
import remoteWorkImage from "@assets/Gemini_Generated_Image_ktbxeiktbxeiktbx_1766483159474.png";

const categories = ["Tous", "FI", "MM", "SD", "ABAP", "Analytics", "Basis", "PP", "QM"];
const levels = ["Tous", "Débutant", "Intermédiaire", "Avancé"];
const formats = ["Tous", "En ligne", "Présentiel", "Hybride"];

const badgeVariants: Record<string, "default" | "secondary" | "outline"> = {
  Certifiant: "default",
  Nouveau: "secondary",
  Populaire: "outline",
};

const levelTranslationKeys: Record<string, string> = {
  "Débutant": "formations.level.debutant",
  "Intermédiaire": "formations.level.intermediaire",
  "Avancé": "formations.level.avance",
  "Debutant": "formations.level.debutant",
  "Intermediaire": "formations.level.intermediaire",
  "Avance": "formations.level.avance",
};

const formatTranslationKeys: Record<string, string> = {
  "En ligne": "formations.format.online",
  "Présentiel": "formations.format.presentiel",
  "Hybride": "formations.format.hybride",
  "Online": "formations.format.online",
  "Presentiel": "formations.format.presentiel",
};

const badgeTranslationKeys: Record<string, string> = {
  Certifiant: "formations.badge.certifiant",
  Nouveau: "formations.badge.nouveau",
  Populaire: "formations.badge.populaire",
};

function FormationCard({ formation, t, language }: { formation: Formation; t: (key: string) => string; language: Language }) {
  const badgeVariant = formation.badge ? badgeVariants[formation.badge] : null;
  const badgeLabel = formation.badge && badgeTranslationKeys[formation.badge] 
    ? t(badgeTranslationKeys[formation.badge]) 
    : formation.badge;

  const levelLabel = formation.level && levelTranslationKeys[formation.level]
    ? t(levelTranslationKeys[formation.level])
    : formation.level;

  const formatLabel = formation.format && formatTranslationKeys[formation.format]
    ? t(formatTranslationKeys[formation.format])
    : formation.format;
  
  return (
    <Card className="flex flex-col h-full" data-testid={`card-formation-${formation.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{formation.title}</CardTitle>
          {badgeVariant && badgeLabel && (
            <Badge variant={badgeVariant} className="flex-shrink-0">
              {badgeLabel}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formation.duration}h
          </span>
          <span className="flex items-center gap-1">
            <BarChart3 className="h-3.5 w-3.5" />
            {levelLabel}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {formatLabel}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{formation.description}</p>
        <Badge variant="outline" className="mt-3">
          {formation.category}
        </Badge>
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-4 border-t pt-4">
        <div className="text-lg font-bold text-primary">
          {t("formations.priceFrom")} {(formation.duration >= 90 
            ? Math.round(formation.price / 3 / 1000 / 100) * 100 
            : Math.round(formation.price / 656 / 100) * 100
          ).toLocaleString(language === "fr" ? "fr-FR" : "en-US")} €
        </div>
        <Link href="/agent">
          <Button size="sm" className="bg-gold text-gold-foreground" data-testid={`button-formation-${formation.id}`}>{t("formations.register")}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

function FormationSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-3/4" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5" />
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-9 w-24 ml-auto" />
      </CardFooter>
    </Card>
  );
}

export default function Formations() {
  const { t, language } = useTranslation();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [level, setLevel] = useState("Tous");
  const [format, setFormat] = useState("Tous");
  const [showFilters, setShowFilters] = useState(false);

  const normalizeLevel = (lvl: string) => {
    const map: Record<string, string> = {
      "Débutant": "Débutant", "Debutant": "Débutant",
      "Intermédiaire": "Intermédiaire", "Intermediaire": "Intermédiaire",
      "Avancé": "Avancé", "Avance": "Avancé"
    };
    return map[lvl] || lvl;
  };

  const normalizeFormat = (fmt: string) => {
    const map: Record<string, string> = {
      "En ligne": "En ligne", "Online": "En ligne",
      "Présentiel": "Présentiel", "Presentiel": "Présentiel",
      "Hybride": "Hybride"
    };
    return map[fmt] || fmt;
  };

  const { data: formations, isLoading } = useQuery<Formation[]>({
    queryKey: ["/api/formations"],
  });

  const filteredFormations = formations?.filter((f) => {
    if (search && !f.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "Tous" && f.category !== category) return false;
    if (level !== "Tous" && normalizeLevel(f.level) !== level) return false;
    if (format !== "Tous" && normalizeFormat(f.format) !== format) return false;
    return true;
  });

  const hasActiveFilters = category !== "Tous" || level !== "Tous" || format !== "Tous" || search;

  const clearFilters = () => {
    setSearch("");
    setCategory("Tous");
    setLevel("Tous");
    setFormat("Tous");
  };

  const getLevelLabel = (lvl: string) => {
    if (lvl === "Tous") return t("formations.all");
    return levelTranslationKeys[lvl] ? t(levelTranslationKeys[lvl]) : lvl;
  };

  const getFormatLabel = (fmt: string) => {
    if (fmt === "Tous") return t("formations.all");
    return formatTranslationKeys[fmt] ? t(formatTranslationKeys[fmt]) : fmt;
  };

  const formationsBreadcrumb = generateBreadcrumbSchema([
    { name: language === "fr" ? "Accueil" : "Home", url: "/" },
    { name: language === "fr" ? "Formations" : "Training", url: "/formations" }
  ]);

  return (
    <>
      <SEO
        title={language === "fr" ? "Formations SAP Certifiantes" : "SAP Certified Training"}
        description={language === "fr"
          ? "Catalogue complet de formations SAP certifiantes à Dakar. Modules FI, MM, SD, ABAP, S/4HANA. En ligne, présentiel ou hybride."
          : "Complete catalog of SAP certified training in Dakar. FI, MM, SD, ABAP, S/4HANA modules. Online, on-site or hybrid."}
        keywords="formation SAP, certification SAP, cours SAP, Dakar, Sénégal, FI, MM, SD, ABAP, S/4HANA, e-learning"
        url="/formations"
        schema={formationsBreadcrumb}
        includeOrgSchema={false}
      />
      <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary via-primary to-dark-blue py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl" data-testid="text-formations-title">
            {t("formations.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/80">
            {t("formations.subtitle")}
          </p>
        </div>
      </section>

      <section className="border-b bg-gradient-to-r from-gold/5 via-background to-gold/5 py-8">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              <div className="flex-shrink-0 text-center md:text-left">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold/20 mb-2">
                  <Rocket className="h-8 w-8 text-gold" />
                </div>
              </div>
              <div className="text-center md:text-left">
                <h2 className="text-xl font-bold mb-2" data-testid="text-roi-title">
                  {t("formations.investment.title")}
                </h2>
                <p className="text-muted-foreground mb-3">
                  {t("formations.investment.subtitle")}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm">
                  <div className="bg-muted/50 rounded-lg px-4 py-2">
                    <span className="font-semibold text-primary">{t("formations.junior")}</span>
                    <span className="text-muted-foreground mx-2">:</span>
                    <span className="font-bold">250-400€{t("formations.perDay")}</span>
                  </div>
                  <div className="bg-muted/50 rounded-lg px-4 py-2">
                    <span className="font-semibold text-primary">{t("formations.confirmed")}</span>
                    <span className="text-muted-foreground mx-2">:</span>
                    <span className="font-bold">450-650€{t("formations.perDay")}</span>
                  </div>
                  <div className="bg-gold/10 rounded-lg px-4 py-2">
                    <span className="font-semibold text-gold">{t("formations.senior")}</span>
                    <span className="text-muted-foreground mx-2">:</span>
                    <span className="font-bold">700€+{t("formations.perDay")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder={t("formations.search")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                  data-testid="input-search-formations"
                />
              </div>
              <Button
                variant="outline"
                size="icon"
                className="lg:hidden"
                onClick={() => setShowFilters(!showFilters)}
                data-testid="button-toggle-filters"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>

            <div className={`flex flex-wrap items-center gap-2 ${showFilters ? "flex" : "hidden lg:flex"}`}>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[130px]" data-testid="select-category">
                  <SelectValue placeholder={t("formations.category")}>
                    {category === "Tous" ? t("formations.allCategories") : category}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat === "Tous" ? t("formations.allCategories") : cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="w-[140px]" data-testid="select-level">
                  <SelectValue placeholder={t("formations.level")}>
                    {getLevelLabel(level)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {levels.map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>{getLevelLabel(lvl)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="w-[130px]" data-testid="select-format">
                  <SelectValue placeholder={t("formations.format")}>
                    {getFormatLabel(format)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {formats.map((fmt) => (
                    <SelectItem key={fmt} value={fmt}>{getFormatLabel(fmt)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                  <X className="mr-1 h-4 w-4" />
                  {t("formations.clear")}
                </Button>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <FormationSkeleton key={i} />
              ))}
            </div>
          ) : filteredFormations && filteredFormations.length > 0 ? (
            <>
              <p className="mb-6 text-sm text-muted-foreground" data-testid="text-formations-count">
                {filteredFormations.length} {t("formations.found")}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredFormations.map((formation) => (
                  <FormationCard key={formation.id} formation={formation} t={t} language={language} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Award className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">{t("formations.noResults")}</h3>
              <p className="mb-6 max-w-md text-muted-foreground">
                {t("formations.noResultsDesc")}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearFilters}>
                  {t("formations.clearFilters")}
                </Button>
                <Link href="/agent">
                  <Button className="bg-gold text-gold-foreground">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t("expertises.talkToSales")}
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden py-16 md:py-24">
        <img 
          src={remoteWorkImage} 
          alt="Formation SAP à distance depuis chez soi" 
          className="absolute inset-0 h-full w-full object-cover blur-[1px] scale-105"
          data-testid="img-remote-work"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/85 to-dark-blue/90" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Badge className="mb-4 bg-white/20 text-white border-white/30">{t("formations.flexible.badge")}</Badge>
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              {t("formations.flexible.title").split(" ").slice(0, 1).join(" ")} <span className="text-gold">{t("formations.flexible.title").split(" ").slice(1).join(" ")}</span>
            </h2>
            <p className="mb-8 text-white/80 text-lg">
              {t("formations.flexible.desc")}
            </p>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0" />
                <span>{t("formations.flexible.access")}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0" />
                <span>{t("formations.flexible.sessions")}</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <CheckCircle2 className="h-5 w-5 text-gold flex-shrink-0" />
                <span>{t("formations.flexible.support")}</span>
              </div>
            </div>
            <Link href="/agent">
              <Button size="lg" className="bg-gold text-gold-foreground" data-testid="button-cta-remote">
                <PlayCircle className="mr-2 h-5 w-5" />
                {t("common.learnMore")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            {t("formations.cta.title").split(" ").slice(0, -2).join(" ")} <span className="text-gold">{t("formations.cta.title").split(" ").slice(-2).join(" ")}</span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            {t("formations.cta.subtitle")}
          </p>
          <Link href="/agent">
            <Button size="lg" className="bg-gold text-gold-foreground" data-testid="button-cta-formations">
              <Rocket className="mr-2 h-5 w-5" />
              {t("formations.cta.button")}
            </Button>
          </Link>
        </div>
      </section>
      </div>
    </>
  );
}
