import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, CheckCircle2, Briefcase } from "lucide-react";
import { getInterviews } from "../services/applicationService";

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInterviews()
      .then((res) => {
        if (res.data) {
          setInterviews(res.data);
        }
      })
      .catch((err) => {
        console.error("Error loading candidate interviews:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Scheduled Interviews</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Applications updated to Interview Scheduled by recruiters.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-slate-400">Checking scheduled interviews...</div>
      ) : interviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-3">
          <Calendar className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Interviews Scheduled Yet</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            When recruiters shortlist your application and update your status to Interview Scheduled, your position details will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {interviews.map((item) => {
            const job = item.job || {};
            return (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/30">
                      <Calendar className="w-6 h-6" />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{job.title || "Position Title"}</h3>
                      <div className="text-sm text-indigo-500 font-medium">{job.company || "Company Name"}</div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-slate-500 dark:text-slate-400">
                        {job.location && (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" /> {job.location}
                          </span>
                        )}
                        {job.jobType && (
                          <span className="inline-flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5" /> {job.jobType}
                          </span>
                        )}
                        {item.appliedAt && (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Applied: {new Date(item.appliedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <span className="px-3 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full font-bold text-xs flex items-center gap-1.5">
                      <CheckCircle2 size={13} /> INTERVIEW SCHEDULED
                    </span>
                    <span className="text-[11px] text-slate-400 italic">
                      Date & Meeting details will be sent by recruiter
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Interviews;