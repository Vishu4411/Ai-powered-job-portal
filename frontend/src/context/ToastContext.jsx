import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = "info", duration = 4000) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 9);
      const newToast = { id, message, type };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Toasts Container */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role={toast.type === "error" || toast.type === "warning" ? "alert" : "status"}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              toast.type === "success"
                ? "bg-slate-900/95 border-emerald-800/80 text-emerald-300"
                : toast.type === "error"
                ? "bg-slate-900/95 border-red-800/80 text-red-300"
                : toast.type === "warning"
                ? "bg-slate-900/95 border-amber-800/80 text-amber-300"
                : "bg-slate-900/95 border-indigo-800/80 text-indigo-300"
            }`}
          >
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" && <CheckCircle2 size={18} className="text-emerald-400" />}
              {toast.type === "error" && <AlertCircle size={18} className="text-red-400" />}
              {toast.type === "warning" && <AlertTriangle size={18} className="text-amber-400" />}
              {toast.type === "info" && <Info size={18} className="text-indigo-400" />}
            </div>

            {/* Message */}
            <div className="flex-1 text-xs font-medium text-slate-200 leading-relaxed">
              {toast.message}
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-slate-400 hover:text-white transition p-0.5"
              aria-label="Dismiss notification"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
