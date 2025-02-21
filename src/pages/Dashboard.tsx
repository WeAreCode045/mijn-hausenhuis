
import { RecentProperties } from "@/components/dashboard/RecentProperties";
import { RecentSubmissions } from "@/components/dashboard/RecentSubmissions";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-estate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-estate-800">Dashboard</h1>
          <p className="text-estate-600 mt-2">Welcome to your real estate management dashboard</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <RecentProperties />
          <RecentSubmissions />
        </div>
      </div>
    </div>
  );
}
