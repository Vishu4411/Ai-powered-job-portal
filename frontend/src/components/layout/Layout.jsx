import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;