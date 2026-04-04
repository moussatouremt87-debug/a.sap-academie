import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "../lib/i18n";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users, UserPlus, TrendingUp, Phone, Mail, Building2,
  Search, Filter, ChevronRight, Clock, Star, MessageSquare,
  BarChart3, Target, ArrowUpRight, ArrowDownRight, Plus,
  Edit2, Trash2, X, Check, Send, MessageCircle,
} from "lucide-react";
import {
  getLeads, createLead, updateLead, deleteLead,
  getConversations, addConversation,
  getCrmStats,
  type Lead, type Conversation,
} from "../lib/supabaseClient";

const statusColors: Record<string, string> = {
  Nouveau: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  contact: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  qualified: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  converted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
};

const statusLabels: Record<string, { fr: string; en: string }> = {
  Nouveau: { fr: "Nouveau", en: "New" },
  contact: { fr: "Contacté", en: "Contacted" },
  qualified: { fr: "Qualifié", en: "Qualified" },
  converted: { fr: "Converti", en: "Converted" },
};

const priorityColors: Record<string, string> = {
  high: "text-red-500",
  medium: "text-yellow-500",
  low: "text-gray-400",
};

interface CrmStats {
  total: number;
  nouveau: number;
  contact: number;
  qualified: number;
  converted: number;
  highPriority: number;
}

