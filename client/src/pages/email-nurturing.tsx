import { useState } from "react";
import { Mail, Send, Clock, Users, BarChart3, Play, Pause, Edit, Trash2, Plus, CheckCircle, XCircle, ArrowRight, Zap, Eye, MousePointer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// ── Types ──────────────────────────────────────────────
interface EmailSequence {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  emails: EmailStep[];
  subscribers: number;
  stats: SequenceStats;
}

interface EmailStep {
  id: string;
  subject: string;
  preview: string;
  delayDays: number;
  status: "sent" | "scheduled" | "draft";
  stats?: { openRate: number; clickRate: number; sent: number };
}

interface SequenceStats {
  totalSent: number;
  avgOpenRate: number;
  avgClickRate: number;
  conversions: number;
}

// ── Données ────────────────────────────────────────────
const EMAIL_SEQUENCES: EmailSequence[] = [
  {
    id: "welcome",
    name: "Séquence de Bienvenue",
    description: "Onboarding des nouveaux inscrits : présentation A.SAP, guide gratuit, première offre",
    status: "active",
    subscribers: 1247,
    stats: { totalSent: 4890, avgOpenRate: 68, avgClickRate: 24, conversions: 312 },
    emails: [
      {
        id: "w1",
        subject: "Bienvenue chez A.SAP Académie ! 🎓 Votre guide gratuit vous attend",
        preview: "Merci de rejoindre la communauté SAP #1 en Afrique de l'Ouest...",
        delayDays: 0,
        status: "sent",
        stats: { openRate: 82, clickRate: 45, sent: 1247 },
      },
      {
        id: "w2",
        subject: "3 erreurs qui freinent votre carrière SAP (et comment les éviter)",
        preview: "Après 10 ans dans le consulting SAP, voici ce que j'aurais aimé savoir...",
        delayDays: 2,
        status: "sent",
        stats: { openRate: 71, clickRate: 28, sent: 1180 },
      },
      {
        id: "w3",
        subject: "Votre plan d'apprentissage SAP personnalisé est prêt",
        preview: "Basé sur vos intérêts, voici le parcours idéal pour vous...",
        delayDays: 5,
        status: "sent",
        stats: { openRate: 65, clickRate: 22, sent: 1120 },
      },
      {
        id: "w4",
        subject: "🎁 -20% sur votre première formation – Offre exclusive nouvel inscrit",
        preview: "Cette offre expire dans 48h. Choisissez la formation qui vous correspond...",
        delayDays: 7,
        status: "sent",
        stats: { openRate: 58, clickRate: 31, sent: 1050 },
      },
    ],
  },
  {
    id: "nurture",
    name: "Nurturing Hebdomadaire",
    description: "Contenu de valeur chaque semaine : tutoriels, actualités SAP, offres d'emploi",
    status: "active",
    subscribers: 892,
    stats: { totalSent: 12450, avgOpenRate: 42, avgClickRate: 15, conversions: 189 },
    emails: [
      {
        id: "n1",
        subject: "📊 Cette semaine en SAP : Nouveautés S/4HANA et offres d'emploi",
        preview: "3 articles, 2 tutoriels et 5 offres d'emploi SAP cette semaine...",
        delayDays: 0,
        status: "sent",
        stats: { openRate: 45, clickRate: 18, sent: 892 },
      },
      {
        id: "n2",
        subject: "Tutoriel : Maîtrisez les écritures comptables SAP (FB50) en 15 min",
        preview: "Guide pas-à-pas avec captures d'écran pour la transaction FB50...",
        delayDays: 7,
        status: "sent",
        stats: { openRate: 52, clickRate: 25, sent: 870 },
      },
      {
        id: "n3",
        subject: "🔥 Les 5 compétences SAP les plus demandées en 2026",
        preview: "S/4HANA, Fiori, ABAP Cloud... Découvrez ce que cherchent les recruteurs...",
        delayDays: 14,
        status: "scheduled",
      },
    ],
  },
  {
    id: "reengagement",
    name: "Réengagement",
    description: "Séquence pour réactiver les utilisateurs inactifs depuis 30+ jours",
    status: "paused",
    subscribers: 345,
    stats: { totalSent: 890, avgOpenRate: 28, avgClickRate: 8, conversions: 42 },
    emails: [
      {
        id: "r1",
        subject: "On ne vous a pas vu depuis un moment... 👋",
        preview: "Votre parcours SAP vous attend. Voici ce que vous avez manqué...",
        delayDays: 0,
        status: "sent",
        stats: { openRate: 32, clickRate: 10, sent: 345 },
      },
      {
        id: "r2",
        subject: "🎁 Un cadeau pour vous : accès gratuit au Tuteur IA pendant 7 jours",
        preview: "Testez notre nouvelle fonctionnalité d'apprentissage assisté par IA...",
        delayDays: 3,
        status: "sent",
        stats: { openRate: 38, clickRate: 15, sent: 310 },
      },
      {
        id: "r3",
        subject: "Dernière chance : -30% réservé aux anciens membres",
        preview: "Cette offre expire définitivement dans 24h...",
        delayDays: 7,
        status: "draft",
      },
    ],
  },
  {
    id: "promo",
    name: "Promotions SAP",
    description: "Offres spéciales et lancements de nouvelles formations",
    status: "draft",
    subscribers: 0,
    stats: { totalSent: 0, avgOpenRate: 0, avgClickRate: 0, conversions: 0 },
    emails: [
      {
        id: "p1",
        subject: "🚀 Nouvelle formation SAP S/4HANA – Inscription anticipée -40%",
        preview: "Soyez parmi les premiers à maîtriser S/4HANA en Afrique...",
        delayDays: 0,
        status: "draft",
      },
      {
        id: "p2",
        subject: "Rappel : Plus que 24h pour profiter de -40% sur SAP S/4HANA",
        preview: "L'offre d'inscription anticipée se termine demain à minuit...",
        delayDays: 6,
        status: "draft",
      },
    ],
  },
];

// ── Composants ─────────────────────────────────────────

function StatCard({ label, value, icon: Icon, trend }: { label: string; value: string; icon: typeof Mail; trend?: string }) {
  return (
    <Card className="border border-gray-100">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 rounded-lg bg-blue-50">
            <Icon className="h-5 w-5 text-blue-600" />
          </div>
          {trend && <Badge className="bg-green-100 text-green-700 text-xs">{trend}</Badge>}
        </div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className="text-sm text-gray-500 mt-1">{label}</div>
      </CardContent>
    </Card>
  );
}

function SequenceCard({ sequence }: { sequence: EmailSequence }) {
  const statusConfig = {
    active: { label: "Actif", color: "bg-green-100 text-green-700", icon: Play },
    paused: { label: "En pause", color: "bg-yellow-100 text-yellow-700", icon: Pause },
    draft: { label: "Brouillon", color: "bg-gray-100 text-gray-600", icon: Edit },
  };
  const config = statusConfig[sequence.status];
  const StatusIcon = config.icon;

  return (
    <Card className="border border-gray-100 hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-gray-900">{sequence.name}</h3>
              <Badge className={`${config.color} text-xs`}>
                <StatusIcon className="h-3 w-3 mr-1" />
                {config.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">{sequence.description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{sequence.emails.length}</div>
            <div className="text-[10px] text-gray-500">Emails</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{sequence.subscribers.toLocaleString()}</div>
            <div className="text-[10px] text-gray-500">Abonnés</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-blue-600">{sequence.stats.avgOpenRate}%</div>
            <div className="text-[10px] text-gray-500">Ouverture</div>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-green-600">{sequence.stats.conversions}</div>
            <div className="text-[10px] text-gray-500">Conversions</div>
          </div>
        </div>

        {/* Email Steps Timeline */}
        <div className="space-y-2">
          {sequence.emails.map((email, i) => (
            <div key={email.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-gray-50/70 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col items-center shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                  email.status === "sent" ? "bg-green-100 text-green-600" :
                  email.status === "scheduled" ? "bg-blue-100 text-blue-600" :
                  "bg-gray-100 text-gray-400"
                }`}>
                  {email.status === "sent" ? <CheckCircle className="h-4 w-4" /> :
                   email.status === "scheduled" ? <Clock className="h-4 w-4" /> :
                   <Edit className="h-4 w-4" />}
                </div>
                {i < sequence.emails.length - 1 && (
                  <div className="w-px h-3 bg-gray-200 mt-1" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{email.subject}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-400">
                    {email.delayDays === 0 ? "Immédiat" : `J+${email.delayDays}`}
                  </span>
                  {email.stats && (
                    <>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Eye className="h-3 w-3" />{email.stats.openRate}%
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <MousePointer className="h-3 w-3" />{email.stats.clickRate}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm" className="flex-1">
            <Edit className="h-3.5 w-3.5 mr-1" />
            Modifier
          </Button>
          {sequence.status === "active" ? (
            <Button variant="outline" size="sm" className="text-yellow-600 border-yellow-200 hover:bg-yellow-50">
              <Pause className="h-3.5 w-3.5 mr-1" />
              Pause
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
              <Play className="h-3.5 w-3.5 mr-1" />
              Activer
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ── Page Principale ────────────────────────────────────
export default function EmailNurturingPage() {
  const [activeTab, setActiveTab] = useState("sequences");
  const { toast } = useToast();

  const totalSubscribers = EMAIL_SEQUENCES.reduce((acc, s) => acc + s.subscribers, 0);
  const totalSent = EMAIL_SEQUENCES.reduce((acc, s) => acc + s.stats.totalSent, 0);
  const avgOpenRate = Math.round(EMAIL_SEQUENCES.filter(s => s.stats.avgOpenRate > 0).reduce((acc, s) => acc + s.stats.avgOpenRate, 0) / EMAIL_SEQUENCES.filter(s => s.stats.avgOpenRate > 0).length);
  const totalConversions = EMAIL_SEQUENCES.reduce((acc, s) => acc + s.stats.conversions, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <Mail className="h-6 w-6 text-blue-600" />
                Email Nurturing
              </h1>
              <p className="text-gray-500 text-sm mt-1">Gérez vos séquences emails et campagnes de nurturing</p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Séquence
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Abonnés total" value={totalSubscribers.toLocaleString()} icon={Users} trend="+12%" />
          <StatCard label="Emails envoyés" value={totalSent.toLocaleString()} icon={Send} trend="+8%" />
          <StatCard label="Taux d'ouverture moy." value={`${avgOpenRate}%`} icon={Eye} />
          <StatCard label="Conversions" value={totalConversions.toString()} icon={BarChart3} trend="+23%" />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="sequences">
              <Zap className="h-4 w-4 mr-1" />
              Séquences ({EMAIL_SEQUENCES.length})
            </TabsTrigger>
            <TabsTrigger value="templates">
              <Mail className="h-4 w-4 mr-1" />
              Templates
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-1" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sequences" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {EMAIL_SEQUENCES.map((seq) => (
                <SequenceCard key={seq.id} sequence={seq} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="templates" className="mt-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Bienvenue Standard", category: "Onboarding", uses: 1247 },
                { name: "Tutoriel de la semaine", category: "Nurturing", uses: 892 },
                { name: "Promo Flash", category: "Promotion", uses: 456 },
                { name: "Webinaire Invitation", category: "Événement", uses: 234 },
                { name: "Réactivation douce", category: "Réengagement", uses: 345 },
                { name: "Certificat obtenu", category: "Transactionnel", uses: 678 },
              ].map((tpl, i) => (
                <Card key={i} className="border border-gray-100 hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <Badge variant="outline" className="text-xs">{tpl.category}</Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{tpl.name}</h3>
                    <p className="text-xs text-gray-400">Utilisé {tpl.uses} fois</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance des Séquences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {EMAIL_SEQUENCES.filter(s => s.stats.totalSent > 0).map((seq) => (
                    <div key={seq.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-sm">{seq.name}</h4>
                        <p className="text-xs text-gray-400">{seq.stats.totalSent.toLocaleString()} emails envoyés</p>
                      </div>
                      <div className="flex gap-6">
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-600">{seq.stats.avgOpenRate}%</div>
                          <div className="text-[10px] text-gray-400">Ouverture</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">{seq.stats.avgClickRate}%</div>
                          <div className="text-[10px] text-gray-400">Clic</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-purple-600">{seq.stats.conversions}</div>
                          <div className="text-[10px] text-gray-400">Conversions</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
