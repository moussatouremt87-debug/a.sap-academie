import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  Eye,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
} from "lucide-react";
import { useLocation } from "wouter";

const kpis = [
  { label: "Visiteurs uniques", value: "12,847", change: "+18.2%", up: true, icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Inscriptions", value: "1,234", change: "+24.5%", up: true, icon: Users, color: "text-green-600", bg: "bg-green-50" },
  { label: "Taux de completion", value: "67.3%", change: "+5.1%", up: true, icon: Target, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Revenus mensuels", value: "8,450,000 FCFA", change: "+31.2%", up: true, icon: DollarSign, color: "text-orange-600", bg: "bg-orange-50" },
];

const weeklyData = [
  { day: "Lun", visitors: 1820, inscriptions: 145, revenue: 1200000 },
  { day: "Mar", visitors: 2150, inscriptions: 178, revenue: 1450000 },
  { day: "Mer", visitors: 1950, inscriptions: 156, revenue: 1100000 },
  { day: "Jeu", visitors: 2400, inscriptions: 201, revenue: 1680000 },
  { day: "Ven", visitors: 2100, inscriptions: 189, revenue: 1520000 },
  { day: "Sam", visitors: 1200, inscriptions: 95, revenue: 750000 },
  { day: "Dim", visitors: 1227, inscriptions: 88, revenue: 680000 },
];

const topCourses = [
  { name: "SAP S/4HANA - Finance (FI)", students: 342, completion: 78, revenue: "2,150,000 FCFA" },
  { name: "SAP MM - Gestion des achats", students: 287, completion: 72, revenue: "1,780,000 FCFA" },
  { name: "SAP SD - Ventes & Distribution", students: 256, completion: 68, revenue: "1,590,000 FCFA" },
  { name: "SAP HCM - Ressources Humaines", students: 198, completion: 65, revenue: "1,230,000 FCFA" },
  { name: "SAP ABAP - Developpement", students: 167, completion: 71, revenue: "1,040,000 FCFA" },
];

const trafficSources = [
  { source: "Recherche organique", percent: 42, color: "bg-blue-500" },
  { source: "Reseaux sociaux", percent: 28, color: "bg-green-500" },
  { source: "Referral / Parrainage", percent: 18, color: "bg-purple-500" },
  { source: "Email marketing", percent: 8, color: "bg-orange-500" },
  { source: "Acces direct", percent: 4, color: "bg-gray-500" },
];

const recentActivity = [
  { type: "inscription", text: "Amadou Diallo s'est inscrit a SAP FI", time: "Il y a 5 min" },
  { type: "completion", text: "Fatou Sow a termine le module SAP MM", time: "Il y a 12 min" },
  { type: "payment", text: "Paiement de 150,000 FCFA recu - SAP SD", time: "Il y a 25 min" },
  { type: "inscription", text: "Ibrahim Toure s'est inscrit a SAP ABAP", time: "Il y a 38 min" },
  { type: "certificate", text: "Certificat genere pour Mariam Keita", time: "Il y a 1h" },
  { type: "payment", text: "Paiement de 200,000 FCFA recu - SAP HCM", time: "Il y a 1h30" },
];

type Period = "7j" | "30j" | "90j" | "12m";

export default function AnalyticsDashboard() {
  const [, setLocation] = useLocation();
  const [period, setPeriod] = useState<Period>("30j");

  const maxVisitors = Math.max(...weeklyData.map((d) => d.visitors));

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => setLocation("/")} className="text-sm text-gray-500 hover:text-gray-700">← Accueil</button>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-medium text-gray-900">Analytics</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                {(["7j", "30j", "90j", "12m"] as Period[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${period === p ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <Download className="w-3.5 h-3.5" /> Exporter
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">Vue d'ensemble des performances de votre plateforme</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.label} className="border border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`p-2 rounded-lg ${kpi.bg}`}>
                      <Icon className={`w-4 h-4 ${kpi.color}`} />
                    </div>
                    <div className={`flex items-center gap-0.5 text-xs font-medium ${kpi.up ? "text-green-600" : "text-red-600"}`}>
                      {kpi.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {kpi.change}
                    </div>
                  </div>
                  <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart - Visitors */}
          <Card className="lg:col-span-2 border border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-500" /> Visiteurs cette semaine
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-48">
                {weeklyData.map((d) => (
                  <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-medium text-gray-600">{d.visitors.toLocaleString()}</span>
                    <div
                      className="w-full bg-blue-500 rounded-t-md transition-all hover:bg-blue-600"
                      style={{ height: `${(d.visitors / maxVisitors) * 140}px` }}
                    />
                    <span className="text-xs text-gray-500">{d.day}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Traffic Sources */}
          <Card className="border border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="w-4 h-4 text-purple-500" /> Sources de trafic
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trafficSources.map((s) => (
                <div key={s.source}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{s.source}</span>
                    <span className="text-sm font-medium text-gray-900">{s.percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div className={`h-2 rounded-full ${s.color}`} style={{ width: `${s.percent}%` }} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Top Courses & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Top Courses Table */}
          <Card className="lg:col-span-3 border border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-green-500" /> Top cours par revenus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2 font-medium text-gray-500">Cours</th>
                      <th className="text-right py-2 font-medium text-gray-500">Etudiants</th>
                      <th className="text-right py-2 font-medium text-gray-500">Completion</th>
                      <th className="text-right py-2 font-medium text-gray-500">Revenus</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topCourses.map((course, i) => (
                      <tr key={course.name} className="border-b border-gray-50 last:border-0">
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                            <span className="text-gray-900 font-medium">{course.name}</span>
                          </div>
                        </td>
                        <td className="text-right text-gray-600 py-2.5">{course.students}</td>
                        <td className="text-right py-2.5">
                          <Badge variant="secondary" className={`text-xs ${course.completion >= 70 ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {course.completion}%
                          </Badge>
                        </td>
                        <td className="text-right font-medium text-gray-900 py-2.5">{course.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2 border border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-orange-500" /> Activite recente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((a, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    a.type === "inscription" ? "bg-blue-500" :
                    a.type === "completion" ? "bg-green-500" :
                    a.type === "payment" ? "bg-orange-500" :
                    "bg-purple-500"
                  }`} />
                  <div className="min-w-0">
                    <p className="text-sm text-gray-700 leading-snug">{a.text}</p>
                    <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {a.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Temps moyen par session", value: "18 min", icon: Clock },
            { label: "Pages par visite", value: "4.7", icon: Eye },
            { label: "Taux de rebond", value: "32%", icon: TrendingUp },
            { label: "Panier moyen", value: "175,000 FCFA", icon: DollarSign },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <Icon className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                <p className="text-lg font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
