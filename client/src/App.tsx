import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Login from "@/pages/login";
import ChecklistBank from "@/pages/checklist-bank";
import MyPerformance from "@/pages/my-performance";
import PracticeDetail from "@/pages/practice-detail";
import Profile from "@/pages/profile";
import Goals from "@/pages/goals";
import Forum from "@/pages/forum";
import TimedSimulations from "@/pages/timed-simulations";
import MainLayout from "@/components/layouts/MainLayout";
import { useAuth } from "@/hooks/useAuth";
import { OfflineIndicator } from "@/components/ui/offline-indicator";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen w-full items-center justify-center">
      <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
    </div>;
  }

  if (!isAuthenticated) {
    window.location.href = "/api/login";
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <ProtectedRoute component={Dashboard} />} />
      <Route path="/login" component={Login} />
      <Route path="/checklist-bank" component={() => <ProtectedRoute component={ChecklistBank} />} />
      <Route path="/my-performance" component={() => <ProtectedRoute component={MyPerformance} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
      <Route path="/goals" component={() => <ProtectedRoute component={Goals} />} />
      <Route path="/forum" component={() => <ProtectedRoute component={Forum} />} />
      <Route path="/timed-simulations" component={() => <ProtectedRoute component={TimedSimulations} />} />
      <Route path="/practice/:id" component={({ params }) => <ProtectedRoute component={() => <PracticeDetail id={params.id} />} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <MainLayout>
          <Router />
          <OfflineIndicator />
        </MainLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
