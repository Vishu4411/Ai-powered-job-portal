import { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getDashboardStats } from "../../services/dashboardService";

function ApplicationChart({ chartData }) {
  const [data, setData] = useState(chartData || []);
  const [loading, setLoading] = useState(!chartData);

  useEffect(() => {
    if (!chartData) {
      getDashboardStats()
        .then((res) => {
          if (res.data && res.data.monthlyApplicationChart) {
            setData(res.data.monthlyApplicationChart);
          }
        })
        .catch((err) => console.error("Error fetching application chart data:", err))
        .finally(() => setLoading(false));
    } else {
      setData(chartData);
      setLoading(false);
    }
  }, [chartData]);

  const hasApplications = data.some((d) => d.applications > 0);

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <h2 className="text-xl font-semibold text-white">Applications Over Time</h2>
      <p className="text-slate-400 mb-6 text-sm">Last 6 Months Application Activity</p>

      {loading ? (
        <div className="h-80 flex items-center justify-center text-slate-400 text-sm">
          Loading application activity history...
        </div>
      ) : !hasApplications ? (
        <div className="h-80 flex flex-col items-center justify-center text-center p-6 border border-dashed border-slate-800 rounded-xl bg-slate-950/40">
          <p className="text-slate-300 font-semibold text-base">No Job Applications Yet</p>
          <p className="text-slate-500 text-xs mt-1 max-w-sm">
            Your application activity chart will automatically populate as you apply for positions across Career Compass.
          </p>
        </div>
      ) : (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorApp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" allowDecimals={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "0.75rem", color: "#fff" }}
              />
              <Area type="monotone" dataKey="applications" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorApp)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default ApplicationChart;