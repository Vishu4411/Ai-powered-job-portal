import axios from "axios";

const API = "http://localhost:8080/saved-jobs";

export const saveJob = (savedJob) => {
  return axios.post(API, savedJob);
};

export const getSavedJobs = (email) => {
  return axios.get(`${API}/${email}`);
};

export const deleteSavedJob = (id) => {
  return axios.delete(`${API}/${id}`);
};