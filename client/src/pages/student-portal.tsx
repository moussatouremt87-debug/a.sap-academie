import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  GraduationCap, 
  Play, 
  Lock, 
  CheckCircle2, 
  Clock, 
  BookOpen,
  LogOut,
  User,
  ArrowLeft
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/auth-utils";
import type { Formation, CourseModule } from "@shared/schema";

interface EnrichedEnrollment {
  id: number;
  userId: string;
  formationId: number;
  status: string;
  enrolledAt: string;
  formation: Formation;
  modules: CourseModule[];
  progress: {
    completed: number;
    total: number;
    percent: number;
  };
}

interface EnrichedModule extends CourseModule {
  hasAccess: boolean;
  progress: { completed: boolean; watchedSeconds: number } | null;
  videoUrl: string | null;
}

interface CourseData {
  formation: Formation;
  enrollment: any;
  modules: EnrichedModule[];
  isEnrolled: boolean;
}

export default function StudentPortal() {
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [selectedModule, setSelectedModule] = useState<EnrichedModule | null>(null);

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery<EnrichedEnrollment[]>({
    queryKey: ["/api/student/enrollments"],
    enabled: isAuthenticated,
  });

  const { data: courseData, isLoading: courseLoading } = useQuery<CourseData>({
    queryKey: ["/api/student/courses", selectedCourse],
    enabled: !!selectedCourse && isAuthenticated,
  });

  const updateProgress = useMutation({
    mutationFn: async (data: { moduleId: number; completed?: boolean; watchedSeconds?: number }) => {
      return apiRequest("POST", "/api/student/progress", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/student/courses", selectedCourse] });
      queryClient.invalidateQueries({ queryKey: ["/api/student/enrollments"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
      }
    }
  });

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Skeleton className="h-12 w-12 rounded-full mx-auto" />
          <Skeleton className="h-4 w-32 mx-auto" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <GraduationCap className="h-12 w-12 mx-auto text-primary mb-4" />
            <CardTitle>Espace Apprenant</CardTitle>
            <CardDescription>
              Connectez-vous pour accéder à vos formations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-login"
            >
              Se connecter
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setLocation("/")}
              data-testid="button-home"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const renderVideoPlayer = (module: EnrichedModule) => {
    if (!module.videoUrl) {
      return (
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <Lock className="h-12 w-12 text-muted-foreground" />
        </div>
      );
    }

    const getEmbedUrl = (url: string) => {
      if (url.includes("youtube.com") || url.includes("youtu.be")) {
        const videoId = url.includes("youtu.be") 
          ? url.split("/").pop() 
          : new URL(url).searchParams.get("v");
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes("vimeo.com")) {
        const videoId = url.split("/").pop();
        return `https://player.vimeo.com/video/${videoId}`;
      }
      return url;
    };

    return (
      <div className="aspect-video bg-black rounded-lg overflow-hidden">
        <iframe
          src={getEmbedUrl(module.videoUrl)}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={module.title}
        />
      </div>
    );
  };

  if (selectedCourse && courseData) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
            <Button 
              variant="ghost" 
              onClick={() => { setSelectedCourse(null); setSelectedModule(null); }}
              data-testid="button-back-to-courses"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Mes formations
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground hidden sm:block">
                {user?.firstName || user?.email}
              </span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => window.location.href = "/api/logout"}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h1 className="text-2xl font-bold">{courseData.formation.title}</h1>
              
              {selectedModule ? (
                <div className="space-y-4">
                  {renderVideoPlayer(selectedModule)}
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <CardTitle className="text-lg">{selectedModule.title}</CardTitle>
                        {selectedModule.hasAccess && (
                          <Button
                            size="sm"
                            variant={selectedModule.progress?.completed ? "secondary" : "default"}
                            onClick={() => updateProgress.mutate({ 
                              moduleId: selectedModule.id, 
                              completed: !selectedModule.progress?.completed 
                            })}
                            disabled={updateProgress.isPending}
                            data-testid={`button-complete-module-${selectedModule.id}`}
                          >
                            {selectedModule.progress?.completed ? (
                              <>
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Terminé
                              </>
                            ) : (
                              "Marquer comme terminé"
                            )}
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    {selectedModule.description && (
                      <CardContent>
                        <p className="text-muted-foreground">{selectedModule.description}</p>
                      </CardContent>
                    )}
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Sélectionnez un module pour commencer
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Modules</CardTitle>
                  <CardDescription>
                    {courseData.modules.filter(m => m.progress?.completed).length} / {courseData.modules.length} terminés
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[400px]">
                    <div className="p-4 space-y-2">
                      {courseLoading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))
                      ) : (
                        courseData.modules.map((module, index) => (
                          <button
                            key={module.id}
                            onClick={() => setSelectedModule(module)}
                            className={`w-full text-left p-3 rounded-lg hover-elevate transition-colors ${
                              selectedModule?.id === module.id 
                                ? "bg-accent text-accent-foreground" 
                                : "bg-muted/50"
                            }`}
                            data-testid={`button-module-${module.id}`}
                          >
                            <div className="flex items-start gap-3">
                              <div className="flex-shrink-0 mt-0.5">
                                {module.progress?.completed ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : module.hasAccess ? (
                                  <Play className="h-5 w-5" />
                                ) : (
                                  <Lock className="h-5 w-5 text-muted-foreground" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">
                                  {index + 1}. {module.title}
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                  {module.duration && (
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {module.duration} min
                                    </span>
                                  )}
                                  {module.isFree && !courseData.isEnrolled && (
                                    <Badge variant="secondary" className="text-xs">
                                      Gratuit
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-semibold">Espace Apprenant</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setLocation("/")}
              data-testid="button-back-site"
            >
              Retour au site
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => window.location.href = "/api/logout"}
              data-testid="button-logout-main"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              Bonjour, {user?.firstName || "Apprenant"}
            </h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses" data-testid="tab-courses">
              Mes Formations
            </TabsTrigger>
            <TabsTrigger value="browse" data-testid="tab-browse">
              Catalogue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-4">
            {enrollmentsLoading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-2 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : enrollments && enrollments.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {enrollments.map((enrollment) => (
                  <Card 
                    key={enrollment.id} 
                    className="hover-elevate cursor-pointer"
                    onClick={() => setSelectedCourse(enrollment.formationId)}
                    data-testid={`card-enrollment-${enrollment.id}`}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-2">
                        {enrollment.formation?.title}
                      </CardTitle>
                      <CardDescription>
                        {enrollment.formation?.category}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progression</span>
                          <span className="font-medium">{enrollment.progress.percent}%</span>
                        </div>
                        <Progress value={enrollment.progress.percent} />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {enrollment.progress.completed} / {enrollment.progress.total} modules
                        </span>
                        <Button size="sm" data-testid={`button-continue-${enrollment.id}`}>
                          <Play className="mr-2 h-4 w-4" />
                          Continuer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Aucune formation</h3>
                  <p className="text-muted-foreground mb-4">
                    Vous n'êtes inscrit à aucune formation pour le moment.
                  </p>
                  <Button onClick={() => setLocation("/formations")} data-testid="button-browse-catalog">
                    Découvrir le catalogue
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="browse">
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Catalogue des formations</h3>
                <p className="text-muted-foreground mb-4">
                  Découvrez toutes nos formations SAP disponibles.
                </p>
                <Button onClick={() => setLocation("/formations")} data-testid="button-view-catalog">
                  Voir le catalogue
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
