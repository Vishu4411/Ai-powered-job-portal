import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { getDashboardStats } from "../../services/dashboardService";

function RecentActivity({ activityData }) {
  const [activities, setActivities] = useState(activityData || []);
  const [loading, setLoading] = useState(!activityData);

  useEffect(() => {
    if (!activityData) {
      getDashboardStats()
        .then((res) => {
          if (res.data && res.data.recentActivities) {
            setActivities(res.data.recentActivities);
          }
        })
        .catch((err) => console.error("Error loading recent activities:", err))
        .finally(() => setLoading(false));
    } else {
      setActivities(activityData);
      setLoading(false);
    }
  }, [activityData]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Recent Activity</h2>

      {loading ? (
        <div className="text-slate-400 text-sm py-4">Loading your recent activity...</div>
      ) : activities.length === 0 ? (
        <div className="text-slate-500 text-sm py-6 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
          No recent activity recorded yet.
        </div>
      ) : (
        <div className="space-y-5">
          {activities.map((activity, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="bg-violet-600/20 text-violet-400 p-2 rounded-full border border-violet-500/30 shrink-0">
                <Clock size={16} />
              </div>

              <div>
                <p className="text-white text-sm font-medium">{activity.title}</p>
                <p className="text-slate-400 text-xs mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentActivity;