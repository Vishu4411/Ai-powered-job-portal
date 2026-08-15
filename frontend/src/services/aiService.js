import API from "./api";

export const getCareerReadiness = () => {
  return API.get("/ai/career/readiness");
};

export const getCareerActionPlan = () => {
  return API.get("/ai/career/action-plan");
};

export const getApplicationCopilot = (jobId) => {
  return API.post(`/ai/jobs/${jobId}/application-copilot`);
};



export const startMockInterview = (jobId) => {
  return API.post("/ai/interview-simulator/start", jobId ? { jobId } : {});
};

export const submitMockInterview = (submissionData) => {
  return API.post("/ai/interview-simulator/evaluate", submissionData);
};

export const analyzeResumeATS = () => {


  return API.post("/ai/resume/ats-analyze");
};

export const getRecommendedJobs = () => {
  return API.get("/ai/jobs/recommended");
};


export const getJobMatch = (jobId) => {
  return API.get(`/ai/jobs/${jobId}/match`);
};


export const getJobExplanation = (jobId) => {
  return API.post(`/ai/jobs/${jobId}/explanation`);
};

export const getSkillGapAnalysis = (jobId) => {
  return API.post("/ai/skill-gap", { jobId });
};

export const getSkillGapRoadmap = (jobId) => {
  return API.post(`/ai/jobs/${jobId}/skill-roadmap`);
};


export const getCareerAdvice = () => {
  return API.post("/ai/career-advice");
};

export const generateCoverLetter = (jobId) => {
  return API.post("/ai/cover-letter/generate", { jobId });
};

export const getRankedApplicants = (jobId) => {
  return API.get(`/recruiter/jobs/${jobId}/ranked-applicants`);
};

export const getCandidateInsights = (applicationId) => {
  return API.get(`/ai/recruiter/applications/${applicationId}/insights`);
};

