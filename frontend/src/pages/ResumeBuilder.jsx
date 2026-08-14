import { useState, useEffect } from "react";
import { Save, FileCheck } from "lucide-react";
import { getResume, updateResume } from "../services/profileService";
import ResumeForm from "../components/resume/ResumeForm";
import ResumePreview from "../components/resume/ResumePreview";

function ResumeBuilder() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [resumeData, setResumeData] = useState({
    fullName: localStorage.getItem("fullName") || "Guest",
    email: localStorage.getItem("email") || "",
    headline: "",
    phone: "",
    location: "",
    bio: "",
    skills: "",
    linkedinUrl: "",
    githubUrl: "",
    educationList: [],
    experienceList: [],
    projectList: [],
  });

  useEffect(() => {
    setLoading(true);
    getResume()
      .then((res) => {
        if (res.data) {
          setResumeData((prev) => ({
            ...prev,
            ...res.data,
          }));
        }
      })
      .catch((err) => {
        console.error("Error loading candidate resume profile:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setSaveSuccess(false);
    setResumeData({
      ...resumeData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveResume = async () => {
    setSaving(true);
    setErrorMessage("");
    setSaveSuccess(false);
    try {
      const res = await updateResume(resumeData);
      if (res.data) {
        setResumeData(res.data);
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (err) {
      console.error("Error saving candidate resume profile:", err);
      setErrorMessage("Failed to save resume changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading your candidate resume builder...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Interactive Resume Builder</h1>
          <p className="text-sm text-slate-400">
            Build and persist your candidate resume. Changes sync directly to your account.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              <FileCheck size={16} /> Saved to Database!
            </span>
          )}

          {errorMessage && (
            <span className="text-xs text-red-400 font-semibold">{errorMessage}</span>
          )}

          <button
            onClick={handleSaveResume}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Resume"}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ResumeForm resumeData={resumeData} onChange={handleChange} />
        </div>

        <div>
          <ResumePreview resumeData={resumeData} />
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;