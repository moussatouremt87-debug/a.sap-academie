import { useState } from "react";
import { Link } from "wouter";
import { Search, Clock, User, Tag, ArrowRight, TrendingUp, BookOpen, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LeadBanner } from "@/components/lead-capture-popup";

// ── Types ──────────────────────────────────────────────
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  category: BlogCategory;
  tags: string[];
  image: string;
  featured: boolean;
  slug: string;
}

type BlogCategory = "carrieres" | "tutoriels" | "actualites" | "conseils" | "temoignages";

const CATEGORY_CONFIG: Record<BlogCategory, { label: string; color: string; icon: typeof TrendingUp }> = {
  carrieres: { label: "Carrières SAP", color: "bg-blue-100 text-blue-700", icon: TrendingUp },
  tutoriels: { label: "Tutoriels", color: "bg-purple-100 text-purple-700", icon: BookOpen },
  actualites: { label: "Actualités", color: "bg-orange-100 text-orange-700", icon: Calendar },
  conseils: { label: "Conseils", color: "bg-green-100 text-green-700", icon: Tag },
  temoignages: { label: "Témoignages", color: "bg-pink-100 text-pink-700", icon: User },
};

// ── Données Blog ───────────────────────────────────────
const BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Comment devenir consultant SAP en Afrique de l'Ouest : Guide complet 2026",
    excerpt: "Le marché SAP en Afrique de l'Ouest explose. Découvrez les étapes clés pour lancer votre carrière de consultant SAP, les certifications nécessaires et les salaires attendus au Sénégal, en Côte d'Ivoire et au Mali.",
    content: "",
    author: "Moussa Touré",
    authorRole: "Fondateur A.SAP Académie",
    date: "2026-03-28",
    readTime: "8 min",
    category: "carrieres",
    tags: ["carrière", "consultant SAP", "Afrique de l'Ouest", "salaires"],
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
    featured: true,
    slug: "devenir-consultant-sap-afrique-ouest",
  },
  {
    id: "2",
    title: "Les 10 transactions SAP FI que tout comptable doit connaître",
    excerpt: "FB50, F-02, FBL1N... Maîtriser ces transactions SAP Finance est indispensable. Voici un guide pratique avec des exemples concrets adaptés au contexte OHADA.",
    content: "",
    author: "Aminata Diallo",
    authorRole: "Consultante SAP FI Senior",
    date: "2026-03-22",
    readTime: "12 min",
    category: "tutoriels",
    tags: ["SAP FI", "transactions", "comptabilité", "OHADA"],
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
    featured: true,
    slug: "10-transactions-sap-fi-comptable",
  },
  {
    id: "3",
    title: "SAP S/4HANA : Pourquoi l'Afrique doit migrer maintenant",
    excerpt: "Avec la fin du support SAP ECC prévue pour 2027, les entreprises africaines doivent planifier leur migration vers S/4HANA. Enjeux, coûts et opportunités pour le continent.",
    content: "",
    author: "Ibrahim Konaté",
    authorRole: "Architecte SAP Basis",
    date: "2026-03-15",
    readTime: "6 min",
    category: "actualites",
    tags: ["S/4HANA", "migration", "ECC", "entreprises africaines"],
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
    featured: false,
    slug: "sap-s4hana-migration-afrique",
  },
  {
    id: "4",
    title: "Témoignage : De zéro à consultant SAP MM en 6 mois",
    excerpt: "Fatou raconte comment elle est passée d'un poste administratif à consultante SAP MM grâce à la formation A.SAP Académie. Son parcours inspirant depuis Dakar.",
    content: "",
    author: "Fatou Sow",
    authorRole: "Consultante SAP MM",
    date: "2026-03-10",
    readTime: "5 min",
    category: "temoignages",
    tags: ["témoignage", "SAP MM", "reconversion", "Dakar"],
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=400&fit=crop",
    featured: false,
    slug: "temoignage-consultante-sap-mm",
  },
  {
    id: "5",
    title: "5 erreurs à éviter en début de carrière SAP",
    excerpt: "Négliger la documentation, ignorer les processus métier, se concentrer uniquement sur la technique... Voici les pièges classiques et comment les éviter.",
    content: "",
    author: "Moussa Touré",
    authorRole: "Fondateur A.SAP Académie",
    date: "2026-03-05",
    readTime: "7 min",
    category: "conseils",
    tags: ["débutant", "erreurs", "conseils", "carrière"],
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop",
    featured: false,
    slug: "5-erreurs-debut-carriere-sap",
  },
  {
    id: "6",
    title: "Tutoriel : Créer un bon de commande SAP MM (ME21N) pas à pas",
    excerpt: "Guide détaillé pour maîtriser la transaction ME21N. De la sélection du fournisseur à la validation, chaque étape est expliquée avec des captures d'écran.",
    content: "",
    author: "Amadou Bah",
    authorRole: "Formateur SAP MM/SD",
    date: "2026-02-28",
    readTime: "15 min",
    category: "tutoriels",
    tags: ["ME21N", "bon de commande", "SAP MM", "tutoriel"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
    featured: false,
    slug: "tutoriel-bon-commande-me21n",
  },
  {
    id: "7",
    title: "Le marché de l'emploi SAP en Côte d'Ivoire : Analyse 2026",
    excerpt: "Abidjan devient un hub SAP majeur en Afrique francophone. Analyse des tendances, secteurs qui recrutent et niveaux de rémunération.",
    content: "",
    author: "Aminata Diallo",
    authorRole: "Consultante SAP FI Senior",
    date: "2026-02-20",
    readTime: "9 min",
    category: "carrieres",
    tags: ["emploi", "Côte d'Ivoire", "Abidjan", "recrutement"],
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop",
    featured: false,
    slug: "emploi-sap-cote-ivoire-2026",
  },
  {
    id: "8",
    title: "SAP ABAP pour débutants : Par où commencer ?",
    excerpt: "Vous voulez apprendre la programmation ABAP ? Voici un roadmap clair : prérequis, ressources, exercices pratiques et premier programme en 30 minutes.",
    content: "",
    author: "Ibrahim Konaté",
    authorRole: "Architecte SAP Basis",
    date: "2026-02-14",
    readTime: "10 min",
    category: "tutoriels",
    tags: ["ABAP", "programmation", "débutant", "roadmap"],
    image: "https://images.unsplash.com/photo-1515879218367-8466d910auj7?w=800&h=400&fit=crop",
    featured: false,
    slug: "sap-abap-debutants-guide",
  },
];

