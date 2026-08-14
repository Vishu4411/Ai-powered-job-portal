import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react"
import { Users, ArrowLeft, Mail, FileText, UserCheck, X } from "lucide-react";
import {
  getJobApplications,
  updateApplicationStatus,
  getCandidateProfileForApp,
} from "../../services/recruiterService";
import { useToast } from "../../context/ToastContext";

function JobApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [profileModalLoading, setProfileModalLoading] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, [jobId]);

  const fetchApplicants = () => {
    setLoading(true);
    getJobApplications(jobId)
      .then((res) => {
        if (res.data) setApplicants(res.data);
      })
      .catch((err) => console.error("Error loading job applicants:", err))
      .finally(() => setLoading(false));
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      const res = await updateApplicationStatus(appId, newStatus);
      setApplicants((prev) => prev.map((a) => (a.id === appId ? res.data : a)));
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


  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading candidate submissions...</div>;
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
          <h1 className="text-3xl font-extrabold dark:text-white">Candidate Applications</h1>
          <p className="text-sm text-slate-400">
            Review applicant profiles and update hiring pipeline status.
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
          {applicants.map((app) => (
            <div
              key={app.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-xl font-bold dark:text-white">{app.applicantName || app.email}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <Mail size={14} /> {app.email}
                    </span>
                    <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 dark:text-white px-3 py-2 text-sm font-semibold outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="APPLIED">APPLIED</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                    <option value="SHORTLISTED">SHORTLISTED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="INTERVIEW_SCHEDULED">INTERVIEW_SCHEDULED</option>
                  </select>

                  <button
                    onClick={() => openCandidateProfile(app.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition"
                  >
                    <UserCheck size={16} /> View Candidate Profile
                  </button>
                </div>
              </div>

              {app.coverLetter && (
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl text-sm">
                  <div className="flex items-center gap-2 font-semibold text-slate-400 mb-1">
                    <FileText size={14} /> Cover Letter / Application Note:
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{app.coverLetter}</p>
                </div>
              )}
            </div>
          ))}
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
