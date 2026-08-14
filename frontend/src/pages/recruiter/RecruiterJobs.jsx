import { useState, useEffect } from "react";
import { Briefcase, Plus, Users, Edit3, Trash2, MapPin, DollarSign, CheckCircle2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getMyJobs, deleteJob, updateJob } from "../../services/recruiterService";
import { useToast } from "../../context/ToastContext";

function RecruiterJobs() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = () => {
    setLoading(true);
    getMyJobs()
      .then((res) => {
        if (res.data) setJobs(res.data);
      })
      .catch((err) => console.error("Error loading recruiter jobs:", err))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job posting?")) return;
    try {
      await deleteJob(id);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      showToast("Job deleted successfully.", "info");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete job.", "error");
    }
  };

  const toggleStatus = async (job) => {
    const newStatus = job.status === "OPEN" ? "CLOSED" : "OPEN";
    try {
      const res = await updateJob(job.id, { ...job, status: newStatus });
      setJobs((prev) => prev.map((j) => (j.id === job.id ? res.data : j)));
      showToast(`Job status updated to ${newStatus}.`, "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to update status.", "error");
    }
  };


  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading your posted jobs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold dark:text-white">My Job Vacancies</h1>
          <p className="text-sm text-slate-400">Manage vacancies posted for your organization.</p>
        </div>

        <Link
          to="/recruiter/post-job"
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition"
        >
          <Plus size={18} /> Create New Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <Briefcase className="mx-auto text-slate-500 mb-3" size={40} />
          <h3 className="text-lg font-bold dark:text-white">No Jobs Posted Yet</h3>
          <p className="text-sm text-slate-400 mt-1 mb-6">Create your first vacancy to start receiving applicant submissions.</p>
          <Link
            to="/recruiter/post-job"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl"
          >
            <Plus size={16} /> Create Job
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-bold dark:text-white">{job.title}</h3>
                  <span
                    className={`px-3 py-0.5 rounded-full text-xs font-semibold ${
                      job.status === "OPEN"
                        ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                        : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                  <span className="font-medium text-indigo-500">{job.company || "Company"}</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {job.location}
                  </span>
                  {job.salary && (
                    <span className="flex items-center gap-1">
                      <DollarSign size={14} /> {job.salary}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {job.skills &&
                    job.skills.split(",").map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 text-xs rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                      >
                        {s.trim()}
                      </span>
                    ))}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end border-t md:border-t-0 pt-4 md:pt-0 border-slate-200 dark:border-slate-800">
                <Link
                  to={`/recruiter/jobs/${job.id}/applicants`}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition"
                >
                  <Users size={16} /> Applicants ({job.applicantCount})
                </Link>

                <button
                  onClick={() => navigate("/recruiter/post-job", { state: { job } })}
                  className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-300 hover:text-white rounded-xl transition"
                  title="Edit Job"
                >
                  <Edit3 size={16} />
                </button>

                <button
                  onClick={() => toggleStatus(job)}
                  className="p-2.5 bg-slate-100 dark:bg-slate-800 text-amber-400 rounded-xl transition"
                  title="Toggle Open/Closed"
                >
                  <CheckCircle2 size={16} />
                </button>

                <button
                  onClick={() => handleDelete(job.id)}
                  className="p-2.5 bg-slate-100 dark:bg-slate-800 text-red-400 hover:text-red-600 rounded-xl transition"
                  title="Delete Job"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecruiterJobs;
