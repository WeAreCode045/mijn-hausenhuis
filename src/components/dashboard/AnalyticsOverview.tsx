
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export function AnalyticsOverview() {
  const { data: viewStats = [], isLoading } = useQuery({
    queryKey: ['property-views'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          property_web_views(count)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[50px]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Most Viewed Properties</h3>
            <div className="space-y-2">
              {viewStats.map((stat) => (
                <div key={stat.id} className="flex items-center justify-between">
                  <span className="text-sm">{stat.title}</span>
                  <span className="text-sm font-medium">
                    {stat.property_web_views?.length || 0} views
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
