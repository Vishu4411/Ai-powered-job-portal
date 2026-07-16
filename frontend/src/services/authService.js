import axios from "axios";

const API = "http://localhost:8080/auth";

export const login = (user) => {
    return axios.post(`${API}/login`, user);
};

export const signup = (user) => {
    return axios.post(`${API}/signup`, user);
};