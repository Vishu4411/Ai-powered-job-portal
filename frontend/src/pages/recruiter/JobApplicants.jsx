import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react";
import { Users, ArrowLeft, Mail, FileText, UserCheck, X, Sparkles, Brain, CheckCircle2, AlertCircle, HelpCircle, Award } from "lucide-react";
import {
  getJobApplications,
  updateApplicationStatus,
  getCandidateProfileForApp,
} from "../../services/recruiterService";
import { getRankedApplicants, getCandidateInsights } from "../../services/aiService";
import { useToast } from "../../context/ToastContext";

function JobApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Candidate Profile Modal State
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [profileModalLoading, setProfileModalLoading] = useState(false);

  // AI Candidate Insights Modal State
  const [insightsModalOpen, setInsightsModalOpen] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [candidateInsights, setCandidateInsights] = useState(null);

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      // Fetch AI-ranked applicants sorted descending by Match %
      const res = await getRankedApplicants(jobId);
      if (res.data && res.data.length > 0) {
        setApplicants(res.data);
      } else {
        // Fallback to basic applications list if ranked list is empty
        const fallbackRes = await getJobApplications(jobId);
        setApplicants(fallbackRes.data || []);
      }
    } catch (err) {
      console.warn("Ranked applicants fetch failed, falling back to basic applications:", err);
      try {
        const fallbackRes = await getJobApplications(jobId);
        setApplicants(fallbackRes.data || []);
      } catch (fallbackErr) {
        console.error(fallbackErr);
        showToast("Failed to load applicants.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await updateApplicationStatus(appId, newStatus);
      setApplicants((prev) =>
        prev.map((a) =>
          a.applicationId === appId || a.id === appId
            ? { ...a, applicationStatus: res.data.status, status: res.data.status }
            : a
        )
      );
      showToast(`Applicant status updated to ${newStatus}.`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update applicant status.", "error");
    }
  };

  const openCandidateProfile = async (appId) => {
    setProfileModalLoading(true);
    try {
      const res = await getCandidateProfileForApp(appId);
      setSelectedCandidate(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch candidate profile.", "error");
    } finally {
      setProfileModalLoading(false);
    }
  };

  const openAIInsights = async (appId) => {
    setInsightsModalOpen(true);
    setInsightsLoading(true);
    setCandidateInsights(null);
    try {
      const res = await getCandidateInsights(appId);
      setCandidateInsights(res.data);
    } catch (err) {
      console.error(err);
      showToast("Failed to load AI Candidate Insights.", "error");
      setInsightsModalOpen(false);
    } finally {
      setInsightsLoading(false);
    }
  };

  const getScoreBadgeColor = (score) => {
    if (score >= 85) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (score >= 65) return "bg-blue-500/10 text-blue-400 border-blue-500/30";
    return "bg-amber-500/10 text-amber-400 border-amber-500/30";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
        <Sparkles className="animate-spin text-indigo-500" size={32} />
        <p className="text-sm font-medium">Calculating AI Candidate Rankings & Match Scores...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/recruiter/jobs")}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
      >
        <ArrowLeft size={16} /> Back to My Jobs
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold dark:text-white">AI Ranked Candidates</h1>
            <span className="px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-semibold flex items-center gap-1.5">
              <Sparkles size={12} /> Ranked by Match %
            </span>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Candidates ordered by deterministic match percentage against target job requirements.
          </p>
        </div>
      </div>

      {applicants.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <Users className="mx-auto text-slate-500 mb-3" size={40} />
          <h3 className="text-lg font-bold dark:text-white">No Applications Received Yet</h3>
          <p className="text-sm text-slate-400 mt-1">Candidates applying for this job will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((app, index) => {
            const appId = app.applicationId || app.id;
            const appStatus = app.applicationStatus || app.status || "APPLIED";
            const matchScore = app.overallMatchScore ?? 75;

            return (
              <div
                key={appId}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm relative overflow-hidden"
              >
                {/* Ranking Ribbon for Top 3 */}
                {index < 3 && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-600 to-purple-600 text-white text-[10px] font-extrabold px-3 py-0.5 rounded-bl-lg shadow-sm">
                    TOP MATCH #{index + 1}
                  </div>
                )}

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                  <div className="flex items-start gap-4">
                    {/* Match Score Badge */}
                    <div className={`flex flex-col items-center justify-center p-3 rounded-xl border ${getScoreBadgeColor(matchScore)} min-w-[76px]`}>
                      <span className="text-2xl font-black">{matchScore}%</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider">AI Match</span>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold dark:text-white flex items-center gap-2">
                        {app.candidateName || app.applicantName || app.candidateEmail || app.email}
                      </h3>
                      {app.headline && <p className="text-xs text-indigo-400 font-medium mt-0.5">{app.headline}</p>}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1.5">
                        <span className="flex items-center gap-1">
                          <Mail size={12} /> {app.candidateEmail || app.email}
                        </span>
                        <span>Applied: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recently"}</span>
                        {app.yearsOfExperience > 0 && <span>Experience: {app.yearsOfExperience} years</span>}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <select
                      value={appStatus}
                      onChange={(e) => handleStatusChange(appId, e.target.value)}
                      className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="APPLIED">APPLIED</option>
                      <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                      <option value="SHORTLISTED">SHORTLISTED</option>
                      <option value="REJECTED">REJECTED</option>
                      <option value="INTERVIEW_SCHEDULED">INTERVIEW_SCHEDULED</option>
                    </select>

                    <button
                      onClick={() => openAIInsights(appId)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm rounded-xl transition shadow-md"
                    >
                      <Brain size={16} /> View AI Insights
                    </button>

                    <button
                      onClick={() => openCandidateProfile(appId)}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm rounded-xl transition border border-slate-700"
                    >
                      <UserCheck size={16} /> Profile
                    </button>
                  </div>
                </div>

                {/* Skills Chips Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {app.matchingSkills && app.matchingSkills.length > 0 && (
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="font-semibold text-emerald-400 flex items-center gap-1 mr-1">
                        <CheckCircle2 size={13} /> Matching:
                      </span>
                      {app.matchingSkills.map((sk) => (
                        <span key={sk} className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 rounded-full font-medium">
                          ✓ {sk}
                        </span>
                      ))}
                    </div>
                  )}

                  {app.missingSkills && app.missingSkills.length > 0 && (
                    <div className="flex items-center flex-wrap gap-1.5">
                      <span className="font-semibold text-amber-400 flex items-center gap-1 mr-1">
                        <AlertCircle size={13} /> Missing:
                      </span>
                      {app.missingSkills.map((sk) => (
                        <span key={sk} className="px-2.5 py-0.5 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded-full font-medium">
                          • {sk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {app.coverLetter && (
                  <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl text-xs">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-400 mb-1">
                      <FileText size={13} /> Cover Letter Note:
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{app.coverLetter}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* AI Candidate Insights Modal */}
      {insightsModalOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8 text-white relative space-y-6 shadow-2xl">
            <button
              onClick={() => setInsightsModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
            >
              <X size={20} />
            </button>

            {insightsLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Sparkles className="animate-spin text-purple-500" size={36} />
                <p className="text-sm font-semibold text-slate-300">Generating AI Executive Candidate Insights & Interview Questions...</p>
              </div>
            ) : candidateInsights ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-800 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <Brain className="text-purple-400" size={22} />
                      <h2 className="text-2xl font-bold">{candidateInsights.candidateName}</h2>
                    </div>
                    <p className="text-sm text-slate-400 mt-1">
                      Target Role: <span className="text-indigo-400 font-semibold">{candidateInsights.jobTitle}</span> at {candidateInsights.company}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800">
                    <Award className="text-amber-400" size={24} />
                    <div>
                      <div className="text-2xl font-black text-white">{candidateInsights.overallMatchScore}%</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Authoritative Match</div>
                    </div>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="bg-gradient-to-r from-indigo-950/60 to-purple-950/60 p-5 rounded-2xl border border-indigo-500/20 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-300 flex items-center gap-2">
                    <Sparkles size={14} /> Executive Candidate Summary
                  </h4>
                  <p className="text-sm text-slate-200 leading-relaxed font-normal">
                    {candidateInsights.executiveSummary}
                  </p>
                </div>

                {/* Strengths & Weaknesses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Strengths */}
                  <div className="bg-slate-950/70 p-5 rounded-2xl border border-emerald-500/20 space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                      <CheckCircle2 size={14} /> Key Strengths & Alignment
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {candidateInsights.strengths && candidateInsights.strengths.map((str, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-400 font-bold">•</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses / Skill Gaps */}
                  <div className="bg-slate-950/70 p-5 rounded-2xl border border-amber-500/20 space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-2">
                      <AlertCircle size={14} /> Identified Gaps & Areas to Probe
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      {candidateInsights.weaknesses && candidateInsights.weaknesses.map((wk, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{wk}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Role Fit Analysis */}
                {candidateInsights.roleFitAnalysis && (
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400">Role Fit Analysis</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{candidateInsights.roleFitAnalysis}</p>
                  </div>
                )}

                {/* Interview Questions */}
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-indigo-400 flex items-center gap-2">
                    <HelpCircle size={15} /> 5 Tailored Interview Questions
                  </h4>
                  <div className="space-y-3">
                    {candidateInsights.interviewQuestions && candidateInsights.interviewQuestions.map((q, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-900/80 rounded-xl border border-slate-800/80 text-xs leading-relaxed text-slate-200">
                        {q}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setInsightsModalOpen(false)}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm rounded-xl transition"
                  >
                    Close Insights
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-400">No Insights Available.</div>
            )}
          </div>
        </div>
      )}

      {/* Candidate Profile Modal */}
      {(selectedCandidate || profileModalLoading) && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 text-white relative space-y-6">
            <button
              onClick={() => setSelectedCandidate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
            >
              <X size={20} />
            </button>

            {profileModalLoading ? (
              <div className="text-center py-12 text-slate-400">Loading Candidate Profile...</div>
            ) : (
              selectedCandidate && (
                <div className="space-y-6">
                  <div className="border-b border-slate-800 pb-4">
                    <h2 className="text-2xl font-bold">{selectedCandidate.fullName}</h2>
                    <p className="text-indigo-400 font-medium">{selectedCandidate.headline || "Candidate"}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-slate-400 mt-2">
                      <span>Email: {selectedCandidate.email}</span>
                      <span>Phone: {selectedCandidate.phone || "N/A"}</span>
                      <span>Location: {selectedCandidate.location || "N/A"}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-300 uppercase tracking-wider mb-2">About / Bio</h4>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {selectedCandidate.bio || "No summary provided."}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-300 uppercase tracking-wider mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCandidate.skills ? (
                        selectedCandidate.skills.split(",").map((s) => (
                          <span key={s} className="px-3 py-1 bg-indigo-950 text-indigo-300 rounded-full text-xs font-semibold">
                            {s.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-500">None listed</span>
                      )}
                    </div>
                  </div>

                  {selectedCandidate.educationList && selectedCandidate.educationList.length > 0 && (
                    <div>
                      <h4 className="font-bold text-sm text-slate-300 uppercase tracking-wider mb-2">Education</h4>
                      <div className="space-y-2">
                        {selectedCandidate.educationList.map((edu) => (
                          <div key={edu.id} className="p-3 bg-slate-950 rounded-xl text-xs">
                            <p className="font-semibold text-white">{edu.institution}</p>
                            <p className="text-slate-400">{edu.degree} — {edu.fieldOfStudy}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCandidate.experienceList && selectedCandidate.experienceList.length > 0 && (
                    <div>
                      <h4 className="font-bold text-sm text-slate-300 uppercase tracking-wider mb-2">Experience</h4>
                      <div className="space-y-2">
                        {selectedCandidate.experienceList.map((exp) => (
                          <div key={exp.id} className="p-3 bg-slate-950 rounded-xl text-xs">
                            <p className="font-semibold text-white">{exp.position} at {exp.company}</p>
                            <p className="text-slate-400">{exp.startDate} - {exp.endDate}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default JobApplicants;
