import API from "./api";

export const getJobs = () => {
    return API.get("/jobs");
};

export const createJob = (job) => {
    return API.post("/jobs", job);
};

export const updateJob = (id, job) => {
    return API.put(`/jobs/${id}`, job);
};

export const deleteJob = (id) => {
    return API.delete(`/jobs/${id}`);
};