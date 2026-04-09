import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5001/api"
});
// 1. Request Interceptor (Token har baar bhejne ke liye)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = token;
  }
  return req;
});

// 2. Response Interceptor (401 error handle karne ke liye) - YE ADD KAREIN
API.interceptors.response.use(
  (response) => response, // Agar sab sahi hai toh response return kar do
  (error) => {
    // Agar server 401 (Unauthorized) bhejta hai, matlab token expire ya galat hai
    if (error.response && error.response.status === 401) {
      alert("Session expired! Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login"; // User ko login page par dhakal do
    }
    return Promise.reject(error);
  }
);

export default API;
