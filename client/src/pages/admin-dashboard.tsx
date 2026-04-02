import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  Search,
  MoreVertical,
  GraduationCap,
  Shield,
  BarChart3,
  Settings,
  Bell,
  LogOut,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  UserPlus,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { useLocation } from "wouter";

const mockStats = [
  { label: "Utilisateurs actifs", value: "2,547", change: "+12.5%", up: true, icon: Users, color: "bg-blue-500" },
  { label: "Cours publies", value: "48", change: "+3", up: true, icon: BookOpen, color: "bg-green-500" },
  { label: "Revenus mensuels", value: "8,450,000 FCFA", change: "+18.2%", up: true, icon: DollarSign, color: "bg-purple-500" },
  { label: "Taux de completion", value: "73%", change: "-2.1%", up: false, icon: TrendingUp, color: "bg-orange-500" },
];

const mockUsers = [
  { id: 1, name: "Aminata Diallo", email: "aminata@email.com", role: "etudiant", status: "actif", courses: 4, lastActive: "Il y a 2h" },
  { id: 2, name: "Oumar Sy", email: "oumar@email.com", role: "formateur", status: "actif", courses: 8, lastActive: "Il y a 1h" },
  { id: 3, name: "Fatou Ndiaye", email: "fatou@email.com", role: "etudiant", status: "actif", courses: 3, lastActive: "Il y a 30min" },
  { id: 4, name: "Ibrahim Keita", email: "ibrahim@email.com", role: "etudiant", status: "inactif", courses: 1, lastActive: "Il y a 7j" },
  { id: 5, name: "Mariame Toure", email: "mariame@email.com", role: "formateur", status: "actif", courses: 6, lastActive: "Il y a 3h" },
  { id: 6, name: "Sekou Bah", email: "sekou@email.com", role: "admin", status: "actif", courses: 0, lastActive: "En ligne" },
  { id: 7, name: "Aissatou Camara", email: "aissatou@email.com", role: "etudiant", status: "suspendu", courses: 2, lastActive: "Il y a 14j" },
  { id: 8, name: "Moussa Kone", email: "moussa@email.com", role: "etudiant", status: "actif", courses: 5, lastActive: "Il y a 5h" },
];

const mockCourses = [
  { id: 1, title: "SAP FI - Finance", students: 456, rating: 4.8, revenue: "2,100,000 FCFA", status: "publie" },
  { id: 2, title: "SAP CO - Controle de gestion", students: 312, rating: 4.6, revenue: "1,450,000 FCFA", status: "publie" },
  { id: 3, title: "SAP MM - Gestion des stocks", students: 289, rating: 4.7, revenue: "1,340,000 FCFA", status: "publie" },
  { id: 4, title: "SAP SD - Ventes & Distribution", students: 234, rating: 4.5, revenue: "1,090,000 FCFA", status: "publie" },
  { id: 5, title: "SAP HANA - Base de donnees", students: 198, rating: 4.9, revenue: "920,000 FCFA", status: "publie" },
  { id: 6, title: "SAP PP - Planification", students: 0, rating: 0, revenue: "0 FCFA", status: "brouillon" },
];

const mockActivity = [
  { type: "inscription", message: "Aminata Diallo s'est inscrite au cours SAP FI", time: "Il y a 15min" },
  { type: "completion", message: "Oumar Sy a termine le module 5 de SAP CO", time: "Il y a 30min" },
  { type: "paiement", message: "Nouveau paiement de 185,000 FCFA recu", time: "Il y a 1h" },
  { type: "alerte", message: "3 utilisateurs inactifs depuis plus de 30 jours", time: "Il y a 2h" },
  { type: "inscription", message: "5 nouvelles inscriptions aujourd'hui", time: "Il y a 3h" },
  { type: "completion", message: "Fatou Ndiaye a obtenu sa certification SAP MM", time: "Il y a 4h" },
];

