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

// ── E-Learning Pages ────────────────────────────────
import Courses from "@/pages/courses";
import CourseDetail from "@/pages/course-detail";

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

      {/* ── E-Learning Routes ──────────────────── */}
      <Route path="/courses" component={Courses} />
      <Route path="/courses/:id" component={CourseDetail} />

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

  if (isCrmPage || isStudentPortal || isInscriptionPage) {
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
