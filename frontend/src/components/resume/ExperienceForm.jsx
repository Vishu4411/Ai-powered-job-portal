function ExperienceForm() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-5">
        Experience
      </h2>

      <div className="grid gap-4">

        <input
          placeholder="Company Name"
          className="p-3 rounded-lg bg-slate-800 text-white"
        />

        <input
          placeholder="Job Role"
          className="p-3 rounded-lg bg-slate-800 text-white"
        />

        <textarea
          rows="5"
          placeholder="Describe your work..."
          className="p-3 rounded-lg bg-slate-800 text-white"
        />

      </div>
    </div>
  );
}

export default ExperienceForm;