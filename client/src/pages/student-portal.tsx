import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useTranslation } from "@/lib/i18n";
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
  ArrowLeft,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/auth-utils";
import { VideoPlayer } from "@/components/video-player";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  progress?: {
    watchedPercent: number;
    lastPosition: number;
    isCompleted: boolean;
  };
}

interface CourseModule {
  id: number;
  formationId: number;
  title: string;
  description: string | null;
  order: number;
  isPublished: boolean;
  lessons: CourseLesson[];
}

interface EnrollmentWithProgress {
  id: number;
  userId: string;
  formationId: number;
  status: string;
  enrolledAt: string;
  formation: {
    id: number;
    title: string;
    category: string;
  };
  progress: {
    completedLessons: number;
    totalLessons: number;
    percent: number;
  };
}

interface CourseWithModules {
  id: number;
  title: string;
  description: string | null;
  category: string;
  modules: CourseModule[];
}

export default function StudentPortal() {
  const { t } = useTranslation();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<CourseLesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set());

  const { data: enrollments, isLoading: enrollmentsLoading } = useQuery<EnrollmentWithProgress[]>({
    queryKey: ["/api/elearning/enrollments"],
    enabled: isAuthenticated,
  });

  const { data: courseData, isLoading: courseLoading } = useQuery<CourseWithModules>({
    queryKey: ["/api/elearning/courses", selectedCourseId],
    enabled: !!selectedCourseId,
  });

  const updateProgress = useMutation({
    mutationFn: async (data: { lessonId: number; watchedPercent: number; lastPosition: number }) => {
      return apiRequest("POST", `/api/elearning/lessons/${data.lessonId}/progress`, {
        watchedPercent: data.watchedPercent,
        lastPosition: data.lastPosition
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/elearning/enrollments"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        window.location.href = "/api/login";
      }
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

  useEffect(() => {
    if (courseData?.modules && courseData.modules.length > 0) {
      setExpandedModules(new Set([courseData.modules[0].id]));
    }
  }, [courseData]);

  const handleLessonProgress = (lessonId: number, percent: number, position: number) => {
    updateProgress.mutate({ lessonId, watchedPercent: percent, lastPosition: position });
  };

  const handleLessonComplete = (lessonId: number) => {
    updateProgress.mutate({ lessonId, watchedPercent: 100, lastPosition: 0 });
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

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
            <CardTitle>{t("student.title")}</CardTitle>
            <CardDescription>
              {t("student.loginSubtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full" 
              onClick={() => window.location.href = "/api/login"}
              data-testid="button-login"
            >
              {t("student.login")}
            </Button>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => setLocation("/")}
              data-testid="button-home"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("student.backHome")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (selectedCourseId && courseData) {
    return (
      <div className="min-h-screen bg-background">
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 h-14 flex items-center justify-between gap-4">
            <Button 
              variant="ghost" 
              onClick={() => { setSelectedCourseId(null); setSelectedLesson(null); }}
              data-testid="button-back-to-courses"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("student.myCourses")}
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
              <h1 className="text-2xl font-bold">{courseData.title}</h1>
              
              {selectedLesson && selectedLesson.videoUrl ? (
                <div className="space-y-4">
                  <VideoPlayer
                    videoUrl={selectedLesson.videoUrl}
                    videoProvider={selectedLesson.videoProvider as "youtube" | "vimeo" | "custom"}
                    title={selectedLesson.title}
                    initialPosition={selectedLesson.progress?.lastPosition || 0}
                    onProgress={(percent, position) => handleLessonProgress(selectedLesson.id, percent, position)}
                    onComplete={() => handleLessonComplete(selectedLesson.id)}
                  />
                  
                  <Card>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <CardTitle className="text-lg">{selectedLesson.title}</CardTitle>
                        {selectedLesson.progress?.isCompleted && (
                          <Badge variant="secondary">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            {t("student.completed")}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    {selectedLesson.description && (
                      <CardContent>
                        <p className="text-muted-foreground">{selectedLesson.description}</p>
                      </CardContent>
                    )}
                  </Card>
                </div>
              ) : selectedLesson ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Lock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {t("student.noVideo")}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      {t("student.selectLesson")}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{t("student.courseContent")}</CardTitle>
                  <CardDescription>
                    {courseData.modules.length} {t("student.modules")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="p-4 space-y-2">
                      {courseLoading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <Skeleton key={i} className="h-16 w-full" />
                        ))
                      ) : (
                        courseData.modules.map((module, moduleIndex) => (
                          <Collapsible 
                            key={module.id}
                            open={expandedModules.has(module.id)}
                            onOpenChange={() => toggleModule(module.id)}
                          >
                            <CollapsibleTrigger asChild>
                              <button
                                className="w-full text-left p-3 rounded-lg bg-muted/50 hover-elevate flex items-center gap-2"
                                data-testid={`button-module-${module.id}`}
                              >
                                {expandedModules.has(module.id) ? (
                                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 flex-shrink-0" />
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">
                                    {moduleIndex + 1}. {module.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {module.lessons.length} {t("student.lessons")}
                                  </p>
                                </div>
                              </button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pl-4 mt-1 space-y-1">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <button
                                  key={lesson.id}
                                  onClick={() => setSelectedLesson(lesson)}
                                  className={`w-full text-left p-2 rounded-md transition-colors ${
                                    selectedLesson?.id === lesson.id 
                                      ? "bg-accent text-accent-foreground" 
                                      : "hover-elevate"
                                  }`}
                                  data-testid={`button-lesson-${lesson.id}`}
                                >
                                  <div className="flex items-start gap-2">
                                    <div className="flex-shrink-0 mt-0.5">
                                      {lesson.progress?.isCompleted ? (
                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                      ) : lesson.videoUrl ? (
                                        <Play className="h-4 w-4" />
                                      ) : (
                                        <Lock className="h-4 w-4 text-muted-foreground" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm truncate">
                                        {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
                                      </p>
                                      <div className="flex items-center gap-2 mt-0.5">
                                        {formatDuration(lesson.durationSeconds) && (
                                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {formatDuration(lesson.durationSeconds)}
                                          </span>
                                        )}
                                        {lesson.isFree && (
                                          <Badge variant="secondary" className="text-xs">
                                            {t("student.free")}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </button>
                              ))}
                            </CollapsibleContent>
                          </Collapsible>
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
            <span className="font-semibold">{t("student.title")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setLocation("/")}
              data-testid="button-back-site"
            >
              {t("student.backToSite")}
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
              {t("student.hello")}, {user?.firstName || t("student.learner")}
            </h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList>
            <TabsTrigger value="courses" data-testid="tab-courses">
              {t("student.myCourses")}
            </TabsTrigger>
            <TabsTrigger value="browse" data-testid="tab-browse">
              {t("student.catalog")}
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
                    onClick={() => setSelectedCourseId(enrollment.formationId)}
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
                          <span className="text-muted-foreground">{t("student.progress")}</span>
                          <span className="font-medium">{enrollment.progress.percent}%</span>
                        </div>
                        <Progress value={enrollment.progress.percent} />
                      </div>
                      <div className="flex items-center justify-between gap-2 text-sm flex-wrap">
                        <span className="text-muted-foreground">
                          {enrollment.progress.completedLessons} / {enrollment.progress.totalLessons} {t("student.lessons")}
                        </span>
                        <Button size="sm" data-testid={`button-continue-${enrollment.id}`}>
                          <Play className="mr-2 h-4 w-4" />
                          {t("student.continue")}
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
                  <h3 className="font-semibold mb-2">{t("student.noEnrollments")}</h3>
                  <p className="text-muted-foreground mb-4">
                    {t("student.noEnrollmentsDesc")}
                  </p>
                  <Button onClick={() => setLocation("/formations")} data-testid="button-browse-catalog">
                    {t("student.browseCatalog")}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="browse">
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">{t("student.catalogTitle")}</h3>
                <p className="text-muted-foreground mb-4">
                  {t("student.catalogDesc")}
                </p>
                <Button onClick={() => setLocation("/formations")} data-testid="button-view-catalog">
                  {t("student.viewCatalog")}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
