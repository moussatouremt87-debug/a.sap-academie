import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, HelpCircle, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Faq } from "@shared/schema";

const categoryLabels: Record<string, string> = {
  General: "Général",
  "Agent IA": "Contact",
  Services: "Services & Projets",
  SAP: "SAP & SI",
  Formation: "Formation",
  Pricing: "Tarifs",
  RDV: "Rendez-vous",
};

const categoryColors: Record<string, string> = {
  General: "bg-primary/10 text-primary",
  "Agent IA": "bg-gold/20 text-gold-foreground dark:text-gold",
  Services: "bg-primary/10 text-primary",
  SAP: "bg-gold/20 text-gold-foreground dark:text-gold",
  Formation: "bg-primary/10 text-primary",
  Pricing: "bg-gold/20 text-gold-foreground dark:text-gold",
  RDV: "bg-primary/10 text-primary",
};

function FaqSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="rounded-lg border p-4">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export default function FaqPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { data: faqs, isLoading } = useQuery<Faq[]>({
    queryKey: ["/api/faqs"],
  });

  const filteredFaqs = faqs?.filter((faq) => {
    if (search) {
      const searchLower = search.toLowerCase();
      if (
        !faq.questionFr.toLowerCase().includes(searchLower) &&
        !faq.answerFr.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    if (selectedCategory && faq.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const categories = faqs ? [...new Set(faqs.map((f) => f.category))] : [];

  const groupedFaqs = filteredFaqs?.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, Faq[]>);

  return (
    <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary via-primary to-dark-blue py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl" data-testid="text-faq-title">
            Foire Aux Questions
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/80">
            Trouvez rapidement les réponses à vos questions sur nos services,
            formations et méthodes de travail.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans la FAQ..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-12 pl-10 text-base"
                  data-testid="input-search-faq"
                />
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                data-testid="button-category-all"
              >
                Toutes
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  data-testid={`button-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {categoryLabels[cat] || cat}
                </Button>
              ))}
            </div>

            {isLoading ? (
              <FaqSkeleton />
            ) : filteredFaqs && filteredFaqs.length > 0 ? (
              <div className="space-y-8">
                {Object.entries(groupedFaqs || {}).map(([category, categoryFaqs]) => (
                  <div key={category} data-testid={`faq-category-${category.toLowerCase().replace(/\s+/g, '-')}`}>
                    <div className="mb-4 flex items-center gap-2">
                      <Badge variant="secondary" className={categoryColors[category]}>
                        {categoryLabels[category] || category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        ({categoryFaqs.length} question{categoryFaqs.length > 1 ? "s" : ""})
                      </span>
                    </div>
                    <Accordion type="single" collapsible className="space-y-2">
                      {categoryFaqs.map((faq) => (
                        <AccordionItem
                          key={faq.id}
                          value={`faq-${faq.id}`}
                          className="rounded-lg border px-4"
                          data-testid={`faq-item-${faq.id}`}
                        >
                          <AccordionTrigger className="text-left hover:no-underline">
                            <span className="font-medium">{faq.questionFr}</span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pb-2 pt-1">
                              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {faq.answerFr}
                              </p>
                              <div className="mt-4 flex items-center gap-4 border-t pt-4">
                                <span className="text-sm text-muted-foreground">Cette réponse vous a-t-elle aidé ?</span>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm">
                                    <ThumbsUp className="mr-1 h-4 w-4" />
                                    Oui
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <ThumbsDown className="mr-1 h-4 w-4" />
                                    Non
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <HelpCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">Aucune question trouvée</h3>
                <p className="mb-6 max-w-md text-muted-foreground">
                  Votre question ne figure pas dans notre FAQ ?
                  Un commercial peut vous aider.
                </p>
                <Link href="/agent">
                  <Button>
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Parler à un commercial
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-2xl font-bold md:text-3xl">
            Vous n'avez pas trouvé de <span className="text-gold">réponse</span> ?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            Nos commerciaux sont disponibles pour répondre à toutes vos questions
            et vous accompagner dans vos démarches.
          </p>
          <Link href="/agent">
            <Button size="lg" className="bg-gold text-gold-foreground" data-testid="button-cta-faq">
              <MessageCircle className="mr-2 h-5 w-5" />
              Poser ma question à un commercial
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
