import axios from "axios";

const API = "http://localhost:8080/dashboard";

export const getDashboardStats = (email) => {
  return axios.get(`${API}/${email}`);
};