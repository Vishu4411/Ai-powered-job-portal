import { useEffect, useState } from "react";
import { getCareerReadiness } from "../../services/aiService";
import { CheckCircle2, AlertCircle, Lightbulb, TrendingUp, RefreshCw } from "lucide-react";

export default function CareerReadiness() {
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReadiness = () => {
    setLoading(true);
    setError(null);
    getCareerReadiness()
      .then((res) => {
        setReadiness(res.data);
      })
      .catch((err) => {
        console.error("Failed to load Career Readiness Score:", err);
        setError("Unable to compute Career Readiness Score. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchReadiness();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
        <div className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-xl"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error || !readiness) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400">
          <AlertCircle size={20} />
          <p className="text-sm font-medium">{error || "No data available."}</p>
          <button
            onClick={fetchReadiness}
            className="ml-auto p-1.5 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-lg text-amber-700 dark:text-amber-300"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
    );
  }

  const score = readiness.overallScore || 0;
  
  // Badge color based on score
  const getBadgeColor = (val) => {
    if (val >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800";
    if (val >= 60) return "bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800";
    return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800";
  };

  const getProgressColor = (val) => {
    if (val >= 80) return "bg-emerald-500";
    if (val >= 60) return "bg-indigo-500";
    return "bg-amber-500";
  };

  const components = [
    { label: "Profile Completeness", weight: "15%", score: readiness.profileScore },
    { label: "Skills Coverage", weight: "20%", score: readiness.skillsScore },
    { label: "Work Experience", weight: "20%", score: readiness.experienceScore },
    { label: "Education History", weight: "10%", score: readiness.educationScore },
    { label: "Projects Portfolio", weight: "15%", score: readiness.projectsScore },
    { label: "Certifications", weight: "5%", score: readiness.certificationsScore },
    { label: "Resume / ATS Score", weight: "15%", score: readiness.resumeATSScore },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="text-indigo-600 dark:text-indigo-400" size={22} />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Career Readiness Score
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Weighted deterministic evaluation of your profile, skills, ATS match & career portfolio.
          </p>
        </div>

        <div className={`px-4 py-1.5 rounded-full border text-xs font-semibold self-start sm:self-auto ${getBadgeColor(score)}`}>
          {score >= 80 ? "High Career Readiness" : score >= 60 ? "Moderate Readiness" : "Needs Optimization"}
        </div>
      </div>

      {/* Main Score Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 dark:bg-slate-800/40 rounded-xl p-5 border border-slate-100 dark:border-slate-800">
        {/* Score Ring / Gauge */}
        <div className="flex flex-col items-center justify-center p-2 text-center md:border-r border-slate-200 dark:border-slate-700/60">
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-200 dark:text-slate-700"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={score >= 80 ? "text-emerald-500" : score >= 60 ? "text-indigo-600" : "text-amber-500"}
                strokeDasharray={`${score}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-2xl font-extrabold text-slate-900 dark:text-white">
              {score}%
            </span>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Overall Readiness
          </span>
        </div>

        {/* Recommended Action Card */}
        <div className="md:col-span-2 flex flex-col justify-center space-y-2">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <Lightbulb size={18} />
            <span className="text-xs uppercase font-bold tracking-wider">Recommended Next Action</span>
          </div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            "{readiness.recommendedNextAction || "Complete your profile information to boost your readiness."}"
          </p>
        </div>
      </div>

      {/* Component Breakdown Progress Bars */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
          Component Breakdown
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
          {components.map((c, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-700 dark:text-slate-300">
                  {c.label} <span className="text-slate-400 dark:text-slate-500 text-[10px]">({c.weight})</span>
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">{c.score}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(c.score)}`}
                  style={{ width: `${Math.min(100, Math.max(0, c.score))}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Improvement Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
        {/* Strengths */}
        <div className="space-y-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
          <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-600 dark:text-emerald-400" />
            Strengths
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            {readiness.strengths && readiness.strengths.length > 0 ? (
              readiness.strengths.map((s, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-500 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-400 italic">No specific strengths recorded yet.</li>
            )}
          </ul>
        </div>

        {/* Improvement Areas */}
        <div className="space-y-2 bg-amber-50/50 dark:bg-amber-950/20 p-4 rounded-xl border border-amber-100 dark:border-amber-900/30">
          <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
            <AlertCircle size={14} className="text-amber-600 dark:text-amber-400" />
            Improvement Areas
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
            {readiness.improvementAreas && readiness.improvementAreas.length > 0 ? (
              readiness.improvementAreas.map((imp, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-amber-500 font-bold">•</span>
                  <span>{imp}</span>
                </li>
              ))
            ) : (
              <li className="text-slate-500 font-medium">Your profile is fully optimized!</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
