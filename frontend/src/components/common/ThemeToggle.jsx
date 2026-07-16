import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function ThemeToggle() {
  const [dark, setDark] = useState(
    localStorage.getItem("theme") !== "light"
  );

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="p-2 rounded-lg bg-slate-800 dark:bg-slate-700 hover:bg-slate-700 dark:hover:bg-slate-600 transition"
    >
      {dark ? (
        <Sun className="w-5 h-5 text-yellow-400" />
      ) : (
        <Moon className="w-5 h-5 text-slate-800" />
      )}
    </button>
  );
}

export default ThemeToggle;