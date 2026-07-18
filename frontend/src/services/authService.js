import axios from "axios";

const API = "https://ai-powered-job-portal-production-573c.up.railway.app/auth";

export const login = (user) => {
    return axios.post(`${API}/login`, user);
};

export const signup = (user) => {
    return axios.post(`${API}/signup`, user);
};