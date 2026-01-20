import API from "./api";

export const fetchServices = async () => {
  const res = await API.get("/services");
  return res.data;
};
