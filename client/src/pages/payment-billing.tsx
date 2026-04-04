import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Check,
  Star,
  Zap,
  Crown,
  Download,
  Receipt,
  Calendar,
  ArrowRight,
  Shield,
  Users,
  BookOpen,
  Award,
  Headphones,
} from "lucide-react";
import { useLocation } from "wouter";

type TabType = "pricing" | "invoices" | "methods";

const plans = [
  {
    name: "Decouverte",
    price: "Gratuit",
    priceNum: 0,
    period: "",
    icon: Star,
    color: "text-gray-600",
    bg: "bg-gray-50",
    borderColor: "border-gray-200",
    popular: false,
    features: [
      "Acces a 2 cours gratuits",
      "Forum communautaire",
      "Certificat de participation",
      "Support par email",
    ],
    cta: "Commencer",
  },
  {
    name: "Professionnel",
    price: "150,000",
    priceNum: 150000,
    period: "FCFA / mois",
    icon: Zap,
    color: "text-blue-600",
    bg: "bg-blue-50",
    borderColor: "border-blue-300",
    popular: true,
    features: [
      "Acces a tous les cours",
      "Projets pratiques guider",
      "Agent IA tuteur personnel",
      "Certificats professionnels",
      "Support prioritaire",
      "Acces hors-ligne (PWA)",
    ],
    cta: "S'abonner",
  },
  {
    name: "Entreprise",
    price: "Sur devis",
    priceNum: 0,
    period: "",
    icon: Crown,
    color: "text-purple-600",
    bg: "bg-purple-50",
    borderColor: "border-purple-200",
    popular: false,
    features: [
      "Tout le plan Professionnel",
      "Formation equipes illimitee",
      "Dashboard admin entreprise",
      "API & integrations SAP",
      "Formateur dedie",
      "SLA garanti 99.9%",
      "Facturation personnalisee",
    ],
    cta: "Contacter",
  },
];

const invoices = [
  { id: "INV-2026-001", date: "01/04/2026", amount: "150,000 FCFA", plan: "Professionnel", status: "paid" },
  { id: "INV-2026-002", date: "01/03/2026", amount: "150,000 FCFA", plan: "Professionnel", status: "paid" },
  { id: "INV-2026-003", date: "01/02/2026", amount: "150,000 FCFA", plan: "Professionnel", status: "paid" },
  { id: "INV-2026-004", date: "01/01/2026", amount: "150,000 FCFA", plan: "Professionnel", status: "paid" },
  { id: "INV-2025-012", date: "01/12/2025", amount: "120,000 FCFA", plan: "Professionnel", status: "paid" },
  { id: "INV-2025-011", date: "01/11/2025", amount: "120,000 FCFA", plan: "Professionnel", status: "paid" },
];

const paymentMethods = [
  { type: "card", label: "Visa se terminant par 4242", expiry: "12/2027", isDefault: true },
  { type: "mobile", label: "Orange Money - 77 XXX XX 45", expiry: "", isDefault: false },
  { type: "card", label: "Mastercard se terminant par 8888", expiry: "06/2028", isDefault: false },
];

