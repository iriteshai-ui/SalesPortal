import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/auth-context";
import AppLayout from "@/components/layout/app-layout";
import React from "react";

import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import LeadJourneyPage from "@/pages/lead-journey";
import PlLeadJourneyPage from "@/pages/pl-lead-journey";
import ElLeadJourneyPage from "@/pages/el-lead-journey";
import NotFound from "@/pages/not-found";

// Protected Route Wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004499]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  return <AppLayout>{children}</AppLayout>;
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      
      <Route path="/dashboard">
        <ProtectedRoute>
          <DashboardPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/leads/new">
        <ProtectedRoute>
          <LeadJourneyPage />
        </ProtectedRoute>
      </Route>
      
      <Route path="/leads/pl/new">
        <ProtectedRoute>
          <PlLeadJourneyPage />
        </ProtectedRoute>
      </Route>

      <Route path="/leads/el/new">
        <ProtectedRoute>
          <ElLeadJourneyPage />
        </ProtectedRoute>
      </Route>

      <Route path="/">
        <Redirect to="/login" />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
