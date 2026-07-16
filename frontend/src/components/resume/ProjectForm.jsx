function ProjectForm() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold text-white mb-5">
        Projects
      </h2>

      <input
        placeholder="Project Title"
        className="w-full p-3 rounded-lg bg-slate-800 text-white mb-4"
      />

      <textarea
        rows="4"
        placeholder="Project Description"
        className="w-full p-3 rounded-lg bg-slate-800 text-white"
      />
    </div>
  );
}

export default ProjectForm;