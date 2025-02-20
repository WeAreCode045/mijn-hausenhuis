
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./ui/use-toast";
import { Building2, Settings, Users, LayoutDashboard } from "lucide-react";

export default function AppSidebar() {
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col h-screen">
      <div className="space-y-2 flex-1">
        <Link to="/dashboard">
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              location.pathname === "/dashboard" ? "bg-slate-100" : ""
            }`}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>

        <Link to="/properties">
          <Button
            variant="ghost"
            className={`w-full justify-start ${
              location.pathname === "/properties" ? "bg-slate-100" : ""
            }`}
          >
            <Building2 className="mr-2 h-4 w-4" />
            Properties
          </Button>
        </Link>
        
        {isAdmin && (
          <>
            <Link to="/agents">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  location.pathname === "/agents" ? "bg-slate-100" : ""
                }`}
              >
                <Users className="mr-2 h-4 w-4" />
                Agents
              </Button>
            </Link>
            <Link to="/settings">
              <Button
                variant="ghost"
                className={`w-full justify-start ${
                  location.pathname === "/settings" ? "bg-slate-100" : ""
                }`}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
          </>
        )}
      </div>
      
      <Button variant="ghost" onClick={handleSignOut} className="w-full">
        Sign Out
      </Button>
    </div>
  );
}
