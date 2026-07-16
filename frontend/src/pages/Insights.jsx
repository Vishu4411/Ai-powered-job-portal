import { TrendingUp, BarChart3, Activity, Sparkles } from "lucide-react";
const metrics = [
  { label: "Applications", value: "24", trend: "+12%" },
  { label: "Response rate", value: "42%", trend: "+8%" },
  { label: "Interview rate", value: "25%", trend: "+3%" },
  { label: "Offer rate", value: "12%", trend: "+2%" },
];
const bars = [40, 65, 55, 80, 70, 90, 75];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
function Insights() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Insights
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Understand what's working across your job hunt.
        </p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
          >
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {m.label}
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-2xl font-bold text-slate-900 dark:text-white">
                {m.value}
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> {m.trend}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="font-semibold text-slate-900 dark:text-white">
                Weekly activity
              </h2>
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              This week
            </span>
          </div>
          <div className="flex items-end justify-between h-48 gap-3">
            {bars.map((h, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 hover:from-indigo-500 hover:to-indigo-300 transition-all"
                  style={{ height: `${h}%` }}
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {days[idx]}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-semibold text-slate-900 dark:text-white">
              AI Suggestions
            </h2>
          </div>
          <ul className="space-y-3 text-sm">
            {[
              "Add 2 more measurable outcomes to your resume summary.",
              "Your best day to apply is Tuesday — 2.1x response rate.",
              "Design roles at Series B startups match you highest.",
            ].map((s) => (
              <li
                key={s}
                className="flex gap-2 text-slate-700 dark:text-slate-300"
              >
                <Activity className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
export default Insights;
