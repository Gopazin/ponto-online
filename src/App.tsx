
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import AuthPage from "./pages/AuthPage";
import ClockPage from "./pages/ClockPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { setupPWA } from "./utils/syncManager";

const queryClient = new QueryClient();

const App = () => {
  // Initialize PWA functionality
  useEffect(() => {
    setupPWA();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<AuthPage />} />
              <Route path="/auth" element={<AuthPage />} />
              
              {/* Protected Employee Routes */}
              <Route element={<ProtectedRoute allowedRoles={['employee']} />}>
                <Route path="/clock" element={<ClockPage />} />
              </Route>
              
              {/* Protected Admin/Supervisor Routes */}
              <Route element={<ProtectedRoute allowedRoles={['supervisor', 'admin']} />}>
                <Route path="/dashboard" element={<DashboardPage />} />
              </Route>
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