function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {mockStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="border border-gray-100 hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? "text-green-600" : "text-red-500"}`}>
                    {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>
                <div className={`${stat.color} p-2.5 rounded-xl`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function UsersTable() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const filtered = mockUsers.filter((u) => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const roleColors: Record<string, string> = {
    etudiant: "bg-blue-100 text-blue-700",
    formateur: "bg-purple-100 text-purple-700",
    admin: "bg-red-100 text-red-700",
  };

  const statusColors: Record<string, string> = {
    actif: "bg-green-100 text-green-700",
    inactif: "bg-gray-100 text-gray-600",
    suspendu: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Rechercher un utilisateur..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {["all", "etudiant", "formateur", "admin"].map((r) => (
              <button key={r} onClick={() => setRoleFilter(r)} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${roleFilter === r ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                {r === "all" ? "Tous" : r.charAt(0).toUpperCase() + r.slice(1) + "s"}
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export
          </Button>
          <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-3.5 h-3.5" /> Ajouter
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Utilisateur</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Role</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Statut</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Cours</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Derniere activite</th>
                <th className="text-right text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className={`text-xs ${roleColors[user.role]}`}>{user.role}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className={`text-xs ${statusColors[user.status]}`}>{user.status}</Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{user.courses}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{user.lastActive}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><Edit className="w-3.5 h-3.5" /></button>
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 bg-gray-50/30">
          <p className="text-xs text-gray-500">{filtered.length} utilisateur(s) sur {mockUsers.length}</p>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" className="h-7 text-xs">Precedent</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs bg-blue-600 text-white hover:bg-blue-700">1</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">2</Button>
            <Button variant="outline" size="sm" className="h-7 text-xs">Suivant</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CoursesTable() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Gestion des cours</h3>
        <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700">
          <BookOpen className="w-3.5 h-3.5" /> Nouveau cours
        </Button>
      </div>
      <div className="grid gap-3">
        {mockCourses.map((course) => (
          <div key={course.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${course.status === "publie" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{course.title}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-gray-500">{course.students} inscrits</span>
                  {course.rating > 0 && <span className="text-xs text-yellow-600">★ {course.rating}</span>}
                  <Badge variant="secondary" className={`text-xs ${course.status === "publie" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>{course.status}</Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-700">{course.revenue}</span>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><Eye className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><Edit className="w-3.5 h-3.5" /></button>
                <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"><MoreVertical className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityFeed() {
  const iconMap: Record<string, { icon: typeof CheckCircle2; color: string }> = {
    inscription: { icon: UserPlus, color: "text-blue-500 bg-blue-50" },
    completion: { icon: CheckCircle2, color: "text-green-500 bg-green-50" },
    paiement: { icon: DollarSign, color: "text-purple-500 bg-purple-50" },
    alerte: { icon: AlertTriangle, color: "text-orange-500 bg-orange-50" },
  };

  return (
    <Card className="border border-gray-100">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Activite recente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {mockActivity.map((item, i) => {
          const { icon: Icon, color } = iconMap[item.type] || iconMap.inscription;
          return (
            <div key={i} className="flex items-start gap-3">
              <div className={`p-1.5 rounded-lg ${color}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">{item.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => setLocation("/")} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-bold text-gray-900 text-sm">A.SAP Academie</span>
                  <span className="ml-2 text-xs text-gray-400 font-medium">Admin</span>
                </div>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-500">
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">MT</div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Moussa Toure</p>
                  <p className="text-xs text-gray-500">Administrateur</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
            <p className="text-sm text-gray-500 mt-0.5">Vue d'ensemble de votre plateforme</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Filtres
            </Button>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="w-3.5 h-3.5" /> Rapport
            </Button>
          </div>
        </div>

        <StatsCards />

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="bg-white border border-gray-200 p-1 rounded-xl">
            <TabsTrigger value="users" className="gap-1.5 text-sm"><Users className="w-3.5 h-3.5" /> Utilisateurs</TabsTrigger>
            <TabsTrigger value="courses" className="gap-1.5 text-sm"><BookOpen className="w-3.5 h-3.5" /> Cours</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5 text-sm"><BarChart3 className="w-3.5 h-3.5" /> Analytique</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersTable />
          </TabsContent>

          <TabsContent value="courses">
            <CoursesTable />
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card className="border border-gray-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Inscriptions par mois</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-end gap-2 h-48">
                      {[120, 180, 240, 200, 320, 280, 360, 420, 380, 450, 410, 520].map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1">
                          <div className="w-full bg-blue-500 rounded-t-md transition-all hover:bg-blue-600" style={{ height: `${(v / 520) * 100}%` }} />
                          <span className="text-[10px] text-gray-400">{["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              <ActivityFeed />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
