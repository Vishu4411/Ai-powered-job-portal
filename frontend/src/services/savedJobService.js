import API from "./api";

export const saveJob = (savedJob) => {
  return API.post("/saved-jobs", savedJob);
};

export const getSavedJobs = (email) => {
  return API.get(`/saved-jobs/${email}`);
};

export const deleteSavedJob = (id) => {
  return API.delete(`/saved-jobs/${id}`);
};