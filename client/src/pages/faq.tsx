import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, HelpCircle, ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/lib/i18n";
import { SEO, generateFAQSchema, generateBreadcrumbSchema } from "@/components/seo";
import type { Faq } from "@shared/schema";

const categoryLabels: Record<string, { fr: string; en: string }> = {
  General: { fr: "Général", en: "General" },
  "Agent IA": { fr: "Contact", en: "Contact" },
  Services: { fr: "Services & Projets", en: "Services & Projects" },
  SAP: { fr: "SAP & SI", en: "SAP & IS" },
  Formation: { fr: "Formation", en: "Training" },
  Pricing: { fr: "Tarifs", en: "Pricing" },
  RDV: { fr: "Rendez-vous", en: "Appointments" },
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
  const { t, language } = useTranslation();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  
const staticFaqs: Faq[] = [
  { id: 1, questionFr: "Qu'est-ce qu'A.SAP ?", questionEn: "What is A.SAP?", answerFr: "A.SAP est un cabinet de conseil sp\u00e9cialis\u00e9 dans l'int\u00e9gration SAP et la transformation digitale en Afrique de l'Ouest. Nous proposons du conseil strat\u00e9gique, de l'int\u00e9gration technique, de la formation certifiante et un Agent IA innovant.", answerEn: "A.SAP is a consulting firm specializing in SAP integration and digital transformation in West Africa. We offer strategic consulting, technical integration, certified training and an innovative AI Agent.", category: "General", order: 1, isPublished: true },
  { id: 2, questionFr: "\u00c0 qui s'adressent vos services ?", questionEn: "Who are your services for?", answerFr: "Nos services s'adressent aux entreprises de toutes tailles en Afrique de l'Ouest : PME en croissance, grandes entreprises, organisations publiques et ONG souhaitant moderniser leurs syst\u00e8mes d'information.", answerEn: "Our services are designed for businesses of all sizes in West Africa: growing SMEs, large corporations, public organizations and NGOs looking to modernize their information systems.", category: "General", order: 2, isPublished: true },
  { id: 3, questionFr: "L'Agent IA remplace-t-il un consultant humain ?", questionEn: "Does the AI Agent replace a human consultant?", answerFr: "Non, l'Agent IA est un outil compl\u00e9mentaire qui acc\u00e9l\u00e8re les diagnostics et l'analyse. Il travaille en synergie avec nos consultants certifi\u00e9s pour offrir un service plus rapide et pr\u00e9cis.", answerEn: "No, the AI Agent is a complementary tool that accelerates diagnostics and analysis. It works in synergy with our certified consultants to deliver faster and more accurate service.", category: "Agent IA", order: 3, isPublished: true },
  { id: 4, questionFr: "Mes donn\u00e9es sont-elles s\u00e9curis\u00e9es avec l'Agent IA ?", questionEn: "Is my data secure with the AI Agent?", answerFr: "Absolument. Toutes les donn\u00e9es trait\u00e9es par notre Agent IA sont chiffr\u00e9es et h\u00e9berg\u00e9es sur des serveurs s\u00e9curis\u00e9s. Nous respectons les normes de confidentialit\u00e9 les plus strictes.", answerEn: "Absolutely. All data processed by our AI Agent is encrypted and hosted on secure servers. We comply with the strictest confidentiality standards.", category: "Agent IA", order: 4, isPublished: true },
  { id: 5, questionFr: "Travaillez-vous avec des PME ou uniquement des grandes entreprises ?", questionEn: "Do you work with SMEs or only large enterprises?", answerFr: "Nous travaillons avec des entreprises de toutes tailles. Nos offres sont modulaires et s'adaptent aussi bien aux PME qu'aux grands groupes.", answerEn: "We work with businesses of all sizes. Our offerings are modular and adapt to both SMEs and large corporations.", category: "Services", order: 5, isPublished: true },
  { id: 6, questionFr: "Intervenez-vous en dehors du S\u00e9n\u00e9gal ?", questionEn: "Do you operate outside Senegal?", answerFr: "Oui, nous intervenons dans toute l'Afrique de l'Ouest. Nous avons des r\u00e9f\u00e9rences au S\u00e9n\u00e9gal, en C\u00f4te d'Ivoire, au Mali et au Burkina Faso.", answerEn: "Yes, we operate throughout West Africa. We have references in Senegal, Ivory Coast, Mali and Burkina Faso.", category: "Services", order: 6, isPublished: true },
  { id: 7, questionFr: "\u00cates-vous un int\u00e9grateur SAP certifi\u00e9 ?", questionEn: "Are you a certified SAP integrator?", answerFr: "Nos consultants poss\u00e8dent des certifications SAP officielles. Nous suivons les m\u00e9thodologies SAP Activate pour garantir la qualit\u00e9 de nos impl\u00e9mentations.", answerEn: "Our consultants hold official SAP certifications. We follow SAP Activate methodologies to ensure the quality of our implementations.", category: "SAP", order: 7, isPublished: true },
  { id: 8, questionFr: "Proposez-vous d'autres ERP que SAP ?", questionEn: "Do you offer other ERPs besides SAP?", answerFr: "Notre expertise principale est SAP, mais nous pouvons conseiller sur d'autres solutions ERP selon vos besoins sp\u00e9cifiques lors de la phase de diagnostic.", answerEn: "Our main expertise is SAP, but we can advise on other ERP solutions based on your specific needs during the diagnostic phase.", category: "SAP", order: 8, isPublished: true },
  { id: 9, questionFr: "Vos formations sont-elles certifiantes ?", questionEn: "Are your training courses certified?", answerFr: "Oui, nos formations SAP sont certifiantes. \u00c0 l'issue de la formation, vous recevez un certificat A.SAP reconnu par les entreprises de la r\u00e9gion.", answerEn: "Yes, our SAP training courses are certified. Upon completion, you receive an A.SAP certificate recognized by companies in the region.", category: "Formation", order: 9, isPublished: true },
  { id: 10, questionFr: "Quels sont les pr\u00e9requis pour suivre une formation ?", questionEn: "What are the prerequisites for training?", answerFr: "Les pr\u00e9requis varient selon la formation. Nos formations d'introduction ne n\u00e9cessitent aucun pr\u00e9requis. Les formations avanc\u00e9es demandent une exp\u00e9rience pr\u00e9alable avec SAP.", answerEn: "Prerequisites vary by course. Our introductory courses require no prerequisites. Advanced courses require prior SAP experience.", category: "Formation", order: 10, isPublished: true },
  { id: 11, questionFr: "Pourquoi les tarifs ne sont-ils pas affich\u00e9s sur le site ?", questionEn: "Why are prices not displayed on the website?", answerFr: "Chaque projet est unique. Nos tarifs d\u00e9pendent du p\u00e9rim\u00e8tre, de la dur\u00e9e et de la complexit\u00e9. Contactez-nous pour un devis personnalis\u00e9 gratuit.", answerEn: "Each project is unique. Our rates depend on scope, duration and complexity. Contact us for a free personalized quote.", category: "Pricing", order: 11, isPublished: true },
  { id: 12, questionFr: "Comment r\u00e9server un rendez-vous ?", questionEn: "How to book an appointment?", answerFr: "Vous pouvez r\u00e9server directement via notre page Contact ou en cliquant sur le bouton 'Contact Commercial' dans le menu. Notre \u00e9quipe vous r\u00e9pond sous 24h.", answerEn: "You can book directly through our Contact page or by clicking the 'Contact Commercial' button in the menu. Our team responds within 24 hours.", category: "RDV", order: 12, isPublished: true }
];

const { data: faqs, isLoading } = useQuery<Faq[]>({
    queryKey: ["/api/faqs"],
    initialData: staticFaqs,
    retry: false,
  });

  const filteredFaqs = faqs?.filter((faq) => {
    if (search) {
      const searchLower = search.toLowerCase();
      const question = language === "fr" ? faq.questionFr : (faq.questionEn || faq.questionFr);
      const answer = language === "fr" ? faq.answerFr : (faq.answerEn || faq.answerFr);
      if (
        !question.toLowerCase().includes(searchLower) &&
        !answer.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    if (selectedCategory && faq.category !== selectedCategory) {
      return false;
    }
    return true;
  });

  const categories = faqs ? Array.from(new Set(faqs.map((f) => f.category))) : [];

  const groupedFaqs = filteredFaqs?.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, Faq[]>);

  const getCategoryLabel = (cat: string) => {
    const labels = categoryLabels[cat];
    if (labels) {
      return language === "fr" ? labels.fr : labels.en;
    }
    return cat;
  };

  const faqSchemaData = filteredFaqs?.map(faq => ({
    question: language === "fr" ? faq.questionFr : (faq.questionEn || faq.questionFr),
    answer: language === "fr" ? faq.answerFr : (faq.answerEn || faq.answerFr)
  })) || [];

  const faqSchema = generateFAQSchema(faqSchemaData);
  const faqBreadcrumb = generateBreadcrumbSchema([
    { name: language === "fr" ? "Accueil" : "Home", url: "/" },
    { name: "FAQ", url: "/faq" }
  ]);

  return (
    <>
      <SEO
        title="FAQ"
        description={language === "fr"
          ? "Trouvez les réponses à vos questions sur nos services SAP, formations, tarifs et processus de consultation."
          : "Find answers to your questions about our SAP services, training, pricing and consultation process."}
        keywords="FAQ, questions fréquentes, SAP, formation, conseil, Dakar, Sénégal"
        url="/faq"
        schema={[faqSchema, faqBreadcrumb]}
        includeOrgSchema={false}
      />
      <div className="min-h-screen">
      <section className="bg-gradient-to-br from-primary via-primary to-dark-blue py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-3xl font-bold text-white md:text-4xl lg:text-5xl" data-testid="text-faq-title">
            {t("faq.title")}
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/80">
            {t("faq.subtitle")}
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
                  placeholder={t("faq.search")}
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
                {t("faq.all")}
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  data-testid={`button-category-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {getCategoryLabel(cat)}
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
                        {getCategoryLabel(category)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        ({categoryFaqs.length} {t("faq.questions")})
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
                            <span className="font-medium">
                              {language === "fr" ? faq.questionFr : (faq.questionEn || faq.questionFr)}
                            </span>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pb-2 pt-1">
                              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {language === "fr" ? faq.answerFr : (faq.answerEn || faq.answerFr)}
                              </p>
                              <div className="mt-4 flex items-center gap-4 border-t pt-4">
                                <span className="text-sm text-muted-foreground">{t("faq.helpful")}</span>
                                <div className="flex gap-2">
                                  <Button variant="ghost" size="sm">
                                    <ThumbsUp className="mr-1 h-4 w-4" />
                                    {t("faq.yes")}
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <ThumbsDown className="mr-1 h-4 w-4" />
                                    {t("faq.no")}
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
                <h3 className="mb-2 text-lg font-semibold">{t("faq.noResults")}</h3>
                <p className="mb-6 max-w-md text-muted-foreground">
                  {t("faq.noResultsDesc")}
                </p>
                <Link href="/agent">
                  <Button className="bg-gold text-gold-foreground">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t("faq.talkToSales")}
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
            {t("faq.cta.title").split(" ").slice(0, -1).join(" ")} <span className="text-gold">{t("faq.cta.title").split(" ").slice(-1)}</span>
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-muted-foreground">
            {t("faq.cta.subtitle")}
          </p>
          <Link href="/agent">
            <Button size="lg" className="bg-gold text-gold-foreground" data-testid="button-cta-faq">
              <MessageCircle className="mr-2 h-5 w-5" />
              {t("faq.cta.button")}
            </Button>
          </Link>
        </div>
      </section>
      </div>
    </>
  );
}
