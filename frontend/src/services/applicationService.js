import axios from "axios";

const API = "http://localhost:8080/applications";

export const getApplications = (email) => {
    return axios.get(`${API}/${email}`);
};

export const applyJob = (application) => {
    return axios.post(API, application);
};