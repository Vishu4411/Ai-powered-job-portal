import { useState, useEffect } from "react";
import { getApplicationCopilot } from "../../services/aiService";
import { applyJob } from "../../services/applicationService";
import {
  Rocket,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Briefcase,
  Target,
  Sparkles,
  ArrowRight,
  X,
  Loader2,
  ShieldCheck,
  Zap,
  Building
} from "lucide-react";

export default function ApplicationCopilotModal({ jobId, onClose, onApplied }) {
  const [copilot, setCopilot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    if (!jobId) return;
    setLoading(true);
    setError("");

    getApplicationCopilot(jobId)
      .then((res) => {
        setCopilot(res.data);
      })
      .catch((err) => {
        console.error("Failed to load Application Copilot:", err);
        setError(err.response?.data?.message || "Failed to analyze application strategy for this job.");
      })
      .finally(() => setLoading(false));
  }, [jobId]);

  const toggleCheck = (idx) => {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleApply = async () => {
    try {
      setApplying(true);
      setError("");
      await applyJob({ jobId });
      setApplySuccess(true);
      if (onApplied) onApplied(jobId);
    } catch (err) {
      console.error("Application submission failed:", err);
      setError(err.response?.data?.message || "Already applied or submission failed.");
    } finally {
      setApplying(false);
    }
  };


  const getBadgeStyle = (recommendation) => {
    switch (recommendation) {
      case "READY_TO_APPLY":
        return "bg-emerald-950/80 text-emerald-300 border-emerald-800/60";
      case "APPLY_AFTER_IMPROVEMENT":
        return "bg-amber-950/80 text-amber-300 border-amber-800/60";
      default:
        return "bg-rose-950/80 text-rose-300 border-rose-800/60";
    }
  };

  const getRecommendationLabel = (recommendation) => {
    switch (recommendation) {
      case "READY_TO_APPLY":
        return "🟢 READY TO APPLY";
      case "APPLY_AFTER_IMPROVEMENT":
        return "⚡ APPLY AFTER IMPROVEMENT";
      default:
        return "⚠ LOW MATCH — CONSIDER OTHER ROLES";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl text-white my-8">
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-indigo-400">
              <Rocket size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">AI Job Application Copilot</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/50">Phase 8</span>
              </div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {copilot?.jobTitle || "Job Application Strategy"}
                {copilot?.company && (
                  <span className="text-sm font-normal text-slate-400 flex items-center gap-1">
                    <Building size={14} /> {copilot.company}
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
              <p className="text-sm text-slate-400 font-medium">Analyzing job requirements against candidate profile...</p>
            </div>
          ) : error && !copilot ? (
            <div className="p-5 bg-rose-950/40 border border-rose-800/50 rounded-2xl text-rose-300 text-sm">
              {error}
            </div>
          ) : copilot ? (
            <>
              {/* Top Banner Score & Badge */}
              <div className="bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-900/40 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className={`px-3 py-1 text-xs font-bold uppercase rounded-xl border ${getBadgeStyle(copilot.recommendation)}`}>
                      {getRecommendationLabel(copilot.recommendation)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white leading-snug">
                    Application Readiness Score
                  </h3>
                  <p className="text-xs text-slate-400">
                    {copilot.recommendedNextAction}
                  </p>
                </div>

                <div className="flex flex-col items-center justify-center shrink-0 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 min-w-[120px]">
                  <span className="text-3xl font-extrabold text-indigo-400">{copilot.applicationReadinessScore}%</span>
                  <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">Readiness</span>
                </div>
              </div>

              {/* Score Breakdown Metrics */}
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 space-y-1 text-center">
                  <div className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
                    <Briefcase size={14} className="text-indigo-400" /> Job Match
                  </div>
                  <div className="text-2xl font-bold text-white">{copilot.overallMatchScore}%</div>
                </div>

                <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 space-y-1 text-center">
                  <div className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
                    <FileText size={14} className="text-indigo-400" /> ATS Resume Score
                  </div>
                  <div className="text-2xl font-bold text-white">{copilot.atsScore}%</div>
                </div>

                <div className="bg-slate-950/50 border border-slate-800/80 rounded-2xl p-4 space-y-1 text-center">
                  <div className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
                    <Target size={14} className="text-indigo-400" /> Career Readiness
                  </div>
                  <div className="text-2xl font-bold text-white">{copilot.careerReadinessScore}%</div>
                </div>
              </div>

              {/* Executive Strategy Text */}
              {copilot.applicationStrategy && (
                <div className="bg-slate-950/60 border border-indigo-900/30 rounded-2xl p-5 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    <Sparkles size={14} /> AI Executive Application Strategy
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed italic">
                    "{copilot.applicationStrategy}"
                  </p>
                </div>
              )}

              {/* Strengths & Skill Gaps */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 size={15} /> Key Matching Strengths
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {copilot.strengths && copilot.strengths.length > 0 ? (
                      copilot.strengths.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{str}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-500 italic">General profile alignment.</li>
                    )}
                  </ul>
                </div>

                <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle size={15} /> Missing / Weak Keywords
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {copilot.skillGaps && copilot.skillGaps.length > 0 ? (
                      copilot.skillGaps.map((gap, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">⚠</span>
                          <span>{gap}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-slate-400 font-medium">No major missing technical skill gaps identified!</li>
                    )}
                  </ul>
                </div>
              </div>

              {/* Resume Improvements */}
              {copilot.resumeImprovements && copilot.resumeImprovements.length > 0 && (
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap size={15} /> Resume Improvements for Target Job
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    {copilot.resumeImprovements.map((imp, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-400 font-bold">•</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Interactive Checklist */}
              {copilot.applicationChecklist && copilot.applicationChecklist.length > 0 && (
                <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center justify-between">
                    <span>Pre-Application Checklist</span>
                    <span className="text-[10px] text-slate-400 font-normal">Interactive (Frontend Session)</span>
                  </h4>
                  <div className="space-y-2">
                    {copilot.applicationChecklist.map((item, idx) => (
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

              {/* Error state if submit fails */}
              {error && (
                <div className="p-4 bg-rose-950/40 border border-rose-800/50 rounded-2xl text-rose-300 text-xs">
                  {error}
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2 flex items-center justify-between gap-4 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all"
                >
                  Close Copilot
                </button>

                {applySuccess ? (
                  <div className="px-6 py-3 bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-xs font-bold rounded-xl flex items-center gap-2">
                    <ShieldCheck size={16} /> Application Submitted Successfully!
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleApply}
                    disabled={applying}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl inline-flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all"
                  >
                    {applying ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Submitting Application...
                      </>
                    ) : (
                      <>
                        Apply With Confidence 🚀 <ArrowRight size={16} />
                      </>
                    )}
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
