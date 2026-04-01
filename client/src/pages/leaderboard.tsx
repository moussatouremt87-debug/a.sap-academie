import { useState } from "react";
import { Link } from "wouter";
import {
  Trophy,
  Medal,
  Flame,
  Star,
  Zap,
  Award,
  ChevronRight,
  Crown,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

/* ────────────────────── types ────────────────────────────── */
interface LeaderboardUser {
  id: number;
  name: string;
  avatar?: string;
  xp: number;
  level: number;
  streak: number;
  badgeCount: number;
  trend: "up" | "down" | "same";
  isCurrentUser: boolean;
}

interface BadgeDetail {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  earnedAt: string | null;
  rarity: "common" | "rare" | "epic" | "legendary";
}

/* ────────────────────── mock data ────────────────────────── */
const MOCK_LEADERBOARD: LeaderboardUser[] = [
  { id: 1, name: "Aminata Diallo", xp: 4200, level: 12, streak: 30, badgeCount: 8, trend: "same", isCurrentUser: false },
  { id: 2, name: "Ousmane Koné", xp: 3850, level: 11, streak: 22, badgeCount: 7, trend: "up", isCurrentUser: false },
  { id: 3, name: "Moussa Touré", xp: 2450, level: 8, streak: 12, badgeCount: 5, trend: "up", isCurrentUser: true },
  { id: 4, name: "Fatou Sow", xp: 2200, level: 7, streak: 8, badgeCount: 4, trend: "down", isCurrentUser: false },
  { id: 5, name: "Ibrahim Traoré", xp: 1900, level: 6, streak: 5, badgeCount: 3, trend: "up", isCurrentUser: false },
  { id: 6, name: "Aïcha Bah", xp: 1650, level: 5, streak: 15, badgeCount: 4, trend: "same", isCurrentUser: false },
  { id: 7, name: "Mamadou Cissé", xp: 1400, level: 5, streak: 3, badgeCount: 2, trend: "down", isCurrentUser: false },
  { id: 8, name: "Mariam Keïta", xp: 1200, level: 4, streak: 7, badgeCount: 3, trend: "up", isCurrentUser: false },
  { id: 9, name: "Seydou Camara", xp: 950, level: 3, streak: 2, badgeCount: 1, trend: "same", isCurrentUser: false },
  { id: 10, name: "Djénéba Touré", xp: 700, level: 2, streak: 1, badgeCount: 1, trend: "up", isCurrentUser: false },
];

const ALL_BADGES: BadgeDetail[] = [
  { id: 1, name: "Premier Pas", description: "Terminer votre première leçon", icon: "🎯", category: "Progression", earnedAt: "2026-03-15", rarity: "common" },
  { id: 2, name: "Assidu", description: "3 jours consécutifs", icon: "📚", category: "Streak", earnedAt: "2026-03-18", rarity: "common" },
  { id: 3, name: "Quiz Master", description: "Obtenir 100% à un quiz", icon: "🏆", category: "Quiz", earnedAt: "2026-03-30", rarity: "rare" },
  { id: 4, name: "Flamme 7j", description: "7 jours consécutifs", icon: "🔥", category: "Streak", earnedAt: "2026-03-31", rarity: "rare" },
  { id: 5, name: "Explorateur", description: "S'inscrire à 3 formations", icon: "🧭", category: "Progression", earnedAt: "2026-03-20", rarity: "common" },
  { id: 6, name: "Expert FI", description: "Compléter le module Finance", icon: "💎", category: "Certification", earnedAt: null, rarity: "epic" },
  { id: 7, name: "Expert MM", description: "Compléter le module Achats", icon: "💎", category: "Certification", earnedAt: null, rarity: "epic" },
  { id: 8, name: "Expert SD", description: "Compléter le module Ventes", icon: "💎", category: "Certification", earnedAt: null, rarity: "epic" },
  { id: 9, name: "Flamme 30j", description: "30 jours consécutifs", icon: "🌟", category: "Streak", earnedAt: null, rarity: "legendary" },
  { id: 10, name: "Certifié SAP", description: "Obtenir votre premier certificat", icon: "🎓", category: "Certification", earnedAt: null, rarity: "epic" },
  { id: 11, name: "Forum Helper", description: "10 réponses validées au forum", icon: "💬", category: "Communauté", earnedAt: null, rarity: "rare" },
  { id: 12, name: "Triple Expert", description: "Certifié FI + MM + SD", icon: "👑", category: "Certification", earnedAt: null, rarity: "legendary" },
];

/* ────────────────────── helpers ──────────────────────────── */
function getRarityStyle(rarity: string) {
  switch (rarity) {
    case "common": return "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800";
    case "rare": return "border-blue-400 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30";
    case "epic": return "border-purple-400 bg-purple-50 dark:border-purple-500 dark:bg-purple-950/30";
    case "legendary": return "border-yellow-400 bg-yellow-50 dark:border-yellow-500 dark:bg-yellow-950/30";
    default: return "border-gray-300 bg-gray-50";
  }
}

function getRarityLabel(rarity: string) {
  switch (rarity) {
    case "common": return { text: "Commun", class: "bg-gray-200 text-gray-700" };
    case "rare": return { text: "Rare", class: "bg-blue-200 text-blue-700" };
    case "epic": return { text: "Épique", class: "bg-purple-200 text-purple-700" };
    case "legendary": return { text: "Légendaire", class: "bg-yellow-200 text-yellow-800" };
    default: return { text: "", class: "" };
  }
}

/* ────────────────── podium ────────────────────────────────── */
function Podium({ users }: { users: LeaderboardUser[] }) {
  const [first, second, third] = users;
  const podiumOrder = [second, first, third]; // visual order: 2-1-3

  const heights = ["h-24", "h-32", "h-20"];
  const colors = [
    "from-gray-300 to-gray-400", // silver
    "from-yellow-300 to-yellow-500", // gold
    "from-orange-300 to-orange-500", // bronze
  ];
  const iconSizes = ["w-8 h-8", "w-10 h-10", "w-7 h-7"];
  const ranks = [2, 1, 3];

  return (
    <div className="flex items-end justify-center gap-4 py-8">
      {podiumOrder.map((user, i) => (
        <div key={user.id} className="flex flex-col items-center">
          {/* Avatar */}
          <div
            className={`${iconSizes[i]} rounded-full bg-gradient-to-br ${colors[i]} flex items-center justify-center text-white font-bold mb-2 shadow-lg`}
          >
            {ranks[i] === 1 ? (
              <Crown className="w-5 h-5" />
            ) : (
              <span className="text-sm">{user.name.charAt(0)}</span>
            )}
          </div>
          <p className="text-sm font-semibold text-center mb-1 max-w-[100px] truncate">
            {user.name}
          </p>
          <p className="text-xs text-muted-foreground mb-2">
            {user.xp.toLocaleString("fr-FR")} XP
          </p>
          {/* Podium bar */}
          <div
            className={`w-20 ${heights[i]} rounded-t-xl bg-gradient-to-t ${colors[i]} flex items-center justify-center shadow-inner`}
          >
            <span className="text-2xl font-bold text-white/80">
              {ranks[i]}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ────────────────── leaderboard row ──────────────────────── */
function LeaderboardRow({
  user,
  rank,
}: {
  user: LeaderboardUser;
  rank: number;
}) {
  const TrendIcon =
    user.trend === "up"
      ? TrendingUp
      : user.trend === "down"
      ? TrendingDown
      : Minus;

  const trendColor =
    user.trend === "up"
      ? "text-emerald-500"
      : user.trend === "down"
      ? "text-red-500"
      : "text-gray-400";

  return (
    <div
      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
        user.isCurrentUser
          ? "bg-primary/5 border-2 border-primary/20"
          : "hover:bg-muted/50"
      }`}
    >
      {/* Rank */}
      <div className="w-8 text-center">
        {rank <= 3 ? (
          <Medal
            className={`w-6 h-6 mx-auto ${
              rank === 1
                ? "text-yellow-500"
                : rank === 2
                ? "text-gray-400"
                : "text-orange-500"
            }`}
          />
        ) : (
          <span className="text-lg font-bold text-muted-foreground">
            {rank}
          </span>
        )}
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm flex-shrink-0">
        {user.name.charAt(0)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm truncate">
            {user.name}
            {user.isCurrentUser && (
              <span className="text-primary ml-1">(vous)</span>
            )}
          </span>
          <Badge variant="secondary" className="text-[10px]">
            Niv. {user.level}
          </Badge>
        </div>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Flame className="w-3 h-3 text-orange-500" />
            {user.streak}j
          </span>
          <span className="flex items-center gap-1">
            <Award className="w-3 h-3 text-yellow-500" />
            {user.badgeCount}
          </span>
        </div>
      </div>

      {/* XP + trend */}
      <div className="text-right flex-shrink-0">
        <p className="font-bold text-sm">
          {user.xp.toLocaleString("fr-FR")} XP
        </p>
        <TrendIcon className={`w-4 h-4 ml-auto ${trendColor}`} />
      </div>
    </div>
  );
}

/* ────────────────── badge grid ───────────────────────────── */
function BadgeGrid({ badges }: { badges: BadgeDetail[] }) {
  const [filter, setFilter] = useState<string>("all");
  const categories = ["all", ...new Set(badges.map((b) => b.category))];

  const filtered =
    filter === "all" ? badges : badges.filter((b) => b.category === filter);

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(cat)}
          >
            {cat === "all" ? "Tous" : cat}
          </Button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((badge) => {
          const earned = !!badge.earnedAt;
          const rarityLabel = getRarityLabel(badge.rarity);

          return (
            <div
              key={badge.id}
              className={`relative p-4 rounded-xl border-2 text-center transition-all ${
                earned
                  ? getRarityStyle(badge.rarity)
                  : "border-dashed border-gray-300 dark:border-gray-600 bg-muted/30 opacity-50 grayscale"
              }`}
            >
              {/* Rarity tag */}
              {earned && (
                <span
                  className={`absolute top-2 right-2 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${rarityLabel.class}`}
                >
                  {rarityLabel.text}
                </span>
              )}

              <span className="text-3xl block mb-2">{badge.icon}</span>
              <p className="text-sm font-semibold mb-1">{badge.name}</p>
              <p className="text-xs text-muted-foreground">
                {badge.description}
              </p>

              {earned && badge.earnedAt && (
                <p className="text-[10px] text-muted-foreground mt-2">
                  Obtenu le{" "}
                  {new Date(badge.earnedAt).toLocaleDateString("fr-FR")}
                </p>
              )}
              {!earned && (
                <p className="text-[10px] text-muted-foreground mt-2 flex items-center justify-center gap-1">
                  <span>🔒</span> Non débloqué
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   LEADERBOARD PAGE
   ════════════════════════════════════════════════════════════ */
export default function LeaderboardPage() {
  const [users] = useState(MOCK_LEADERBOARD);
  const [badges] = useState(ALL_BADGES);

  const earnedBadges = badges.filter((b) => b.earnedAt).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Gamification
          </h1>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Dashboard
            </Button>
          </Link>
        </div>

        <Tabs defaultValue="leaderboard">
          <TabsList className="w-full mb-6">
            <TabsTrigger value="leaderboard" className="flex-1">
              Classement
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex-1">
              Badges ({earnedBadges}/{badges.length})
            </TabsTrigger>
          </TabsList>

          {/* ── Leaderboard ────── */}
          <TabsContent value="leaderboard">
            {/* Podium top 3 */}
            {users.length >= 3 && (
              <Card className="mb-6">
                <CardContent className="pt-4">
                  <Podium users={users.slice(0, 3)} />
                </CardContent>
              </Card>
            )}

            {/* Full list */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Classement général
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {users.map((user, i) => (
                    <LeaderboardRow
                      key={user.id}
                      user={user}
                      rank={i + 1}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Badges ─────────── */}
          <TabsContent value="badges">
            <BadgeGrid badges={badges} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
