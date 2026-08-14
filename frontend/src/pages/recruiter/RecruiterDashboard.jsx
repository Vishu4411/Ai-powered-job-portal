import { useState, useEffect } from "react";
import { Briefcase, Users, CheckCircle2, Clock, Plus, Building, BarChart2, Award, Sparkles, UserCheck, XCircle, ArrowUpRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { getRecruiterDashboard, getRecruiterAnalytics } from "../../services/recruiterService";
import { getMyCompany } from "../../services/companyService";
import { useToast } from "../../context/ToastContext";

function RecruiterDashboard() {
  const { showToast } = useToast();
  const [company, setCompany] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [compRes, analyticsRes] = await Promise.all([
        getMyCompany(),
        getRecruiterAnalytics(),
      ]);
      if (compRes.data) setCompany(compRes.data);
      if (analyticsRes.data) setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error("Error loading recruiter analytics dashboard:", err);
      showToast("Failed to load recruiter analytics.", "error");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-4">
        <Sparkles className="animate-spin text-indigo-500" size={32} />
        <p className="text-sm font-medium">Loading Recruiter Analytics & Hiring Metrics...</p>
      </div>
    );
  }

  const totalJobs = analytics?.totalJobs || 0;
  const activeJobs = analytics?.activeJobs || 0;
  const totalApplicants = analytics?.totalApplicants || 0;
  const avgMatchScore = analytics?.averageMatchScore || 0;
  const topMatchScore = analytics?.topMatchScore || 0;

  const pendingApps = analytics?.pendingApplications || 0;
  const shortlistedApps = analytics?.shortlistedApplications || 0;
  const interviewApps = analytics?.interviewScheduledApplications || 0;
  const rejectedApps = analytics?.rejectedApplications || 0;

  const topCandidate = analytics?.topCandidate;
  const topSkills = analytics?.topSkills || [];
  const recentApps = analytics?.recentApplications || [];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 w-max mb-2">
            <BarChart2 size={13} /> Recruiter Analytics Portal
          </span>
          <h1 className="text-3xl font-black">
            Welcome back, {localStorage.getItem("fullName") || "Recruiter"}! 👋
          </h1>
          <p className="text-indigo-100 mt-1 text-sm max-w-xl">
            {company?.companyName
              ? `Hiring & Recruitment Metrics for ${company.companyName}`
              : "Set up your company profile to start posting job vacancies and tracking candidate analytics."}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/recruiter/post-job"
            className="flex items-center gap-2 px-5 py-3 bg-white text-indigo-700 font-bold rounded-2xl hover:bg-slate-100 transition shadow-lg text-sm"
          >
            <Plus size={18} /> Post New Job
          </Link>
          <Link
            to="/recruiter/company"
            className="flex items-center gap-2 px-5 py-3 bg-indigo-700/60 backdrop-blur-md text-white font-semibold rounded-2xl hover:bg-indigo-700 transition text-sm"
          >
            <Building size={18} /> Company Profile
          </Link>
        </div>
      </div>

      {/* Primary Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex items-center gap-4 shadow-sm hover:border-indigo-500/40 transition">
          <div className="w-14 h-14 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
            <Briefcase size={26} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Active / Total Jobs</p>
            <h3 className="text-2xl font-black dark:text-white mt-0.5">
              {activeJobs} <span className="text-sm font-normal text-slate-400">/ {totalJobs} Total</span>
            </h3>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex items-center gap-4 shadow-sm hover:border-purple-500/40 transition">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
            <Users size={26} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Applicants</p>
            <h3 className="text-2xl font-black dark:text-white mt-0.5">{totalApplicants}</h3>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex items-center gap-4 shadow-sm hover:border-emerald-500/40 transition">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp size={26} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Avg Candidate Match</p>
            <h3 className="text-2xl font-black dark:text-white mt-0.5">{avgMatchScore}%</h3>
          </div>
        </div>

        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex items-center gap-4 shadow-sm hover:border-amber-500/40 transition">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
            <Award size={26} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Top Match Score</p>
            <h3 className="text-2xl font-black dark:text-white mt-0.5">{topMatchScore}%</h3>
          </div>
        </div>
      </div>

      {totalJobs === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
          <Briefcase className="mx-auto text-slate-500 mb-3" size={44} />
          <h3 className="text-xl font-bold dark:text-white">No Jobs Posted Yet</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Post your first job vacancy to start receiving AI-matched applications and recruiter analytics.
          </p>
          <Link
            to="/recruiter/post-job"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition mt-6 text-sm"
          >
            <Plus size={18} /> Post Your First Job
          </Link>
        </div>
      ) : totalApplicants === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8">
          <Users className="mx-auto text-slate-500 mb-3" size={44} />
          <h3 className="text-xl font-bold dark:text-white">No Applicants Received Yet</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            Applicant pipeline metrics and skill breakdowns will appear automatically when candidates apply to your job postings.
          </p>
        </div>
      ) : (
        <>
          {/* Pipeline & Top Candidate Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Application Pipeline (2 Cols) */}
            <div className="lg:col-span-2 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                    <BarChart2 size={20} className="text-indigo-500" /> Hiring Application Pipeline
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time candidate status distribution across active vacancies.</p>
                </div>

                <div className="flex gap-2 text-xs font-semibold">
                  <span className="px-2.5 py-1 bg-indigo-500/10 text-indigo-400 rounded-full">
                    Shortlist Rate: {analytics?.shortlistRate || 0}%
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                {/* Pending */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5 dark:text-slate-300">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Clock size={14} /> Pending / Under Review
                    </span>
                    <span>{pendingApps} ({totalApplicants > 0 ? Math.round((pendingApps / totalApplicants) * 100) : 0}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${totalApplicants > 0 ? (pendingApps / totalApplicants) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Shortlisted */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5 dark:text-slate-300">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <CheckCircle2 size={14} /> Shortlisted
                    </span>
                    <span>{shortlistedApps} ({analytics?.shortlistRate || 0}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${analytics?.shortlistRate || 0}%` }}
                    />
                  </div>
                </div>

                {/* Interview Scheduled */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5 dark:text-slate-300">
                    <span className="flex items-center gap-1.5 text-indigo-400">
                      <UserCheck size={14} /> Interview Scheduled
                    </span>
                    <span>{interviewApps} ({analytics?.interviewRate || 0}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${analytics?.interviewRate || 0}%` }}
                    />
                  </div>
                </div>

                {/* Rejected */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5 dark:text-slate-300">
                    <span className="flex items-center gap-1.5 text-rose-400">
                      <XCircle size={14} /> Rejected
                    </span>
                    <span>{rejectedApps} ({analytics?.rejectionRate || 0}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-rose-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${analytics?.rejectionRate || 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Top Candidate Spotlight (1 Col) */}
            <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-indigo-950/80 border border-slate-800 p-6 md:p-8 space-y-5 text-white shadow-xl flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5 w-max mb-4">
                  <Award size={14} /> Top Candidate Spotlight
                </span>

                {topCandidate ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-black">{topCandidate.candidateName}</h3>
                        <p className="text-xs text-indigo-300 font-medium mt-0.5">{topCandidate.jobTitle}</p>
                      </div>
                      <div className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl text-xl font-black">
                        {topCandidate.overallMatchScore}%
                      </div>
                    </div>

                    <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Pipeline Status:</span>
                        <span className="font-bold text-indigo-400">{topCandidate.applicationStatus}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Match Accuracy:</span>
                        <span className="font-bold text-emerald-400">Authoritative AI Score</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400">No candidate evaluation available yet.</p>
                )}
              </div>

              <Link
                to="/recruiter/jobs"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl transition flex items-center justify-center gap-2 shadow-md"
              >
                Evaluate Candidate Rankings <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          {/* Top Applicant Skills Breakdown */}
          {topSkills.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-sm">
              <div>
                <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                  <Sparkles size={20} className="text-purple-500" /> Top Applicant Skills & Competencies
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Most common technical skills present across your applicant pool.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {topSkills.map((sk) => (
                  <div key={sk.skill} className="p-4 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="dark:text-white">{sk.skill}</span>
                      <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full">{sk.count} candidates</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-500 h-full rounded-full"
                        style={{ width: `${Math.min(100, (sk.count / totalApplicants) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Application Activity */}
          {recentApps.length > 0 && (
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 md:p-8 space-y-6 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                    <Clock size={20} className="text-indigo-500" /> Recent Application Activity
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Latest candidate submissions for your job postings.</p>
                </div>

                <Link to="/recruiter/jobs" className="text-xs text-indigo-500 font-bold hover:underline flex items-center gap-1">
                  View All Jobs <ArrowUpRight size={14} />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-bold">
                      <th className="py-3 px-4">Candidate</th>
                      <th className="py-3 px-4">Target Job</th>
                      <th className="py-3 px-4">AI Match</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Applied Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 dark:text-slate-300">
                    {recentApps.map((app) => (
                      <tr key={app.applicationId} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                        <td className="py-3.5 px-4 font-bold dark:text-white">{app.candidateName}</td>
                        <td className="py-3.5 px-4 font-medium text-indigo-400">{app.jobTitle}</td>
                        <td className="py-3.5 px-4 font-black text-emerald-400">{app.matchScore}%</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-300 rounded-full font-semibold">
                            {app.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-slate-400">
                          {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : "Recently"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RecruiterDashboard;
