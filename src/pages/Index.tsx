
import { RecentProperties } from "@/components/dashboard/RecentProperties";
import { RecentSubmissions } from "@/components/dashboard/RecentSubmissions";
import { AnalyticsOverview } from "@/components/dashboard/AnalyticsOverview";

export default function Index() {
  return (
    <div className="min-h-screen bg-estate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-estate-800 mb-12">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <RecentProperties />
          <RecentSubmissions />
          <AnalyticsOverview />
        </div>
      </div>
    </div>
  );
}
