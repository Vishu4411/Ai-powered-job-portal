import { useState, useEffect } from "react";
import { Briefcase, Send, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { createJob, updateJob } from "../../services/recruiterService";
import { getMyCompany } from "../../services/companyService";
import { useToast } from "../../context/ToastContext";

function PostJob() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const locationState = useLocation().state;
  const isEditing = Boolean(locationState?.job);

  const [saving, setSaving] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    experience: "",
    jobType: "Full-time",
    description: "",
    skills: "",
    status: "OPEN",
  });

  useEffect(() => {
    if (isEditing) {
      setJobForm({
        ...locationState.job,
        status: locationState.job.status || "OPEN",
      });
    } else {
      // Auto-populate company name from Recruiter's Company profile if available
      getMyCompany().then((res) => {
        if (res.data && res.data.companyName) {
          setJobForm((prev) => ({ ...prev, company: res.data.companyName }));
        }
      });
    }
  }, [isEditing, locationState]);

  const handleChange = (e) => {
    setJobForm({ ...jobForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (isEditing) {
        await updateJob(locationState.job.id, jobForm);
        showToast("Job updated successfully!", "success");
      } else {
        await createJob(jobForm);
        showToast("Job posted successfully!", "success");
      }
      navigate("/recruiter/jobs");
    } catch (err) {
      console.error(err);
      showToast("Failed to submit job posting.", "error");
    } finally {
      setSaving(false);
    }
  };


  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white text-black dark:bg-slate-800 dark:text-white dark:border-slate-700 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate("/recruiter/jobs")}
        className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
      >
        <ArrowLeft size={16} /> Back to My Jobs
      </button>

      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <Briefcase className="text-indigo-600" size={28} />
          <div>
            <h1 className="text-2xl font-bold dark:text-white">
              {isEditing ? "Edit Job Vacancy" : "Create New Job Vacancy"}
            </h1>
            <p className="text-sm text-slate-400">
              {isEditing
                ? "Update job details and requirements."
                : "Post a new opportunity to reach qualified candidates."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-slate-200">
                Job Title *
              </label>
              <input
                required
                name="title"
                value={jobForm.title}
                onChange={handleChange}
                placeholder="e.g. Senior Full Stack Java Developer"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-slate-200">
                Company Name
              </label>
              <input
                name="company"
                value={jobForm.company}
                onChange={handleChange}
                placeholder="Company Name"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-slate-200">
                Location *
              </label>
              <input
                required
                name="location"
                value={jobForm.location}
                onChange={handleChange}
                placeholder="e.g. Remote / Bengaluru / Hybrid"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-slate-200">
                Salary Range
              </label>
              <input
                name="salary"
                value={jobForm.salary}
                onChange={handleChange}
                placeholder="e.g. $90,000 - $120,000"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-slate-200">
                Job Type
              </label>
              <select
                name="jobType"
                value={jobForm.jobType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-slate-200">
                Experience Level
              </label>
              <input
                name="experience"
                value={jobForm.experience}
                onChange={handleChange}
                placeholder="e.g. 2-5 Years / Senior"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-slate-200">
                Posting Status
              </label>
              <select
                name="status"
                value={jobForm.status}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="OPEN">OPEN (Accepting Applications)</option>
                <option value="CLOSED">CLOSED (Filled / Paused)</option>
                <option value="DRAFT">DRAFT</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-slate-200">
              Required Skills (Comma separated) *
            </label>
            <input
              required
              name="skills"
              value={jobForm.skills}
              onChange={handleChange}
              placeholder="e.g. Java, Spring Boot, React, MySQL, AWS"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-slate-200">
              Job Description & Responsibilities *
            </label>
            <textarea
              required
              rows={6}
              name="description"
              value={jobForm.description}
              onChange={handleChange}
              placeholder="Detail job roles, team environment, prerequisites, and qualifications..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate("/recruiter/jobs")}
              className="px-5 py-2.5 bg-slate-800 text-slate-300 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition"
            >
              <Send size={18} />
              {saving ? "Saving..." : isEditing ? "Save Changes" : "Publish Job Posting"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
