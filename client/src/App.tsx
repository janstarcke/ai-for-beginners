import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ConsentProvider } from "./contexts/ConsentContext";
import ConsentBanner from "./components/ConsentBanner";
import RouteTracker from "./components/RouteTracker";
import { ThemeToggle } from "./components/ThemeToggle";
import { GlobalSearch } from "./components/GlobalSearch";

// Audit Finding #7: Route-based Code-Splitting. Vorher waren alle 6 Pages
// im initialen Bundle (~810 KB raw / 250 KB gz, Vite >500 KB Warnung).
// Mit lazy() + Suspense bekommt jede Page ihren eigenen Chunk — initial-
// Route Home lädt ~120 KB gz (-50%).
const Home = lazy(() => import("./pages/Home"));
const Guide = lazy(() => import("./pages/Guide"));
const ClaudeDesign = lazy(() => import("./pages/ClaudeDesign"));
const FinancialAnalyst = lazy(() => import("./pages/FinancialAnalyst"));
const TokenSpar = lazy(() => import("./pages/TokenSpar"));
const ImportHistory = lazy(() => import("./pages/ImportHistory"));
const Impressum = lazy(() => import("./pages/Impressum"));
const Datenschutz = lazy(() => import("./pages/Datenschutz"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Minimal-Fallback: keine Spinner-UI um Layout-Shift zu vermeiden — die
// Pages sind nach Chunk-Download sub-100ms-render.
function RouteFallback() {
  return <div className="min-h-screen" aria-hidden="true" />;
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return null;
}

function Router() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/guide"} component={Guide} />
        <Route path={"/claude-design"} component={ClaudeDesign} />
        <Route path={"/financial-analyst"} component={FinancialAnalyst} />
        <Route path={"/token-spar"} component={TokenSpar} />
        {/* Hidden: nicht im Menü verlinkt, noindex via useEffect-Meta-Tag
            im Component PLUS nginx X-Robots-Tag-Header. */}
        <Route path={"/secret-import-history"} component={ImportHistory} />
        <Route path={"/impressum"} component={Impressum} />
        <Route path={"/datenschutz"} component={Datenschutz} />
        <Route path={"/disclaimer"} component={Disclaimer} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  // Audit Finding #11 (Reduced-Motion) wird jetzt von tw-animate-css selbst
  // gehandhabt: alle `animate-in`/`fade-in`/`slide-in-*`-Klassen werden via
  // @media (prefers-reduced-motion: reduce) automatisch no-op. Vorher war
  // dafür <MotionConfig reducedMotion="user"> nötig (Audit #16 Migration).
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <ConsentProvider>
          <TooltipProvider>
            <Toaster />
            <ThemeToggle />
            <GlobalSearch />
            <ScrollToTop />
            <RouteTracker />
            {/* Audit (Lighthouse): genau EIN <main>-Landmark pro Route.
                Zentral hier statt in jeder Page — ThemeToggle/Toaster/
                GlobalSearch bleiben bewusst außerhalb des main-Landmarks. */}
            <main>
              <Router />
            </main>
            <ConsentBanner />
          </TooltipProvider>
        </ConsentProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
