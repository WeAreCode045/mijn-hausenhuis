
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { useAuth } from "@/providers/AuthProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

type Submission = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  inquiry_type: string;
  created_at: string;
  properties: {
    title: string;
  };
};

export function RecentSubmissions() {
  const { profile, isAdmin } = useAuth();
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const { data: recentSubmissions = [], isLoading } = useQuery({
    queryKey: ['recent-submissions', profile?.id, isAdmin],
    queryFn: async () => {
      let query = supabase
        .from('property_contact_submissions')
        .select(`
          id,
          name,
          created_at,
          properties(title)
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
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const fetchFullSubmission = async (id: string) => {
    const { data, error } = await supabase
      .from('property_contact_submissions')
      .select('*, properties(title)')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Contact Form Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
                <Skeleton className="h-4 w-[100px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recent Contact Form Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentSubmissions.map((submission) => (
              <div 
                key={submission.id} 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
                onClick={async () => {
                  const fullSubmission = await fetchFullSubmission(submission.id);
                  setSelectedSubmission(fullSubmission);
                }}
              >
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

      <Dialog open={!!selectedSubmission} onOpenChange={() => setSelectedSubmission(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contact Form Submission</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedSubmission && (
              <>
                <div>
                  <h3 className="font-medium">Property</h3>
                  <p>{selectedSubmission.properties?.title}</p>
                </div>
                <div>
                  <h3 className="font-medium">Contact Information</h3>
                  <p>Name: {selectedSubmission.name}</p>
                  <p>Email: {selectedSubmission.email}</p>
                  <p>Phone: {selectedSubmission.phone}</p>
                </div>
                <div>
                  <h3 className="font-medium">Inquiry Type</h3>
                  <p>{selectedSubmission.inquiry_type}</p>
                </div>
                {selectedSubmission.message && (
                  <div>
                    <h3 className="font-medium">Message</h3>
                    <p>{selectedSubmission.message}</p>
                  </div>
                )}
                <div>
                  <h3 className="font-medium">Submitted</h3>
                  <p>{format(new Date(selectedSubmission.created_at), 'dd MMMM yyyy HH:mm')}</p>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
