import { Bell, Search, LogOut, Briefcase, FileText, Calendar, CheckCircle2, UserCheck, XCircle, Sparkles, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ThemeToggle from "../common/ThemeToggle";
import { getUnreadCount, getNotifications, markNotificationRead, markAllNotificationsRead } from "../../services/notificationService";

function Navbar() {
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    fetchUnreadCount();

    // Lightweight polling every 45 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 45000);

    return () => clearInterval(interval);
  }, [token]);

  const fetchUnreadCount = async () => {
    try {
      const res = await getUnreadCount();
      if (res.data && typeof res.data.unreadCount === "number") {
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      // Passive polling failure - suppress console spam if unauthenticated
    }
  };

  const handleToggleNotifications = async () => {
    const nextState = !showNotifications;
    setShowNotifications(nextState);

    if (nextState) {
      setLoading(true);
      try {
        const res = await getNotifications();
        if (res.data) {
          setNotifications(res.data);
          // Also update unread count based on returned list
          const unread = res.data.filter((n) => !n.read).length;
          setUnreadCount(unread);
        }
      } catch (err) {
        console.error("Failed to load notifications:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to mark all notifications read:", err);
    }
  };

  const formatRelativeTime = (isoString) => {
    if (!isoString) return "Recently";
    const date = new Date(isoString);
    const now = new Date();
    const diffSecs = Math.floor((now - date) / 1000);

    if (diffSecs < 60) return "Just now";
    if (diffSecs < 3600) return `${Math.floor(diffSecs / 60)}m ago`;
    if (diffSecs < 86400) return `${Math.floor(diffSecs / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "NEW_APPLICANT":
        return <Briefcase className="w-4 h-4 text-purple-400" />;
      case "APPLICATION_SUBMITTED":
        return <FileText className="w-4 h-4 text-blue-400" />;
      case "APPLICATION_SHORTLISTED":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "INTERVIEW_SCHEDULED":
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case "APPLICATION_REJECTED":
        return <XCircle className="w-4 h-4 text-rose-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
    }
  };

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

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={handleToggleNotifications}
            className="relative p-2 rounded-full hover:bg-slate-800 transition"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-slate-300 hover:text-white transition" />

            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-88 max-w-sm rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-xs font-semibold rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-indigo-500 hover:text-indigo-400 font-semibold flex items-center gap-1"
                  >
                    <Check size={12} /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                {loading ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-8 text-center space-y-2">
                    <Bell className="mx-auto text-slate-500" size={28} />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      No notifications yet
                    </p>
                    <p className="text-xs text-slate-400">
                      Notifications regarding job applications and status updates will appear here.
                    </p>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleMarkAsRead(item.id, item.read)}
                      className={`flex items-start gap-3 p-4 transition cursor-pointer ${
                        !item.read
                          ? "bg-indigo-50/60 dark:bg-indigo-950/30 font-medium"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                        {getNotificationIcon(item.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </h4>
                          <span className="text-[10px] text-slate-400 shrink-0">
                            {formatRelativeTime(item.createdAt)}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-snug break-words">
                          {item.message}
                        </p>
                      </div>

                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Badge */}
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