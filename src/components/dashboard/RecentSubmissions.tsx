
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useAuth } from "@/providers/AuthProvider";

export function RecentSubmissions() {
  const { profile, isAdmin } = useAuth();

  const { data: recentSubmissions = [] } = useQuery({
    queryKey: ['recent-submissions', profile?.id, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('property_contact_submissions')
        .select(`
          *,
          properties(title, agent_id)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!isAdmin) {
        query = query.eq('properties.agent_id', profile.id);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Contact Form Submissions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentSubmissions.map((submission) => (
            <div key={submission.id} className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{submission.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {submission.properties?.title}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(submission.created_at), 'dd/MM/yyyy HH:mm')}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
