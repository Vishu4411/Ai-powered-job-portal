import { Bell, Search, LogOut, Briefcase, FileText, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "../common/ThemeToggle";

function Navbar() {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      icon: <Briefcase className="w-4 h-4 text-green-500" />,
      title: "New Java Developer Job",
      desc: "Infosys posted a new Java Developer opening.",
    },
    {
      id: 2,
      icon: <FileText className="w-4 h-4 text-blue-500" />,
      title: "Application Viewed",
      desc: "Your TCS application has been viewed.",
    },
    {
      id: 3,
      icon: <Calendar className="w-4 h-4 text-orange-500" />,
      title: "Interview Reminder",
      desc: "Mock interview scheduled for tomorrow.",
    },
  ];

  const fullName = localStorage.getItem("fullName") ?? "Guest";
  const email = localStorage.getItem("email") ?? "";
  const role = localStorage.getItem("role") ?? "USER";

  const initials = fullName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">

      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

          <input
            type="text"
            placeholder="Search jobs, companies, skills..."
            className="pl-10 pr-4 py-2 rounded-lg bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 w-80"
          />
        </div>
      </div>

      <div className="flex items-center gap-5">

        <ThemeToggle />

        {/* Notification */}

        <div className="relative">

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative"
          >
            <Bell className="w-5 h-5 text-slate-300 hover:text-white transition" />

            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {notifications.length}
            </span>
          </button>

          {showNotifications && (

            <div className="absolute right-0 mt-4 w-80 rounded-xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">

              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">

                <h3 className="font-semibold text-slate-900 dark:text-white">
                  Notifications
                </h3>

              </div>

              {notifications.map((item) => (

                <div
                  key={item.id}
                  className="flex gap-3 px-4 py-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
                >
                  <div>{item.icon}</div>

                  <div>

                    <h4 className="text-sm font-medium text-slate-900 dark:text-white">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </p>

                  </div>

                </div>

              ))}

              <div className="text-center py-3 border-t border-slate-200 dark:border-slate-700">

                <button className="text-violet-600 font-medium hover:underline">
                  View All Notifications
                </button>

              </div>

            </div>

          )}

        </div>

        {/* User */}

        <div className="flex items-center gap-3">

          <div className="h-10 w-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-semibold">
            {initials}
          </div>

          <div>
            <p className="text-white text-sm font-medium">{fullName}</p>
            <p className="text-slate-400 text-xs">{email}</p>
            <p className="text-violet-400 text-xs">{role}</p>
          </div>

        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
        >
          <LogOut size={16} />
          Logout
        </button>

      </div>

    </header>
  );
}

export default Navbar;