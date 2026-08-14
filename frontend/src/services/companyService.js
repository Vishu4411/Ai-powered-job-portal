import API from "./api";

export const getMyCompany = () => {
  return API.get("/companies/me");
};

export const updateMyCompany = (companyData) => {
  return API.put("/companies/me", companyData);
};
