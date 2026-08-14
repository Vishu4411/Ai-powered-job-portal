import { useState, useEffect } from "react";
import { Briefcase, Users, CheckCircle2, Clock, Plus, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { getRecruiterDashboard } from "../../services/recruiterService";
import { getMyCompany } from "../../services/companyService";

function RecruiterDashboard() {
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalJobs: 0,
    applicationsReceived: 0,
    shortlisted: 0,
    pendingReview: 0,
  });
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getRecruiterDashboard(), getMyCompany()])
      .then(([statsRes, compRes]) => {
        if (statsRes.data) setStats(statsRes.data);
        if (compRes.data) setCompany(compRes.data);
      })
      .catch((err) => console.error("Error loading recruiter dashboard:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading Recruiter Dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider">
            Recruiter Portal
          </span>
          <h1 className="text-3xl font-extrabold mt-2">
            Welcome, {localStorage.getItem("fullName") || "Recruiter"}! 👋
          </h1>
          <p className="text-indigo-100 mt-1">
            {company?.companyName
              ? `Hiring Manager at ${company.companyName}`
              : "Set up your company profile to start posting job vacancies."}
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/recruiter/post-job"
            className="flex items-center gap-2 px-5 py-3 bg-white text-indigo-700 font-semibold rounded-xl hover:bg-slate-100 transition shadow-lg"
          >
            <Plus size={18} /> Post New Job
          </Link>
          <Link
            to="/recruiter/company"
            className="flex items-center gap-2 px-5 py-3 bg-indigo-700/60 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-indigo-700 transition"
          >
            <Building size={18} /> Company Profile
          </Link>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center font-bold">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Job Postings</p>
            <h3 className="text-2xl font-bold dark:text-white">{stats.activeJobs}</h3>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center font-bold">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Applicants</p>
            <h3 className="text-2xl font-bold dark:text-white">{stats.applicationsReceived}</h3>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Shortlisted Candidates</p>
            <h3 className="text-2xl font-bold dark:text-white">{stats.shortlisted}</h3>
          </div>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center font-bold">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Pending Reviews</p>
            <h3 className="text-2xl font-bold dark:text-white">{stats.pendingReview}</h3>
          </div>
        </div>
      </div>

      {/* Quick Navigation Panel */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xl font-bold mb-4 dark:text-white flex items-center justify-between">
            Manage Vacancies
            <Link to="/recruiter/jobs" className="text-xs text-indigo-500 hover:underline font-normal">
              View All Jobs ↗
            </Link>
          </h2>
          <p className="text-slate-400 text-sm mb-6 leading-6">
            Review active jobs, close filled vacancies, or modify job details and candidate qualifications.
          </p>
          <Link
            to="/recruiter/jobs"
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Go to My Jobs Dashboard
          </Link>
        </div>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xl font-bold mb-4 dark:text-white">Employer Branding</h2>
          <p className="text-slate-400 text-sm mb-6 leading-6">
            Update your company profile, website, industry, and location to attract top engineering talent.
          </p>
          <Link
            to="/recruiter/company"
            className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2.5 bg-slate-100 dark:bg-slate-800 dark:text-white rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Edit Company Details
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RecruiterDashboard;
