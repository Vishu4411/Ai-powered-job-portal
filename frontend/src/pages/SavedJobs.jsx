import { useEffect, useState } from "react";
import { Briefcase, MapPin, Trash2 } from "lucide-react";
import {
  getSavedJobs,
  deleteSavedJob,
} from "../services/savedJobService";

function SavedJobs() {
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = () => {
    const email = localStorage.getItem("email");

    getSavedJobs(email)
      .then((res) => {
        setSavedJobs(res.data);
      })
      .catch(console.log);
  };

  const removeJob = async (id) => {
    try {
      await deleteSavedJob(id);
      loadSavedJobs();
      alert("Removed Successfully");
    } catch (err) {
      console.log(err);
      alert("Delete Failed");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Saved Jobs
        </h1>

        <p className="text-gray-500">
          Your bookmarked jobs
        </p>
      </div>

      {savedJobs.length === 0 ? (
        <div className="text-center mt-10 text-gray-500">
          No Saved Jobs
        </div>
      ) : (
        savedJobs.map((saved) => (
          <div
            key={saved.id}
            className="rounded-xl border p-5 flex justify-between items-center"
          >
            <div className="flex gap-4">
              <Briefcase />

              <div>
                <h2 className="font-bold">
                  {saved.job.title}
                </h2>

                <p>{saved.job.company}</p>

                <div className="flex gap-4 text-sm mt-2">
                  <span className="flex gap-1">
                    <MapPin size={16} />
                    {saved.job.location}
                  </span>

                  <span>{saved.job.salary}</span>

                  <span>{saved.job.jobType}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => removeJob(saved.id)}
              className="bg-red-600 text-white p-2 rounded-lg"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default SavedJobs;