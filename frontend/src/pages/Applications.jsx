import { useEffect, useState } from "react";
import { Briefcase, MapPin, Compass } from "lucide-react";
import { getApplications } from "../services/applicationService";
import PostApplicationCoachModal from "../components/applications/PostApplicationCoachModal";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppId, setSelectedAppId] = useState(null);

  useEffect(() => {
    const email = localStorage.getItem("email");

    if (!email) {
      setLoading(false);
      return;
    }

    getApplications(email)
      .then((response) => {
        console.log("Applications:", response.data);
        setApplications(response.data);
      })
      .catch((error) => {
        console.error("Error fetching applications:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "SHORTLISTED":
        return "bg-emerald-950/80 text-emerald-300 border-emerald-800/60";
      case "INTERVIEW_SCHEDULED":
        return "bg-purple-950/80 text-purple-300 border-purple-800/60";
      case "UNDER_REVIEW":
        return "bg-indigo-950/80 text-indigo-300 border-indigo-800/60";
      case "REJECTED":
        return "bg-rose-950/80 text-rose-300 border-rose-800/60";
      default:
        return "bg-slate-800 text-slate-300 border-slate-700";
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Loading applications...
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          My Applications
        </h1>

        <p className="text-sm text-slate-500 dark:text-slate-400">
          Jobs you have applied for and stage-aware AI coaching.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          No Applications Found
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row gap-4 items-start justify-between">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                    <Briefcase className="text-indigo-600" />
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                      {app.job?.title}
                    </h2>

                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {app.job?.company}
                    </p>

                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                      <MapPin size={16} />
                      {app.job?.location}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 self-end sm:self-auto">
                  <span className={`px-3 py-1 text-xs font-bold rounded-xl border ${getStatusStyle(app.status)}`}>
                    {app.status || "APPLIED"}
                  </span>

                  <button
                    onClick={() => setSelectedAppId(app.id)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 shadow-md transition-all"
                  >
                    <Compass size={14} /> Post-App Coach 🚀
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 grid sm:grid-cols-3 gap-2">
                <p><strong>Applicant:</strong> {app.applicantName}</p>
                <p><strong>Email:</strong> {app.email}</p>
                <p><strong>Job Type:</strong> {app.job?.jobType}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Post Application Coach Modal */}
      {selectedAppId && (
        <PostApplicationCoachModal
          applicationId={selectedAppId}
          onClose={() => setSelectedAppId(null)}
        />
      )}
    </div>
  );
}

export default Applications;