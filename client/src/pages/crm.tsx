import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  Users, UserPlus, Calendar, Clock, Phone, Mail,
  Building2, AlertCircle, CheckCircle2, ArrowRight,
  Filter, Search, Sparkles, MessageSquare, FileText,
  RefreshCw, ChevronDown, ChevronUp, ExternalLink
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Lead, LeadActivity, Conversation, Message } from "@shared/schema";

const statusLabels: Record<string, { label: string; color: string }> = {
  new: { label: "Nouveau", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  to_follow_up: { label: "A relancer", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  in_progress: { label: "En cours", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  qualified: { label: "Qualifié", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  converted: { label: "Converti", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
  lost: { label: "Perdu", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" },
};

const priorityLabels: Record<string, { label: string; color: string }> = {
  low: { label: "Basse", color: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300" },
  medium: { label: "Moyenne", color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300" },
  high: { label: "Haute", color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-300" },
  urgent: { label: "Urgente", color: "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300" },
};

const sourceLabels: Record<string, string> = {
  "agent-ia": "Commercial IA",
  "formation": "Formation",
  "contact": "Contact direct",
  "google_meet_booking": "RDV Google Meet",
};

interface LeadWithDetails extends Lead {
  activities?: LeadActivity[];
  conversations?: (Conversation & { messages: Message[] })[];
}

interface AISuggestions {
  summary: string;
  recommendation: string;
  timing: string;
  script: string;
}

export default function CRM() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showLeadDetail, setShowLeadDetail] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [expandedConversation, setExpandedConversation] = useState<number | null>(null);

  const { data: leads = [], isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/crm/leads"],
  });

  const { data: followUpLeads = [] } = useQuery<Lead[]>({
    queryKey: ["/api/crm/leads/follow-up"],
  });

  const { data: leadDetails, isLoading: detailsLoading } = useQuery<{ 
    lead: Lead; 
    activities: LeadActivity[]; 
    conversations: (Conversation & { messages: Message[] })[] 
  }>({
    queryKey: ["/api/crm/leads", selectedLead?.id],
    enabled: !!selectedLead?.id,
  });

  const [aiSuggestions, setAiSuggestions] = useState<AISuggestions | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

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
  };

  const openLeadDetail = (lead: Lead) => {
    setSelectedLead(lead);
    setShowLeadDetail(true);
    setAiSuggestions(null);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-crm-title">
            Tableau de bord CRM
          </h1>
          <p className="text-muted-foreground">
            Gérez vos leads et suivez les relances avec l'aide de l'IA
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-5 mb-8">
          <Card data-testid="stat-total-leads">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total leads</p>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="stat-new-leads">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-3">
                <UserPlus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.new}</p>
                <p className="text-sm text-muted-foreground">Nouveaux</p>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="stat-followup-leads">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900/30 p-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.toFollowUp}</p>
                <p className="text-sm text-muted-foreground">A relancer</p>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="stat-qualified-leads">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.qualified}</p>
                <p className="text-sm text-muted-foreground">Qualifiés</p>
              </div>
            </CardContent>
          </Card>
          <Card data-testid="stat-converted-leads">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-lg bg-emerald-100 dark:bg-emerald-900/30 p-3">
                <Calendar className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.converted}</p>
                <p className="text-sm text-muted-foreground">Convertis</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {followUpLeads.length > 0 && (
          <Card className="mb-8 border-yellow-200 dark:border-yellow-800" data-testid="card-followup-alert">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                Relances à faire aujourd'hui
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {followUpLeads.slice(0, 5).map((lead) => (
                  <Button
                    key={lead.id}
                    variant="outline"
                    size="sm"
                    onClick={() => openLeadDetail(lead)}
                    className="border-yellow-200 dark:border-yellow-800"
                    data-testid={`button-followup-${lead.id}`}
                  >
                    {lead.name}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ))}
                {followUpLeads.length > 5 && (
                  <Badge variant="secondary">+{followUpLeads.length - 5} autres</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Liste des leads
              </CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                    data-testid="input-search-leads"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    {Object.entries(statusLabels).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[140px]" data-testid="select-priority-filter">
                    <SelectValue placeholder="Priorité" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes priorités</SelectItem>
                    {Object.entries(priorityLabels).map(([key, { label }]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {leadsLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>Aucun lead trouvé</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full" data-testid="table-leads">
                  <thead>
                    <tr className="border-b text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Lead</th>
                      <th className="pb-3 font-medium">Source</th>
                      <th className="pb-3 font-medium">Statut</th>
                      <th className="pb-3 font-medium">Priorité</th>
                      <th className="pb-3 font-medium">Dernier contact</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead) => (
                      <tr 
                        key={lead.id} 
                        className="border-b last:border-0 hover-elevate cursor-pointer"
                        onClick={() => openLeadDetail(lead)}
                        data-testid={`row-lead-${lead.id}`}
                      >
                        <td className="py-4">
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {lead.email}
                            </div>
                            {lead.company && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Building2 className="h-3 w-3" />
                                {lead.company}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="text-sm">{sourceLabels[lead.source || ""] || lead.source}</span>
                        </td>
                        <td className="py-4">
                          <Badge className={statusLabels[lead.status || "new"]?.color}>
                            {statusLabels[lead.status || "new"]?.label}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <Badge className={priorityLabels[lead.priority || "medium"]?.color}>
                            {priorityLabels[lead.priority || "medium"]?.label}
                          </Badge>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {lead.lastContactAt 
                              ? new Date(lead.lastContactAt).toLocaleDateString("fr-FR")
                              : "Jamais"}
                          </div>
                        </td>
                        <td className="py-4">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              openLeadDetail(lead);
                            }}
                            data-testid={`button-view-${lead.id}`}
                          >
                            Voir fiche
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={showLeadDetail} onOpenChange={setShowLeadDetail}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between gap-4 flex-wrap">
              <span>Fiche client: {selectedLead?.name}</span>
              <div className="flex items-center gap-2">
                <Badge className={statusLabels[selectedLead?.status || "new"]?.color}>
                  {statusLabels[selectedLead?.status || "new"]?.label}
                </Badge>
                <Badge className={priorityLabels[selectedLead?.priority || "medium"]?.color}>
                  {priorityLabels[selectedLead?.priority || "medium"]?.label}
                </Badge>
              </div>
            </DialogTitle>
            <DialogDescription>
              {selectedLead?.email} {selectedLead?.phone && `| ${selectedLead.phone}`}
              {selectedLead?.company && ` | ${selectedLead.company}`}
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="overview" className="flex-1 overflow-hidden flex flex-col">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" data-testid="tab-overview">
                <FileText className="mr-2 h-4 w-4" />
                Vue d'ensemble
              </TabsTrigger>
              <TabsTrigger value="conversations" data-testid="tab-conversations">
                <MessageSquare className="mr-2 h-4 w-4" />
                Conversations
              </TabsTrigger>
              <TabsTrigger value="ai" data-testid="tab-ai">
                <Sparkles className="mr-2 h-4 w-4" />
                Suggestions IA
              </TabsTrigger>
              <TabsTrigger value="actions" data-testid="tab-actions">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Actions
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="overview" className="h-full mt-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4 pr-4">
                    <div>
                      <h4 className="font-medium mb-2">Informations</h4>
                      <div className="grid gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          {selectedLead?.email}
                        </div>
                        {selectedLead?.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {selectedLead.phone}
                          </div>
                        )}
                        {selectedLead?.company && (
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            {selectedLead.company}
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          Créé le {selectedLead?.createdAt && new Date(selectedLead.createdAt).toLocaleDateString("fr-FR")}
                        </div>
                      </div>
                    </div>
                    
                    {selectedLead?.notes && (
                      <div>
                        <h4 className="font-medium mb-2">Notes</h4>
                        <p className="text-sm text-muted-foreground">{selectedLead.notes}</p>
                      </div>
                    )}

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-2">Historique des activités</h4>
                      {detailsLoading ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : leadDetails?.activities?.length === 0 ? (
                        <p className="text-sm text-muted-foreground">Aucune activité</p>
                      ) : (
                        <div className="space-y-2">
                          {leadDetails?.activities?.map((activity) => (
                            <div key={activity.id} className="flex items-start gap-2 text-sm">
                              <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                              <div>
                                <span className="font-medium capitalize">{activity.type.replace("_", " ")}</span>
                                <span className="text-muted-foreground"> - {activity.content}</span>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(activity.createdAt).toLocaleString("fr-FR")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="conversations" className="h-full mt-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4 pr-4">
                    {detailsLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : !leadDetails?.conversations?.length ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <MessageSquare className="mx-auto h-8 w-8 mb-2 opacity-50" />
                        <p>Aucune conversation avec ce lead</p>
                      </div>
                    ) : (
                      leadDetails.conversations.map((conv) => (
                        <Card key={conv.id} className="overflow-hidden">
                          <CardHeader 
                            className="cursor-pointer py-3"
                            onClick={() => setExpandedConversation(
                              expandedConversation === conv.id ? null : conv.id
                            )}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-primary" />
                                <span className="font-medium">{conv.title}</span>
                                {conv.commercialName && (
                                  <Badge variant="outline" className="text-xs">
                                    {conv.commercialName}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground">
                                  {new Date(conv.createdAt).toLocaleDateString("fr-FR")}
                                </span>
                                {expandedConversation === conv.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          {expandedConversation === conv.id && (
                            <CardContent className="border-t bg-muted/30 pt-4">
                              <div className="space-y-3 max-h-60 overflow-y-auto">
                                {conv.messages.map((msg) => (
                                  <div 
                                    key={msg.id}
                                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                                  >
                                    <div 
                                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
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
                            </CardContent>
                          )}
                        </Card>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="ai" className="h-full mt-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4 pr-4">
                    {!aiSuggestions && !loadingAi && (
                      <div className="text-center py-8">
                        <Sparkles className="mx-auto h-12 w-12 text-primary mb-4" />
                        <p className="text-muted-foreground mb-4">
                          L'IA va analyser ce lead et vous proposer des recommandations de suivi personnalisées
                        </p>
                        <Button 
                          onClick={() => selectedLead && fetchAiSuggestions(selectedLead.id)}
                          disabled={loadingAi}
                          data-testid="button-get-ai-suggestions"
                        >
                          <Sparkles className="mr-2 h-4 w-4" />
                          Obtenir des suggestions IA
                        </Button>
                      </div>
                    )}

                    {loadingAi && (
                      <div className="text-center py-8">
                        <RefreshCw className="mx-auto h-8 w-8 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Analyse du lead en cours...</p>
                      </div>
                    )}

                    {aiSuggestions && (
                      <div className="space-y-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <FileText className="h-4 w-4 text-primary" />
                              Résumé du lead
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{aiSuggestions.summary}</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              Action recommandée
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{aiSuggestions.recommendation}</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Clock className="h-4 w-4 text-yellow-600" />
                              Meilleur moment
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm">{aiSuggestions.timing}</p>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-purple-600" />
                              Script de relance
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm whitespace-pre-wrap">{aiSuggestions.script}</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="mt-3"
                              onClick={() => {
                                navigator.clipboard.writeText(aiSuggestions.script);
                                toast({ title: "Script copié" });
                              }}
                              data-testid="button-copy-script"
                            >
                              Copier le script
                            </Button>
                          </CardContent>
                        </Card>

                        <Button 
                          variant="outline" 
                          onClick={() => selectedLead && fetchAiSuggestions(selectedLead.id)}
                          className="w-full"
                          data-testid="button-refresh-ai"
                        >
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Rafraîchir les suggestions
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="actions" className="h-full mt-4">
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4 pr-4">
                    <div>
                      <h4 className="font-medium mb-3">Changer le statut</h4>
                      <Select 
                        value={selectedLead?.status || "new"}
                        onValueChange={(value) => {
                          if (selectedLead) {
                            updateLeadMutation.mutate({ id: selectedLead.id, data: { status: value } });
                            setSelectedLead({ ...selectedLead, status: value });
                          }
                        }}
                      >
                        <SelectTrigger data-testid="select-change-status">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(statusLabels).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Changer la priorité</h4>
                      <Select 
                        value={selectedLead?.priority || "medium"}
                        onValueChange={(value) => {
                          if (selectedLead) {
                            updateLeadMutation.mutate({ id: selectedLead.id, data: { priority: value } });
                            setSelectedLead({ ...selectedLead, priority: value });
                          }
                        }}
                      >
                        <SelectTrigger data-testid="select-change-priority">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(priorityLabels).map(([key, { label }]) => (
                            <SelectItem key={key} value={key}>{label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <h4 className="font-medium mb-3">Planifier une relance</h4>
                      <Input 
                        type="datetime-local"
                        onChange={(e) => {
                          if (selectedLead && e.target.value) {
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
                      <h4 className="font-medium mb-3">Ajouter une note</h4>
                      <Textarea
                        placeholder="Écrivez votre note..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="mb-2"
                        data-testid="textarea-note"
                      />
                      <Button 
                        onClick={() => {
                          if (selectedLead && newNote.trim()) {
                            addActivityMutation.mutate({
                              leadId: selectedLead.id,
                              type: "note",
                              content: newNote.trim()
                            });
                          }
                        }}
                        disabled={!newNote.trim() || addActivityMutation.isPending}
                        data-testid="button-add-note"
                      >
                        Ajouter la note
                      </Button>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="font-medium mb-3">Actions rapides</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (selectedLead) {
                              addActivityMutation.mutate({
                                leadId: selectedLead.id,
                                type: "call",
                                content: "Appel passé"
                              });
                            }
                          }}
                          data-testid="button-log-call"
                        >
                          <Phone className="mr-2 h-4 w-4" />
                          Appel passé
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (selectedLead) {
                              addActivityMutation.mutate({
                                leadId: selectedLead.id,
                                type: "email",
                                content: "Email envoyé"
                              });
                            }
                          }}
                          data-testid="button-log-email"
                        >
                          <Mail className="mr-2 h-4 w-4" />
                          Email envoyé
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (selectedLead) {
                              addActivityMutation.mutate({
                                leadId: selectedLead.id,
                                type: "meeting",
                                content: "RDV effectué"
                              });
                            }
                          }}
                          data-testid="button-log-meeting"
                        >
                          <Calendar className="mr-2 h-4 w-4" />
                          RDV effectué
                        </Button>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
