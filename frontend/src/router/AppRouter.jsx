import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "../components/layout/Layout";
import ProtectedRoute from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import ResumeBuilder from "../pages/ResumeBuilder";
import Jobs from "../pages/Jobs";
import Applications from "../pages/Applications";
import Interviews from "../pages/Interviews";
import Insights from "../pages/Insights";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import SavedJobs from "../pages/SavedJobs";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume" element={<ResumeBuilder />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;