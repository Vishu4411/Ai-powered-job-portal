import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  Heart,
  Target,
  MessageSquare,
  TrendingUp,
  User,
  Settings,
  ChevronLeft,
  ChevronRight,
  Compass,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/resume", label: "Resume Builder", icon: FileText },
  { to: "/jobs", label: "Job Search", icon: Briefcase },
  { to: "/saved-jobs", label: "Saved Jobs", icon: Heart },
  { to: "/applications", label: "Applications", icon: Target },
  { to: "/interviews", label: "Interview Prep", icon: MessageSquare },
  { to: "/insights", label: "Career Insights", icon: TrendingUp },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const fullName = localStorage.getItem("fullName") || "Guest";
  const role = localStorage.getItem("role") || "USER";

  const initials = fullName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } hidden md:flex flex-col h-screen sticky top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300`}
    >
      {/* Logo */}

      <div className="flex items-center justify-between px-4 py-5 border-b border-slate-200 dark:border-slate-800">

        <div className="flex items-center gap-2">

          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">

            <Compass className="w-5 h-5 text-white" />

          </div>

          {!collapsed && (
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white">
                Career Compass
              </h2>

              <p className="text-xs text-indigo-500">
                AI Job Portal
              </p>
            </div>
          )}

        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </button>

      </div>

      {/* Navigation */}

      <nav className="flex-1 px-3 py-4 space-y-2">

        {navItems.map(({ to, label, icon: Icon }) => (

          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                isActive
                  ? "bg-indigo-600 text-white"
                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`
            }
          >
            <Icon size={20} />

            {!collapsed && label}

          </NavLink>

        ))}

      </nav>

      {/* User */}

      <div className="border-t border-slate-200 dark:border-slate-800 p-4">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">

            {initials}

          </div>

          {!collapsed && (
            <div>

              <h3 className="font-semibold text-slate-900 dark:text-white">
                {fullName}
              </h3>

              <p className="text-xs text-slate-500">
                {role}
              </p>

            </div>
          )}

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;