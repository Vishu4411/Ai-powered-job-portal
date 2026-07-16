function EducationForm() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-5">
        Education
      </h2>

      <div className="grid md:grid-cols-2 gap-4">
        <input
          placeholder="College / University"
          className="p-3 rounded-lg bg-slate-800 text-white"
        />

        <input
          placeholder="Degree"
          className="p-3 rounded-lg bg-slate-800 text-white"
        />

        <input
          placeholder="Specialization"
          className="p-3 rounded-lg bg-slate-800 text-white"
        />

        <input
          placeholder="CGPA"
          className="p-3 rounded-lg bg-slate-800 text-white"
        />

        <input
          placeholder="Start Year"
          className="p-3 rounded-lg bg-slate-800 text-white"
        />

        <input
          placeholder="End Year"
          className="p-3 rounded-lg bg-slate-800 text-white"
        />
      </div>
    </div>
  );
}

export default EducationForm;