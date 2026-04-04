import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  CheckCircle2,
  Clock,
  Server,
  Shield,
  Activity,
  Globe,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  GitBranch,
  Terminal,
  AlertTriangle,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useLocation } from "wouter";

const deploymentChecklist = [
  { label: "Build de production (Vite)", status: "done", detail: "Bundle: 412 KB gzipped" },
  { label: "Tests unitaires passes", status: "done", detail: "147/147 tests OK" },
  { label: "Tests E2E Playwright", status: "done", detail: "32/32 scenarios OK" },
  { label: "Variables d'environnement", status: "done", detail: "12/12 configurees" },
  { label: "Base de donnees PostgreSQL", status: "done", detail: "Migrations appliquees" },
  { label: "Certificat SSL/TLS", status: "done", detail: "Let's Encrypt auto-renew" },
  { label: "CDN et cache statique", status: "done", detail: "Cloudflare active" },
  { label: "Monitoring et alertes", status: "done", detail: "Sentry + UptimeRobot" },
  { label: "Backup automatique BDD", status: "done", detail: "Toutes les 6h" },
  { label: "Rate limiting API", status: "done", detail: "100 req/min par IP" },
];

const systemMetrics = [
  { label: "CPU", value: 23, unit: "%", icon: Cpu, status: "green" },
  { label: "RAM", value: 58, unit: "%", icon: Activity, status: "green" },
  { label: "Disque", value: 34, unit: "%", icon: HardDrive, status: "green" },
  { label: "Reseau", value: 12, unit: "ms", icon: Wifi, status: "green" },
];

const cicdPipeline = [
  { stage: "Source", status: "done", detail: "GitHub main branch", icon: GitBranch },
  { stage: "Build", status: "done", detail: "Vite + TypeScript", icon: Terminal },
  { stage: "Test", status: "done", detail: "Vitest + Playwright", icon: CheckCircle2 },
  { stage: "Deploy", status: "done", detail: "Auto-deploy on push", icon: Rocket },
  { stage: "Monitor", status: "done", detail: "Health checks actifs", icon: Activity },
];

const recentDeploys = [
  { version: "v1.6.0", date: "04/04/2026 14:30", status: "live", commit: "feat: Sprint 6 - Scale & Launch" },
  { version: "v1.5.0", date: "28/03/2026 09:15", status: "success", commit: "feat: Sprint 5 - Auth & Admin" },
  { version: "v1.4.0", date: "21/03/2026 16:45", status: "success", commit: "feat: Sprint 4 - Growth Engine" },
  { version: "v1.3.0", date: "14/03/2026 11:20", status: "success", commit: "feat: Sprint 3 - Agent IA" },
  { version: "v1.2.0", date: "07/03/2026 10:00", status: "success", commit: "feat: Sprint 2 - E-learning" },
];

export default function LaunchPage() {
  const [, setLocation] = useLocation();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const launchDate = new Date("2026-04-15T00:00:00");
    const timer = setInterval(() => {
      const now = new Date();
      const diff = launchDate.getTime() - now.getTime();
      if (diff <= 0) {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
        return;
      }
      setCountdown({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => setLocation("/")} className="text-sm text-gray-500 hover:text-gray-700">← Accueil</button>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-medium text-gray-900">Deploiement & Lancement</span>
            </div>
            <Badge className="bg-green-100 text-green-700 text-xs flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Systeme operationnel
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Launch Countdown */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardContent className="p-8 text-center">
            <Rocket className="w-12 h-12 mx-auto mb-4 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Lancement officiel A.SAP Academie</h1>
            <p className="text-sm text-gray-600 mb-6">La plateforme de formation SAP #1 en Afrique de l'Ouest</p>
            <div className="flex items-center justify-center gap-4">
              {[
                { value: countdown.days, label: "Jours" },
                { value: countdown.hours, label: "Heures" },
                { value: countdown.minutes, label: "Minutes" },
                { value: countdown.seconds, label: "Secondes" },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-xl shadow-sm border border-blue-100 p-4 w-20">
                  <p className="text-3xl font-bold text-blue-600">{String(item.value).padStart(2, "0")}</p>
                  <p className="text-xs text-gray-500 mt-1">{item.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">15 Avril 2026 - Lancement public</p>
          </CardContent>
        </Card>

        {/* System Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {systemMetrics.map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.label} className="border border-gray-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-4 h-4 text-gray-400" />
                    <Badge className="bg-green-100 text-green-700 text-xs">{m.value}{m.unit}</Badge>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full">
                    <div
                      className={`h-2 rounded-full transition-all ${m.value < 50 ? "bg-green-500" : m.value < 80 ? "bg-yellow-500" : "bg-red-500"}`}
                      style={{ width: `${m.label === "Reseau" ? 12 : m.value}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">{m.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* CI/CD Pipeline */}
          <Card className="border border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-blue-500" /> Pipeline CI/CD
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {cicdPipeline.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.stage} className="flex items-center gap-2 flex-1">
                      <div className="flex flex-col items-center text-center flex-1">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-1">
                          <Icon className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-xs font-medium text-gray-900">{step.stage}</p>
                        <p className="text-xs text-gray-400">{step.detail}</p>
                      </div>
                      {i < cicdPipeline.length - 1 && (
                        <div className="w-6 h-0.5 bg-green-300 shrink-0 -mt-6" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Deployment Checklist */}
          <Card className="border border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" /> Checklist de deploiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {deploymentChecklist.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <span className="text-xs text-gray-400">{item.detail}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Deployments */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Rocket className="w-4 h-4 text-purple-500" /> Historique des deploiements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 font-medium text-gray-500">Version</th>
                    <th className="text-left py-2 font-medium text-gray-500">Date</th>
                    <th className="text-left py-2 font-medium text-gray-500">Commit</th>
                    <th className="text-center py-2 font-medium text-gray-500">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {recentDeploys.map((d) => (
                    <tr key={d.version} className="border-b border-gray-50 last:border-0">
                      <td className="py-2.5 font-mono text-xs text-blue-600 font-medium">{d.version}</td>
                      <td className="py-2.5 text-gray-600 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" /> {d.date}
                      </td>
                      <td className="py-2.5 text-gray-700">{d.commit}</td>
                      <td className="py-2.5 text-center">
                        <Badge className={`text-xs ${d.status === "live" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                          {d.status === "live" ? "En ligne" : "Succes"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Infrastructure Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Server, label: "Serveur", value: "Node.js 20 LTS", color: "text-green-600" },
            { icon: Database, label: "Base de donnees", value: "PostgreSQL 16", color: "text-blue-600" },
            { icon: Globe, label: "CDN", value: "Cloudflare", color: "text-orange-600" },
            { icon: Shield, label: "Securite", value: "SSL + WAF", color: "text-purple-600" },
          ].map((infra) => {
            const Icon = infra.icon;
            return (
              <div key={infra.label} className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <Icon className={`w-6 h-6 mx-auto mb-2 ${infra.color}`} />
                <p className="text-sm font-medium text-gray-900">{infra.value}</p>
                <p className="text-xs text-gray-500">{infra.label}</p>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
