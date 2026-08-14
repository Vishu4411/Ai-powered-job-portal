import API from "./api";

export const getRecruiterDashboard = () => {
  return API.get("/recruiter/dashboard");
};

export const getMyJobs = () => {
  return API.get("/recruiter/jobs");
};

export const createJob = (jobData) => {
  return API.post("/recruiter/jobs", jobData);
};

export const updateJob = (id, jobData) => {
  return API.put(`/recruiter/jobs/${id}`, jobData);
};

export const deleteJob = (id) => {
  return API.delete(`/recruiter/jobs/${id}`);
};

export const getJobApplications = (jobId) => {
  return API.get(`/recruiter/jobs/${jobId}/applications`);
};

export const getCandidateProfileForApp = (applicationId) => {
  return API.get(`/recruiter/applications/${applicationId}/candidate-profile`);
};

export const updateApplicationStatus = (applicationId, status) => {
  return API.put(`/recruiter/applications/${applicationId}/status`, { status });
};
