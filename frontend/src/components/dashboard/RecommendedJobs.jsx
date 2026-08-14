import { useState, useEffect } from "react";
import { Briefcase, MapPin, DollarSign, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { getRecommendedJobs } from "../../services/aiService";

function RecommendedJobs() {
  const [recommendedList, setRecommendedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = () => {
    setLoading(true);
    setError(false);
    getRecommendedJobs()
      .then((res) => {
        if (res.data) {
          setRecommendedList(res.data);
        }
      })
      .catch((err) => {
        console.error("Error loading recommended jobs:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  if (loading) {
    return (
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-center py-10 text-slate-400 text-sm">
        <Sparkles className="animate-spin text-amber-400 mx-auto mb-2" size={20} />
        Calculating personalized job recommendations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 text-center py-8 text-red-400 text-sm">
        <AlertCircle className="mx-auto mb-2" size={20} />
        Unable to load personalized job recommendations.
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Sparkles className="text-amber-400" size={18} />
          Recommended Jobs for You
        </h2>
        <span className="text-xs text-slate-400 font-medium">Ranked by Match Score</span>
      </div>

      {recommendedList.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          No job recommendations available matching your profile at this time.
        </div>
      ) : (
        <div className="space-y-4">
          {recommendedList.slice(0, 5).map((job) => (
            <div
              key={job.jobId}
              className="bg-slate-800/80 hover:bg-slate-800 rounded-xl p-4 transition border border-slate-700/50 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-semibold text-base">{job.title}</h3>
                  <p className="text-indigo-400 text-sm font-medium">{job.company}</p>
                </div>

                <div className="flex flex-col items-end">
                  <span
                    className={`px-3 py-1 rounded-full font-bold text-xs border ${
                      job.overallMatchScore >= 80
                        ? "bg-emerald-950 text-emerald-400 border-emerald-800"
                        : job.overallMatchScore >= 50
                        ? "bg-amber-950 text-amber-400 border-amber-800"
                        : "bg-slate-900 text-slate-400 border-slate-700"
                    }`}
                  >
                    {job.overallMatchScore}% MATCH
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-slate-400 text-xs">
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

              {job.matchingSkills && job.matchingSkills.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] font-semibold text-slate-400 mr-1 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-400" /> Matching Skills:
                  </span>
                  {job.matchingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 rounded-md text-[11px] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecommendedJobs;