import { useState, useEffect } from "react";
import { Save, FileCheck, Sparkles, CheckCircle2, AlertCircle, Award, ChevronDown, ChevronUp } from "lucide-react";
import { getResume, updateResume } from "../services/profileService";
import { analyzeResumeATS } from "../services/aiService";
import { useToast } from "../context/ToastContext";
import ResumeForm from "../components/resume/ResumeForm";
import ResumePreview from "../components/resume/ResumePreview";

function ResumeBuilder() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ATS Analysis State
  const [atsLoading, setAtsLoading] = useState(false);
  const [atsData, setAtsData] = useState(null);
  const [showAtsDetails, setShowAtsDetails] = useState(true);

  const [resumeData, setResumeData] = useState({
    fullName: localStorage.getItem("fullName") || "Guest",
    email: localStorage.getItem("email") || "",
    headline: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
    linkedinUrl: "",
    githubUrl: "",
    educationList: [],
    experienceList: [],
    projectList: [],
  });

  useEffect(() => {
    setLoading(true);
    getResume()
      .then((res) => {
        if (res.data) {
          setResumeData((prev) => ({
            ...prev,
            ...res.data,
          }));
        }
      })
      .catch((err) => {
        console.error("Error loading candidate resume profile:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setSaveSuccess(false);
    setResumeData({
      ...resumeData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveResume = async () => {
    setSaving(true);
    setErrorMessage("");
    setSaveSuccess(false);
    try {
      const res = await updateResume(resumeData);
      if (res.data) {
        setResumeData(res.data);
      }
      setSaveSuccess(true);
      showToast("Resume saved successfully!", "success");
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error("Error saving candidate resume profile:", err);
      setErrorMessage("Failed to save resume changes. Please try again.");
      showToast("Failed to save resume.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAnalyzeATS = async () => {
    setAtsLoading(true);
    try {
      const res = await analyzeResumeATS();
      if (res.data) {
        setAtsData(res.data);
        setShowAtsDetails(true);
        showToast(`ATS Analysis complete! Overall Score: ${res.data.overallScore}%`, "success");
      }
    } catch (err) {
      console.error("Error performing ATS resume analysis:", err);
      showToast("Failed to perform ATS analysis. Please try again.", "error");
    } finally {
      setAtsLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading your candidate resume builder...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Interactive Resume Builder</h1>
          <p className="text-sm text-slate-400">
            Build and persist your candidate resume. Changes sync directly to your account.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <FileCheck size={16} /> Saved to Database!
            </span>
          )}

          {errorMessage && (
            <span className="text-xs text-red-400 font-semibold">{errorMessage}</span>
          )}

          <button
            onClick={handleAnalyzeATS}
            disabled={atsLoading}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg transition"
          >
            <Sparkles size={18} className={atsLoading ? "animate-spin" : ""} />
            {atsLoading ? "Analyzing..." : "Analyze ATS Score"}
          </button>

          <button
            onClick={handleSaveResume}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Resume"}
          </button>
        </div>
      </div>

      {/* ATS Analysis Panel */}
      {atsData && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-950/60 border border-amber-800/80 rounded-xl text-amber-400">
                <Award size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  ATS Resume Compatibility Analysis
                </h3>
                <p className="text-xs text-slate-400">Deterministic scoring & AI feedback</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Overall Score:</span>
                <span
                  className={`px-3 py-1 rounded-full font-extrabold text-sm border ${
                    atsData.overallScore >= 80
                      ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                      : atsData.overallScore >= 50
                      ? "bg-amber-950 text-amber-400 border-amber-800"
                      : "bg-red-950 text-red-400 border-red-800"
                  }`}
                >
                  {atsData.overallScore}%
                </span>
              </div>

              <button
                onClick={() => setShowAtsDetails(!showAtsDetails)}
                className="text-slate-400 hover:text-white p-1"
              >
                {showAtsDetails ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
            </div>
          </div>

          {showAtsDetails && (
            <div className="space-y-6">
              {/* Component Score Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-medium">Profile Info (15%)</div>
                  <div className="text-lg font-bold text-indigo-400 mt-1">{atsData.profileCompletenessScore}%</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-medium">Skills Coverage (20%)</div>
                  <div className="text-lg font-bold text-indigo-400 mt-1">{atsData.skillsScore}%</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-medium">Experience (20%)</div>
                  <div className="text-lg font-bold text-indigo-400 mt-1">{atsData.experienceScore}%</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-medium">Education (10%)</div>
                  <div className="text-lg font-bold text-indigo-400 mt-1">{atsData.educationScore}%</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-medium">Projects (15%)</div>
                  <div className="text-lg font-bold text-indigo-400 mt-1">{atsData.projectsScore}%</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-medium">Certifications (5%)</div>
                  <div className="text-lg font-bold text-indigo-400 mt-1">{atsData.certificationsScore}%</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-medium">Summary (10%)</div>
                  <div className="text-lg font-bold text-indigo-400 mt-1">{atsData.summaryScore}%</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                  <div className="text-xs text-slate-400 font-medium">Keywords (5%)</div>
                  <div className="text-lg font-bold text-indigo-400 mt-1">{atsData.keywordScore}%</div>
                </div>
              </div>

              {/* Strengths & Recommendations */}
              <div className="grid md:grid-cols-2 gap-4">
                {atsData.strengths && atsData.strengths.length > 0 && (
                  <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 size={14} /> Profile Strengths
                    </h4>
                    <ul className="text-xs text-emerald-200 space-y-1 list-disc pl-4">
                      {atsData.strengths.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {atsData.recommendations && atsData.recommendations.length > 0 && (
                  <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-4 space-y-2">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertCircle size={14} /> Actionable Recommendations
                    </h4>
                    <ul className="text-xs text-amber-200 space-y-1 list-disc pl-4">
                      {atsData.recommendations.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* AI Executive Summary */}
              {atsData.aiExplanation && (
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs leading-relaxed space-y-1">
                  <div className="font-semibold text-indigo-400 flex items-center gap-1.5 mb-1">
                    <Sparkles size={14} /> AI ATS Feedback:
                  </div>
                  <p className="text-slate-300">{atsData.aiExplanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ResumeForm resumeData={resumeData} onChange={handleChange} />
        </div>

        <div>
          <ResumePreview resumeData={resumeData} />
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;