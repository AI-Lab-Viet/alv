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
    const userId = "daylaminh123";

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.headers["user-id"] = userId;

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that fall outside the range of 2xx causes this function to trigger
    console.error("API Error:", {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: error.config?.url,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login or refresh token
      console.error("Unauthorized access - consider redirecting to login");
      // localStorage.removeItem("accessToken");
      // window.location.href = "/login";
    } else if (error.response?.status === 403) {
      console.error("Forbidden access");
    } else if (error.response?.status === 404) {
      console.error("Resource not found");
    } else if (error.response?.status >= 500) {
      console.error("Server error");
    }

    return Promise.reject(error);
  }
);

export default api;
