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
import RecruiterDashboard from "../pages/recruiter/RecruiterDashboard";
import CompanyProfile from "../pages/recruiter/CompanyProfile";
import PostJob from "../pages/recruiter/PostJob";
import RecruiterJobs from "../pages/recruiter/RecruiterJobs";
import JobApplicants from "../pages/recruiter/JobApplicants";

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
          <Route path="/mock-interview" element={<MockInterviewSimulator />} />
          <Route path="/career-plan" element={<CareerActionPlan />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />

          {/* Recruiter Portal Routes */}
          <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} />
          <Route path="/recruiter/company" element={<CompanyProfile />} />
          <Route path="/recruiter/post-job" element={<PostJob />} />
          <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
          <Route path="/recruiter/jobs/:jobId/applicants" element={<JobApplicants />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


export default AppRouter;