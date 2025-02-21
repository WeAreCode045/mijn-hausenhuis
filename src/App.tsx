
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/providers/AuthProvider";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyFormPage from "./pages/PropertyFormPage";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import { AppSidebar } from "./components/AppSidebar";
import { PropertyWebView } from "./components/property/PropertyWebView";
import { useAuth } from "@/providers/AuthProvider";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" />;
  }

  return children;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Router>
          <SidebarProvider>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/property/:id/webview"
                element={<PropertyWebView />}
              />
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <div className="min-h-screen flex w-full">
                      <AppSidebar />
                      <main className="flex-1 p-4">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/properties" element={<Properties />} />
                          <Route path="/property/new" element={<PropertyFormPage />} />
                          <Route path="/property/:id/edit" element={<PropertyFormPage />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </main>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </SidebarProvider>
        </Router>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
