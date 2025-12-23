import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Users, UserPlus, Calendar, Clock, Phone, Mail,
  Building2, AlertCircle, CheckCircle2, ArrowRight,
  Filter, Search, Sparkles, MessageSquare, FileText,
  RefreshCw, ChevronDown, ChevronUp, LogOut, Loader2,
  LayoutDashboard, Kanban, BarChart3, Settings, X,
  TrendingUp, Target, Zap, Copy, PhoneCall, MailOpen,
  CalendarCheck, ChevronRight, MoreHorizontal, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import type { Lead, LeadActivity, Conversation, Message } from "@shared/schema";

const statusConfig: Record<string, { label: string; color: string; bgColor: string; iconColor: string }> = {
  new: { 
    label: "Nouveau", 
    color: "text-blue-700 dark:text-blue-300",
    bgColor: "bg-blue-50 dark:bg-blue-950/50",
    iconColor: "text-blue-500"
  },
  to_follow_up: { 
    label: "A relancer", 
    color: "text-amber-700 dark:text-amber-300",
    bgColor: "bg-amber-50 dark:bg-amber-950/50",
    iconColor: "text-amber-500"
  },
  in_progress: { 
    label: "En cours", 
    color: "text-purple-700 dark:text-purple-300",
    bgColor: "bg-purple-50 dark:bg-purple-950/50",
    iconColor: "text-purple-500"
  },
  qualified: { 
    label: "Qualifié", 
    color: "text-emerald-700 dark:text-emerald-300",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/50",
    iconColor: "text-emerald-500"
  },
  converted: { 
    label: "Converti", 
    color: "text-green-700 dark:text-green-300",
    bgColor: "bg-green-50 dark:bg-green-950/50",
    iconColor: "text-green-500"
  },
  lost: { 
    label: "Perdu", 
    color: "text-gray-700 dark:text-gray-300",
    bgColor: "bg-gray-50 dark:bg-gray-950/50",
    iconColor: "text-gray-500"
  },
};

