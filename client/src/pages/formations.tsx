import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Filter, Clock, BarChart3, Users, Award, Bot, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Formation } from "@shared/schema";

const categories = ["Tous", "FI", "MM", "SD", "ABAP", "Analytics", "Basis", "PP", "QM"];
const levels = ["Tous", "Debutant", "Intermediaire", "Avance"];
const formats = ["Tous", "Online", "Presentiel", "Hybride"];

const badgeVariants: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
  Certifiant: { variant: "default", label: "Certifiant" },
  Nouveau: { variant: "secondary", label: "Nouveau" },
  Populaire: { variant: "outline", label: "Populaire" },
};

function FormationCard({ formation }: { formation: Formation }) {
  const badge = formation.badge ? badgeVariants[formation.badge] : null;
  
  return (
    <Card className="flex flex-col h-full" data-testid={`card-formation-${formation.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{formation.title}</CardTitle>
          {badge && (
            <Badge variant={badge.variant} className="flex-shrink-0">
              {badge.label}
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
            {formation.level}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            {formation.format}
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
          {(formation.price / 100).toLocaleString("fr-FR")} EUR
        </div>
        <Link href={`/formations/${formation.id}`}>
          <Button size="sm" data-testid={`button-formation-${formation.id}`}>S'inscrire</Button>
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
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [level, setLevel] = useState("Tous");
  const [format, setFormat] = useState("Tous");
  const [showFilters, setShowFilters] = useState(false);

  const { data: formations, isLoading } = useQuery<Formation[]>({
    queryKey: ["/api/formations"],
  });

  const filteredFormations = formations?.filter((f) => {
    if (search && !f.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "Tous" && f.category !== category) return false;
    if (level !== "Tous" && f.level !== level) return false;
    if (format !== "Tous" && f.format !== format) return false;
    return true;
  });

  const hasActiveFilters = category !== "Tous" || level !== "Tous" || format !== "Tous" || search;

  const clearFilters = () => {
    setSearch("");
    setCategory("Tous");
    setLevel("Tous");
    setFormat("Tous");
  };

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary via-primary to-dark-blue py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl" data-testid="text-formations-title">
            Formations SAP
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/80">
            Développez vos compétences avec nos formations certifiantes.
            Pour particuliers en reconversion ou professionnels en entreprise.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher une formation..."
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
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="w-[140px]" data-testid="select-level">
                  <SelectValue placeholder="Niveau" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((lvl) => (
                    <SelectItem key={lvl} value={lvl}>{lvl}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={format} onValueChange={setFormat}>
                <SelectTrigger className="w-[130px]" data-testid="select-format">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  {formats.map((fmt) => (
                    <SelectItem key={fmt} value={fmt}>{fmt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} data-testid="button-clear-filters">
                  <X className="mr-1 h-4 w-4" />
                  Effacer
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
                {filteredFormations.length} formation{filteredFormations.length > 1 ? "s" : ""} trouvée{filteredFormations.length > 1 ? "s" : ""}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredFormations.map((formation) => (
                  <FormationCard key={formation.id} formation={formation} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Award className="mb-4 h-12 w-12 text-muted-foreground" />
              <h3 className="mb-2 text-lg font-semibold">Aucune formation trouvée</h3>
              <p className="mb-6 max-w-md text-muted-foreground">
                Aucune formation ne correspond à vos critères.
                Essayez de modifier vos filtres ou parlez à notre Agent IA.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={clearFilters}>
                  Effacer les filtres
                </Button>
                <Link href="/agent">
                  <Button>
                    <Bot className="mr-2 h-4 w-4" />
                    Parler à l'Agent IA
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            Besoin d'une formation <span className="text-gold">sur mesure</span> ?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Nous créons des programmes adaptés aux besoins spécifiques de votre entreprise.
            Contactez notre Agent IA pour discuter de vos objectifs.
          </p>
          <Link href="/agent">
            <Button size="lg" className="bg-gold text-gold-foreground" data-testid="button-cta-formations">
              <Bot className="mr-2 h-5 w-5" />
              Demander un programme personnalisé
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
