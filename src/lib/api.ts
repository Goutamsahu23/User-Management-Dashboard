import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://jsonplaceholder.typicode.com";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // timeout: 10000,
});


// Request interceptor (attach tokens, logging, etc.)

api.interceptors.request.use(
  (config) => {
    // attach auth token if present 
    // const token = localStorage.getItem("token");
    // if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);


// Response interceptor (global error handling, unwrap data)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Optionally normalize error object
    // Example: const message = error.response?.data?.message || error.message;
    return Promise.reject(error);
  }
);

export default api;
