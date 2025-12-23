import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import Home from "@/pages/home";
import Agent from "@/pages/agent";
import Expertises from "@/pages/expertises";
import Formations from "@/pages/formations";
import FaqPage from "@/pages/faq";
import PourquoiAsap from "@/pages/pourquoi-asap";
import CRM from "@/pages/crm";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/agent" component={Agent} />
      <Route path="/expertises" component={Expertises} />
      <Route path="/formations" component={Formations} />
      <Route path="/faq" component={FaqPage} />
      <Route path="/pourquoi-asap" component={PourquoiAsap} />
      <Route path="/crm" component={CRM} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppLayout() {
  const [location] = useLocation();
  const isAgentPage = location === "/agent";
  const isCrmPage = location === "/crm";

  if (isCrmPage) {
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
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppLayout />
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
