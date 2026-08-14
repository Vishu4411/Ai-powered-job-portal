import { useState, useEffect } from "react";
import { Building, Globe, MapPin, Save } from "lucide-react";
import { getMyCompany, updateMyCompany } from "../../services/companyService";
import { useToast } from "../../context/ToastContext";

function CompanyProfile() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState({
    companyName: "",
    industry: "",
    description: "",
    location: "",
    website: "",
    logoUrl: "",
  });

  useEffect(() => {
    getMyCompany()
      .then((res) => {
        if (res.data) setCompany((prev) => ({ ...prev, ...res.data }));
      })
      .catch((err) => console.error("Error loading company profile:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateMyCompany(company);
      if (res.data) setCompany(res.data);
      showToast("Company profile saved successfully!", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to save company profile.", "error");
    } finally {
      setSaving(false);
    }
  };


  const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white text-black dark:bg-slate-800 dark:text-white dark:border-slate-700 px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none";

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading company profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
          <Building className="text-indigo-600" size={28} />
          <div>
            <h1 className="text-2xl font-bold dark:text-white">Employer Company Profile</h1>
            <p className="text-sm text-slate-400">Manage your organisation branding shown to job applicants.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-slate-200">
                Company Name *
              </label>
              <input
                required
                name="companyName"
                value={company.companyName || ""}
                onChange={handleChange}
                placeholder="e.g. Google / Microsoft / TechCorp"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-slate-200">
                Industry
              </label>
              <input
                name="industry"
                value={company.industry || ""}
                onChange={handleChange}
                placeholder="e.g. Software & Technology / Fintech"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-slate-200">
                Headquarters Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  name="location"
                  value={company.location || ""}
                  onChange={handleChange}
                  placeholder="e.g. San Francisco, CA / Bengaluru, India"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 dark:text-slate-200">
                Website URL
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-3 text-slate-400" size={18} />
                <input
                  name="website"
                  value={company.website || ""}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-slate-200">
              Logo / Image URL
            </label>
            <input
              name="logoUrl"
              value={company.logoUrl || ""}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 dark:text-slate-200">
              Company Overview / Culture Description
            </label>
            <textarea
              rows={5}
              name="description"
              value={company.description || ""}
              onChange={handleChange}
              placeholder="Provide job seekers with details about your company mission, tech stack, and workplace culture..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg transition"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Company Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CompanyProfile;
