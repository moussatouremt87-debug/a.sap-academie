import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { BackToTop } from "@/components/back-to-top";
import Home from "@/pages/home";
import Agent from "@/pages/agent";
import Expertises from "@/pages/expertises";
import Formations from "@/pages/formations";
import FormationDetail from "@/pages/formation-detail";
import FaqPage from "@/pages/faq";
import PourquoiAsap from "@/pages/pourquoi-asap";
import CRM from "@/pages/crm";
import Nurturing from "@/pages/nurturing";
import MentionsLegales from "@/pages/mentions-legales";
import StudentPortal from "@/pages/student-portal";
import Inscription from "@/pages/inscription";
import Documents from "@/pages/documents";
import SharedDocument from "@/pages/shared-document";
import AdminElearning from "@/pages/admin-elearning";
import NotFound from "@/pages/not-found";

// ── E-Learning Pages (Sprint 1) ──────────────────────
import Courses from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";

// ── E-Learning Pages (Sprint 2) ──────────────────────
import Dashboard from "@/pages/dashboard";
import LessonViewer from "@/pages/lesson-viewer";
import Quiz from "@/pages/quiz";
import Certificates from "@/pages/certificates";
import Leaderboard from "@/pages/leaderboard";
import Forum from "@/pages/forum";

// ── Agent IA & Modules SAP (Sprint 3) ────────────────
import AiTutor from "@/pages/ai-tutor";
import SapModules from "@/pages/sap-modules";

// ── Growth Engine & Nurturing (Sprint 4) ─────────────
import BlogPage from "@/pages/blog";
import ParrainagePage from "@/pages/parrainage";
import EmailNurturingPage from "@/pages/email-nurturing";

// ── Infrastructure & Sécurité (Sprint 5) ────────────
import AuthPage from "@/pages/auth";
import AdminDashboard from "@/pages/admin-dashboard";
import SeoPerformancePage from "@/pages/seo-performance";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/agent" component={Agent} />
      <Route path="/expertises" component={Expertises} />
      <Route path="/formations" component={Formations} />
      <Route path="/formation/:id" component={FormationDetail} />
      <Route path="/faq" component={FaqPage} />
      <Route path="/pourquoi-asap" component={PourquoiAsap} />
      <Route path="/crm" component={CRM} />
      <Route path="/nurturing" component={Nurturing} />
      <Route path="/mentions-legales" component={MentionsLegales} />
      <Route path="/espace-apprenant" component={StudentPortal} />
      <Route path="/e-learning">{() => <Redirect to="/espace-apprenant" />}</Route>
      <Route path="/inscription" component={Inscription} />
      <Route path="/documents" component={Documents} />
      <Route path="/shared/:token" component={SharedDocument} />
      <Route path="/admin/elearning" component={AdminElearning} />

      {/* ── E-Learning Routes (Sprint 1) ──────────── */}
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:id" component={CourseDetail} />

      {/* ── E-Learning Routes (Sprint 2) ──────────── */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/courses/:id/learn/:lessonId" component={LessonViewer} />
      <Route path="/quiz/:quizId" component={Quiz} />
      <Route path="/certificates" component={Certificates} />
      <Route path="/leaderboard" component={Leaderboard} />
      <Route path="/forum" component={Forum} />

      {/* ── Agent IA & Modules SAP (Sprint 3) ─────── */}
      <Route path="/ai-tutor" component={AiTutor} />
      <Route path="/sap-modules" component={SapModules} />

      {/* ── Growth Engine & Nurturing (Sprint 4) ──── */}
      <Route path="/blog" component={BlogPage} />
      <Route path="/parrainage" component={ParrainagePage} />
      <Route path="/email-nurturing" component={EmailNurturingPage} />


      {/* ── Infrastructure & Sécurité (Sprint 5) ──────── */}
      <Route path="/auth" component={AuthPage} />
      <Route path="/admin-dashboard" component={AdminDashboard} />
      <Route path="/seo-performance" component={SeoPerformancePage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const [location] = useLocation();
  const isAgentPage = location === "/agent";
  const isCrmPage = location === "/crm" || location === "/nurturing" || location === "/documents" || location === "/admin/elearning";
  const isStudentPortal = location === "/espace-apprenant" || location === "/e-learning";
  const isInscriptionPage = location.startsWith("/inscription");

  // E-learning pages with their own layout (no header/footer)
  const isLessonViewer = location.match(/^\/courses\/\d+\/learn\/\d+/);
  const isQuizPage = location.startsWith("/quiz/");

  // AI Tutor has its own immersive layout
  const isAiTutor = location === "/ai-tutor";

  // Email nurturing dashboard has its own layout
  const isEmailNurturing = location === "/email-nurturing";
  const isAuthPage = location === "/auth";
  const isAdminDashboard = location === "/admin-dashboard";
  const isSeoPerformance = location === "/seo-performance";

  if (isCrmPage || isStudentPortal || isInscriptionPage || isLessonViewer || isQuizPage || isAiTutor || isEmailNurturing || isAuthPage || isAdminDashboard || isSeoPerformance) {
    return (
      <>
        <Router />
        <ScrollToTop />
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Router />
      </main>
      {!isAgentPage && <Footer />}
      <ScrollToTop />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="asap-ui-theme">
      <I18nProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AppLayout />
            <BackToTop />
            <Toaster />
          </TooltipProvider>
        </QueryClientProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;
