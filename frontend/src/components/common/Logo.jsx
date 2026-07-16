import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
function Logo({ className = "" }) {
  return (
    <Link
      to="/"
      className={`flex items-center gap-2 group ${className}`}
    >
      <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:shadow-indigo-600/30 transition-all duration-300">
        <Compass className="w-5 h-5 text-white" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
          Career Compass
        </span>
        <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
          Pro
        </span>
      </div>
    </Link>
  );
}
export default Logo;
