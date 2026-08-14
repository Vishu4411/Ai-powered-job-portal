import { Search, MapPin, Briefcase, Bookmark, Filter, Sparkles, X, FileText, CheckCircle2, AlertTriangle, RotateCcw, Award } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { getJobs } from "../services/jobService";
import { applyJob } from "../services/applicationService";
import { saveJob } from "../services/savedJobService";
import { getJobMatch, getJobExplanation, generateCoverLetter } from "../services/aiService";
import { useToast } from "../context/ToastContext";

function Jobs() {
  const { showToast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [matchScores, setMatchScores] = useState({});

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("ALL");
  const [selectedJobType, setSelectedJobType] = useState("ALL");
  const [selectedExperience, setSelectedExperience] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);

  // Modal State
  const [selectedJob, setSelectedJob] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [loadingMatch, setLoadingMatch] = useState(false);

  const [aiExplanation, setAiExplanation] = useState("");
  const [loadingExplanation, setLoadingExplanation] = useState(false);

  const [coverLetterText, setCoverLetterText] = useState("");
  const [loadingCoverLetter, setLoadingCoverLetter] = useState(false);

  useEffect(() => {
    getJobs()
      .then((response) => {
        const jobList = response.data || [];
        setJobs(jobList);
        fetchMatchScores(jobList);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const fetchMatchScores = (jobList) => {
    jobList.forEach(async (j) => {
      try {
        const res = await getJobMatch(j.id);
        if (res.data) {
          setMatchScores((prev) => ({ ...prev, [j.id]: res.data.overallMatchScore }));
        }
      } catch (err) {
        console.error("Match score fetch error for job:", j.id, err);
      }
    });
  };

  // Dynamically extract unique location, jobType, and experience values for dropdowns
  const availableLocations = useMemo(() => {
    const locSet = new Set();
    jobs.forEach((j) => {
      if (j.location) locSet.add(j.location.trim());
    });
    return Array.from(locSet);
  }, [jobs]);

  const availableJobTypes = useMemo(() => {
    const typeSet = new Set();
    jobs.forEach((j) => {
      if (j.jobType) typeSet.add(j.jobType.trim());
    });
    return Array.from(typeSet);
  }, [jobs]);

  const availableExperiences = useMemo(() => {
    const expSet = new Set();
    jobs.forEach((j) => {
      if (j.experience) expSet.add(j.experience.trim());
    });
    return Array.from(expSet);
  }, [jobs]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedLocation("ALL");
    setSelectedJobType("ALL");
    setSelectedExperience("ALL");
  };

  const isFilterActive =
    searchTerm.trim() !== "" ||
    selectedLocation !== "ALL" ||
    selectedJobType !== "ALL" ||
    selectedExperience !== "ALL";

  // Combined Multi-Criteria Filtering
  const filteredJobs = useMemo(() => {
    return jobs.filter((j) => {
      // 1. Keyword search (Title, Company, Skills)
      const q = searchTerm.toLowerCase().trim();
      const matchesKeyword =
        !q ||
        (j.title && j.title.toLowerCase().includes(q)) ||
        (j.company && j.company.toLowerCase().includes(q)) ||
        (j.skills && j.skills.toLowerCase().includes(q));

      // 2. Location filter
      const matchesLocation =
        selectedLocation === "ALL" ||
        (j.location && j.location.toLowerCase().includes(selectedLocation.toLowerCase()));

      // 3. Job Type filter
      const matchesJobType =
        selectedJobType === "ALL" ||
        (j.jobType && j.jobType.toLowerCase().includes(selectedJobType.toLowerCase()));

      // 4. Experience filter
      const matchesExperience =
        selectedExperience === "ALL" ||
        (j.experience && j.experience.toLowerCase().includes(selectedExperience.toLowerCase()));

      return matchesKeyword && matchesLocation && matchesJobType && matchesExperience;
    });
  }, [jobs, searchTerm, selectedLocation, selectedJobType, selectedExperience]);

  const openMatchDetails = async (job) => {
    setSelectedJob(job);
    setLoadingMatch(true);
    setAiExplanation("");
    setCoverLetterText("");

    try {
      const res = await getJobMatch(job.id);
      setMatchData(res.data);
    } catch (err) {
      console.error(err);
      showToast("Unable to fetch job match data.", "error");
    } finally {
      setLoadingMatch(false);
    }
  };

  const handleFetchExplanation = async () => {
    if (!selectedJob) return;
    setLoadingExplanation(true);
    try {
      const res = await getJobExplanation(selectedJob.id);
      if (res.data && res.data.aiExplanation) {
        setAiExplanation(res.data.aiExplanation);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to generate AI explanation.", "error");
    } finally {
      setLoadingExplanation(false);
    }
  };

  const handleGenerateCoverLetter = async () => {
    if (!selectedJob) return;
    setLoadingCoverLetter(true);
    try {
      const res = await generateCoverLetter(selectedJob.id);
      if (res.data && res.data.coverLetter) {
        setCoverLetterText(res.data.coverLetter);
      }
    } catch (err) {
      console.error(err);
      showToast("Failed to generate AI cover letter.", "error");
    } finally {
      setLoadingCoverLetter(false);
    }
  };

  const handleApply = async (job) => {
    const application = {
      applicantName: localStorage.getItem("fullName"),
      email: localStorage.getItem("email"),
      coverLetter: coverLetterText || "I am interested in this position.",
      job: {
        id: job.id,
      },
    };

    try {
      await applyJob(application);
      showToast("Application submitted successfully!", "success");
      setSelectedJob(null);
    } catch (err) {
      console.log(err);
      if (err.response?.status === 409) {
        showToast("You have already applied for this job.", "warning");
      } else {
        showToast("Application failed. Please try again.", "error");
      }
    }
  };

  const handleSaveJob = async (job) => {
    const savedJob = {
      email: localStorage.getItem("email"),
      job: {
        id: job.id,
      },
    };

    try {
      await saveJob(savedJob);
      showToast("Job saved successfully!", "success");
    } catch (err) {
      console.log(err);
      if (err.response?.status === 409) {
        showToast("Job already saved.", "warning");
      } else {
        showToast("Unable to save job.", "error");
      }
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Job Search & Opportunities</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Search positions by keyword, location, type, and experience with real-time AI match scores.
        </p>
      </div>

      {/* Search Bar & Filter Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search role, company, or skills (e.g. Java, React)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              showFilters || isFilterActive
                ? "bg-indigo-600 border-indigo-600 text-white"
                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters {isFilterActive && "•"}
          </button>

          {isFilterActive && (
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Reset Filters"
            >
              <RotateCcw size={14} /> Clear
            </button>
          )}
        </div>

        {/* Multi-Criteria Filter Dropdowns Panel */}
        {showFilters && (
          <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Location Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Location</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 text-white border border-slate-700 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Locations</option>
                {availableLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Type Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Job Type</label>
              <select
                value={selectedJobType}
                onChange={(e) => setSelectedJobType(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 text-white border border-slate-700 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Job Types</option>
                {availableJobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Experience Dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Experience Level</label>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-800 text-white border border-slate-700 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="ALL">All Experience Levels</option>
                {availableExperiences.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center space-y-3">
          <Briefcase className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Jobs Match Your Filters</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try adjusting your keyword search query or clearing your location, job type, and experience filters.
          </p>
          {isFilterActive && (
            <button
              onClick={handleResetFilters}
              className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition"
            >
              <RotateCcw size={14} /> Clear All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm hover:border-slate-700 transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-11 h-11 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-lg">{job.title}</h3>
                    <div className="text-sm text-indigo-500 font-medium">{job.company || "Company"}</div>

                    <div className="flex flex-wrap gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                      <span>{job.jobType || "Full Time"}</span>
                      <span>{job.salary || "Not Disclosed"}</span>
                      {job.experience && (
                        <span className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5" /> Exp: {job.experience}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {job.skills ? (
                        job.skills.split(",").map((skill) => (
                          <span
                            key={skill}
                            className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                          >
                            {skill.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No skills specified</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => openMatchDetails(job)}
                    className="px-3 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-full font-bold text-xs flex items-center gap-1 hover:bg-emerald-900 transition"
                  >
                    <Sparkles size={12} />
                    {matchScores[job.id] !== undefined ? `${matchScores[job.id]}% MATCH` : "AI MATCH"}
                  </button>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleSaveJob(job)}
                      className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-indigo-50 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 transition"
                      title="Save Job"
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleApply(job)}
                      className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 font-semibold text-sm transition"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Match & Insights Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 text-white relative space-y-6">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2"
            >
              <X size={20} />
            </button>

            <div>
              <span className="px-3 py-1 bg-indigo-950 text-indigo-400 text-xs font-semibold rounded-full uppercase tracking-wider">
                AI Match Score & Insights
              </span>
              <h2 className="text-2xl font-bold mt-2">{selectedJob.title}</h2>
              <p className="text-slate-400 text-sm">{selectedJob.company} • {selectedJob.location}</p>
            </div>

            {loadingMatch ? (
              <div className="text-center py-10 text-slate-400">Evaluating deterministic match rules...</div>
            ) : (
              matchData && (
                <div className="space-y-6">
                  {/* Overall Match Circle */}
                  <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-lg">
                        {matchData.overallMatchScore}%
                      </div>
                      <div>
                        <h3 className="text-lg font-bold">Overall Match Score</h3>
                        <p className="text-xs text-slate-400 mt-1">
                          Calculated deterministically using skills, experience, education, and location.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Component Breakdown Bars */}
                  <div className="grid grid-cols-2 gap-4 text-sm bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Skills Match (50%)</span>
                        <span className="font-bold text-white">{matchData.skillMatchScore}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: `${matchData.skillMatchScore}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Experience (20%)</span>
                        <span className="font-bold text-white">{matchData.experienceMatchScore}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full" style={{ width: `${matchData.experienceMatchScore}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Education (10%)</span>
                        <span className="font-bold text-white">{matchData.educationMatchScore}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full" style={{ width: `${matchData.educationMatchScore}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Location & Type (20%)</span>
                        <span className="font-bold text-white">{matchData.locationMatchScore}%</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full" style={{ width: `${matchData.locationMatchScore}%` }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Matching vs Missing Skills */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Skills Comparison</h4>
                    <div className="flex flex-wrap gap-2">
                      {matchData.matchingSkills.map((s) => (
                        <span key={s} className="px-3 py-1 bg-emerald-950 border border-emerald-800 text-emerald-300 rounded-full text-xs font-semibold flex items-center gap-1">
                          <CheckCircle2 size={12} /> {s}
                        </span>
                      ))}
                      {matchData.missingSkills.map((s) => (
                        <span key={s} className="px-3 py-1 bg-amber-950 border border-amber-800 text-amber-300 rounded-full text-xs font-semibold flex items-center gap-1">
                          <AlertTriangle size={12} /> {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AI Explanation Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <Sparkles className="text-amber-400" size={14} /> AI Explanation & Insights
                      </h4>
                      {!aiExplanation && (
                        <button
                          onClick={handleFetchExplanation}
                          disabled={loadingExplanation}
                          className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition"
                        >
                          {loadingExplanation ? "Analyzing with AI..." : "Generate AI Insight"}
                        </button>
                      )}
                    </div>

                    {aiExplanation && (
                      <div className="p-4 bg-slate-950 rounded-xl text-xs text-slate-300 leading-relaxed border border-slate-800 whitespace-pre-line">
                        {aiExplanation}
                      </div>
                    )}
                  </div>

                  {/* AI Cover Letter Generator */}
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <FileText className="text-indigo-400" size={14} /> Tailored Cover Letter
                      </h4>
                      {!coverLetterText && (
                        <button
                          onClick={handleGenerateCoverLetter}
                          disabled={loadingCoverLetter}
                          className="px-3 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-semibold transition"
                        >
                          {loadingCoverLetter ? "Drafting Cover Letter..." : "Generate AI Cover Letter"}
                        </button>
                      )}
                    </div>

                    {coverLetterText && (
                      <div className="space-y-2">
                        <textarea
                          rows={6}
                          value={coverLetterText}
                          onChange={(e) => setCoverLetterText(e.target.value)}
                          className="w-full p-3 bg-slate-950 rounded-xl text-xs text-slate-300 border border-slate-800 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                        />
                        <p className="text-[11px] text-slate-400">
                          * You can edit this text before submitting your application.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Apply Action */}
                  <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setSelectedJob(null)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-sm"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => handleApply(selectedJob)}
                      className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition shadow-lg"
                    >
                      Submit Application Now
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;