const priorityConfig: Record<string, { label: string; color: string; dot: string }> = {
  low: { label: "Basse", color: "text-slate-600 dark:text-slate-400", dot: "bg-slate-400" },
  medium: { label: "Moyenne", color: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
  high: { label: "Haute", color: "text-orange-600 dark:text-orange-400", dot: "bg-orange-500" },
  urgent: { label: "Urgente", color: "text-red-600 dark:text-red-400", dot: "bg-red-500" },
};

const sourceLabels: Record<string, string> = {
  "agent-ia": "Commercial IA",
  "formation": "Formation",
  "contact": "Contact direct",
  "google_meet_booking": "RDV Google Meet",
};

interface AISuggestions {
  summary: string;
  recommendation: string;
  timing: string;
  script: string;
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = "primary" 
}: { 
  title: string; 
  value: number; 
  subtitle: string; 
  icon: any;
  trend?: number;
  color?: "primary" | "blue" | "amber" | "emerald" | "purple";
}) {
  const colorClasses = {
    primary: "from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10",
    blue: "from-blue-500/10 to-blue-500/5 dark:from-blue-500/20 dark:to-blue-500/10",
    amber: "from-amber-500/10 to-amber-500/5 dark:from-amber-500/20 dark:to-amber-500/10",
    emerald: "from-emerald-500/10 to-emerald-500/5 dark:from-emerald-500/20 dark:to-emerald-500/10",
    purple: "from-purple-500/10 to-purple-500/5 dark:from-purple-500/20 dark:to-purple-500/10",
  };
  
  const iconColors = {
    primary: "text-primary",
    blue: "text-blue-600 dark:text-blue-400",
    amber: "text-amber-600 dark:text-amber-400",
    emerald: "text-emerald-600 dark:text-emerald-400",
    purple: "text-purple-600 dark:text-purple-400",
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
            <div className="flex items-center gap-2 mt-2">
              {trend !== undefined && (
                <span className={`text-xs font-medium flex items-center gap-0.5 ${trend >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  <TrendingUp className={`h-3 w-3 ${trend < 0 ? 'rotate-180' : ''}`} />
                  {Math.abs(trend)}%
                </span>
              )}
              <span className="text-xs text-muted-foreground">{subtitle}</span>
            </div>
          </div>
          <div className={`rounded-xl p-3 bg-gradient-to-br ${colorClasses[color]}`}>
            <Icon className={`h-5 w-5 ${iconColors[color]}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function LeadCard({ 
  lead, 
  onClick,
  compact = false
}: { 
  lead: Lead; 
  onClick: () => void;
  compact?: boolean;
}) {
  const status = statusConfig[lead.status || "new"];
  const priority = priorityConfig[lead.priority || "medium"];
  
  return (
    <div 
      className="group p-4 rounded-lg border bg-card hover-elevate cursor-pointer transition-all"
      onClick={onClick}
      data-testid={`card-lead-${lead.id}`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold truncate">{lead.name}</p>
            {lead.company && (
              <p className="text-sm text-muted-foreground truncate">{lead.company}</p>
            )}
          </div>
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          onClick={(e) => { e.stopPropagation(); onClick(); }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
        <Mail className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{lead.email}</span>
      </div>
      
      {!compact && lead.phone && (
        <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
          <Phone className="h-3.5 w-3.5 shrink-0" />
          <span>{lead.phone}</span>
        </div>
      )}
      
      <div className="flex items-center justify-between gap-2 pt-3 border-t">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${status.bgColor} ${status.color}`}>
            {status.label}
          </span>
          <span className="flex items-center gap-1.5 text-xs">
            <span className={`h-2 w-2 rounded-full ${priority.dot}`} />
            <span className={priority.color}>{priority.label}</span>
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {lead.lastContactAt 
            ? new Date(lead.lastContactAt).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short' })
            : "Nouveau"}
        </span>
      </div>
    </div>
  );
}

function KanbanColumn({ 
  title, 
  leads, 
  icon: Icon, 
  color,
  onLeadClick 
}: { 
  title: string; 
  leads: Lead[]; 
  icon: any;
  color: string;
  onLeadClick: (lead: Lead) => void;
}) {
  return (
    <div className="flex-1 min-w-[280px] max-w-[320px]">
      <div className="flex items-center gap-2 mb-4 px-1">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="font-semibold text-sm">{title}</span>
        <Badge variant="secondary" className="ml-auto">{leads.length}</Badge>
      </div>
      <ScrollArea className="h-[calc(100vh-380px)]">
        <div className="space-y-3 pr-2">
          {leads.map((lead) => (
            <LeadCard 
              key={lead.id} 
              lead={lead} 
              onClick={() => onLeadClick(lead)}
              compact
            />
          ))}
          {leads.length === 0 && (
            <div className="text-center py-8 text-muted-foreground text-sm">
              Aucun lead
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default function CRM() {
  const { toast } = useToast();
  const { user, isLoading: authLoading, isAuthenticated, logout } = useAuth();
  const [view, setView] = useState<"dashboard" | "pipeline" | "list">("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [expandedConversation, setExpandedConversation] = useState<number | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({ 
        title: "Accès restreint", 
        description: "Veuillez vous connecter pour accéder au CRM.",
        variant: "destructive" 
      });
      setTimeout(() => { window.location.href = "/api/login"; }, 1000);
    }
  }, [authLoading, isAuthenticated, toast]);

  const { data: leads = [], isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/crm/leads"],
    enabled: isAuthenticated,
  });

  const { data: followUpLeads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/crm/leads/follow-up"],
    enabled: isAuthenticated,
  });

  const { data: leadDetails, isLoading: detailsLoading } = useQuery<{ 
    lead: Lead; 
    activities: LeadActivity[]; 
    conversations: (Conversation & { messages: Message[] })[] 
  }>({
    queryKey: ["/api/crm/leads", selectedLead?.id],
    enabled: !!selectedLead?.id && isAuthenticated,
  });

  const updateLeadMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Lead> }) => {
      const res = await apiRequest("PATCH", `/api/crm/leads/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/leads"] });
      queryClient.invalidateQueries({ queryKey: ["/api/crm/leads/follow-up"] });
      toast({ title: "Lead mis à jour" });
    },
  });

  const addActivityMutation = useMutation({
    mutationFn: async ({ leadId, type, content }: { leadId: number; type: string; content: string }) => {
      const res = await apiRequest("POST", `/api/crm/leads/${leadId}/activities`, { type, content });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/leads", selectedLead?.id] });
      setNewNote("");
      toast({ title: "Note ajoutée" });
    },
  });

  const fetchAiSuggestions = async (leadId: number) => {
    setLoadingAi(true);
    try {
      const response = await apiRequest("POST", "/api/crm/ai/suggestions", { leadId });
      const data = await response.json();
      setAiSuggestions(data as AISuggestions);
    } catch (error) {
      toast({ title: "Erreur", description: "Impossible d'obtenir les suggestions IA", variant: "destructive" });
    } finally {
      setLoadingAi(false);
    }
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lead.company?.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || lead.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "new").length,
    toFollowUp: followUpLeads.length,
    qualified: leads.filter(l => l.status === "qualified").length,
    converted: leads.filter(l => l.status === "converted").length,
    inProgress: leads.filter(l => l.status === "in_progress").length,
  };

  const conversionRate = stats.total > 0 ? Math.round((stats.converted / stats.total) * 100) : 0;

  const openLeadPanel = (lead: Lead) => {
    setSelectedLead(lead);
    setShowPanel(true);
    setAiSuggestions(null);
  };

  const closePanel = () => {
    setShowPanel(false);
    setTimeout(() => setSelectedLead(null), 300);
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">
            {authLoading ? "Chargement..." : "Redirection vers la connexion..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <span className="font-bold text-xl text-primary">A.SAP</span>
              </Link>
              <Separator orientation="vertical" className="h-6" />
              <span className="font-semibold text-lg hidden sm:inline">SunuCRM</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-1 p-1 bg-muted rounded-lg">
                <Button 
                  variant={view === "dashboard" ? "secondary" : "ghost"} 
                  size="sm"
                  onClick={() => setView("dashboard")}
                  data-testid="button-view-dashboard"
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Tableau de bord
                </Button>
                <Button 
                  variant={view === "pipeline" ? "secondary" : "ghost"} 
                  size="sm"
                  onClick={() => setView("pipeline")}
                  data-testid="button-view-pipeline"
                >
                  <Kanban className="h-4 w-4 mr-2" />
                  Pipeline
                </Button>
                <Button 
                  variant={view === "list" ? "secondary" : "ghost"} 
                  size="sm"
                  onClick={() => setView("list")}
                  data-testid="button-view-list"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Liste
                </Button>
              </div>
              
              <Separator orientation="vertical" className="h-6 hidden md:block" />
              
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImageUrl || undefined} alt={user?.firstName || "User"} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {user?.firstName?.[0] || user?.email?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium hidden lg:inline">
                  {user?.firstName || user?.email?.split("@")[0] || "Admin"}
                </span>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => logout()}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-6 py-6">
        {view === "dashboard" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold" data-testid="text-crm-title">
                Tableau de bord
              </h1>
              <p className="text-muted-foreground">
                Vue d'ensemble de vos prospects et performances commerciales
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard 
                title="Total Leads" 
                value={stats.total} 
                subtitle="contacts"
                icon={Users}
                color="primary"
              />
              <StatCard 
                title="Nouveaux" 
                value={stats.new} 
                subtitle="cette semaine"
                icon={UserPlus}
                color="blue"
              />
              <StatCard 
                title="A Relancer" 
                value={stats.toFollowUp} 
                subtitle="urgents"
                icon={AlertCircle}
                color="amber"
              />
              <StatCard 
                title="Taux Conversion" 
                value={conversionRate} 
                subtitle="%"
                icon={Target}
                color="emerald"
              />
            </div>

            {followUpLeads.length > 0 && (
              <Card className="border-amber-200 dark:border-amber-800/50 bg-amber-50/50 dark:bg-amber-950/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/50">
                        <AlertCircle className="h-4 w-4 text-amber-600" />
                      </div>
                      Relances prioritaires
                    </CardTitle>
                    <Badge variant="secondary">{followUpLeads.length} leads</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {followUpLeads.slice(0, 6).map((lead) => (
                      <div 
                        key={lead.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-background border hover-elevate cursor-pointer"
                        onClick={() => openLeadPanel(lead)}
                        data-testid={`button-followup-${lead.id}`}
                      >
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 text-xs font-medium">
                            {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{lead.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{lead.company || lead.email}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-base">Leads récents</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setView("list")}
                    >
                      Voir tout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {leadsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : leads.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <Users className="mx-auto h-12 w-12 mb-4 opacity-30" />
                      <p>Aucun lead pour le moment</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {leads.slice(0, 5).map((lead) => (
                        <div 
                          key={lead.id}
                          className="flex items-center gap-4 p-3 rounded-lg hover-elevate cursor-pointer"
                          onClick={() => openLeadPanel(lead)}
                          data-testid={`row-lead-${lead.id}`}
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                              {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{lead.name}</p>
                              <span className={`h-2 w-2 rounded-full ${priorityConfig[lead.priority || "medium"].dot}`} />
                            </div>
                            <p className="text-sm text-muted-foreground truncate">
                              {lead.company || lead.email}
                            </p>
                          </div>
                          <div className="hidden sm:block">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${statusConfig[lead.status || "new"].bgColor} ${statusConfig[lead.status || "new"].color}`}>
                              {statusConfig[lead.status || "new"].label}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground hidden md:block">
                            {lead.createdAt && new Date(lead.createdAt).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Pipeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Nouveaux", value: stats.new, color: "bg-blue-500" },
                    { label: "En cours", value: stats.inProgress, color: "bg-purple-500" },
                    { label: "Qualifiés", value: stats.qualified, color: "bg-emerald-500" },
                    { label: "Convertis", value: stats.converted, color: "bg-green-500" },
                  ].map((stage) => (
                    <div key={stage.label} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{stage.label}</span>
                        <span className="font-medium">{stage.value}</span>
                      </div>
                      <Progress 
                        value={stats.total > 0 ? (stage.value / stats.total) * 100 : 0} 
                        className="h-2"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {view === "pipeline" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">Pipeline commercial</h1>
              <p className="text-muted-foreground">
                Visualisez et gérez vos leads par étape du parcours client
              </p>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4">
              <KanbanColumn 
                title="Nouveaux"
                leads={leads.filter(l => l.status === "new")}
                icon={UserPlus}
                color="text-blue-500"
                onLeadClick={openLeadPanel}
              />
              <KanbanColumn 
                title="A relancer"
                leads={leads.filter(l => l.status === "to_follow_up")}
                icon={AlertCircle}
                color="text-amber-500"
                onLeadClick={openLeadPanel}
              />
              <KanbanColumn 
                title="En cours"
                leads={leads.filter(l => l.status === "in_progress")}
                icon={Zap}
                color="text-purple-500"
                onLeadClick={openLeadPanel}
              />
              <KanbanColumn 
                title="Qualifiés"
                leads={leads.filter(l => l.status === "qualified")}
                icon={CheckCircle2}
                color="text-emerald-500"
                onLeadClick={openLeadPanel}
              />
              <KanbanColumn 
                title="Convertis"
                leads={leads.filter(l => l.status === "converted")}
                icon={Target}
                color="text-green-500"
                onLeadClick={openLeadPanel}
              />
            </div>
          </div>
        )}

        {view === "list" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold">Tous les leads</h1>
              <p className="text-muted-foreground">
                Gérez et filtrez l'ensemble de vos contacts commerciaux
              </p>
            </div>

            <Card>
              <CardHeader className="border-b">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher un lead..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                      data-testid="input-search-leads"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
                        <SelectValue placeholder="Statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous statuts</SelectItem>
                        {Object.entries(statusConfig).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger className="w-[150px]" data-testid="select-priority-filter">
                        <SelectValue placeholder="Priorité" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes</SelectItem>
                        {Object.entries(priorityConfig).map(([key, { label }]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {leadsLoading ? (
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <div className="text-center py-16 text-muted-foreground">
                    <Users className="mx-auto h-12 w-12 mb-4 opacity-30" />
                    <p>Aucun lead trouvé</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {filteredLeads.map((lead) => (
                      <div 
                        key={lead.id}
                        className="flex items-center gap-4 p-4 hover-elevate cursor-pointer"
                        onClick={() => openLeadPanel(lead)}
                        data-testid={`row-lead-${lead.id}`}
                      >
                        <Avatar className="h-11 w-11 shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {lead.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-semibold">{lead.name}</p>
                            <span className={`h-2 w-2 rounded-full shrink-0 ${priorityConfig[lead.priority || "medium"].dot}`} />
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5 truncate">
                              <Mail className="h-3.5 w-3.5 shrink-0" />
                              {lead.email}
                            </span>
                            {lead.company && (
                              <span className="hidden lg:flex items-center gap-1.5">
                                <Building2 className="h-3.5 w-3.5" />
                                {lead.company}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="hidden md:block shrink-0">
                          <span className="text-sm text-muted-foreground">
                            {sourceLabels[lead.source || ""] || lead.source || "N/A"}
                          </span>
                        </div>
                        <div className="hidden sm:block shrink-0">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${statusConfig[lead.status || "new"].bgColor} ${statusConfig[lead.status || "new"].color}`}>
                            {statusConfig[lead.status || "new"].label}
                          </span>
                        </div>
                        <div className="hidden lg:flex items-center gap-1.5 text-sm text-muted-foreground shrink-0">
                          <Clock className="h-3.5 w-3.5" />
                          {lead.lastContactAt 
                            ? new Date(lead.lastContactAt).toLocaleDateString("fr-FR", { day: 'numeric', month: 'short' })
                            : "Jamais"}
                        </div>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          className="shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            openLeadPanel(lead);
                          }}
                          data-testid={`button-view-${lead.id}`}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <div 
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity ${showPanel ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closePanel}
      />
      
      <div className={`fixed right-0 top-0 z-50 h-full w-full max-w-xl bg-background border-l shadow-xl transition-transform duration-300 ${showPanel ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedLead && (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between gap-4 p-4 border-b bg-muted/30">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {selectedLead.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h2 className="font-semibold text-lg truncate">{selectedLead.name}</h2>
                  <p className="text-sm text-muted-foreground truncate">
                    {selectedLead.company || selectedLead.email}
                  </p>
                </div>
              </div>
              <Button size="icon" variant="ghost" onClick={closePanel}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2 p-4 border-b">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${statusConfig[selectedLead.status || "new"].bgColor} ${statusConfig[selectedLead.status || "new"].color}`}>
                {statusConfig[selectedLead.status || "new"].label}
              </span>
              <span className="flex items-center gap-1.5 text-xs">
                <span className={`h-2 w-2 rounded-full ${priorityConfig[selectedLead.priority || "medium"].dot}`} />
                <span className={priorityConfig[selectedLead.priority || "medium"].color}>
                  Priorité {priorityConfig[selectedLead.priority || "medium"].label.toLowerCase()}
                </span>
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                Créé le {selectedLead.createdAt && new Date(selectedLead.createdAt).toLocaleDateString("fr-FR")}
              </span>
            </div>

            <Tabs defaultValue="info" className="flex-1 flex flex-col overflow-hidden">
              <TabsList className="w-full justify-start rounded-none border-b bg-transparent p-0 h-auto">
                <TabsTrigger 
                  value="info" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
                >
                  Infos
                </TabsTrigger>
                <TabsTrigger 
                  value="conversations"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
                >
                  Conversations
                </TabsTrigger>
                <TabsTrigger 
                  value="ai"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
                >
                  <Sparkles className="h-4 w-4 mr-1.5" />
                  IA
                </TabsTrigger>
                <TabsTrigger 
                  value="actions"
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3 px-4"
                >
                  Actions
                </TabsTrigger>
              </TabsList>

              <ScrollArea className="flex-1">
                <TabsContent value="info" className="m-0 p-4">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Contact</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="text-sm">{selectedLead.email}</span>
                        </div>
                        {selectedLead.phone && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm">{selectedLead.phone}</span>
                          </div>
                        )}
                        {selectedLead.company && (
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
                            <span className="text-sm">{selectedLead.company}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {selectedLead.notes && (
                      <div>
                        <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Notes</h4>
                        <p className="text-sm p-3 rounded-lg bg-muted/50">{selectedLead.notes}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Historique</h4>
                      {detailsLoading ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        </div>
                      ) : !leadDetails?.activities?.length ? (
                        <p className="text-sm text-muted-foreground text-center py-8">Aucune activité</p>
                      ) : (
                        <div className="space-y-3">
                          {leadDetails.activities.map((activity) => (
                            <div key={activity.id} className="flex gap-3">
                              <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
                              <div className="flex-1">
                                <p className="text-sm">
                                  <span className="font-medium capitalize">{activity.type.replace("_", " ")}</span>
                                  {" - "}{activity.content}
                                </p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {new Date(activity.createdAt).toLocaleString("fr-FR")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="conversations" className="m-0 p-4">
                  {detailsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : !leadDetails?.conversations?.length ? (
                    <div className="text-center py-12 text-muted-foreground">
                      <MessageSquare className="mx-auto h-10 w-10 mb-3 opacity-30" />
                      <p className="text-sm">Aucune conversation</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {leadDetails.conversations.map((conv) => (
                        <div key={conv.id} className="border rounded-lg overflow-hidden">
                          <div 
                            className="flex items-center gap-3 p-3 bg-muted/30 cursor-pointer hover-elevate"
                            onClick={() => setExpandedConversation(
                              expandedConversation === conv.id ? null : conv.id
                            )}
                          >
                            <MessageSquare className="h-4 w-4 text-primary shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{conv.title}</p>
                              {conv.commercialName && (
                                <p className="text-xs text-muted-foreground">{conv.commercialName}</p>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0">
                              {new Date(conv.createdAt).toLocaleDateString("fr-FR")}
                            </span>
                            {expandedConversation === conv.id ? (
                              <ChevronUp className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          {expandedConversation === conv.id && (
                            <div className="p-3 space-y-2 max-h-60 overflow-y-auto border-t">
                              {conv.messages.map((msg) => (
                                <div 
                                  key={msg.id}
                                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                >
                                  <div 
                                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                                      msg.role === "user" 
                                        ? "bg-primary text-primary-foreground" 
                                        : "bg-muted"
                                    }`}
                                  >
                                    {msg.content}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="ai" className="m-0 p-4">
                  {!aiSuggestions && !loadingAi && (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold mb-2">Analyse IA</h3>
                      <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto">
                        Obtenez des recommandations personnalisées pour ce lead
                      </p>
                      <Button 
                        onClick={() => fetchAiSuggestions(selectedLead.id)}
                        disabled={loadingAi}
                        data-testid="button-get-ai-suggestions"
                      >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Analyser ce lead
                      </Button>
                    </div>
                  )}

                  {loadingAi && (
                    <div className="text-center py-12">
                      <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
                      <p className="text-sm text-muted-foreground">Analyse en cours...</p>
                    </div>
                  )}

                  {aiSuggestions && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <h4 className="font-semibold text-sm">Résumé</h4>
                        </div>
                        <p className="text-sm text-muted-foreground">{aiSuggestions.summary}</p>
                      </div>

                      <div className="p-4 rounded-lg border bg-emerald-50/50 dark:bg-emerald-950/20">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <h4 className="font-semibold text-sm">Action recommandée</h4>
                        </div>
                        <p className="text-sm">{aiSuggestions.recommendation}</p>
                      </div>

                      <div className="p-4 rounded-lg border bg-amber-50/50 dark:bg-amber-950/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-amber-600" />
                          <h4 className="font-semibold text-sm">Meilleur moment</h4>
                        </div>
                        <p className="text-sm">{aiSuggestions.timing}</p>
                      </div>

                      <div className="p-4 rounded-lg border">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-purple-600" />
                            <h4 className="font-semibold text-sm">Script de relance</h4>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(aiSuggestions.script);
                              toast({ title: "Script copié" });
                            }}
                            data-testid="button-copy-script"
                          >
                            <Copy className="h-3.5 w-3.5 mr-1.5" />
                            Copier
                          </Button>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{aiSuggestions.script}</p>
                      </div>

                      <Button 
                        variant="outline" 
                        onClick={() => fetchAiSuggestions(selectedLead.id)}
                        className="w-full"
                        data-testid="button-refresh-ai"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Rafraîchir
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="actions" className="m-0 p-4">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Statut</h4>
                      <Select 
                        value={selectedLead.status || "new"}
                        onValueChange={(value) => {
                          updateLeadMutation.mutate({ id: selectedLead.id, data: { status: value } });
                          setSelectedLead({ ...selectedLead, status: value });
                        }}
                      >
                        <SelectTrigger data-testid="select-change-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusConfig).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Priorité</h4>
                      <Select 
                        value={selectedLead.priority || "medium"}
                        onValueChange={(value) => {
                          updateLeadMutation.mutate({ id: selectedLead.id, data: { priority: value } });
                          setSelectedLead({ ...selectedLead, priority: value });
                        }}
                      >
                        <SelectTrigger data-testid="select-change-priority">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(priorityConfig).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Planifier relance</h4>
                      <Input 
                        type="datetime-local"
                        onChange={(e) => {
                          if (e.target.value) {
                            const date = new Date(e.target.value);
                            updateLeadMutation.mutate({ 
                              id: selectedLead.id, 
                              data: { nextFollowUpAt: date } 
                            });
                            toast({ title: "Relance planifiée" });
                          }
                        }}
                        data-testid="input-schedule-followup"
                      />
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Ajouter une note</h4>
                      <Textarea
                        placeholder="Votre note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="mb-3"
                        rows={3}
                        data-testid="textarea-note"
                      />
                      <Button 
                        onClick={() => {
                          if (newNote.trim()) {
                            addActivityMutation.mutate({
                              leadId: selectedLead.id,
                              type: "note",
                              content: newNote.trim()
                            });
                          }
                        }}
                        disabled={!newNote.trim() || addActivityMutation.isPending}
                        className="w-full"
                        data-testid="button-add-note"
                      >
                        Ajouter
                      </Button>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Actions rapides</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          className="flex-col h-auto py-4 gap-2"
                          onClick={() => {
                            addActivityMutation.mutate({
                              leadId: selectedLead.id,
                              type: "call",
                              content: "Appel passé"
                            });
                          }}
                          data-testid="button-log-call"
                        >
                          <PhoneCall className="h-5 w-5" />
                          <span className="text-xs">Appel</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-col h-auto py-4 gap-2"
                          onClick={() => {
                            addActivityMutation.mutate({
                              leadId: selectedLead.id,
                              type: "email",
                              content: "Email envoyé"
                            });
                          }}
                          data-testid="button-log-email"
                        >
                          <MailOpen className="h-5 w-5" />
                          <span className="text-xs">Email</span>
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-col h-auto py-4 gap-2"
                          onClick={() => {
                            addActivityMutation.mutate({
                              leadId: selectedLead.id,
                              type: "meeting",
                              content: "RDV effectué"
                            });
                          }}
                          data-testid="button-log-meeting"
                        >
                          <CalendarCheck className="h-5 w-5" />
                          <span className="text-xs">RDV</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}
