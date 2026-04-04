import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  BellOff,
  Check,
  CheckCheck,
  UserPlus,
  BookOpen,
  CreditCard,
  Award,
  MessageSquare,
  AlertTriangle,
  Settings,
  Trash2,
  Filter,
  Clock,
} from "lucide-react";
import { useLocation } from "wouter";

type NotificationType = "inscription" | "completion" | "payment" | "certificate" | "message" | "alert";
type NotificationFilter = "all" | "unread" | NotificationType;

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  read: boolean;
  avatar?: string;
}

const initialNotifications: Notification[] = [
  { id: 1, type: "inscription", title: "Nouvelle inscription", message: "Amadou Diallo s'est inscrit au cours SAP S/4HANA Finance", time: "Il y a 2 min", read: false },
  { id: 2, type: "payment", title: "Paiement recu", message: "150,000 FCFA - Abonnement Premium par Fatou Sow", time: "Il y a 15 min", read: false },
  { id: 3, type: "completion", title: "Module termine", message: "Ibrahim Toure a complete le module 4 de SAP MM", time: "Il y a 32 min", read: false },
  { id: 4, type: "certificate", title: "Certificat genere", message: "Certificat SAP FI delivre a Mariam Keita", time: "Il y a 1h", read: false },
  { id: 5, type: "message", title: "Nouveau message forum", message: "Question sur le module CO : 'Comment configurer les centres de couts ?'", time: "Il y a 1h30", read: true },
  { id: 6, type: "alert", title: "Alerte systeme", message: "Utilisation CPU a 85% - Performance degradee detectee", time: "Il y a 2h", read: true },
  { id: 7, type: "inscription", title: "Nouvelle inscription", message: "Oumar Ba s'est inscrit au cours SAP ABAP Developpement", time: "Il y a 2h30", read: true },
  { id: 8, type: "payment", title: "Paiement recu", message: "200,000 FCFA - Formation SAP HCM par Awa Ndiaye", time: "Il y a 3h", read: true },
  { id: 9, type: "completion", title: "Cours termine", message: "Moussa Diop a obtenu 92% au quiz final SAP SD", time: "Il y a 4h", read: true },
  { id: 10, type: "message", title: "Reponse forum", message: "Nouvelle reponse a votre question sur les transactions ME21N", time: "Il y a 5h", read: true },
  { id: 11, type: "certificate", title: "Certificat genere", message: "Certificat SAP MM delivre a Kadiatou Traore", time: "Il y a 6h", read: true },
  { id: 12, type: "alert", title: "Mise a jour disponible", message: "Nouvelle version du module SAP S/4HANA 2025 disponible", time: "Il y a 8h", read: true },
];

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; bg: string; label: string }> = {
  inscription: { icon: UserPlus, color: "text-blue-600", bg: "bg-blue-100", label: "Inscriptions" },
  completion: { icon: BookOpen, color: "text-green-600", bg: "bg-green-100", label: "Completions" },
  payment: { icon: CreditCard, color: "text-orange-600", bg: "bg-orange-100", label: "Paiements" },
  certificate: { icon: Award, color: "text-purple-600", bg: "bg-purple-100", label: "Certificats" },
  message: { icon: MessageSquare, color: "text-cyan-600", bg: "bg-cyan-100", label: "Messages" },
  alert: { icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100", label: "Alertes" },
};

export default function NotificationsPage() {
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState<NotificationFilter>("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    return n.type === filter;
  });

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const typeCounts = notifications.reduce((acc, n) => {
    acc[n.type] = (acc[n.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button onClick={() => setLocation("/")} className="text-sm text-gray-500 hover:text-gray-700">← Accueil</button>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-medium text-gray-900">Notifications</span>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white text-xs px-1.5 py-0">{unreadCount}</Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-xs gap-1.5" onClick={markAllRead}>
                <CheckCheck className="w-3.5 h-3.5" /> Tout marquer lu
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <Settings className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="space-y-4">
            <Card className="border border-gray-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5" /> Filtres
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <button
                  onClick={() => setFilter("all")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filter === "all" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Toutes ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter("unread")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${filter === "unread" ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  Non lues ({unreadCount})
                </button>
                <div className="border-t border-gray-100 my-2" />
                {(Object.entries(typeConfig) as [NotificationType, typeof typeConfig["inscription"]][]).map(([type, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={type}
                      onClick={() => setFilter(type)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between transition-colors ${filter === type ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="w-3.5 h-3.5" /> {config.label}
                      </span>
                      <span className="text-xs text-gray-400">{typeCounts[type] || 0}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="border border-gray-100">
              <CardContent className="p-4 space-y-3">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{notifications.length}</p>
                  <p className="text-xs text-gray-500">Total notifications</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-2 bg-red-50 rounded-lg">
                    <p className="text-lg font-bold text-red-600">{unreadCount}</p>
                    <p className="text-xs text-red-500">Non lues</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <p className="text-lg font-bold text-green-600">{notifications.length - unreadCount}</p>
                    <p className="text-xs text-green-500">Lues</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notifications List */}
          <div className="lg:col-span-3 space-y-2">
            {filteredNotifications.length === 0 ? (
              <Card className="border border-gray-100">
                <CardContent className="p-12 text-center">
                  <BellOff className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-gray-500 font-medium">Aucune notification</p>
                  <p className="text-sm text-gray-400 mt-1">Vous etes a jour !</p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((n) => {
                const config = typeConfig[n.type];
                const Icon = config.icon;
                return (
                  <div
                    key={n.id}
                    className={`bg-white rounded-xl border p-4 flex items-start gap-3 transition-all hover:shadow-sm ${
                      n.read ? "border-gray-100" : "border-blue-200 bg-blue-50/30"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${config.bg} shrink-0`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className={`text-sm ${n.read ? "text-gray-700" : "text-gray-900 font-medium"}`}>{n.title}</p>
                          <p className="text-sm text-gray-500 mt-0.5">{n.message}</p>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {n.time}
                        </span>
                        {!n.read && (
                          <button onClick={() => markRead(n.id)} className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                            <Check className="w-3 h-3" /> Marquer lu
                          </button>
                                        )}
                        <button onClick={() => deleteNotification(n.id)} className="text-xs text-gray-400 hover:text-red-500 flex items-center gap-1">
                          <Trash2 className="w-3 h-3" /> Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
