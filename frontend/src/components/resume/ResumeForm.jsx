function ResumeForm({ resumeData, onChange }) {
  const data = resumeData || {};

  return (
    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 space-y-4">
      <h2 className="text-2xl font-bold text-white mb-2">Resume Personal Details & Summary</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
          <input
            name="fullName"
            value={data.fullName || ""}
            placeholder="Full Name"
            onChange={onChange}
            className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Headline / Title</label>
          <input
            name="headline"
            value={data.headline || ""}
            placeholder="e.g. Senior Full Stack Engineer"
            onChange={onChange}
            className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Email</label>
          <input
            name="email"
            value={data.email || ""}
            placeholder="Email Address"
            onChange={onChange}
            className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Phone</label>
          <input
            name="phone"
            value={data.phone || ""}
            placeholder="Phone Number"
            onChange={onChange}
            className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">Location</label>
          <input
            name="location"
            value={data.location || ""}
            placeholder="City, Country"
            onChange={onChange}
            className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">LinkedIn URL</label>
          <input
            name="linkedinUrl"
            value={data.linkedinUrl || ""}
            placeholder="https://linkedin.com/in/..."
            onChange={onChange}
            className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Professional Summary / Bio</label>
        <textarea
          name="bio"
          value={data.bio || ""}
          placeholder="Summarize your engineering background, key accomplishments, and target roles..."
          rows="4"
          onChange={onChange}
          className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-400 mb-1">Core Technical Skills (Comma separated)</label>
        <textarea
          name="skills"
          value={data.skills || ""}
          placeholder="Java, Spring Boot, React, MySQL, AWS, Docker"
          rows="2"
          onChange={onChange}
          className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>
    </div>
  );
}

export default ResumeForm;