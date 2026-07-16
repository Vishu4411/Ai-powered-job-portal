import StatsCards from "../components/dashboard/StatsCards";
import ApplicationChart from "../components/dashboard/ApplicationChart";
import ProfileStrength from "../components/dashboard/ProfileStrength";
import AIRecommendations from "../components/dashboard/AIRecommendations";
import RecommendedJobs from "../components/dashboard/RecommendedJobs";
import RecentActivity from "../components/dashboard/RecentActivity";
function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
       <h1 className="text-4xl font-bold text-white">
  Good Morning, {localStorage.getItem("fullName")} 👋
</h1>

        <p className="text-slate-400 mt-2">
          Here's what's happening with your career today.
        </p>
      </div>

      <StatsCards />
      <div className="grid lg:grid-cols-3 gap-6">

  <div className="lg:col-span-2">
    <ApplicationChart />
  </div>

  <ProfileStrength />

</div>
<div className="mt-6">
  <AIRecommendations />
</div>
<div className="mt-6">
    <RecommendedJobs />
</div>
<div className="mt-6">
  <RecentActivity />
</div>
    </div>
  );
}

export default Dashboard;