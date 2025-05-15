// src/api/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://critiq-backend.onrender.com", // ✅ Your live backend URL
  withCredentials: true, // Include cookies if using JWT or sessions
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
