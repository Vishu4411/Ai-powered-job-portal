import API from "./api";

export const login = (user) => API.post("/auth/login", user);

export const signup = (user) => API.post("/auth/signup", user);