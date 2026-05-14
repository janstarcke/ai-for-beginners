import { useEffect } from "react";
import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Guide from "./pages/Guide";
import ClaudeDesign from "./pages/ClaudeDesign";
import FinancialAnalyst from "./pages/FinancialAnalyst";
import TokenSpar from "./pages/TokenSpar";
import ImportHistory from "./pages/ImportHistory";
import { ThemeToggle } from "./components/ThemeToggle";
import { GlobalSearch } from "./components/GlobalSearch";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/guide"} component={Guide} />
      <Route path={"/claude-design"} component={ClaudeDesign} />
      <Route path={"/financial-analyst"} component={FinancialAnalyst} />
      <Route path={"/token-spar"} component={TokenSpar} />
      {/* Hidden: nicht im Menü verlinkt, noindex via useEffect-Meta-Tag im Component. */}
      <Route path={"/secret-import-history"} component={ImportHistory} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      {/* Audit Finding #11: Reduced-Motion respektieren.
          reducedMotion="user" liest prefers-reduced-motion und deaktiviert
          Framer-Animations dann global. Affects Vestibular-Disorder-User. */}
      <MotionConfig reducedMotion="user">
        <ThemeProvider defaultTheme="light" switchable>
          <TooltipProvider>
            <Toaster />
            <ThemeToggle />
            <GlobalSearch />
            <ScrollToTop />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}

export default App;
