import API from "./api";

export const getProfile = () => {
  return API.get("/users/profile");
};

export const updateProfile = (profileData) => {
  return API.put("/users/profile", profileData);
};

export const addEducation = (educationData) => {
  return API.post("/users/profile/education", educationData);
};

export const deleteEducation = (id) => {
  return API.delete(`/users/profile/education/${id}`);
};

export const addExperience = (experienceData) => {
  return API.post("/users/profile/experience", experienceData);
};

export const deleteExperience = (id) => {
  return API.delete(`/users/profile/experience/${id}`);
};

export const addProject = (projectData) => {
  return API.post("/users/profile/projects", projectData);
};

export const deleteProject = (id) => {
  return API.delete(`/users/profile/projects/${id}`);
};

export const addCertification = (certificationData) => {
  return API.post("/users/profile/certifications", certificationData);
};

export const deleteCertification = (id) => {
  return API.delete(`/users/profile/certifications/${id}`);
};

export const getResume = () => {
  return API.get("/users/resume");
};

export const updateResume = (resumeData) => {
  return API.put("/users/resume", resumeData);
};


