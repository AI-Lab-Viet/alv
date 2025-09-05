import { HANH_BACKEND_URL } from "@/consts/urls";
import axios from "axios";

// Create an axios instance
const api = axios.create({
  baseURL: HANH_BACKEND_URL, // change to your API base URL
});

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token (from localStorage, cookie, or context)
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
