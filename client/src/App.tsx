import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { I18nProvider } from "@/lib/i18n";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/protected-route";
import { ErrorBoundary } from "@/components/error-boundary";
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

// ── Infrastructure & Sécurité (Sprint 5) ─────────────
import AuthPage from "@/pages/auth";
import AdminDashboard from "@/pages/admin-dashboard";
import SeoPerformancePage from "@/pages/seo-performance";

// ── Scale, Analytics & Lancement (Sprint 6) ──────────
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import NotificationsPage from "@/pages/notifications";
import PaymentBillingPage from "@/pages/payment-billing";
import LaunchPage from "@/pages/launch";

function Router() {
  return (
    <Switch>
      {/* ── Public Routes ──────────────────────────── */}
      <Route path="/" component={Home} />
      <Route path="/agent" component={Agent} />
      <Route path="/expertises" component={Expertises} />
      <Route path="/formations" component={Formations} />
      <Route path="/formation/:id" component={FormationDetail} />
      <Route path="/faq" component={FaqPage} />
      <Route path="/pourquoi-asap" component={PourquoiAsap} />
      <Route path="/mentions-legales" component={MentionsLegales} />
      <Route path="/espace-apprenant" component={StudentPortal} />
      <Route path="/e-learning">{() => <Redirect to="/espace-apprenant" />}</Route>
      <Route path="/inscription" component={Inscription} />
      <Route path="/shared/:token" component={SharedDocument} />
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:id" component={CourseDetail} />
      <Route path="/sap-modules" component={SapModules} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/launch" component={LaunchPage} />

      {/* ── Protected Routes (require auth) ────────── */}
      <Route path="/dashboard">{() => <ProtectedRoute component={Dashboard} />}</Route>
      <Route path="/courses/:id/learn/:lessonId">{() => <ProtectedRoute component={LessonViewer} />}</Route>
      <Route path="/quiz/:quizId">{() => <ProtectedRoute component={Quiz} />}</Route>
      <Route path="/certificates">{() => <ProtectedRoute component={Certificates} />}</Route>
      <Route path="/leaderboard">{() => <ProtectedRoute component={Leaderboard} />}</Route>
      <Route path="/forum">{() => <ProtectedRoute component={Forum} />}</Route>
      <Route path="/ai-tutor">{() => <ProtectedRoute component={AiTutor} />}</Route>
      <Route path="/parrainage">{() => <ProtectedRoute component={ParrainagePage} />}</Route>
      <Route path="/notifications">{() => <ProtectedRoute component={NotificationsPage} />}</Route>
      <Route path="/payment-billing">{() => <ProtectedRoute component={PaymentBillingPage} />}</Route>
      <Route path="/documents">{() => <ProtectedRoute component={Documents} />}</Route>

      {/* ── Admin Routes (require auth + admin) ────── */}
      <Route path="/crm">{() => <ProtectedRoute component={CRM} />}</Route>
      <Route path="/nurturing">{() => <ProtectedRoute component={Nurturing} />}</Route>
      <Route path="/admin/elearning">{() => <ProtectedRoute component={AdminElearning} />}</Route>
      <Route path="/admin-dashboard">{() => <ProtectedRoute component={AdminDashboard} />}</Route>
      <Route path="/email-nurturing">{() => <ProtectedRoute component={EmailNurturingPage} />}</Route>
      <Route path="/analytics">{() => <ProtectedRoute component={AnalyticsDashboard} />}</Route>
      <Route path="/seo-performance">{() => <ProtectedRoute component={SeoPerformancePage} />}</Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const [location] = useLocation();
  const isAgentPage = location === "/agent";
  const isCrmPage =
    location === "/crm" ||
    location === "/nurturing" ||
    location === "/documents" ||
    location === "/admin/elearning";
  const isStudentPortal =
    location === "/espace-apprenant" || location === "/e-learning";
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
  const isAnalytics = location === "/analytics";
  const isNotifications = location === "/notifications";
  const isPaymentBilling = location === "/payment-billing";
  const isLaunch = location === "/launch";

  if (
    isCrmPage ||
    isStudentPortal ||
    isInscriptionPage ||
    isLessonViewer ||
    isQuizPage ||
    isAiTutor ||
    isEmailNurturing ||
    isAuthPage ||
    isAdminDashboard ||
    isSeoPerformance ||
    isAnalytics ||
    isNotifications ||
    isPaymentBilling ||
    isLaunch
  ) {
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
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="asap-ui-theme">
        <I18nProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <TooltipProvider>
                <AppLayout />
                <BackToTop />
                <Toaster />
              </TooltipProvider>
            </AuthProvider>
          </QueryClientProvider>
        </I18nProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
