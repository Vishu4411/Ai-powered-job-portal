import API from "./api";

export const getJobMatch = (jobId) => {
  return API.get(`/ai/jobs/${jobId}/match`);
};

export const getJobExplanation = (jobId) => {
  return API.post(`/ai/jobs/${jobId}/explanation`);
};

export const getSkillGapAnalysis = (jobId) => {
  return API.post("/ai/skill-gap", { jobId });
};

export const getCareerAdvice = () => {
  return API.post("/ai/career-advice");
};

export const generateCoverLetter = (jobId) => {
  return API.post("/ai/cover-letter/generate", { jobId });
};

export const generateInterviewQuestions = (jobId) => {
  return API.post("/ai/interview-prep/generate", { jobId });
};
