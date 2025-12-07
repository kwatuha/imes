// src/api/axiosInstance.js
import axios from 'axios';

/**
 * @file Centralized Axios instance for making API requests.
 * @description Configures a base URL and includes request/response interceptors
 * for consistent handling of headers (e.g., authentication tokens) and errors.
 */

// Prefer explicit API URL via env (e.g., http://api:3000 in Docker),
// otherwise fall back to Nginx/Vite proxy at /api
const API_BASE_URL = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL)
    ? import.meta.env.VITE_API_URL
    : '/api';
// const API_BASE_URL = 'http://192.168.100.12:6000/api'; // Ensure this matches your Express API base URL

//const API_BASE_URL = 'http://192.168.100.12:3000/api'; // Intellibibiz Ensure this matches your Express API base URL
// const API_BASE_URL = 'http://192.168.100.28:3000/api'; // Advocate Ensure this matches your Express API base URL

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // Request timeout in milliseconds
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Adds Authorization: Bearer token to headers if available in localStorage
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken'); // Assuming token is stored as 'jwtToken'
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Changed to Bearer token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Logs API errors and re-throws them for component-level handling
axiosInstance.interceptors.response.use(
    (response) => response, // If response is successful, just return it
    (error) => {
        console.error('API Response Error:', error.response || error.message);
        
        // Handle 401 Unauthorized errors (token expired or invalid)
        if (error.response && error.response.status === 401) {
            console.warn('Token expired or invalid. Clearing local storage...');
            localStorage.removeItem('jwtToken');
            
            // If we're not already on the login page, redirect to login
            if (window.location.pathname !== '/login') {
                window.location.href = '/login';
            }
        }
        
        // If there's a response object (e.g., 4xx, 5xx errors), reject with its data plus status
        // Otherwise, reject with the original error (preserves request info for network errors)
        if (error.response) {
          // Preserve status code and response data
          const errorWithStatus = error.response.data || {};
          errorWithStatus.status = error.response.status;
          errorWithStatus.statusText = error.response.statusText;
          return Promise.reject(errorWithStatus);
        }
        // For network errors (no response), return the original error to preserve request info
        return Promise.reject(error);
    }
);

export default axiosInstance;
