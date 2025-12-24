import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  GraduationCap, 
  Plus, 
  Pencil, 
  Trash2, 
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Video,
  BookOpen,
  Save,
  X,
  GripVertical
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/auth-utils";
import type { Formation } from "@shared/schema";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

interface CourseLesson {
  id: number;
  moduleId: number;
  title: string;
  description: string | null;
  order: number;
  videoUrl: string | null;
  videoProvider: string;
  thumbnailUrl: string | null;
  durationSeconds: number | null;
  isFree: boolean;
  isPublished: boolean;
}

interface CourseModule {
  id: number;
  formationId: number;
  title: string;
  description: string | null;
  order: number;
  isPublished: boolean;
  lessons?: CourseLesson[];
}

export default function AdminElearning() {
  const { t } = useTranslation();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());
  const [moduleDialogOpen, setModuleDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<CourseModule | null>(null);
  const [editingLesson, setEditingLesson] = useState<CourseLesson | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);

  const { data: formations, isLoading: formationsLoading } = useQuery<Formation[]>({
    queryKey: ["/api/formations"],
  });

  const { data: modules, isLoading: modulesLoading, refetch: refetchModules } = useQuery<CourseModule[]>({
    queryKey: ["/api/admin/formations", selectedFormation?.id, "modules"],
    enabled: !!selectedFormation,
  });

  const { data: lessons, refetch: refetchLessons } = useQuery<CourseLesson[]>({
    queryKey: ["/api/admin/modules", selectedModuleId, "lessons"],
    enabled: !!selectedModuleId,
  });

  const moduleForm = useForm<{
    title: string;
    description: string;
    isPublished: boolean;
  }>({
    defaultValues: {
      title: "",
      description: "",
      isPublished: true
    }
  });

  const lessonForm = useForm<{
    title: string;
    description: string;
    videoUrl: string;
    videoProvider: string;
    durationSeconds: number;
    isFree: boolean;
    isPublished: boolean;
  }>({
    defaultValues: {
      title: "",
      description: "",
      videoUrl: "",
      videoProvider: "youtube",
      durationSeconds: 0,
      isFree: false,
      isPublished: true
    }
  });

  const createModule = useMutation({
    mutationFn: async (data: { title: string; description: string; isPublished: boolean }) => {
      return apiRequest("POST", `/api/admin/formations/${selectedFormation?.id}/modules`, {
        ...data,
        order: (modules?.length || 0) + 1
      });
    },
    onSuccess: () => {
      refetchModules();
      setModuleDialogOpen(false);
      moduleForm.reset();
      toast({ title: "Module créé", description: "Le module a été ajouté avec succès." });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
      }
      toast({ title: "Erreur", description: "Impossible de créer le module.", variant: "destructive" });
    }
  });

  const updateModule = useMutation({
    mutationFn: async (data: { id: number; title: string; description: string; isPublished: boolean }) => {
      return apiRequest("PUT", `/api/admin/modules/${data.id}`, {
        title: data.title,
        description: data.description,
        isPublished: data.isPublished
      });
    },
    onSuccess: () => {
      refetchModules();
      setModuleDialogOpen(false);
      setEditingModule(null);
      moduleForm.reset();
      toast({ title: "Module mis à jour", description: "Les modifications ont été enregistrées." });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
      }
      toast({ title: "Erreur", description: "Impossible de mettre à jour le module.", variant: "destructive" });
    }
  });

  const deleteModule = useMutation({
    mutationFn: async (moduleId: number) => {
      return apiRequest("DELETE", `/api/admin/modules/${moduleId}`);
    },
    onSuccess: () => {
      refetchModules();
      toast({ title: "Module supprimé", description: "Le module a été supprimé avec succès." });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
      }
      toast({ title: "Erreur", description: "Impossible de supprimer le module.", variant: "destructive" });
    }
  });

  const createLesson = useMutation({
    mutationFn: async (data: { moduleId: number; title: string; description: string; videoUrl: string; videoProvider: string; durationSeconds: number; isFree: boolean; isPublished: boolean }) => {
      const moduleLessons = modules?.find(m => m.id === data.moduleId)?.lessons || [];
      return apiRequest("POST", `/api/admin/modules/${data.moduleId}/lessons`, {
        ...data,
        order: moduleLessons.length + 1
      });
    },
    onSuccess: () => {
      refetchModules();
      setLessonDialogOpen(false);
      setSelectedModuleId(null);
      lessonForm.reset();
      toast({ title: "Leçon créée", description: "La leçon a été ajoutée avec succès." });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
      }
      toast({ title: "Erreur", description: "Impossible de créer la leçon.", variant: "destructive" });
    }
  });

  const updateLesson = useMutation({
    mutationFn: async (data: { id: number; title: string; description: string; videoUrl: string; videoProvider: string; durationSeconds: number; isFree: boolean; isPublished: boolean }) => {
      return apiRequest("PUT", `/api/admin/lessons/${data.id}`, data);
    },
    onSuccess: () => {
      refetchModules();
      setLessonDialogOpen(false);
      setEditingLesson(null);
      lessonForm.reset();
      toast({ title: "Leçon mise à jour", description: "Les modifications ont été enregistrées." });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
      }
      toast({ title: "Erreur", description: "Impossible de mettre à jour la leçon.", variant: "destructive" });
    }
  });

  const deleteLesson = useMutation({
    mutationFn: async (lessonId: number) => {
      return apiRequest("DELETE", `/api/admin/lessons/${lessonId}`);
    },
    onSuccess: () => {
      refetchModules();
      toast({ title: "Leçon supprimée", description: "La leçon a été supprimée avec succès." });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
      }
      toast({ title: "Erreur", description: "Impossible de supprimer la leçon.", variant: "destructive" });
    }
  });

  const toggleModule = (moduleId: number) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(moduleId)) {
        next.delete(moduleId);
      } else {
        next.add(moduleId);
      }
      return next;
    });
  };

  const openModuleDialog = (module?: CourseModule) => {
    if (module) {
      setEditingModule(module);
      moduleForm.reset({
        title: module.title,
        description: module.description || "",
        isPublished: module.isPublished
      });
    } else {
      setEditingModule(null);
      moduleForm.reset({ title: "", description: "", isPublished: true });
    }
    setModuleDialogOpen(true);
  };

  const openLessonDialog = (moduleId: number, lesson?: CourseLesson) => {
    setSelectedModuleId(moduleId);
    if (lesson) {
      setEditingLesson(lesson);
      lessonForm.reset({
        title: lesson.title,
        description: lesson.description || "",
        videoUrl: lesson.videoUrl || "",
        videoProvider: lesson.videoProvider,
        durationSeconds: lesson.durationSeconds || 0,
        isFree: lesson.isFree,
        isPublished: lesson.isPublished
      });
    } else {
      setEditingLesson(null);
      lessonForm.reset({
        title: "",
        description: "",
        videoUrl: "",
        videoProvider: "youtube",
        durationSeconds: 0,
        isFree: false,
        isPublished: true
      });
    }
    setLessonDialogOpen(true);
  };

  const handleModuleSubmit = (data: { title: string; description: string; isPublished: boolean }) => {
    if (editingModule) {
      updateModule.mutate({ id: editingModule.id, ...data });
    } else {
      createModule.mutate(data);
    }
  };

  const handleLessonSubmit = (data: { title: string; description: string; videoUrl: string; videoProvider: string; durationSeconds: number; isFree: boolean; isPublished: boolean }) => {
    if (editingLesson) {
      updateLesson.mutate({ id: editingLesson.id, ...data });
    } else if (selectedModuleId) {
      createLesson.mutate({ moduleId: selectedModuleId, ...data });
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <GraduationCap className="h-12 w-12 mx-auto text-primary mb-4" />
            <CardTitle>Administration E-Learning</CardTitle>
            <CardDescription>Connectez-vous pour gérer le contenu</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={() => window.location.href = "/api/login"} data-testid="button-login">
              Se connecter
            </Button>
            <Button variant="outline" className="w-full" onClick={() => setLocation("/")} data-testid="button-home">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!selectedFormation) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6 text-primary" />
              <span className="font-semibold">Administration E-Learning</span>
            </div>
            <Button variant="outline" size="sm" onClick={() => setLocation("/crm")} data-testid="button-back-crm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour CRM
            </Button>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Sélectionnez une formation</h1>
          
          {formationsLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {formations?.map((formation) => (
                <Card 
                  key={formation.id} 
                  className="hover-elevate cursor-pointer"
                  onClick={() => setSelectedFormation(formation)}
                  data-testid={`card-formation-${formation.id}`}
                >
                  <CardHeader>
                    <CardTitle className="text-lg line-clamp-2">{formation.title}</CardTitle>
                    <CardDescription>{formation.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="secondary">{formation.level}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <Button variant="ghost" onClick={() => setSelectedFormation(null)} data-testid="button-back-formations">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Formations
          </Button>
          <span className="font-medium truncate">{selectedFormation.title}</span>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <h1 className="text-2xl font-bold">Modules et Leçons</h1>
          <Button onClick={() => openModuleDialog()} data-testid="button-add-module">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un module
          </Button>
        </div>

        {modulesLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        ) : modules && modules.length > 0 ? (
          <div className="space-y-4">
            {modules.map((module, moduleIndex) => (
              <Card key={module.id}>
                <Collapsible open={expandedModules.has(module.id)} onOpenChange={() => toggleModule(module.id)}>
                  <CollapsibleTrigger asChild>
                    <CardHeader className="cursor-pointer hover-elevate">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-3">
                          {expandedModules.has(module.id) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                          <div>
                            <CardTitle className="text-lg">
                              {moduleIndex + 1}. {module.title}
                            </CardTitle>
                            <CardDescription>
                              {module.lessons?.length || 0} leçons
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!module.isPublished && (
                            <Badge variant="outline">Brouillon</Badge>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => { e.stopPropagation(); openModuleDialog(module); }}
                            data-testid={`button-edit-module-${module.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={(e) => { e.stopPropagation(); deleteModule.mutate(module.id); }}
                            data-testid={`button-delete-module-${module.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="pt-0">
                      <div className="space-y-2 mb-4">
                        {module.lessons?.map((lesson, lessonIndex) => (
                          <div 
                            key={lesson.id}
                            className="flex items-center justify-between gap-2 p-3 bg-muted/50 rounded-lg flex-wrap"
                          >
                            <div className="flex items-center gap-3">
                              <Video className="h-4 w-4 text-muted-foreground" />
                              <div>
                                <p className="font-medium">
                                  {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  {lesson.durationSeconds && (
                                    <span>{Math.floor(lesson.durationSeconds / 60)} min</span>
                                  )}
                                  {lesson.isFree && <Badge variant="secondary">Gratuit</Badge>}
                                  {!lesson.isPublished && <Badge variant="outline">Brouillon</Badge>}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => openLessonDialog(module.id, lesson)}
                                data-testid={`button-edit-lesson-${lesson.id}`}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => deleteLesson.mutate(lesson.id)}
                                data-testid={`button-delete-lesson-${lesson.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openLessonDialog(module.id)}
                        data-testid={`button-add-lesson-${module.id}`}
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Ajouter une leçon
                      </Button>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">Aucun module</h3>
              <p className="text-muted-foreground mb-4">
                Ajoutez des modules pour structurer votre formation.
              </p>
              <Button onClick={() => openModuleDialog()} data-testid="button-add-first-module">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter le premier module
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={moduleDialogOpen} onOpenChange={setModuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingModule ? "Modifier le module" : "Nouveau module"}
            </DialogTitle>
            <DialogDescription>
              {editingModule ? "Modifiez les informations du module." : "Ajoutez un nouveau module à cette formation."}
            </DialogDescription>
          </DialogHeader>
          <Form {...moduleForm}>
            <form onSubmit={moduleForm.handleSubmit(handleModuleSubmit)} className="space-y-4">
              <FormField
                control={moduleForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Titre du module" data-testid="input-module-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={moduleForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Description du module" data-testid="input-module-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={moduleForm.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel>Publié</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-module-published" />
                    </FormControl>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setModuleDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={createModule.isPending || updateModule.isPending} data-testid="button-save-module">
                  <Save className="mr-2 h-4 w-4" />
                  {editingModule ? "Enregistrer" : "Créer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingLesson ? "Modifier la leçon" : "Nouvelle leçon"}
            </DialogTitle>
            <DialogDescription>
              {editingLesson ? "Modifiez les informations de la leçon." : "Ajoutez une nouvelle leçon à ce module."}
            </DialogDescription>
          </DialogHeader>
          <Form {...lessonForm}>
            <form onSubmit={lessonForm.handleSubmit(handleLessonSubmit)} className="space-y-4">
              <FormField
                control={lessonForm.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Titre de la leçon" data-testid="input-lesson-title" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={lessonForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Description de la leçon" data-testid="input-lesson-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={lessonForm.control}
                  name="videoProvider"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plateforme vidéo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-video-provider">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="vimeo">Vimeo</SelectItem>
                          <SelectItem value="custom">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={lessonForm.control}
                  name="durationSeconds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durée (minutes)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          {...field} 
                          onChange={e => field.onChange(parseInt(e.target.value) * 60)}
                          value={Math.floor((field.value || 0) / 60)}
                          placeholder="0"
                          data-testid="input-lesson-duration"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={lessonForm.control}
                name="videoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de la vidéo</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://youtube.com/watch?v=..." data-testid="input-lesson-video-url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-6">
                <FormField
                  control={lessonForm.control}
                  name="isFree"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-lesson-free" />
                      </FormControl>
                      <FormLabel className="!mt-0">Gratuit (aperçu)</FormLabel>
                    </FormItem>
                  )}
                />
                <FormField
                  control={lessonForm.control}
                  name="isPublished"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} data-testid="switch-lesson-published" />
                      </FormControl>
                      <FormLabel className="!mt-0">Publié</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setLessonDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit" disabled={createLesson.isPending || updateLesson.isPending} data-testid="button-save-lesson">
                  <Save className="mr-2 h-4 w-4" />
                  {editingLesson ? "Enregistrer" : "Créer"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
