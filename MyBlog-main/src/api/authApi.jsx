import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// 🌟 Axios Instance with base URL
const axiosInstance = axios.create({ baseURL: API_URL });

/**
 * 🛠️ Function to get latest tokens from localStorage
 */
const getStoredTokens = () => {
  try {
    return JSON.parse(localStorage.getItem("tokens"));
  } catch (error) {
    console.error("Error reading tokens:", error);
    return null;
  }
};

/**
 * 🔄 Axios Interceptor: Handles 401 & Refresh Token Automatically
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🛑 If 401 Unauthorized & not already retried
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const tokens = getStoredTokens();
      if (!tokens || !tokens.refresh) {
        console.error("No refresh token found. Redirecting to login...");
        return Promise.reject(error);
      }

      try {
        // 🔄 Refresh Access Token
        const { data } = await axios.post(`${API_URL}/api/token/refresh/`, {
          refresh: tokens.refresh,
        });

        // 💾 Store New Tokens
        const newTokens = { ...tokens, access: data.access };
        localStorage.setItem("tokens", JSON.stringify(newTokens));

        // 🔑 Retry Original Request with New Token
        originalRequest.headers["Authorization"] = `Bearer ${data.access}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed. Logging out...");
        localStorage.removeItem("tokens"); // ❌ Clear tokens on failure
        window.location.href = "/login"; // 🔄 Redirect to Login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * 🔐 Auth API Functions
 */
const authApi = {
  /**
   * 📩 Login User & Store Tokens
   */
  loginUser: async (email, password) => {
    try {
      const response = await axiosInstance.post(`/api/login/`, {
        email,
        password,
      });

      // 💾 Store Tokens Locally
      localStorage.setItem("tokens", JSON.stringify(response.data.tokens));
      console.log("✅ Tokens Stored:", response.data.tokens);

      return response.data;
    } catch (error) {
      console.error("❌ Login Failed:", error.response?.data || error);
      throw error.response?.data || "Login failed";
    }
  },

  /**
   * 🧑‍💼 Get Current User Info
   */
  getCurrentUser: async () => {
    try {
      const tokens = getStoredTokens();
      if (!tokens?.access) throw new Error("No access token found");

      const response = await axiosInstance.get(`/api/current-user/`, {
        headers: { Authorization: `Bearer ${tokens.access}` },
      });

      return response.data;
    } catch (error) {
      console.error("❌ Failed to fetch user:", error.response?.data || error);
      throw error.response?.data || "Failed to fetch user";
    }
  },

  /**
   * 🚪 Logout User & Clear Tokens
   */
  logoutUser: async () => {
    try {
      const tokens = getStoredTokens();
      if (!tokens?.refresh) throw new Error("No refresh token found");

      await axiosInstance.post(
        `/api/logout/`,
        { refresh: tokens.refresh },
        { headers: { Authorization: `Bearer ${tokens.access}` } }
      );

      // 🧹 Clear tokens from localStorage
      localStorage.removeItem("tokens");
      console.log("✅ Logout successful");
    } catch (error) {
      console.error("❌ Logout failed:", error.response?.data || error);
      throw error.response?.data || "Logout failed";
    }
  },

  /**
   * 📝 Register User
   */
  registerUser: async (userData) => {
    try {
      const response = await axiosInstance.post(`/api/register/`, userData);
      return response.data;
    } catch (error) {
      console.error("❌ Registration failed:", error.response?.data || error);
      throw error.response?.data || "Registration failed";
    }
  },
};

export default authApi;
