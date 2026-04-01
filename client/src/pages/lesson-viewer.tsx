import { useState, useEffect, useRef } from "react";
import { useParams, Link, useLocation } from "wouter";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Play,
  FileText,
  Clock,
  BookOpen,
  Menu,
  X,
  ChevronDown,
  Lock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

/* ────────────────────── types ────────────────────────────── */
interface Lesson {
  id: number;
  title: string;
  type: "video" | "text" | "exercise";
  duration: number; // minutes
  completed: boolean;
  locked: boolean;
  videoUrl?: string;
  content?: string;
}

interface Module {
  id: number;
  title: string;
  lessons: Lesson[];
}

interface CourseStructure {
  id: number;
  title: string;
  modules: Module[];
  progress: number;
}

/* ────────────────────── mock data ────────────────────────── */
const MOCK_COURSE: CourseStructure = {
  id: 1,
  title: "SAP FI/CO – Finance & Contrôle de gestion",
  progress: 68,
  modules: [
    {
      id: 1,
      title: "Introduction à SAP ERP",
      lessons: [
        { id: 1, title: "Qu'est-ce que SAP ?", type: "video", duration: 12, completed: true, locked: false, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
        { id: 2, title: "Architecture SAP", type: "text", duration: 8, completed: true, locked: false },
        { id: 3, title: "Navigation dans SAP GUI", type: "video", duration: 15, completed: true, locked: false },
      ],
    },
    {
      id: 2,
      title: "Comptabilité Générale (FI-GL)",
      lessons: [
        { id: 4, title: "Plan comptable et structure", type: "video", duration: 20, completed: true, locked: false },
        { id: 5, title: "Écritures comptables", type: "text", duration: 15, completed: true, locked: false },
        { id: 6, title: "Exercice : Créer une écriture", type: "exercise", duration: 25, completed: false, locked: false },
        { id: 7, title: "Clôture de période", type: "video", duration: 18, completed: false, locked: false },
      ],
    },
    {
      id: 3,
      title: "Comptabilité Fournisseurs (FI-AP)",
      lessons: [
        { id: 8, title: "Fiche fournisseur", type: "video", duration: 14, completed: false, locked: false },
        { id: 9, title: "Factures fournisseurs", type: "text", duration: 12, completed: false, locked: true },
        { id: 10, title: "Paiements et compensation", type: "video", duration: 20, completed: false, locked: true },
      ],
    },
    {
      id: 4,
      title: "Contrôle de gestion (CO)",
      lessons: [
        { id: 11, title: "Centres de coûts", type: "video", duration: 22, completed: false, locked: true },
        { id: 12, title: "Ordres internes", type: "text", duration: 15, completed: false, locked: true },
        { id: 13, title: "Analyse de rentabilité", type: "video", duration: 18, completed: false, locked: true },
        { id: 14, title: "Quiz final", type: "exercise", duration: 30, completed: false, locked: true },
      ],
    },
  ],
};

const LESSON_CONTENT = `
# Centres de coûts et allocation

Les **centres de coûts** sont un élément fondamental du module CO (Contrôle de gestion) dans SAP.

## Objectifs de cette leçon

- Comprendre le concept de centre de coûts dans SAP CO
- Savoir créer et gérer un centre de coûts
- Maîtriser les principes d'allocation des coûts

## Qu'est-ce qu'un centre de coûts ?

Un centre de coûts représente une **unité organisationnelle** au sein de l'entreprise qui génère des coûts. Il permet de collecter, suivre et analyser les dépenses par département ou fonction.

### Exemples de centres de coûts
- **Administration** : frais généraux, RH, juridique
- **Production** : atelier, chaîne de montage
- **Commercial** : marketing, ventes
- **IT** : infrastructure, développement

## Création dans SAP (transaction KS01)

Pour créer un centre de coûts dans SAP :

1. Accédez à la transaction **KS01**
2. Saisissez le périmètre analytique
3. Renseignez les champs obligatoires :
   - Nom du centre de coûts
   - Description
   - Responsable
   - Type de centre de coûts (H, K, F, V...)
   - Hiérarchie
4. Sauvegardez

## Allocation des coûts

L'allocation permet de répartir les coûts d'un centre vers d'autres centres ou objets de coûts.

### Types d'allocation
| Type | Transaction | Description |
|------|------------|-------------|
| Répartition | KSV5 | Ventile les coûts primaires et secondaires |
| Imputation | KSU5 | Ventile uniquement les coûts primaires |

## À retenir

> Les centres de coûts sont essentiels pour le suivi budgétaire et l'analyse des écarts dans SAP CO.

---

*Prochaine leçon : Ordres internes et leur utilisation dans le contrôle de gestion.*
`;

/* ────────────────────── helpers ──────────────────────────── */
function allLessons(course: CourseStructure): Lesson[] {
  return course.modules.flatMap((m) => m.lessons);
}

function getLessonIcon(type: string) {
  switch (type) {
    case "video": return Play;
    case "exercise": return FileText;
    default: return BookOpen;
  }
}

/* ────────────────── sidebar module ───────────────────────── */
function SidebarModule({
  module,
  currentLessonId,
  onSelect,
}: {
  module: Module;
  currentLessonId: number;
  onSelect: (id: number) => void;
}) {
  const [open, setOpen] = useState(
    module.lessons.some((l) => l.id === currentLessonId)
  );
  const completedCount = module.lessons.filter((l) => l.completed).length;

  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 hover:bg-muted/50 transition-colors text-left"
      >
        <ChevronDown
          className={`w-4 h-4 flex-shrink-0 transition-transform ${open ? "" : "-rotate-90"}`}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{module.title}</p>
          <p className="text-xs text-muted-foreground">
            {completedCount}/{module.lessons.length} terminées
          </p>
        </div>
      </button>

      {open && (
        <div className="pb-2">
          {module.lessons.map((lesson) => {
            const Icon = getLessonIcon(lesson.type);
            const isCurrent = lesson.id === currentLessonId;

            return (
              <button
                key={lesson.id}
                onClick={() => !lesson.locked && onSelect(lesson.id)}
                disabled={lesson.locked}
                className={`w-full flex items-center gap-3 px-6 py-2 text-left transition-colors ${
                  isCurrent
                    ? "bg-primary/10 text-primary border-l-2 border-primary"
                    : lesson.locked
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-muted/50"
                }`}
              >
                {lesson.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : lesson.locked ? (
                  <Lock className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{lesson.title}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
                  <Icon className="w-3 h-3" />
                  <span>{lesson.duration}m</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ────────────────── markdown renderer (simple) ───────────── */
function MarkdownContent({ content }: { content: string }) {
  // Simple markdown-to-HTML (in production use react-markdown)
  const html = content
    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-6 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-bold mt-8 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary/50 pl-4 py-2 my-4 bg-muted/30 rounded-r-lg italic">$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^\d+\. (.+)$/gm, '<li class="ml-4 list-decimal">$1</li>')
    .replace(/^---$/gm, '<hr class="my-6 border-border" />')
    .replace(/\n\n/g, '<br class="my-2" />');

  return (
    <div
      className="prose prose-sm dark:prose-invert max-w-none leading-relaxed"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/* ════════════════════════════════════════════════════════════
   LESSON VIEWER PAGE
   ════════════════════════════════════════════════════════════ */
export default function LessonViewerPage() {
  const params = useParams<{ id: string; lessonId: string }>();
  const [, navigate] = useLocation();
  const courseId = Number(params.id);
  const lessonId = Number(params.lessonId);

  const [course] = useState<CourseStructure>(MOCK_COURSE);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completing, setCompleting] = useState(false);

  const lessons = allLessons(course);
  const currentIndex = lessons.findIndex((l) => l.id === lessonId);
  const currentLesson = lessons[currentIndex];
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  const handleSelectLesson = (id: number) => {
    navigate(`/courses/${courseId}/learn/${id}`);
    setSidebarOpen(false);
  };

  const handleComplete = () => {
    setCompleting(true);
    // TODO: POST /api/elearning/progress
    setTimeout(() => {
      setCompleting(false);
      if (nextLesson && !nextLesson.locked) {
        navigate(`/courses/${courseId}/learn/${nextLesson.id}`);
      }
    }, 800);
  };

  if (!currentLesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-lg font-semibold mb-2">Leçon introuvable</p>
            <Link href={`/courses/${courseId}`}>
              <Button>Retour au cours</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Top bar ───────────────────────── */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <div className="flex items-center gap-3 px-4 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          <Link href={`/courses/${courseId}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">{course.title}</span>
              <span className="sm:hidden">Retour</span>
            </Button>
          </Link>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {currentIndex + 1} / {lessons.length}
            </span>
            <Progress value={course.progress} className="w-24 h-2" />
            <span className="text-xs font-medium">{course.progress}%</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── Sidebar ─────────────────────── */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-30 w-80 bg-background border-r overflow-y-auto transition-transform lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          style={{ top: "57px" }}
        >
          <div className="p-4 border-b">
            <h2 className="font-semibold text-sm">{course.title}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Progress value={course.progress} className="h-2 flex-1" />
              <span className="text-xs text-muted-foreground">{course.progress}%</span>
            </div>
          </div>

          {course.modules.map((m) => (
            <SidebarModule
              key={m.id}
              module={m}
              currentLessonId={lessonId}
              onSelect={handleSelectLesson}
            />
          ))}
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── Main content ────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            {/* Lesson header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="capitalize">
                  {currentLesson.type === "video"
                    ? "Vidéo"
                    : currentLesson.type === "exercise"
                    ? "Exercice"
                    : "Lecture"}
                </Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {currentLesson.duration} min
                </span>
              </div>
              <h1 className="text-2xl font-bold">{currentLesson.title}</h1>
            </div>

            {/* Video player */}
            {currentLesson.type === "video" && (
              <div className="aspect-video bg-black rounded-xl overflow-hidden mb-8 shadow-lg">
                <div className="w-full h-full flex items-center justify-center text-white/60">
                  <div className="text-center">
                    <Play className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Lecteur vidéo SAP</p>
                    <p className="text-sm opacity-50 mt-1">
                      La vidéo se chargera ici via l'API
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Text content */}
            <Card className="mb-8">
              <CardContent className="pt-6">
                <MarkdownContent content={LESSON_CONTENT} />
              </CardContent>
            </Card>

            {/* Mark complete + navigation */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pb-8">
              {!currentLesson.completed && (
                <Button
                  onClick={handleComplete}
                  disabled={completing}
                  className="w-full sm:w-auto gap-2"
                  size="lg"
                >
                  {completing ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  {completing ? "En cours..." : "Marquer comme terminée"}
                </Button>
              )}

              <div className="flex-1" />

              <div className="flex gap-2">
                {prevLesson && (
                  <Link href={`/courses/${courseId}/learn/${prevLesson.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      <ChevronLeft className="w-4 h-4" />
                      Précédente
                    </Button>
                  </Link>
                )}
                {nextLesson && !nextLesson.locked && (
                  <Link href={`/courses/${courseId}/learn/${nextLesson.id}`}>
                    <Button variant="outline" size="sm" className="gap-1">
                      Suivante
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
