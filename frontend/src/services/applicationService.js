import API from "./api";

export const getApplications = (email) => {
    return API.get(`/applications/${email}`);
};

export const applyJob = (application) => {
    return API.post("/applications", application);
};

export const getInterviews = () => {
    return API.get("/applications/interviews");
};