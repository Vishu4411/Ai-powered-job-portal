import { useState, useEffect } from "react";
import { Briefcase, MapPin, DollarSign, Sparkles } from "lucide-react";
import { getJobs } from "../../services/jobService";
import { getJobMatch } from "../../services/aiService";

function RecommendedJobs() {
  const [recommendedList, setRecommendedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getJobs()
      .then(async (res) => {
        if (res.data && res.data.length > 0) {
          const topJobs = res.data.slice(0, 3);
          const listWithScores = await Promise.all(
            topJobs.map(async (job) => {
              try {
                const matchRes = await getJobMatch(job.id);
                return {
                  ...job,
                  matchScore: matchRes.data ? matchRes.data.overallMatchScore : 85,
                };
              } catch {
                return { ...job, matchScore: 80 };
              }
            })
          );
          setRecommendedList(listWithScores);
        }
      })
      .catch((err) => console.error("Error loading recommended jobs:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-slate-400 text-sm py-4">Calculating job matches...</div>;
  }

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="text-amber-400" size={18} />
          Recommended Jobs for You
        </h2>
      </div>

      {recommendedList.length === 0 ? (
        <p className="text-slate-400 text-sm">No job recommendations available at this time.</p>
      ) : (
        <div className="space-y-4">
          {recommendedList.map((job) => (
            <div
              key={job.id}
              className="bg-slate-800 rounded-xl p-4 hover:bg-slate-750 transition border border-slate-700/50"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold text-base">{job.title}</h3>
                  <p className="text-indigo-400 text-sm mt-0.5">{job.company}</p>
                </div>

                <div className="flex flex-col items-end">
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full font-bold text-xs">
                    {job.matchScore}% MATCH
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mt-3 text-slate-400 text-xs">
                <span className="flex items-center gap-1">
                  <MapPin size={13} /> {job.location}
                </span>

                {job.salary && (
                  <span className="flex items-center gap-1">
                    <DollarSign size={13} /> {job.salary}
                  </span>
                )}

                <span className="flex items-center gap-1">
                  <Briefcase size={13} /> {job.jobType || "Full-time"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecommendedJobs;