import { Clock } from "lucide-react";

const activities = [
  {
    title: "Applied to Frontend Developer",
    time: "10 min ago",
  },
  {
    title: "AI Resume Analysis Completed",
    time: "45 min ago",
  },
  {
    title: "Interview Scheduled with Infosys",
    time: "2 hours ago",
  },
  {
    title: "Profile Updated",
    time: "Yesterday",
  },
];

function RecentActivity() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">
        Recent Activity
      </h2>

      <div className="space-y-5">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="bg-violet-600 p-2 rounded-full">
              <Clock size={16} className="text-white" />
            </div>

            <div>
              <p className="text-white">
                {activity.title}
              </p>

              <p className="text-slate-400 text-sm">
                {activity.time}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;