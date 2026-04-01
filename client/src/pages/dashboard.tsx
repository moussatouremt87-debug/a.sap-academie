import { useState, useEffect } from "react";
import { Link } from "wouter";
import {
  BookOpen,
  Trophy,
  Flame,
  Star,
  Clock,
  ChevronRight,
  Play,
  CheckCircle2,
  BarChart3,
  Target,
  Zap,
  Award,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ────────────────────────── types ────────────────────────── */
interface EnrolledCourse {
  id: number;
  title: string;
  module: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  lastLessonId: number | null;
  lastLessonTitle: string | null;
  thumbnail?: string;
}

interface BadgeInfo {
  id: number;
  name: string;
  description: string;
  icon: string;
  earnedAt: string | null;
}

interface XpEvent {
  id: number;
  type: string;
  points: number;
  description: string;
  createdAt: string;
}

interface DashboardData {
  user: {
    name: string;
    xp: number;
    level: number;
    streak: number;
    rank: number;
    totalUsers: number;
  };
  enrolledCourses: EnrolledCourse[];
  recentBadges: BadgeInfo[];
  recentXpEvents: XpEvent[];
  stats: {
    coursesCompleted: number;
    quizzesPassed: number;
    certificatesEarned: number;
    totalHours: number;
  };
}

/* ────────────────────── mock data ────────────────────────── */
const MOCK_DASHBOARD: DashboardData = {
  user: {
    name: "Moussa",
    xp: 2450,
    level: 8,
    streak: 12,
    rank: 3,
    totalUsers: 147,
  },
  enrolledCourses: [
    {
      id: 1,
      title: "SAP FI/CO – Finance & Contrôle de gestion",
      module: "SAP FI/CO",
      progress: 68,
      totalLessons: 24,
      completedLessons: 16,
      lastLessonId: 17,
      lastLessonTitle: "Centres de coûts et allocation",
    },
    {
      id: 2,
      title: "SAP MM – Gestion des achats et stocks",
      module: "SAP MM",
      progress: 35,
      totalLessons: 20,
      completedLessons: 7,
      lastLessonId: 8,
      lastLessonTitle: "Fiche article et catégories",
    },
    {
      id: 3,
      title: "SAP SD – Administration des ventes",
      module: "SAP SD",
      progress: 10,
      totalLessons: 22,
      completedLessons: 2,
      lastLessonId: 3,
      lastLessonTitle: "Structure organisationnelle SD",
    },
  ],
  recentBadges: [
    {
      id: 1,
      name: "Premier Pas",
      description: "Terminer votre première leçon",
      icon: "🎯",
      earnedAt: "2026-03-28",
    },
    {
      id: 2,
      name: "Quiz Master",
      description: "Obtenir 100% à un quiz",
      icon: "🏆",
      earnedAt: "2026-03-30",
    },
    {
      id: 3,
      name: "Flamme 7j",
      description: "7 jours consécutifs d'apprentissage",
      icon: "🔥",
      earnedAt: "2026-03-31",
    },
    {
      id: 4,
      name: "Expert FI",
      description: "Compléter le module Finance",
      icon: "💎",
      earnedAt: null,
    },
    {
      id: 5,
      name: "Certifié SAP",
      description: "Obtenir votre premier certificat",
      icon: "🎓",
      earnedAt: null,
    },
  ],
  recentXpEvents: [
    { id: 1, type: "lesson_complete", points: 50, description: "Leçon terminée : Centres de coûts", createdAt: "2026-03-31T14:30:00" },
    { id: 2, type: "quiz_pass", points: 100, description: "Quiz réussi : Module Comptabilité", createdAt: "2026-03-30T16:00:00" },
    { id: 3, type: "streak_bonus", points: 25, description: "Bonus streak 7 jours", createdAt: "2026-03-31T09:00:00" },
    { id: 4, type: "lesson_complete", points: 50, description: "Leçon terminée : Plan comptable", createdAt: "2026-03-29T11:20:00" },
    { id: 5, type: "badge_earned", points: 150, description: "Badge obtenu : Quiz Master", createdAt: "2026-03-30T16:00:00" },
  ],
  stats: {
    coursesCompleted: 0,
    quizzesPassed: 4,
    certificatesEarned: 0,
    totalHours: 18,
  },
};

/* ────────────────────── helpers ──────────────────────────── */
function xpForLevel(level: number) {
  return level * 500;
}

function getModuleColor(mod: string) {
  if (mod.includes("FI")) return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
  if (mod.includes("MM")) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  if (mod.includes("SD")) return "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300";
  return "bg-gray-100 text-gray-700";
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "À l'instant";
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

/* ────────────────── stat card ────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent: string;
}) {
  return (
    <Card className="relative overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
          </div>
          <div className={`p-3 rounded-xl ${accent}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ────────────────── course row ───────────────────────────── */
function CourseRow({ course }: { course: EnrolledCourse }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow">
      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getModuleColor(course.module)}`}
      >
        <BookOpen className="w-5 h-5" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-sm truncate">{course.title}</h3>
          <Badge variant="secondary" className="text-[10px] flex-shrink-0">
            {course.module}
          </Badge>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <Progress value={course.progress} className="h-2 flex-1" />
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {course.completedLessons}/{course.totalLessons} leçons
          </span>
        </div>

        {/* Last lesson */}
        {course.lastLessonTitle && (
          <p className="text-xs text-muted-foreground mt-1 truncate">
            Prochain : {course.lastLessonTitle}
          </p>
        )}
      </div>

      {/* CTA */}
      <Link href={`/courses/${course.id}/learn/${course.lastLessonId ?? 1}`}>
        <Button size="sm" className="flex-shrink-0 gap-1">
          <Play className="w-3 h-3" />
          Continuer
        </Button>
      </Link>
    </div>
  );
}

/* ────────────────── xp event row ─────────────────────────── */
function XpRow({ event }: { event: XpEvent }) {
  const iconMap: Record<string, React.ElementType> = {
    lesson_complete: CheckCircle2,
    quiz_pass: Trophy,
    streak_bonus: Flame,
    badge_earned: Award,
  };
  const Icon = iconMap[event.type] ?? Zap;

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{event.description}</p>
        <p className="text-xs text-muted-foreground">{timeAgo(event.createdAt)}</p>
      </div>
      <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">
        +{event.points} XP
      </span>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   DASHBOARD PAGE
   ════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: replace with real API call: GET /api/elearning/dashboard
    const timer = setTimeout(() => {
      setData(MOCK_DASHBOARD);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    );
  }

  const { user, enrolledCourses, recentBadges, recentXpEvents, stats } = data;
  const xpInLevel = user.xp % xpForLevel(user.level);
  const xpNeeded = xpForLevel(user.level);
  const xpPercent = Math.round((xpInLevel / xpNeeded) * 100);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* ── Header ────────────────────────── */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">
                Bonjour, {user.name} 👋
              </h1>
              <p className="text-muted-foreground mt-1">
                Continuez votre apprentissage SAP — chaque jour compte !
              </p>
            </div>

            {/* Streak badge */}
            <div className="flex items-center gap-2 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
              <Flame className="w-5 h-5" />
              <span className="font-bold">{user.streak} jours</span>
              <span className="text-sm">de suite</span>
            </div>
          </div>

          {/* ── Stat cards ────────────────────── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              icon={Zap}
              label="XP Total"
              value={user.xp.toLocaleString("fr-FR")}
              accent="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"
            />
            <StatCard
              icon={BarChart3}
              label="Classement"
              value={`#${user.rank} / ${user.totalUsers}`}
              accent="bg-blue-100 dark:bg-blue-900/30 text-blue-600"
            />
            <StatCard
              icon={Trophy}
              label="Quiz réussis"
              value={stats.quizzesPassed}
              accent="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
            />
            <StatCard
              icon={Clock}
              label="Heures d'étude"
              value={`${stats.totalHours}h`}
              accent="bg-purple-100 dark:bg-purple-900/30 text-purple-600"
            />
          </div>

          {/* ── XP Level bar ──────────────────── */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">Niveau {user.level}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {xpInLevel} / {xpNeeded} XP
                </span>
              </div>
              <Progress value={xpPercent} className="h-3" />
              <p className="text-xs text-muted-foreground mt-2">
                Encore {xpNeeded - xpInLevel} XP pour atteindre le niveau {user.level + 1}
              </p>
            </CardContent>
          </Card>

          {/* ── Main grid ─────────────────────── */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Courses */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Mes formations</h2>
                <Link href="/courses">
                  <Button variant="ghost" size="sm" className="gap-1">
                    Catalogue
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              {enrolledCourses.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-semibold mb-2">
                      Aucune formation en cours
                    </p>
                    <p className="text-muted-foreground mb-4">
                      Explorez notre catalogue et commencez votre première
                      formation SAP.
                    </p>
                    <Link href="/courses">
                      <Button>Voir le catalogue</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {enrolledCourses.map((c) => (
                    <CourseRow key={c.id} course={c} />
                  ))}
                </div>
              )}
            </div>

            {/* Right: Sidebar */}
            <div className="space-y-6">
              {/* Badges */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Badges
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-2">
                    {recentBadges.map((b) => (
                      <div
                        key={b.id}
                        className={`relative flex flex-col items-center gap-1 p-2 rounded-lg text-center transition-all ${
                          b.earnedAt
                            ? "bg-yellow-50 dark:bg-yellow-900/20"
                            : "bg-gray-100 dark:bg-gray-800 opacity-40 grayscale"
                        }`}
                        title={b.earnedAt ? `${b.name} — ${b.description}` : `🔒 ${b.name}`}
                      >
                        <span className="text-2xl">{b.icon}</span>
                        <span className="text-[9px] leading-tight font-medium truncate w-full">
                          {b.name}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Link href="/leaderboard">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-3 text-xs gap-1"
                    >
                      Tous les badges
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* XP Activity */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Activité XP récente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="divide-y">
                    {recentXpEvents.map((e) => (
                      <XpRow key={e.id} event={e} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Actions rapides
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Link href="/leaderboard">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <Trophy className="w-4 h-4" />
                      Voir le classement
                    </Button>
                  </Link>
                  <Link href="/forum">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <BookOpen className="w-4 h-4" />
                      Forum Q&A
                    </Button>
                  </Link>
                  <Link href="/certificates">
                    <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                      <Award className="w-4 h-4" />
                      Mes certificats
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
