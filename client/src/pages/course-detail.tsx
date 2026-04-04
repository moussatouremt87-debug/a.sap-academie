import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Share2,
  Play,
  Clock,
  BarChart3,
  BookOpen,
  Award,
  Zap,
  CheckCircle2,
  MessageCircle,
  Linkedin,
  Share2,
} from "lucide-react";
import { SEO } from "@/components/seo";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Lesson {
  id: string;
  title: string;
  duration: number;
  isFree: boolean;
}

interface Module {
  id: string;
  title: string;
  duration: number;
  lessons: Lesson[];
  hasQuiz: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  price: number;
  duration: number;
  level: "Débutant" | "Intermédiaire" | "Avancé";
  format: "En ligne" | "En présentiel" | "Hybride";
  badge: "Certifiant" | "Nouveau" | "Populaire" | null;
  modules: Module[];
  objectives: string[];
  prerequisites: string;
  certificationInfo: string;
  instructor?: string;
  rating?: number;
  reviews?: number;
}

export default function CourseDetailPage() {
  const params = useParams<{ id: string }>();
  const [enrolling, setEnrolling] = useState(false);

  const { data: course, isLoading } = useQuery({
    queryKey: [`/api/courses/${params.id}`],
    enabled: !!params.id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="text-gray-600">Chargement du cours...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Cours non trouvé
          </h1>
          <p className="text-gray-600 mb-6">
            Le cours que vous recherchez n'existe pas.
          </p>
          <Link href="/courses">
            <Button>Retour aux cours</Button>
          </Link>
        </div>
      </div>
    );
  }

  const courseDuration = (course.duration / 60).toFixed(1);
  const totalModules = course.modules?.length || 0;
  const totalLessons =
    course.modules?.reduce((sum, m) => sum + m.lessons.length, 0) || 0;
  const priceFormatted = (course.price / 100).toLocaleString("fr-FR");

  const handleShare = (platform: "linkedin" | "whatsapp") => {
    const url = window.location.href;
    const title = course.title;
    const text = `Découvrez le cours "${title}" sur A.SAP Academie`;

    if (platform === "linkedin") {
      window.open(
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        "linkedin-share",
        "width=600,height=400"
      );
    } else if (platform === "whatsapp") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
        "whatsapp-share"
      );
    }
  };

  const handleEnroll = () => {
    setEnrolling(true);
    setTimeout(() => {
      setEnrolling(false);
      window.location.href = `/checkout/${course.id}`;
    }, 300);
  };

  const getBadgeStyles = (badge: string | null) => {
    switch (badge) {
      case "Certifiant":
        return "bg-green-100 text-green-800";
      case "Nouveau":
        return "bg-blue-100 text-blue-800";
      case "Populaire":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <SEO
        title={course.title}
        description={course.description}
        image={`/courses/${course.id}-hero.png`}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-3xl">
              {/* Badge */}
              {course.badge && (
                <Badge className={`mb-4 ${getBadgeStyles(course.badge)}`}>
                  {course.badge}
                </Badge>
              )}

              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                {course.title}
              </h1>

              {/* Description */}
              <p className="text-lg md:text-xl text-blue-50 mb-8 leading-relaxed">
                {course.description}
              </p>

              {/* Key Info Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 py-6 border-t border-b border-blue-400">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm text-blue-100">Durée</span>
                  </div>
                  <p className="text-lg font-semibold">{courseDuration}h</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <BarChart3 className="w-4 h-4" />
                    <span className="text-sm text-blue-100">Niveau</span>
                  </div>
                  <p className="text-lg font-semibold">{course.level}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="w-4 h-4" />
                    <span className="text-sm text-blue-100">Format</span>
                  </div>
                  <p className="text-lg font-semibold">{course.format}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="w-4 h-4" />
                    <span className="text-sm text-blue-100">Prix</span>
                  </div>
                  <p className="text-lg font-semibold">{priceFormatted} €</p>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                onClick={handleEnroll}
                disabled={enrolling}
                size="lg"
                className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-8 text-lg rounded-lg shadow-lg transition-all"
              >
                {enrolling ? "Redirection..." : "S'inscrire à cette formation"}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 max-w-6xl py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Tabs Section */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="programme" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-8">
                  <TabsTrigger value="programme">Programme</TabsTrigger>
                  <TabsTrigger value="objectifs">Objectifs</TabsTrigger>
                  <TabsTrigger value="prerequis">Prérequis</TabsTrigger>
                  <TabsTrigger value="certification">
                    Certification
                  </TabsTrigger>
                </TabsList>

                {/* Programme Tab */}
                <TabsContent value="programme" className="space-y-4">
                  <p className="text-gray-600 mb-6">
                    Découvrez la structure complète de ce cours organisé en{" "}
                    {totalModules} modules contenant {totalLessons} leçons.
                  </p>
                  <Accordion type="single" collapsible className="space-y-3">
                    {course.modules?.map((module, index) => (
                      <AccordionItem
                        key={module.id}
                        value={module.id}
                        className="border rounded-lg px-4"
                      >
                        <AccordionTrigger className="hover:no-underline py-4">
                          <div className="flex items-start gap-4 text-left flex-1">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900">
                                Module {index + 1}: {module.title}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {module.duration} minutes
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-0 pb-4">
                          <div className="space-y-3 mt-4">
                            {/* Lessons */}
                            <div className="space-y-2">
                              {module.lessons.map((lesson, lessonIndex) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                  <Play className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                      Leçon {lessonIndex + 1}: {lesson.title}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {lesson.duration} minutes
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    {lesson.isFree && (
                                      <Badge className="bg-green-100 text-green-800 text-xs">
                                        Gratuit
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Module Quiz */}
                            {module.hasQuiz && (
                              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                <Zap className="w-4 h-4 text-purple-600 flex-shrink-0" />
                                <span className="text-sm font-medium text-purple-900">
                                  Quiz du module
                                </span>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </TabsContent>

                {/* Objectifs Tab */}
                <TabsContent value="objectifs" className="space-y-4">
                  <div className="space-y-3">
                    {course.objectives?.map((objective, index) => (
                      <div
                        key={index}
                        className="flex gap-3 p-4 bg-blue-50 rounded-lg"
                      >
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700">{objective}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Prérequis Tab */}
                <TabsContent value="prerequis" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {course.prerequisites}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Certification Tab */}
                <TabsContent value="certification" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex gap-3 mb-4">
                        <Award className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <h3 className="text-lg font-semibold text-gray-900">
                          Certification Professionnelle
                        </h3>
                      </div>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {course.certificationInfo}
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Sticky Price Card */}
              <div className="lg:sticky lg:top-4 space-y-6">
                {/* Price Card */}
                <Card className="border-2 border-blue-600">
                  <CardContent className="pt-6">
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-2">Prix</p>
                      <p className="text-3xl font-bold text-gray-900">
                        {priceFormatted} €
                      </p>
                    </div>

                    <Button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      size="lg"
                      className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 rounded-lg shadow transition-all mb-4"
                    >
                      {enrolling ? "..." : "S'inscrire"}
                    </Button>

                    <div className="space-y-3 py-6 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                        Ce cours inclut
                      </p>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-gray-700">
                            {totalModules} modules
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Play className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-gray-700">
                            {totalLessons} leçons
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-gray-700">
                            {courseDuration}h de formation
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Award className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-gray-700">Certification</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MessageCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span className="text-gray-700">Support IA</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Share Section */}
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm font-semibold text-gray-700 mb-4">
                      Partager ce cours
                    </p>
                    <div className="flex gap-3">
                      <Button
                        onClick={() => handleShare("linkedin")}
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Linkedin className="w-4 h-4" />
                        <span className="text-xs">LinkedIn</span>
                      </Button>
                      <Button
                        onClick={() => handleShare("whatsapp")}
                        variant="outline"
                        size="sm"
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Share2 className="w-4 h-4" />
                        <span className="text-xs">WhatsApp</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Instructor Info (if available) */}
                {course.instructor && (
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Instructeur
                      </p>
                      <p className="text-gray-600">{course.instructor}</p>
                      {course.rating && (
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={
                                  i < Math.floor(course.rating!)
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }
                              >
                                ★
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {course.rating.toFixed(1)}/5 ({course.reviews}{" "}
                            avis)
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
