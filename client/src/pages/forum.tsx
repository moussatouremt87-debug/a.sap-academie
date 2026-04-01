import { useState } from "react";
import { Link } from "wouter";
import {
  MessageSquare,
  ThumbsUp,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Filter,
  ChevronRight,
  User,
  MessageCircle,
  ArrowUp,
  Send,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ────────────────────── types ────────────────────────────── */
interface ForumThread {
  id: number;
  title: string;
  body: string;
  author: string;
  authorLevel: number;
  courseId: number;
  courseModule: string;
  createdAt: string;
  replyCount: number;
  voteCount: number;
  isResolved: boolean;
  tags: string[];
  lastReplyAt: string;
}

interface ForumReply {
  id: number;
  body: string;
  author: string;
  authorLevel: number;
  createdAt: string;
  voteCount: number;
  isAccepted: boolean;
}

/* ────────────────────── mock data ────────────────────────── */
const MOCK_THREADS: ForumThread[] = [
  {
    id: 1,
    title: "Différence entre FB01 et FB50 pour les écritures comptables ?",
    body: "Bonjour, je ne comprends pas bien la différence entre ces deux transactions. Quand utiliser l'une plutôt que l'autre ?",
    author: "Aminata D.",
    authorLevel: 12,
    courseId: 1,
    courseModule: "SAP FI/CO",
    createdAt: "2026-03-31T10:30:00",
    replyCount: 4,
    voteCount: 12,
    isResolved: true,
    tags: ["FI-GL", "Transactions"],
    lastReplyAt: "2026-03-31T14:20:00",
  },
  {
    id: 2,
    title: "Comment configurer les centres de profit dans CO ?",
    body: "J'essaie de créer un centre de profit mais je n'arrive pas à trouver la bonne transaction. Est-ce KE51 ou KE52 ?",
    author: "Ousmane K.",
    authorLevel: 11,
    courseId: 1,
    courseModule: "SAP FI/CO",
    createdAt: "2026-03-30T16:00:00",
    replyCount: 2,
    voteCount: 8,
    isResolved: false,
    tags: ["CO", "Configuration"],
    lastReplyAt: "2026-03-31T09:15:00",
  },
  {
    id: 3,
    title: "Problème de stock négatif dans MM",
    body: "Lors d'un mouvement de marchandise, j'obtiens un message d'erreur de stock négatif. Comment gérer ça ?",
    author: "Fatou S.",
    authorLevel: 7,
    courseId: 2,
    courseModule: "SAP MM",
    createdAt: "2026-03-29T08:45:00",
    replyCount: 6,
    voteCount: 15,
    isResolved: true,
    tags: ["MM", "Stock", "Erreur"],
    lastReplyAt: "2026-03-30T11:30:00",
  },
  {
    id: 4,
    title: "Workflow d'approbation des commandes d'achat",
    body: "Comment mettre en place un workflow d'approbation pour les commandes au-dessus de 5000€ dans SAP MM ?",
    author: "Ibrahim T.",
    authorLevel: 6,
    courseId: 2,
    courseModule: "SAP MM",
    createdAt: "2026-03-28T14:00:00",
    replyCount: 3,
    voteCount: 10,
    isResolved: false,
    tags: ["MM", "Workflow", "ME21N"],
    lastReplyAt: "2026-03-29T16:45:00",
  },
  {
    id: 5,
    title: "Création d'une commande client avec référence devis",
    body: "Est-il possible de créer une commande client VA01 en reprenant automatiquement les données d'un devis VA21 ?",
    author: "Moussa T.",
    authorLevel: 8,
    courseId: 3,
    courseModule: "SAP SD",
    createdAt: "2026-03-31T11:00:00",
    replyCount: 1,
    voteCount: 5,
    isResolved: false,
    tags: ["SD", "VA01", "Devis"],
    lastReplyAt: "2026-03-31T13:00:00",
  },
];

const MOCK_REPLIES: ForumReply[] = [
  {
    id: 1,
    body: "FB01 est la transaction classique qui permet de saisir des écritures avec tous les détails (en-tête + postes séparément). FB50 est la version 'Enjoy' qui propose une interface simplifiée avec tous les champs sur un seul écran. Pour les débutants, FB50 est plus accessible !",
    author: "Ousmane K.",
    authorLevel: 11,
    createdAt: "2026-03-31T11:00:00",
    voteCount: 8,
    isAccepted: true,
  },
  {
    id: 2,
    body: "Pour compléter la réponse d'Ousmane : FB01 offre plus de contrôle sur les données d'en-tête et permet de saisir des documents multi-devises plus facilement. En production, beaucoup d'entreprises utilisent les deux selon le contexte.",
    author: "Aminata D.",
    authorLevel: 12,
    createdAt: "2026-03-31T12:30:00",
    voteCount: 5,
    isAccepted: false,
  },
  {
    id: 3,
    body: "Merci pour ces explications ! C'est beaucoup plus clair maintenant. Je vais utiliser FB50 pour mes exercices.",
    author: "Fatou S.",
    authorLevel: 7,
    createdAt: "2026-03-31T13:00:00",
    voteCount: 2,
    isAccepted: false,
  },
  {
    id: 4,
    body: "N'oubliez pas aussi la transaction F-02 qui est un raccourci pour FB01 avec le type de document pré-rempli !",
    author: "Ibrahim T.",
    authorLevel: 6,
    createdAt: "2026-03-31T14:20:00",
    voteCount: 3,
    isAccepted: false,
  },
];

/* ────────────────────── helpers ──────────────────────────── */
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `il y a ${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `il y a ${days}j`;
}

function getModuleBadgeStyle(mod: string) {
  if (mod.includes("FI")) return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  if (mod.includes("MM")) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  if (mod.includes("SD")) return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
  return "bg-gray-100 text-gray-700";
}

/* ────────────────── thread card ───────────────────────────── */
function ThreadCard({
  thread,
  onClick,
}: {
  thread: ForumThread;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-all cursor-pointer"
    >
      {/* Vote column */}
      <div className="flex flex-col items-center gap-1 min-w-[48px]">
        <ArrowUp className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-bold">{thread.voteCount}</span>
        <span className="text-[10px] text-muted-foreground">votes</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          {thread.isResolved && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
          )}
          <h3 className="font-semibold text-sm">{thread.title}</h3>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
          {thread.body}
        </p>

        <div className="flex items-center gap-3 flex-wrap">
          <Badge
            variant="secondary"
            className={`text-[10px] ${getModuleBadgeStyle(thread.courseModule)}`}
          >
            {thread.courseModule}
          </Badge>
          {thread.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="outline" className="text-[10px]">
              {tag}
            </Badge>
          ))}
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <MessageCircle className="w-3 h-3" />
            {thread.replyCount}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <User className="w-3 h-3" />
            {thread.author}
          </span>
          <span className="text-xs text-muted-foreground">
            {timeAgo(thread.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ────────────────── thread detail ─────────────────────────── */
function ThreadDetail({
  thread,
  replies,
  onBack,
}: {
  thread: ForumThread;
  replies: ForumReply[];
  onBack: () => void;
}) {
  const [newReply, setNewReply] = useState("");

  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-4 gap-1">
        ← Retour au forum
      </Button>

      {/* Thread */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {thread.isResolved && (
              <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Résolu
              </Badge>
            )}
            <Badge
              variant="secondary"
              className={getModuleBadgeStyle(thread.courseModule)}
            >
              {thread.courseModule}
            </Badge>
            {thread.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <h1 className="text-xl font-bold mb-4">{thread.title}</h1>

          <p className="text-muted-foreground leading-relaxed mb-4">
            {thread.body}
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-4">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {thread.author}
              <Badge variant="secondary" className="text-[9px] ml-1">
                Niv. {thread.authorLevel}
              </Badge>
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {timeAgo(thread.createdAt)}
            </span>
            <button className="flex items-center gap-1 hover:text-primary transition-colors">
              <ArrowUp className="w-4 h-4" />
              {thread.voteCount}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Replies */}
      <h2 className="text-lg font-semibold mb-4">
        {replies.length} réponse{replies.length !== 1 ? "s" : ""}
      </h2>

      <div className="space-y-4 mb-6">
        {replies.map((reply) => (
          <Card
            key={reply.id}
            className={
              reply.isAccepted
                ? "border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/20"
                : ""
            }
          >
            <CardContent className="pt-4">
              {reply.isAccepted && (
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 gap-1 mb-3">
                  <CheckCircle2 className="w-3 h-3" />
                  Meilleure réponse
                </Badge>
              )}

              <p className="text-sm leading-relaxed mb-4">{reply.body}</p>

              <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-3">
                <span className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  {reply.author}
                  <Badge variant="secondary" className="text-[9px] ml-1">
                    Niv. {reply.authorLevel}
                  </Badge>
                </span>
                <span>{timeAgo(reply.createdAt)}</span>
                <button className="flex items-center gap-1 hover:text-primary transition-colors ml-auto">
                  <ThumbsUp className="w-3 h-3" />
                  {reply.voteCount}
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New reply */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-sm font-semibold mb-3">Votre réponse</h3>
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Partagez votre expérience ou posez une question complémentaire..."
            className="w-full min-h-[120px] p-3 border rounded-xl bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          />
          <div className="flex justify-end mt-3">
            <Button
              disabled={!newReply.trim()}
              className="gap-2"
            >
              <Send className="w-4 h-4" />
              Publier
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ────────────────── new thread form ──────────────────────── */
function NewThreadForm({ onCancel }: { onCancel: () => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [module, setModule] = useState("SAP FI/CO");

  return (
    <div>
      <Button variant="ghost" onClick={onCancel} className="mb-4 gap-1">
        ← Retour au forum
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Nouvelle question</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Module SAP</label>
            <select
              value={module}
              onChange={(e) => setModule(e.target.value)}
              className="w-full p-2 border rounded-lg bg-background text-sm"
            >
              <option value="SAP FI/CO">SAP FI/CO</option>
              <option value="SAP MM">SAP MM</option>
              <option value="SAP SD">SAP SD</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Titre</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Résumez votre question en une phrase..."
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Détails</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Décrivez votre problème en détail : contexte, transaction utilisée, message d'erreur..."
              className="w-full min-h-[160px] p-3 border rounded-xl bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onCancel}>
              Annuler
            </Button>
            <Button disabled={!title.trim() || !body.trim()} className="gap-2">
              <Send className="w-4 h-4" />
              Publier la question
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   FORUM PAGE
   ════════════════════════════════════════════════════════════ */
export default function ForumPage() {
  const [threads] = useState(MOCK_THREADS);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [viewing, setViewing] = useState<ForumThread | null>(null);
  const [creating, setCreating] = useState(false);

  const modules = ["all", "SAP FI/CO", "SAP MM", "SAP SD"];

  const filtered = threads.filter((t) => {
    const matchesSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    const matchesModule =
      moduleFilter === "all" || t.courseModule === moduleFilter;
    return matchesSearch && matchesModule;
  });

  // Detail view
  if (viewing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <ThreadDetail
            thread={viewing}
            replies={MOCK_REPLIES}
            onBack={() => setViewing(null)}
          />
        </div>
      </div>
    );
  }

  // New thread
  if (creating) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <NewThreadForm onCancel={() => setCreating(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-primary" />
              Forum Q&A
            </h1>
            <p className="text-muted-foreground mt-1">
              Posez vos questions et aidez la communauté SAP
            </p>
          </div>
          <Button onClick={() => setCreating(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle question
          </Button>
        </div>

        {/* Search + filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une question..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {modules.map((mod) => (
              <Button
                key={mod}
                variant={moduleFilter === mod ? "default" : "outline"}
                size="sm"
                onClick={() => setModuleFilter(mod)}
              >
                {mod === "all" ? "Tous" : mod.replace("SAP ", "")}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold">{threads.length}</p>
              <p className="text-xs text-muted-foreground">Questions</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">
                {threads.filter((t) => t.isResolved).length}
              </p>
              <p className="text-xs text-muted-foreground">Résolues</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 text-center">
              <p className="text-2xl font-bold">
                {threads.reduce((acc, t) => acc + t.replyCount, 0)}
              </p>
              <p className="text-xs text-muted-foreground">Réponses</p>
            </CardContent>
          </Card>
        </div>

        {/* Thread list */}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-40" />
              <p className="text-lg font-semibold mb-2">Aucun résultat</p>
              <p className="text-muted-foreground">
                Essayez d'autres mots-clés ou posez votre question.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filtered.map((thread) => (
              <ThreadCard
                key={thread.id}
                thread={thread}
                onClick={() => setViewing(thread)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
