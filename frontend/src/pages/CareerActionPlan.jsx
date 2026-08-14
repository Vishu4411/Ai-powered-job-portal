import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCareerActionPlan, getRecommendedJobs } from "../services/aiService";
import { Target, Compass, Award, CheckCircle2, Clock, Zap, ArrowRight, BookOpen, FileText, Code, MessageSquareCode, Briefcase, RefreshCw, AlertCircle, Loader2 } from "lucide-react";

export default function CareerActionPlan() {
  const [plan, setPlan] = useState(null);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completedTasks, setCompletedTasks] = useState({});

  const fetchPlanData = () => {
    setLoading(true);
    setError(null);

    Promise.all([getCareerActionPlan(), getRecommendedJobs()])
      .then(([planRes, jobsRes]) => {
        setPlan(planRes.data);
        setRecommendedJobs(jobsRes.data || []);
      })
      .catch((err) => {
        console.error("Failed to load career action plan:", err);
        setError("Unable to load your career action plan. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPlanData();
  }, []);

  const toggleTaskCompleted = (taskId) => {
    setCompletedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-6 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 flex items-center justify-center mx-auto">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Action Plan Unavailable</h2>
        <p className="text-sm text-slate-500">{error || "Could not load action plan."}</p>
        <button
          onClick={fetchPlanData}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 hover:bg-indigo-700"
        >
          <RefreshCw size={14} /> Retry
        </button>
      </div>
    );
  }

  const getPriorityBadgeClass = (level) => {
    switch (level) {
      case "CRITICAL":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      case "HIGH":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "MODERATE":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
      default:
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">
      {/* Header Title */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
            <Target size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              AI Personal Career Action Plan
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Your personalized multi-week execution roadmap to reach 100% job readiness.
            </p>
          </div>
        </div>

        <button
          onClick={fetchPlanData}
          className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          title="Refresh Action Plan"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* EXECUTIVE PRIORITY BANNER */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white border border-indigo-800/40 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
          {/* Readiness Ring & Badges */}
          <div className="flex flex-col items-center justify-center p-4 border-b lg:border-b-0 lg:border-r border-indigo-800/40 text-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={plan.overallReadinessScore >= 75 ? "text-emerald-400" : plan.overallReadinessScore >= 50 ? "text-indigo-400" : "text-amber-400"}
                  strokeDasharray={`${plan.overallReadinessScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-2xl font-extrabold text-white">
                {plan.overallReadinessScore}%
              </span>
            </div>
            <span className="text-xs text-indigo-200 mt-2 font-medium">Readiness Score</span>

            <div className="flex items-center gap-2 mt-3">
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getPriorityBadgeClass(plan.priorityLevel)}`}>
                {plan.priorityLevel.replace("_", " ")}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center gap-1">
                <Clock size={11} /> {plan.estimatedTimeline}
              </span>
            </div>
          </div>

          {/* Next Best Action Card */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-500/30">
              <Zap size={14} className="text-amber-400 fill-amber-400" />
              NEXT BEST ACTION (HIGHEST IMPACT)
            </div>

            <h2 className="text-lg sm:text-xl font-bold leading-snug text-white">
              {plan.nextBestAction}
            </h2>

            {plan.executiveSummary && (
              <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed bg-indigo-950/50 p-3 rounded-xl border border-indigo-800/30">
                "{plan.executiveSummary}"
              </p>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to="/resume"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 shadow-md transition-all"
              >
                <FileText size={14} /> Resume & Profile
              </Link>
              <Link
                to="/mock-interview"
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 shadow-md transition-all"
              >
                <MessageSquareCode size={14} /> AI Mock Interview
              </Link>
              <Link
                to="/jobs"
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl inline-flex items-center gap-1.5 border border-slate-700 transition-all"
              >
                <Briefcase size={14} /> Recommended Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CATEGORIZED ACTION MODULES */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen size={18} className="text-indigo-600 dark:text-indigo-400" />
          Prioritized Action Tasks by Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SKILLS TASKS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <Code size={16} className="text-indigo-600" /> Technical Skills Tasks
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                {plan.skillTasks.length} Tasks
              </span>
            </div>

            <div className="space-y-2">
              {plan.skillTasks.map((t) => (
                <div
                  key={t.taskId}
                  onClick={() => toggleTaskCompleted(t.taskId)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    completedTasks[t.taskId]
                      ? "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60 line-through"
                      : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-indigo-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 dark:text-white">
                      <CheckCircle2
                        size={15}
                        className={completedTasks[t.taskId] ? "text-emerald-500 fill-emerald-500/20" : "text-slate-300 dark:text-slate-700"}
                      />
                      <span>{t.title}</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {t.impact} Impact
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-6">
                    {t.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RESUME / ATS TASKS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <FileText size={16} className="text-purple-600" /> Resume & ATS Tasks
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                {plan.resumeTasks.length} Tasks
              </span>
            </div>

            <div className="space-y-2">
              {plan.resumeTasks.map((t) => (
                <div
                  key={t.taskId}
                  onClick={() => toggleTaskCompleted(t.taskId)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    completedTasks[t.taskId]
                      ? "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60 line-through"
                      : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-purple-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 dark:text-white">
                      <CheckCircle2
                        size={15}
                        className={completedTasks[t.taskId] ? "text-emerald-500 fill-emerald-500/20" : "text-slate-300 dark:text-slate-700"}
                      />
                      <span>{t.title}</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {t.impact} Impact
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-6">
                    {t.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* PROJECT TASKS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <Zap size={16} className="text-emerald-600" /> Portfolio Project Tasks
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                {plan.projectTasks.length} Tasks
              </span>
            </div>

            <div className="space-y-2">
              {plan.projectTasks.map((t) => (
                <div
                  key={t.taskId}
                  onClick={() => toggleTaskCompleted(t.taskId)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    completedTasks[t.taskId]
                      ? "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60 line-through"
                      : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-emerald-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 dark:text-white">
                      <CheckCircle2
                        size={15}
                        className={completedTasks[t.taskId] ? "text-emerald-500 fill-emerald-500/20" : "text-slate-300 dark:text-slate-700"}
                      />
                      <span>{t.title}</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {t.impact} Impact
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-6">
                    {t.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* INTERVIEW TASKS */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-sm">
                <MessageSquareCode size={16} className="text-blue-600" /> Mock Interview Tasks
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                {plan.interviewTasks.length} Tasks
              </span>
            </div>

            <div className="space-y-2">
              {plan.interviewTasks.map((t) => (
                <div
                  key={t.taskId}
                  onClick={() => toggleTaskCompleted(t.taskId)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    completedTasks[t.taskId]
                      ? "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60 line-through"
                      : "bg-slate-50/60 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 font-semibold text-xs text-slate-900 dark:text-white">
                      <CheckCircle2
                        size={15}
                        className={completedTasks[t.taskId] ? "text-emerald-500 fill-emerald-500/20" : "text-slate-300 dark:text-slate-700"}
                      />
                      <span>{t.title}</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {t.impact} Impact
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 pl-6">
                    {t.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FOUR-WEEK ROADMAP */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock size={18} className="text-indigo-600" />
          Structured 4-Week Career Execution Roadmap
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plan.weeklyRoadmap?.map((w) => (
            <div
              key={w.weekNumber}
              className="bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    Week {w.weekNumber}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400">{w.focusArea}</span>
                </div>
                <h3 className="font-bold text-xs text-slate-900 dark:text-white mt-2 leading-snug">
                  {w.title}
                </h3>
                <ul className="mt-2 text-xs text-slate-600 dark:text-slate-400 space-y-1.5 list-disc list-inside">
                  {w.goals?.map((g, idx) => (
                    <li key={idx} className="leading-snug">{g}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TARGET JOB ALIGNMENT */}
      {recommendedJobs.length > 0 && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase size={18} className="text-indigo-600" />
              Target Jobs Aligned with Your Action Plan
            </h2>
            <Link to="/jobs" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
              Browse All Jobs <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {recommendedJobs.slice(0, 3).map((j) => (
              <div key={j.jobId} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-xs text-slate-900 dark:text-white truncate">{j.title}</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                      {j.overallMatchScore}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">{j.company} • {j.location}</p>
                </div>
                <Link
                  to={`/mock-interview?jobId=${j.jobId}`}
                  className="mt-3 py-1.5 px-3 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 rounded-lg text-[11px] font-semibold text-center transition"
                >
                  Practice Interview
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