// ── Composants ─────────────────────────────────────────

function FeaturedPost({ post }: { post: BlogPost }) {
  const cat = CATEGORY_CONFIG[post.category];

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
        <div className="grid md:grid-cols-2 gap-0">
          <div className="relative h-64 md:h-full overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-yellow-400 text-yellow-900 font-semibold">⭐ À la une</Badge>
            </div>
          </div>
          <CardContent className="p-6 md:p-8 flex flex-col justify-center">
            <Badge className={`${cat.color} w-fit mb-3`}>{cat.label}</Badge>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
              {post.title}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5" />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {post.readTime}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
              </span>
            </div>
          </CardContent>
        </div>
      </Card>
    </Link>
  );
}

function PostCard({ post }: { post: BlogPost }) {
  const cat = CATEGORY_CONFIG[post.category];

  return (
    <Link href={`/blog/${post.slug}`}>
      <Card className="group overflow-hidden h-full border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer">
        <div className="relative h-48 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <Badge className={`${cat.color} text-xs`}>{cat.label}</Badge>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readTime}
            </span>
          </div>
          <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="text-xs font-medium text-gray-700">{post.author}</p>
                <p className="text-[10px] text-gray-400">
                  {new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

// ── Page Principale Blog ───────────────────────────────
export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<BlogCategory | "all">("all");

  const featuredPosts = BLOG_POSTS.filter((p) => p.featured);
  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    return matchesSearch && matchesCategory && !post.featured;
  });

  const categories: Array<{ key: BlogCategory | "all"; label: string }> = [
    { key: "all", label: "Tous" },
    { key: "carrieres", label: "Carrières" },
    { key: "tutoriels", label: "Tutoriels" },
    { key: "actualites", label: "Actualités" },
    { key: "conseils", label: "Conseils" },
    { key: "temoignages", label: "Témoignages" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-blue-950 to-indigo-900 text-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 mb-4">
            Blog A.SAP Académie
          </Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight">
            Ressources & Actualités{" "}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              SAP
            </span>
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8 text-lg">
            Articles, tutoriels et analyses pour booster votre carrière SAP en Afrique de l'Ouest
          </p>

          {/* Search */}
          <div className="max-w-lg mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Rechercher un article, tag, sujet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-13 bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl text-base focus:bg-white/15"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Button
              key={cat.key}
              variant={activeCategory === cat.key ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory(cat.key)}
              className="rounded-full"
            >
              {cat.label}
            </Button>
          ))}
        </div>

        {/* Featured Posts */}
        {activeCategory === "all" && searchQuery === "" && (
          <div className="space-y-6 mb-12">
            {featuredPosts.map((post) => (
              <FeaturedPost key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Post Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">Aucun article trouvé</h3>
            <p className="text-gray-400 mt-1">Essayez un autre terme de recherche ou catégorie</p>
          </div>
        )}
      </div>

      {/* Newsletter CTA */}
      <LeadBanner variant="newsletter" />
    </div>
  );
}
