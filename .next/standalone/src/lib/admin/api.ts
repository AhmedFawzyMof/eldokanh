import axios from "axios";

const adminApi = axios.create({
  baseURL: "/api/admin",
  withCredentials: true,
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      if (typeof window !== "undefined") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  },
);

export default adminApi;
