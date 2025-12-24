import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import {
  ArrowLeft, Plus, Play, Pause, Trash2, Edit2, Save, X,
  Mail, Clock, Bell, UserCheck, Target, Zap, ChevronDown,
  ChevronUp, GripVertical, Loader2, CheckCircle, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { SEO } from "@/components/seo";
import type { NurturingSequence, NurturingStep } from "@shared/schema";

const triggerOptions = [
  { value: "new_lead", label: "Nouveau lead", icon: UserCheck },
  { value: "form_submission", label: "Soumission formulaire", icon: Mail },
  { value: "chat_interaction", label: "Interaction chat IA", icon: Zap },
  { value: "meeting_booked", label: "RDV planifié", icon: Clock },
  { value: "enrollment", label: "Inscription formation", icon: Target },
];

const sourceOptions = [
  { value: "", label: "Toutes les sources" },
  { value: "agent-ia", label: "Commercial IA" },
  { value: "formation", label: "Formation" },
  { value: "contact", label: "Contact direct" },
  { value: "google_meet_booking", label: "RDV Google Meet" },
];

const actionTypeOptions = [
  { value: "email", label: "Email", icon: Mail },
  { value: "task", label: "Tâche", icon: CheckCircle },
  { value: "notification", label: "Notification", icon: Bell },
  { value: "status_change", label: "Changement statut", icon: Target },
];

interface SequenceWithSteps extends NurturingSequence {
  steps?: NurturingStep[];
  stepCount?: number;
}

function StepEditor({
  step,
  stepIndex,
  onUpdate,
  onDelete,
  isNew = false
}: {
  step: Partial<NurturingStep>;
  stepIndex: number;
  onUpdate: (data: Partial<NurturingStep>) => void;
  onDelete: () => void;
  isNew?: boolean;
}) {
  const actionType = actionTypeOptions.find(a => a.value === step.actionType);
  const ActionIcon = actionType?.icon || Mail;

  return (
    <Card className="border-dashed">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
              {stepIndex + 1}
            </div>
            <div className="w-px h-full bg-border" />
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <ActionIcon className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">{actionType?.label || "Action"}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={onDelete}
                data-testid={`button-delete-step-${stepIndex}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Type d'action</Label>
                <Select
                  value={step.actionType || "email"}
                  onValueChange={(v) => onUpdate({ actionType: v })}
                >
                  <SelectTrigger data-testid={`select-action-type-${stepIndex}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {actionTypeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        <div className="flex items-center gap-2">
                          <opt.icon className="h-4 w-4" />
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Délai</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={0}
                      value={step.delayDays || 0}
                      onChange={(e) => onUpdate({ delayDays: parseInt(e.target.value) || 0 })}
                      placeholder="Jours"
                      data-testid={`input-delay-days-${stepIndex}`}
                    />
                    <span className="text-xs text-muted-foreground">jours</span>
                  </div>
                  <div className="flex-1">
                    <Input
                      type="number"
                      min={0}
                      max={23}
                      value={step.delayHours || 0}
                      onChange={(e) => onUpdate({ delayHours: parseInt(e.target.value) || 0 })}
                      placeholder="Heures"
                      data-testid={`input-delay-hours-${stepIndex}`}
                    />
                    <span className="text-xs text-muted-foreground">heures</span>
                  </div>
                </div>
              </div>
            </div>
            
            {step.actionType === "email" && (
              <div className="space-y-2">
                <Label>Objet de l'email</Label>
                <Input
                  value={step.subject || ""}
                  onChange={(e) => onUpdate({ subject: e.target.value })}
                  placeholder="Objet de l'email..."
                  data-testid={`input-subject-${stepIndex}`}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label>Contenu / Description</Label>
              <Textarea
                value={step.content || ""}
                onChange={(e) => onUpdate({ content: e.target.value })}
                placeholder={step.actionType === "email" ? "Corps de l'email..." : "Description de l'action..."}
                rows={3}
                data-testid={`textarea-content-${stepIndex}`}
              />
              <p className="text-xs text-muted-foreground">
                Variables disponibles: {"{{name}}"}, {"{{email}}"}, {"{{company}}"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SequenceCard({
  sequence,
  onEdit,
  onToggle,
  onDelete
}: {
  sequence: SequenceWithSteps;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const trigger = triggerOptions.find(t => t.value === sequence.triggerEvent);
  const TriggerIcon = trigger?.icon || Target;
  
  return (
    <Card className="hover-elevate transition-all" data-testid={`card-sequence-${sequence.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TriggerIcon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{sequence.name}</CardTitle>
              <CardDescription className="mt-0.5">
                {sequence.description || "Aucune description"}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={sequence.isActive || false}
              onCheckedChange={onToggle}
              data-testid={`switch-active-${sequence.id}`}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge variant="outline">
            <TriggerIcon className="h-3 w-3 mr-1" />
            {trigger?.label || sequence.triggerEvent}
          </Badge>
          {sequence.targetSource && (
            <Badge variant="secondary">
              Source: {sourceOptions.find(s => s.value === sequence.targetSource)?.label || sequence.targetSource}
            </Badge>
          )}
          <Badge variant="secondary">
            {sequence.stepCount || 0} étapes
          </Badge>
        </div>
        
        <div className="flex items-center justify-between gap-4 pt-3 border-t">
          <span className="text-xs text-muted-foreground">
            Créée le {sequence.createdAt && new Date(sequence.createdAt).toLocaleDateString("fr-FR")}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onEdit}
              data-testid={`button-edit-${sequence.id}`}
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Modifier
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={onDelete}
              data-testid={`button-delete-${sequence.id}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function NurturingPage() {
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSequence, setEditingSequence] = useState<SequenceWithSteps | null>(null);
  const [newSequence, setNewSequence] = useState({
    name: "",
    description: "",
    triggerEvent: "new_lead",
    targetSource: "",
    isActive: true
  });
  const [newSteps, setNewSteps] = useState<Partial<NurturingStep>[]>([]);

  const { data: sequences = [], isLoading } = useQuery<SequenceWithSteps[]>({
    queryKey: ["/api/crm/nurturing-sequences"],
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof newSequence) => {
      const res = await apiRequest("POST", "/api/crm/nurturing-sequences", data);
      return res.json();
    },
    onSuccess: async (sequence) => {
      for (let i = 0; i < newSteps.length; i++) {
        const step = newSteps[i];
        if (step.content) {
          await apiRequest("POST", `/api/crm/nurturing-sequences/${sequence.id}/steps`, {
            ...step,
            stepOrder: i + 1
          });
        }
      }
      queryClient.invalidateQueries({ queryKey: ["/api/crm/nurturing-sequences"] });
      setIsCreateOpen(false);
      setNewSequence({ name: "", description: "", triggerEvent: "new_lead", targetSource: "", isActive: true });
      setNewSteps([]);
      toast({ title: "Séquence créée", description: "La séquence de nurturing a été créée avec succès." });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Impossible de créer la séquence.", variant: "destructive" });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<NurturingSequence> }) => {
      const res = await apiRequest("PATCH", `/api/crm/nurturing-sequences/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/nurturing-sequences"] });
      toast({ title: "Séquence mise à jour" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/crm/nurturing-sequences/${id}`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/crm/nurturing-sequences"] });
      toast({ title: "Séquence supprimée" });
    }
  });

  const handleAddStep = () => {
    setNewSteps([...newSteps, {
      stepOrder: newSteps.length + 1,
      actionType: "email",
      delayDays: 1,
      delayHours: 0,
      subject: "",
      content: ""
    }]);
  };

  const handleUpdateStep = (index: number, data: Partial<NurturingStep>) => {
    const updated = [...newSteps];
    updated[index] = { ...updated[index], ...data };
    setNewSteps(updated);
  };

  const handleDeleteStep = (index: number) => {
    setNewSteps(newSteps.filter((_, i) => i !== index));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Accès restreint</h2>
            <p className="text-muted-foreground mb-4">
              Connectez-vous pour accéder à la gestion des séquences de nurturing.
            </p>
            <Link href="/crm">
              <Button>Retour au CRM</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="Séquences de Nurturing | SunuCRM"
        description="Gérez vos séquences de nurturing automatisées pour suivre et convertir vos leads."
        includeOrgSchema={false}
      />
      
      <div className="min-h-screen bg-background">
        <div className="border-b bg-card/50">
          <div className="container max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link href="/crm">
                  <Button variant="ghost" size="icon" data-testid="button-back">
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold">Séquences de Nurturing</h1>
                  <p className="text-sm text-muted-foreground">
                    Automatisez le suivi de vos leads avec des séquences personnalisées
                  </p>
                </div>
              </div>
              <Button onClick={() => setIsCreateOpen(true)} data-testid="button-create-sequence">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle séquence
              </Button>
            </div>
          </div>
        </div>

        <div className="container max-w-6xl mx-auto px-4 py-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : sequences.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                <Zap className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Aucune séquence</h3>
                <p className="text-muted-foreground mb-4">
                  Créez votre première séquence de nurturing pour automatiser le suivi de vos leads.
                </p>
                <Button onClick={() => setIsCreateOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une séquence
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {sequences.map((sequence) => (
                <SequenceCard
                  key={sequence.id}
                  sequence={sequence}
                  onEdit={() => setEditingSequence(sequence)}
                  onToggle={() => updateMutation.mutate({
                    id: sequence.id,
                    data: { isActive: !sequence.isActive }
                  })}
                  onDelete={() => {
                    if (confirm("Supprimer cette séquence ?")) {
                      deleteMutation.mutate(sequence.id);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Nouvelle séquence de nurturing</DialogTitle>
              <DialogDescription>
                Créez une séquence automatisée pour suivre vos leads
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-6 py-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Nom de la séquence</Label>
                    <Input
                      value={newSequence.name}
                      onChange={(e) => setNewSequence({ ...newSequence, name: e.target.value })}
                      placeholder="Ex: Onboarding nouveaux leads"
                      data-testid="input-sequence-name"
                    />
                  </div>
                  
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Description (optionnel)</Label>
                    <Textarea
                      value={newSequence.description}
                      onChange={(e) => setNewSequence({ ...newSequence, description: e.target.value })}
                      placeholder="Décrivez l'objectif de cette séquence..."
                      rows={2}
                      data-testid="textarea-sequence-description"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Déclencheur</Label>
                    <Select
                      value={newSequence.triggerEvent}
                      onValueChange={(v) => setNewSequence({ ...newSequence, triggerEvent: v })}
                    >
                      <SelectTrigger data-testid="select-trigger">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {triggerOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex items-center gap-2">
                              <opt.icon className="h-4 w-4" />
                              {opt.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Source des leads</Label>
                    <Select
                      value={newSequence.targetSource}
                      onValueChange={(v) => setNewSequence({ ...newSequence, targetSource: v })}
                    >
                      <SelectTrigger data-testid="select-source">
                        <SelectValue placeholder="Toutes les sources" />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Étapes de la séquence</h4>
                      <p className="text-sm text-muted-foreground">
                        Définissez les actions automatiques à effectuer
                      </p>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleAddStep} data-testid="button-add-step">
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter
                    </Button>
                  </div>

                  {newSteps.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg">
                      <Clock className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Ajoutez des étapes à votre séquence
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {newSteps.map((step, index) => (
                        <StepEditor
                          key={index}
                          step={step}
                          stepIndex={index}
                          onUpdate={(data) => handleUpdateStep(index, data)}
                          onDelete={() => handleDeleteStep(index)}
                          isNew
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Annuler
              </Button>
              <Button
                onClick={() => createMutation.mutate(newSequence)}
                disabled={!newSequence.name || createMutation.isPending}
                data-testid="button-save-sequence"
              >
                {createMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Créer la séquence
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
