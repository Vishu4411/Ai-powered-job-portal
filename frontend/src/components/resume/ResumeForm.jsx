import { useState } from "react";

function ResumeForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    summary: "",
    skills: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">

      <h2 className="text-2xl font-bold text-white mb-6">
        Resume Details
      </h2>

      <div className="grid md:grid-cols-2 gap-4">

        <input
          name="fullName"
          placeholder="Full Name"
          onChange={handleChange}
          className="p-3 rounded-lg bg-slate-800 text-white"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="p-3 rounded-lg bg-slate-800 text-white"
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="p-3 rounded-lg bg-slate-800 text-white"
        />

        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          className="p-3 rounded-lg bg-slate-800 text-white"
        />

        <input
          name="linkedin"
          placeholder="LinkedIn"
          onChange={handleChange}
          className="p-3 rounded-lg bg-slate-800 text-white"
        />

        <input
          name="github"
          placeholder="GitHub"
          onChange={handleChange}
          className="p-3 rounded-lg bg-slate-800 text-white"
        />

      </div>

      <textarea
        name="summary"
        placeholder="Professional Summary"
        rows="5"
        onChange={handleChange}
        className="mt-5 w-full p-3 rounded-lg bg-slate-800 text-white"
      />

      <textarea
        name="skills"
        placeholder="Skills (Comma separated)"
        rows="3"
        onChange={handleChange}
        className="mt-5 w-full p-3 rounded-lg bg-slate-800 text-white"
      />

    </div>
  );
}

export default ResumeForm;