
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Properties from "@/pages/Properties";
import PropertyFormPage from "@/pages/PropertyFormPage";
import { AuthProvider } from "@/providers/AuthProvider";
import Auth from "@/pages/Auth";
import Settings from "@/pages/Settings";
import Agents from "@/pages/Agents";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/NotFound";
import AppSidebar from "@/components/AppSidebar";
import { useAuth } from "@/providers/AuthProvider";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";

// Protected Route wrapper component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  // While checking authentication status, show a loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  // If not authenticated, redirect to auth page
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex h-screen">
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/properties" 
                element={
                  <ProtectedRoute>
                    <Properties />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/properties/new" 
                element={
                  <ProtectedRoute>
                    <PropertyFormPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/properties/:id" 
                element={
                  <ProtectedRoute>
                    <PropertyFormPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/agents" 
                element={
                  <ProtectedRoute>
                    <Agents />
                  </ProtectedRoute>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
