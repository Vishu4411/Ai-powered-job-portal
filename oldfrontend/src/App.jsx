import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Resume from "./pages/Resume";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

import {
  Routes,
  Route
} from "react-router-dom";

import "./App.css";

function App() {
  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <Navbar />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>

      </div>
    </div>
  );
}

export default App;