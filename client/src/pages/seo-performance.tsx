import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Search,
  Globe,
  Shield,
  Gauge,
  FileText,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Monitor,
  Smartphone,
  Clock,
  Image,
  Code,
  Wifi,
  Eye,
} from "lucide-react";
import { useLocation } from "wouter";

const performanceMetrics = [
  { label: "Performance", score: 94, color: "text-green-600", bg: "bg-green-100" },
  { label: "Accessibilite", score: 88, color: "text-green-600", bg: "bg-green-100" },
  { label: "Bonnes pratiques", score: 96, color: "text-green-600", bg: "bg-green-100" },
  { label: "SEO", score: 91, color: "text-green-600", bg: "bg-green-100" },
];

const seoChecklist = [
  { label: "Meta titles sur toutes les pages", status: "ok", detail: "12/12 pages" },
  { label: "Meta descriptions uniques", status: "ok", detail: "12/12 pages" },
  { label: "Balises H1 uniques", status: "ok", detail: "12/12 pages" },
  { label: "Images avec attribut alt", status: "warning", detail: "45/48 images" },
  { label: "Sitemap XML genere", status: "ok", detail: "/sitemap.xml" },
  { label: "Robots.txt configure", status: "ok", detail: "/robots.txt" },
  { label: "Liens canoniques", status: "ok", detail: "Tous configures" },
  { label: "Schema.org / JSON-LD", status: "ok", detail: "Course, Organization" },
  { label: "Open Graph tags", status: "warning", detail: "10/12 pages" },
  { label: "Certificat SSL actif", status: "ok", detail: "HTTPS partout" },
];

const optimizations = [
  {
    icon: Image,
    title: "Optimisation des images",
    description: "WebP automatique, lazy loading, srcset responsive",
    status: "actif",
    impact: "Haut",
  },
  {
    icon: Code,
    title: "Code splitting & Lazy loading",
    description: "Chargement dynamique des routes avec React.lazy()",
    status: "actif",
    impact: "Haut",
  },
  {
    icon: Zap,
    title: "Minification CSS/JS",
    description: "Vite build avec tree-shaking et compression gzip",
    status: "actif",
    impact: "Moyen",
  },
  {
    icon: Wifi,
    title: "Service Worker (PWA)",
    description: "Cache offline, notifications push, installation",
    status: "actif",
    impact: "Moyen",
  },
  {
    icon: Globe,
    title: "CDN & Edge Caching",
    description: "Assets statiques servis via CDN global",
    status: "actif",
    impact: "Haut",
  },
  {
    icon: Shield,
    title: "Headers de securite",
    description: "CSP, HSTS, X-Frame-Options, X-Content-Type",
    status: "actif",
    impact: "Moyen",
  },
];

const coreWebVitals = [
  { metric: "LCP", label: "Largest Contentful Paint", value: "1.2s", target: "< 2.5s", status: "good" },
  { metric: "FID", label: "First Input Delay", value: "18ms", target: "< 100ms", status: "good" },
  { metric: "CLS", label: "Cumulative Layout Shift", value: "0.04", target: "< 0.1", status: "good" },
  { metric: "FCP", label: "First Contentful Paint", value: "0.8s", target: "< 1.8s", status: "good" },
  { metric: "TTFB", label: "Time to First Byte", value: "210ms", target: "< 800ms", status: "good" },
  { metric: "INP", label: "Interaction to Next Paint", value: "95ms", target: "< 200ms", status: "good" },
];

export default function SeoPerformancePage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => setLocation("/")} className="text-sm text-gray-500 hover:text-gray-700">← Accueil</button>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-medium text-gray-900">Performance & SEO</span>
            </div>
            <Badge className="bg-green-100 text-green-700 text-xs">Derniere analyse : aujourd'hui</Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance & SEO</h1>
          <p className="text-sm text-gray-500 mt-0.5">Optimisations, metriques et audit SEO de votre plateforme</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {performanceMetrics.map((m) => (
            <Card key={m.label} className="border border-gray-100 text-center">
              <CardContent className="p-5">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${m.bg} mb-3`}>
                  <span className={`text-2xl font-bold ${m.color}`}>{m.score}</span>
                </div>
                <p className="text-sm font-medium text-gray-700">{m.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Gauge className="w-4 h-4 text-blue-500" /> Core Web Vitals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {coreWebVitals.map((v) => (
                <div key={v.metric} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <span className="text-xs font-bold text-green-700">{v.metric}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{v.label}</p>
                      <p className="text-xs text-gray-500">Cible : {v.target}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-green-600">{v.value}</span>
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-500" /> Audit SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {seoChecklist.map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    {item.status === "ok" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
                    )}
                    <span className="text-sm text-gray-700">{item.label}</span>
                  </div>
                  <span className={`text-xs font-medium ${item.status === "ok" ? "text-green-600" : "text-yellow-600"}`}>{item.detail}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border border-gray-100">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-500" /> Optimisations actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {optimizations.map((opt) => {
                const Icon = opt.icon;
                return (
                  <div key={opt.title} className="p-4 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className="p-2 rounded-lg bg-blue-50">
                        <Icon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex gap-1.5">
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">{opt.status}</Badge>
                        <Badge variant="secondary" className={`text-xs ${opt.impact === "Haut" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                          Impact {opt.impact}
                        </Badge>
                      </div>
                    </div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1">{opt.title}</h4>
                    <p className="text-xs text-gray-500">{opt.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Monitor className="w-4 h-4 text-gray-500" /> Desktop vs Mobile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-xl bg-gray-50">
                  <Monitor className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold text-gray-900">96</p>
                  <p className="text-xs text-gray-500 mt-1">Score Desktop</p>
                </div>
                <div className="text-center p-4 rounded-xl bg-gray-50">
                  <Smartphone className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-2xl font-bold text-gray-900">89</p>
                  <p className="text-xs text-gray-500 mt-1">Score Mobile</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" /> Fichiers generes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[
                { file: "/sitemap.xml", desc: "Plan du site pour moteurs de recherche", size: "4.2 KB" },
                { file: "/robots.txt", desc: "Regles d'indexation", size: "0.3 KB" },
                { file: "/manifest.json", desc: "Configuration PWA", size: "1.1 KB" },
                { file: "/sw.js", desc: "Service Worker cache offline", size: "12.4 KB" },
              ].map((f) => (
                <div key={f.file} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <code className="text-xs font-mono text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{f.file}</code>
                    <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                  </div>
                  <span className="text-xs text-gray-400">{f.size}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
