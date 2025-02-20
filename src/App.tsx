
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex h-screen">
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            <Routes>
              <Route path="/" element={<Navigate to="/properties" replace />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/new" element={<PropertyFormPage />} />
              <Route path="/properties/:id" element={<PropertyFormPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/agents" element={<Agents />} />
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
