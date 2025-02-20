
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Properties from "@/pages/Properties";
import PropertyFormPage from "@/pages/PropertyFormPage";
import { AuthProvider, useAuth } from "@/providers/AuthProvider";
import Auth from "@/pages/Auth";
import Settings from "@/pages/Settings";
import Agents from "@/pages/Agents";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/NotFound";
import AppSidebar from "@/components/AppSidebar";
import Dashboard from "@/pages/Dashboard";
import Index from "@/pages/Index";

// Protected Route wrapper component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <div className="flex h-screen">
      <AppSidebar />
      <div className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
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
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toaster />
      </Router>
    </AuthProvider>
  );
}

export default App;
