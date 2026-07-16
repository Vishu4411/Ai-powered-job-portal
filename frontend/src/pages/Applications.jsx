import { useEffect, useState } from "react";
import { Briefcase, MapPin } from "lucide-react";
import { getApplications } from "../services/applicationService";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

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
          Jobs you have applied for.
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
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Briefcase className="text-indigo-600" />
                </div>

                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                    {app.job?.title}
                  </h2>

                  <p className="text-slate-600 dark:text-slate-400">
                    {app.job?.company}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                    <MapPin size={16} />
                    {app.job?.location}
                  </div>

                  <div className="mt-3">
                    <p>
                      <strong>Applicant:</strong> {app.applicantName}
                    </p>

                    <p>
                      <strong>Email:</strong> {app.email}
                    </p>

                    <p>
                      <strong>Experience:</strong> {app.job?.experience}
                    </p>

                    <p>
                      <strong>Salary:</strong> {app.job?.salary}
                    </p>

                    <p>
                      <strong>Job Type:</strong> {app.job?.jobType}
                    </p>

                    <p className="mt-2">
                      <strong>Cover Letter:</strong>
                    </p>

                    <p className="text-gray-600">
                      {app.coverLetter}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Applications;