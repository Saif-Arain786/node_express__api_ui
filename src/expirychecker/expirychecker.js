import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: "http://localhost:5004", // Set your base URL here
});

// Request interceptor to attach token and check for expiry
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        // Decode JWT payload
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
          // Handle token expiry
          console.warn("🔒 Token expired. Redirecting to login...");
          localStorage.removeItem("token"); // Clear token
          localStorage.removeItem("user"); // Clear user data
          window.location.href = "/login"; // Redirect to login page
          return Promise.reject(new Error("Token expired"));
        }

        // Attach token to headers
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.error("❌ Error decoding token:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login"; // Redirect to login page
        return Promise.reject(new Error("Invalid token"));
      }
    } else {
      console.warn("🔒 No token found. Redirecting to login...");
      window.location.href = "/login"; // Redirect to login page
      return Promise.reject(new Error("No token found"));
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;