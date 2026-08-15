import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getPostApplicationCoach } from "../../services/aiService";
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Briefcase,
  Target,
  Sparkles,
  ArrowRight,
  X,
  Loader2,
  Building,
  RotateCcw,
  MessageSquareCode,
  CheckSquare
} from "lucide-react";

export default function PostApplicationCoachModal({ applicationId, onClose }) {
  const navigate = useNavigate();
  const [coach, setCoach] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    if (!applicationId) return;
    setLoading(true);
    setError("");

    getPostApplicationCoach(applicationId)
      .then((res) => {
        setCoach(res.data);
      })
      .catch((err) => {
        console.error("Failed to load Post-Application Coach:", err);
        setError(err.response?.data?.message || "Failed to analyze post-application coaching details.");
      })
      .finally(() => setLoading(false));
  }, [applicationId]);

  const toggleCheck = (idx) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "SHORTLISTED":
        return { label: "You're Shortlisted 🎉", style: "bg-emerald-950/80 text-emerald-300 border-emerald-800/60" };
      case "INTERVIEW_SCHEDULED":
        return { label: "Interview Scheduled 🚀", style: "bg-purple-950/80 text-purple-300 border-purple-800/60" };
      case "UNDER_REVIEW":
        return { label: "Under Review ⚡", style: "bg-indigo-950/80 text-indigo-300 border-indigo-800/60" };
      case "REJECTED":
        return { label: "Outcome Strategy Pivot 🔄", style: "bg-rose-950/80 text-rose-300 border-rose-800/60" };
      default:
        return { label: "Application Active 🕒", style: "bg-slate-800 text-slate-300 border-slate-700" };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl text-white my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-indigo-400">
              <Compass size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Post-Application Journey Coach</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50">Phase 8</span>
              </div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {coach?.jobTitle || "Application Stage Assistant"}
                {coach?.company && (
                  <span className="text-sm font-normal text-slate-400 flex items-center gap-1">
                    <Building size={14} /> {coach.company}
                  </span>
                )}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4 text-center">
              <Loader2 size={36} className="animate-spin text-indigo-500" />
              <p className="text-sm text-slate-400 font-medium">Analyzing application stage & compiling tailored guidance...</p>
            </div>
          ) : error ? (
            <div className="p-5 bg-rose-950/40 border border-rose-800/50 rounded-2xl text-rose-300 text-sm">
              {error}
            </div>
          ) : coach ? (
            <>
              {/* Top Banner Status & Follow-up */}
              <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-900/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-xl border ${getStatusBadge(coach.status).style}`}>
                      {getStatusBadge(coach.status).label}
                    </span>
                    <span className="text-xs text-slate-400 bg-slate-950 px-2.5 py-1 rounded-xl border border-slate-800 flex items-center gap-1">
                      <Clock size={12} /> {coach.recommendedFollowUpDate}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-200">
                    {coach.recommendedNextAction}
                  </h3>
                </div>

                <div className="flex flex-col items-center justify-center shrink-0 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 min-w-[120px]">
                  <span className="text-3xl font-extrabold text-indigo-400">{coach.stageReadinessScore}%</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Stage Score</span>
                </div>
              </div>

              {/* Executive Stage Guidance */}
              {coach.stageGuidance && (
                <div className="bg-slate-950/60 border border-indigo-900/30 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    <Sparkles size={14} /> AI Executive Coaching Guidance
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    "{coach.stageGuidance}"
                  </p>
                </div>
              )}

              {/* Focus Technical Interview Topics */}
              {coach.focusInterviewTopics && coach.focusInterviewTopics.length > 0 && (
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Target size={15} /> Key Interview Technical Focus Topics
                  </h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {coach.focusInterviewTopics.map((topic, idx) => (
                      <div key={idx} className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl text-xs text-slate-200 font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0"></span>
                        <span>{topic}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actionable Stage Checklist */}
              {coach.stageActionChecklist && coach.stageActionChecklist.length > 0 && (
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><CheckSquare size={15} className="text-indigo-400" /> Stage Action Checklist</span>
                    <span className="text-[10px] text-slate-400 font-normal">Interactive Checkbox</span>
                  </h4>
                  <div className="space-y-2">
                    {coach.stageActionChecklist.map((item, idx) => (
                      <label
                        key={idx}
                        onClick={() => toggleCheck(idx)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          checkedItems[idx]
                            ? "bg-indigo-950/40 border-indigo-700/60 text-slate-200 line-through opacity-80"
                            : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={!!checkedItems[idx]}
                          onChange={() => {}}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 bg-slate-950 border-slate-700"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Skill Pivot Recommendations for Rejected or Low Match */}
              {coach.skillPivotRecommendations && coach.skillPivotRecommendations.length > 0 && (
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <RotateCcw size={15} /> Skill Pivot & Growth Recommendations
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {coach.skillPivotRecommendations.map((pivot, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{pivot}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dynamic Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
                >
                  Close Assistant
                </button>

                {(coach.status === "SHORTLISTED" || coach.status === "INTERVIEW_SCHEDULED") && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate(coach.jobId ? `/mock-interview?jobId=${coach.jobId}` : "/mock-interview");
                    }}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-all"
                  >
                    <MessageSquareCode size={16} /> Start AI Mock Interview 🎯
                  </button>
                )}

                {coach.status === "REJECTED" && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate("/career-plan");
                    }}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    Improve My Career Plan 🎯 <ArrowRight size={16} />
                  </button>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
