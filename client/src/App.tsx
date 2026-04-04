import { Switch, Route, useLocation, Redirect } from "wouter";
import { lazy, Suspense } from "react";
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

// ── Eager-loaded (critical path) ─────────────────────
import Home from "@/pages/home";

// ── Lazy-loaded Pages ────────────────────────────────
const Agent = lazy(() => import("@/pages/agent"));
const Expertises = lazy(() => import("@/pages/expertises"));
const Formations = lazy(() => import("@/pages/formations"));
const FormationDetail = lazy(() => import("@/pages/formation-detail"));
const FaqPage = lazy(() => import("@/pages/faq"));
const PourquoiAsap = lazy(() => import("@/pages/pourquoi-asap"));
const CRM = lazy(() => import("@/pages/crm"));
const Nurturing = lazy(() => import("@/pages/nurturing"));
const MentionsLegales = lazy(() => import("@/pages/mentions-legales"));
const StudentPortal = lazy(() => import("@/pages/student-portal"));
const Inscription = lazy(() => import("@/pages/inscription"));
const Documents = lazy(() => import("@/pages/documents"));
const SharedDocument = lazy(() => import("@/pages/shared-document"));
const AdminElearning = lazy(() => import("@/pages/admin-elearning"));
const NotFound = lazy(() => import("@/pages/not-found"));

// ── E-Learning Pages (Sprint 1) ──────────────────────
const Courses = lazy(() => import("@/pages/courses"));
const CourseDetail = lazy(() => import("@/pages/course-detail"));

// ── E-Learning Pages (Sprint 2) ──────────────────────
const Dashboard = lazy(() => import("@/pages/dashboard"));
const LessonViewer = lazy(() => import("@/pages/lesson-viewer"));
const Quiz = lazy(() => import("@/pages/quiz"));
const Certificates = lazy(() => import("@/pages/certificates"));
const Leaderboard = lazy(() => import("@/pages/leaderboard"));
const Forum = lazy(() => import("@/pages/forum"));

// ── Agent IA & Modules SAP (Sprint 3) ────────────────
const AiTutor = lazy(() => import("@/pages/ai-tutor"));
const SapModules = lazy(() => import("@/pages/sap-modules"));

// ── Growth Engine & Nurturing (Sprint 4) ─────────────
const BlogPage = lazy(() => import("@/pages/blog"));
const ParrainagePage = lazy(() => import("@/pages/parrainage"));
const EmailNurturingPage = lazy(() => import("@/pages/email-nurturing"));

// ── Infrastructure & Sécurité (Sprint 5) ─────────────
const AuthPage = lazy(() => import("@/pages/auth"));
const AdminDashboard = lazy(() => import("@/pages/admin-dashboard"));
const SeoPerformancePage = lazy(() => import("@/pages/seo-performance"));

// ── Scale, Analytics & Lancement (Sprint 6) ──────────
const AnalyticsDashboard = lazy(() => import("@/pages/analytics-dashboard"));
const NotificationsPage = lazy(() => import("@/pages/notifications"));
const PaymentBillingPage = lazy(() => import("@/pages/payment-billing"));
const LaunchPage = lazy(() => import("@/pages/launch"));

// ── Loading Fallback ─────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Chargement...</p>
      </div>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
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
    </Suspense>
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
