
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@/types/user";
import { useToast } from "@/components/ui/use-toast";

interface ProfileResponse {
  id: string;
  created_at: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  role: "admin" | "agent" | null;
  updated_at: string;
  whatsapp_number: string | null;
  agent_photo: string | null;
}

export function useUsers() {
  const { toast } = useToast();

  const { data: users, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      
      // Transform the data to match the User type
      const transformedData: User[] = (data as ProfileResponse[]).map(user => ({
        id: user.id,
        email: user.email || null,
        full_name: user.full_name || null,
        phone: user.phone || null,
        whatsapp_number: user.whatsapp_number || null,
        role: user.role || null,
        agent_photo: user.agent_photo || null
      }));

      return transformedData;
    },
  });

  const deleteUser = async (userId: string) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    users,
    refetch,
    deleteUser
  };
}