export default function CRM() {
  const { language } = useTranslation();
  const t = language === "fr";

  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<CrmStats>({ total: 0, nouveau: 0, contact: 0, qualified: 0, converted: 0, highPriority: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLead, setEditingLead] = useState<Partial<Lead> | null>(null);

  // Load data
  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [leadsData, statsData] = await Promise.all([getLeads(), getCrmStats()]);
      setLeads(leadsData);
      setStats(statsData);
    } catch (err) {
      console.error("Error loading CRM data:", err);
    }
    setLoading(false);
  }

  // Load conversations when lead selected
  useEffect(() => {
    if (selectedLead) {
      getConversations(selectedLead.id).then(setConversations).catch(console.error);
    }
  }, [selectedLead]);

  // Filter leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        !search ||
        lead.name.toLowerCase().includes(search.toLowerCase()) ||
        (lead.company || "").toLowerCase().includes(search.toLowerCase()) ||
        (lead.email || "").toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [leads, search, statusFilter]);

  // Pipeline groups
  const pipeline = useMemo(() => {
    const groups: Record<string, Lead[]> = { Nouveau: [], contact: [], qualified: [], converted: [] };
    leads.forEach((lead) => {
      if (groups[lead.status]) groups[lead.status].push(lead);
    });
    return groups;
  }, [leads]);

  // Add lead
  async function handleAddLead() {
    if (!editingLead?.name) return;
    try {
      await createLead({
        name: editingLead.name,
        email: editingLead.email || null,
        phone: editingLead.phone || null,
        company: editingLead.company || null,
        status: "Nouveau",
        priority: "medium",
        source: "manual",
        notes: editingLead.notes || null,
      });
      setShowAddForm(false);
      setEditingLead(null);
      loadData();
    } catch (err) {
      console.error("Error creating lead:", err);
    }
  }

  // Update lead status
  async function handleStatusChange(lead: Lead, newStatus: string) {
    try {
      await updateLead(lead.id, { status: newStatus as Lead["status"] });
      loadData();
      if (selectedLead?.id === lead.id) {
        setSelectedLead({ ...lead, status: newStatus as Lead["status"] });
      }
    } catch (err) {
      console.error("Error updating lead:", err);
    }
  }

  // Delete lead
  async function handleDeleteLead(id: number) {
    try {
      await deleteLead(id);
      if (selectedLead?.id === id) setSelectedLead(null);
      loadData();
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  }

  // Send conversation message
  async function handleSendMessage() {
    if (!newMessage.trim() || !selectedLead) return;
    try {
      await addConversation({ lead_id: selectedLead.id, message: newMessage.trim(), sender: "agent" });
      setNewMessage("");
      const convs = await getConversations(selectedLead.id);
      setConversations(convs);
      await updateLead(selectedLead.id, { last_contact_at: new Date().toISOString() });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString(t ? "fr-FR" : "en-US", {
      day: "numeric", month: "short", year: "numeric",
    });
  }

  function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return t ? "Aujourd'hui" : "Today";
    if (days === 1) return t ? "Hier" : "Yesterday";
    return t ? `Il y a ${days} jours` : `${days} days ago`;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {t ? "CRM - Gestion des Leads" : "CRM - Lead Management"}
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {t ? "Gérez vos prospects et opportunités commerciales" : "Manage your prospects and business opportunities"}
              </p>
            </div>
            <Button onClick={() => { setShowAddForm(true); setEditingLead({}); }}>
              <Plus className="w-4 h-4 mr-2" />
              {t ? "Nouveau Lead" : "New Lead"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-xs text-muted-foreground">{t ? "Total" : "Total"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.nouveau}</p>
                  <p className="text-xs text-muted-foreground">{t ? "Nouveaux" : "New"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.contact}</p>
                  <p className="text-xs text-muted-foreground">{t ? "Contactés" : "Contacted"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.qualified}</p>
                  <p className="text-xs text-muted-foreground">{t ? "Qualifiés" : "Qualified"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.converted}</p>
                  <p className="text-xs text-muted-foreground">{t ? "Convertis" : "Converted"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.highPriority}</p>
                  <p className="text-xs text-muted-foreground">{t ? "Prioritaires" : "High Priority"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="pipeline" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pipeline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Pipeline
            </TabsTrigger>
            <TabsTrigger value="list">
              <Users className="w-4 h-4 mr-2" />
              {t ? "Liste" : "List"}
            </TabsTrigger>
            <TabsTrigger value="conversations">
              <MessageSquare className="w-4 h-4 mr-2" />
              Conversations
            </TabsTrigger>
          </TabsList>

          {/* Pipeline View */}
          <TabsContent value="pipeline">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(pipeline).map(([status, statusLeads]) => (
                <div key={status} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Badge className={statusColors[status]}>
                        {statusLabels[status]?.[language] || status}
                      </Badge>
                      <span className="text-muted-foreground text-sm">({statusLeads.length})</span>
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {statusLeads.map((lead) => (
                      <Card
                        key={lead.id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{lead.name}</p>
                              {lead.company && (
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Building2 className="w-3 h-3" />
                                  {lead.company}
                                </p>
                              )}
                            </div>
                            <Star className={`w-4 h-4 ${priorityColors[lead.priority]}`} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {timeAgo(lead.last_contact_at)}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                    {statusLeads.length === 0 && (
                      <p className="text-center text-muted-foreground text-sm py-8">
                        {t ? "Aucun lead" : "No leads"}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder={t ? "Rechercher un lead..." : "Search leads..."}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="flex gap-2">
                    {["all", "Nouveau", "contact", "qualified", "converted"].map((s) => (
                      <Button
                        key={s}
                        variant={statusFilter === s ? "default" : "outline"}
                        size="sm"
                        onClick={() => setStatusFilter(s)}
                      >
                        {s === "all"
                          ? t ? "Tous" : "All"
                          : statusLabels[s]?.[language] || s}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="flex items-center gap-4 p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {lead.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {lead.company || lead.email || lead.phone}
                        </p>
                      </div>
                      <Badge className={statusColors[lead.status]}>
                        {statusLabels[lead.status]?.[language] || lead.status}
                      </Badge>
                      <Star className={`w-4 h-4 ${priorityColors[lead.priority]}`} />
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {timeAgo(lead.last_contact_at)}
                      </span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  ))}
                  {filteredLeads.length === 0 && (
                    <p className="text-center text-muted-foreground py-12">
                      {t ? "Aucun lead trouvé" : "No leads found"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Conversations View */}
          <TabsContent value="conversations">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
              {/* Lead list */}
              <Card className="lg:col-span-1 overflow-hidden flex flex-col">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{t ? "Contacts" : "Contacts"}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-2">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedLead?.id === lead.id ? "bg-primary/10" : "hover:bg-accent/50"
                      }`}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-semibold">
                        {lead.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{lead.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{lead.company}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Chat */}
              <Card className="lg:col-span-2 overflow-hidden flex flex-col">
                {selectedLead ? (
                  <>
                    <CardHeader className="pb-2 border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {selectedLead.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{selectedLead.name}</p>
                            <p className="text-xs text-muted-foreground">{selectedLead.company}</p>
                          </div>
                        </div>
                        <Badge className={statusColors[selectedLead.status]}>
                          {statusLabels[selectedLead.status]?.[language]}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                      {conversations.length === 0 && (
                        <p className="text-center text-muted-foreground py-12">
                          {t ? "Aucun message. Commencez la conversation !" : "No messages. Start the conversation!"}
                        </p>
                      )}
                      {conversations.map((conv) => (
                        <div
                          key={conv.id}
                          className={`flex ${conv.sender === "agent" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg p-3 text-sm ${
                              conv.sender === "agent"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <p>{conv.message}</p>
                            <p className={`text-xs mt-1 ${
                              conv.sender === "agent" ? "text-primary-foreground/70" : "text-muted-foreground"
                            }`}>
                              {formatDate(conv.created_at)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                    <div className="border-t p-3 flex gap-2">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t ? "Écrire un message..." : "Write a message..."}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage} size="icon">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>{t ? "Sélectionnez un contact" : "Select a contact"}</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Lead Detail Sidebar */}
      {selectedLead && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-card border-l shadow-xl z-50 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{t ? "Détail du Lead" : "Lead Detail"}</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedLead(null)}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {/* Lead info */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold mx-auto mb-2">
                  {selectedLead.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold">{selectedLead.name}</h3>
                {selectedLead.company && (
                  <p className="text-muted-foreground flex items-center justify-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {selectedLead.company}
                  </p>
                )}
              </div>

              {/* Status */}
              <div>
                <label className="text-sm font-medium mb-2 block">{t ? "Statut" : "Status"}</label>
                <div className="flex gap-2 flex-wrap">
                  {["Nouveau", "contact", "qualified", "converted"].map((s) => (
                    <Button
                      key={s}
                      variant={selectedLead.status === s ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStatusChange(selectedLead, s)}
                    >
                      {statusLabels[s]?.[language] || s}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Contact info */}
              <div className="space-y-2">
                {selectedLead.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href={`mailto:${selectedLead.email}`} className="text-primary hover:underline">
                      {selectedLead.email}
                    </a>
                  </div>
                )}
                {selectedLead.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href={`tel:${selectedLead.phone}`} className="text-primary hover:underline">
                      {selectedLead.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t ? "Source" : "Source"}</span>
                  <span className="capitalize">{selectedLead.source}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t ? "Priorité" : "Priority"}</span>
                  <span className="flex items-center gap-1">
                    <Star className={`w-3 h-3 ${priorityColors[selectedLead.priority]}`} />
                    <span className="capitalize">{selectedLead.priority}</span>
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t ? "Créé le" : "Created"}</span>
                  <span>{formatDate(selectedLead.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t ? "Dernier contact" : "Last contact"}</span>
                  <span>{timeAgo(selectedLead.last_contact_at)}</span>
                </div>
              </div>

              {/* Notes */}
              {selectedLead.notes && (
                <div>
                  <label className="text-sm font-medium mb-1 block">{t ? "Notes" : "Notes"}</label>
                  <p className="text-sm text-muted-foreground bg-muted rounded-lg p-3">
                    {selectedLead.notes}
                  </p>
                </div>
              )}


              {/* Historique des conversations */}
              {conversations.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Historique des conversations
                  </h4>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`p-2 rounded-lg text-sm ${
                          conv.sender === "agent"
                            ? "bg-blue-50 text-blue-900 ml-4"
                            : "bg-gray-50 text-gray-900 mr-4"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-xs">
                            {conv.sender === "agent" ? "Commercial" : "Prospect"}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(conv.created_at).toLocaleString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-sm">{conv.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="destructive"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDeleteLead(selectedLead.id)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  {t ? "Supprimer" : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{t ? "Nouveau Lead" : "New Lead"}</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => { setShowAddForm(false); setEditingLead(null); }}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder={t ? "Nom complet *" : "Full name *"}
                value={editingLead?.name || ""}
                onChange={(e) => setEditingLead({ ...editingLead, name: e.target.value })}
              />
              <Input
                placeholder="Email"
                type="email"
                value={editingLead?.email || ""}
                onChange={(e) => setEditingLead({ ...editingLead, email: e.target.value })}
              />
              <Input
                placeholder={t ? "Téléphone" : "Phone"}
                value={editingLead?.phone || ""}
                onChange={(e) => setEditingLead({ ...editingLead, phone: e.target.value })}
              />
              <Input
                placeholder={t ? "Entreprise" : "Company"}
                value={editingLead?.company || ""}
                onChange={(e) => setEditingLead({ ...editingLead, company: e.target.value })}
              />
              <Input
                placeholder="Notes"
                value={editingLead?.notes || ""}
                onChange={(e) => setEditingLead({ ...editingLead, notes: e.target.value })}
              />
              <Button onClick={handleAddLead} className="w-full" disabled={!editingLead?.name}>
                <Check className="w-4 h-4 mr-2" />
                {t ? "Ajouter le Lead" : "Add Lead"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
