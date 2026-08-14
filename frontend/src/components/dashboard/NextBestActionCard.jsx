import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCareerActionPlan } from "../../services/aiService";
import { Zap, ArrowRight, Clock } from "lucide-react";

export default function NextBestActionCard() {
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCareerActionPlan()
      .then((res) => setPlan(res.data))
      .catch((err) => console.error("Failed to load dashboard Next Best Action:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !plan) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-900/80 via-slate-900 to-purple-950/80 border border-indigo-800/40 rounded-2xl p-5 text-white shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
          <Zap size={14} className="text-amber-400 fill-amber-400" />
          <span>NEXT BEST ACTION — PRIORITY FOCUS: {plan.topPriorityFocus}</span>
          <span className="px-2 py-0.5 rounded-md bg-indigo-950 text-indigo-200 border border-indigo-800/50 text-[10px]">
            <Clock size={10} className="inline mr-1" />{plan.estimatedTimeline}
          </span>
        </div>
        <h3 className="text-sm sm:text-base font-bold text-white leading-snug">
          {plan.nextBestAction}
        </h3>
      </div>

      <Link
        to="/career-plan"
        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-md transition-all shrink-0 self-end sm:self-auto"
      >
        View Full Action Plan <ArrowRight size={14} />
      </Link>
    </div>
  );
}
