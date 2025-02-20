
import { useAuth } from "@/providers/AuthProvider";
import { Navigate } from "react-router-dom";

export default function Index() {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-estate-600">Loading...</p>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  return <Navigate to="/dashboard" replace />;
}
