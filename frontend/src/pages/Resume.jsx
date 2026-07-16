import { FileText, Download, Plus, Edit3, Sparkles } from "lucide-react";
const resumes = [
  { name: "Product Designer — 2026", updated: "Updated 2 days ago", score: 92 },
  { name: "Frontend Engineer", updated: "Updated 1 week ago", score: 85 },
  { name: "General CV", updated: "Updated 3 weeks ago", score: 76 },
];
function Resume() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Resume Builder
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Craft, tailor and optimize resumes with AI.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 text-sm font-medium transition shadow-lg shadow-indigo-600/20">
          <Plus className="w-4 h-4" /> New Resume
        </button>
      </div>
      <div className="rounded-2xl border border-indigo-100 dark:border-indigo-500/20 bg-gradient-to-br from-indigo-50 to-white dark:from-indigo-500/10 dark:to-slate-900 p-6">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-slate-900 dark:text-white">
              AI Resume Assistant
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Paste a job description and we'll tailor your resume in seconds.
            </p>
            <button className="mt-3 inline-flex items-center gap-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition">
              Try AI Tailor
            </button>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {resumes.map((r) => (
          <div
            key={r.name}
            className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                Score {r.score}
              </span>
            </div>
            <h3 className="mt-4 font-semibold text-slate-900 dark:text-white truncate">
              {r.name}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {r.updated}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 px-3 py-1.5 text-xs font-medium transition">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
              <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 text-xs font-medium transition">
                <Download className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Resume;
