import { Search, MapPin, Briefcase, Bookmark, Filter } from "lucide-react";
import { useEffect, useState } from "react";
import { getJobs } from "../services/jobService";
import { applyJob } from "../services/applicationService";
import { saveJob } from "../services/savedJobService";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    getJobs()
      .then((response) => {
        console.log("Jobs:", response.data);
        setJobs(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleApply = async (job) => {
    const application = {
      applicantName: localStorage.getItem("fullName"),
      email: localStorage.getItem("email"),
      coverLetter: "I am interested in this position.",
      job: {
        id: job.id,
      },
    };

    try {
      await applyJob(application);
      alert("Application Submitted Successfully!");
    } catch (err) {
      console.log(err);

      if (err.response?.status === 409) {
        alert("You have already applied for this job.");
      } else {
        alert("Application Failed");
      }
    }
  };

  const handleSaveJob = async (job) => {
    console.log("SAVE CLICKED");
    console.log(job);

    const savedJob = {
      email: localStorage.getItem("email"),
      job: {
        id: job.id,
      },
    };

    console.log(savedJob);

    try {
      await saveJob(savedJob);
      alert("Job Saved Successfully!");
    } catch (err) {
      console.log(err);

      if (err.response?.status === 409) {
        alert("Job already saved.");
      } else {
        alert("Unable to save job.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Job Search
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Personalized matches, updated in real-time.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />

          <input
            type="text"
            placeholder="Search role, company..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800"
          />
        </div>

        <button className="inline-flex items-center gap-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5">
          <Filter className="w-4 h-4" />
          Filters
        </button>
      </div>

      <div className="space-y-3">
        {jobs.map((job) => (
          <div
            key={job.id}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5"
          >
            <div className="flex justify-between">
              <div className="flex gap-4">
                <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                </div>

                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {job.title}
                  </h3>

                  <div className="text-sm text-slate-500">
                    {job.company}
                  </div>

                  <div className="flex gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {job.location}
                    </span>

                    <span>{job.jobType || "Full Time"}</span>

                    <span>{job.salary || "Not Disclosed"}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {job.skills ? (
                      job.skills.split(",").map((skill) => (
                        <span
                          key={skill}
                          className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">
                        No skills added
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className="text-green-600 font-bold">
                  95% Match
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleSaveJob(job)}
                    className="w-9 h-9 rounded-lg border flex items-center justify-center hover:bg-indigo-100"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleApply(job)}
                    className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;