export default function PaymentBillingPage() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState<TabType>("pricing");
  const [selectedPlan, setSelectedPlan] = useState("Professionnel");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => setLocation("/")} className="text-sm text-gray-500 hover:text-gray-700">← Accueil</button>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-medium text-gray-900">Paiement & Facturation</span>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {([
                { key: "pricing", label: "Tarifs" },
                { key: "invoices", label: "Factures" },
                { key: "methods", label: "Moyens de paiement" },
              ] as { key: TabType; label: string }[]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === tab.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Pricing Tab */}
        {activeTab === "pricing" && (
          <>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">Choisissez votre plan</h1>
              <p className="text-sm text-gray-500 mt-1">Investissez dans vos competences SAP avec un plan adapte</p>
              <div className="flex items-center justify-center gap-3 mt-4">
                <span className={`text-sm ${billingCycle === "monthly" ? "text-gray-900 font-medium" : "text-gray-400"}`}>Mensuel</span>
                <button
                  onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
                  className={`relative w-11 h-6 rounded-full transition-colors ${billingCycle === "annual" ? "bg-blue-600" : "bg-gray-300"}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${billingCycle === "annual" ? "translate-x-5.5 left-0.5" : "left-0.5"}`} />
                </button>
                <span className={`text-sm ${billingCycle === "annual" ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                  Annuel <Badge className="bg-green-100 text-green-700 text-xs ml-1">-20%</Badge>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {plans.map((plan) => {
                const Icon = plan.icon;
                const displayPrice = plan.priceNum > 0 && billingCycle === "annual"
                  ? (plan.priceNum * 0.8).toLocaleString()
                  : plan.price;
                return (
                  <Card
                    key={plan.name}
                    className={`relative border-2 ${plan.popular ? plan.borderColor + " shadow-lg" : "border-gray-100"} transition-all hover:shadow-md`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-blue-600 text-white text-xs px-3">Le plus populaire</Badge>
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className={`w-10 h-10 rounded-xl ${plan.bg} flex items-center justify-center mb-4`}>
                        <Icon className={`w-5 h-5 ${plan.color}`} />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                      <div className="mt-3 mb-5">
                        <span className="text-3xl font-bold text-gray-900">{displayPrice}</span>
                        {plan.period && <span className="text-sm text-gray-500 ml-1">{plan.period}</span>}
                      </div>
                      <ul className="space-y-2.5 mb-6">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Button
                        className={`w-full ${plan.popular ? "bg-blue-600 hover:bg-blue-700 text-white" : ""}`}
                        variant={plan.popular ? "default" : "outline"}
                        onClick={() => setSelectedPlan(plan.name)}
                      >
                        {plan.cta} <ArrowRight className="w-4 h-4 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { icon: Shield, label: "Paiement securise", desc: "SSL 256-bit" },
                { icon: Users, label: "1,200+ etudiants", desc: "Nous font confiance" },
                { icon: Award, label: "Certifications", desc: "Reconnues SAP" },
                { icon: Headphones, label: "Support 24/7", desc: "Assistance reactive" },
              ].map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.label} className="text-center p-4 bg-white rounded-xl border border-gray-100">
                    <Icon className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                    <p className="text-sm font-medium text-gray-900">{badge.label}</p>
                    <p className="text-xs text-gray-500">{badge.desc}</p>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Invoices Tab */}
        {activeTab === "invoices" && (
          <Card className="border border-gray-100">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Receipt className="w-4 h-4 text-blue-500" /> Historique des factures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-2.5 font-medium text-gray-500">Numero</th>
                      <th className="text-left py-2.5 font-medium text-gray-500">Date</th>
                      <th className="text-left py-2.5 font-medium text-gray-500">Plan</th>
                      <th className="text-right py-2.5 font-medium text-gray-500">Montant</th>
                      <th className="text-center py-2.5 font-medium text-gray-500">Statut</th>
                      <th className="text-right py-2.5 font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoices.map((inv) => (
                      <tr key={inv.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50">
                        <td className="py-3 font-mono text-xs text-blue-600">{inv.id}</td>
                        <td className="py-3 text-gray-600 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" /> {inv.date}
                        </td>
                        <td className="py-3 text-gray-700">{inv.plan}</td>
                        <td className="py-3 text-right font-medium text-gray-900">{inv.amount}</td>
                        <td className="py-3 text-center">
                          <Badge className="bg-green-100 text-green-700 text-xs">Paye</Badge>
                        </td>
                        <td className="py-3 text-right">
                          <Button variant="ghost" size="sm" className="text-xs gap-1">
                            <Download className="w-3.5 h-3.5" /> PDF
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Methods Tab */}
        {activeTab === "methods" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Moyens de paiement</h2>
              <Button size="sm" className="text-xs gap-1.5">
                <CreditCard className="w-3.5 h-3.5" /> Ajouter
              </Button>
            </div>
            {paymentMethods.map((pm, i) => (
              <Card key={i} className={`border ${pm.isDefault ? "border-blue-200 bg-blue-50/30" : "border-gray-100"}`}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${pm.type === "card" ? "bg-blue-100" : "bg-orange-100"}`}>
                      <CreditCard className={`w-5 h-5 ${pm.type === "card" ? "text-blue-600" : "text-orange-600"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{pm.label}</p>
                      {pm.expiry && <p className="text-xs text-gray-500">Expire {pm.expiry}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {pm.isDefault && <Badge className="bg-blue-100 text-blue-700 text-xs">Par defaut</Badge>}
                    <Button variant="ghost" size="sm" className="text-xs">Modifier</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
