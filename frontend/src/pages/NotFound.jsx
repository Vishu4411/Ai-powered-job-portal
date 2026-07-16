import { Link } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";
function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-6">
          <Compass className="w-8 h-8" />
        </div>
        <div className="text-7xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          404
        </div>
        <h1 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
          You've drifted off course
        </h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 text-sm font-medium transition shadow-lg shadow-indigo-600/20"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
export default NotFound;