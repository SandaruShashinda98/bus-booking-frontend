// src/api/client.js
import { setupInterceptors } from "@/intercepters/interceptors";
import axios from "axios";

// Create a base axios instance with common configuration
const API_BASE_URL = "http://localhost:3000/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 seconds
});

// Configure request/response interceptors
setupInterceptors(apiClient);

// Reusable API methods
const api = {
  /**
   * GET request
   * @param {string} url - Endpoint URL
   * @param {Object} params - URL parameters
   * @param {Object} config - Additional axios config
   * @returns {Promise} - Axios response promise
   */
  get: (
    url: string,
    params: object = {},
    config: object = {}
  ): Promise<unknown> => {
    return apiClient.get(url, { ...config, params });
  },

  /**
   * POST request
   * @param {string} url - Endpoint URL
   * @param {Object} data - Request body
   * @param {Object} config - Additional axios config
   * @returns {Promise} - Axios response promise
   */
  post: (
    url: string,
    data: object = {},
    config: object = {}
  ): Promise<unknown> => {
    return apiClient.post(url, data, config);
  },

  /**
   * PUT request
   * @param {string} url - Endpoint URL
   * @param {Object} data - Request body
   * @param {Object} config - Additional axios config
   * @returns {Promise} - Axios response promise
   */
  put: (
    url: string,
    data: object = {},
    config: object = {}
  ): Promise<unknown> => {
    return apiClient.put(url, data, config);
  },

  /**
   * PATCH request
   * @param {string} url - Endpoint URL
   * @param {Object} data - Request body
   * @param {Object} config - Additional axios config
   * @returns {Promise} - Axios response promise
   */
  patch: (
    url: string,
    data: object = {},
    config: object = {}
  ): Promise<unknown> => {
    return apiClient.patch(url, data, config);
  },

  /**
   * DELETE request
   * @param {string} url - Endpoint URL
   * @param {Object} config - Additional axios config
   * @returns {Promise} - Axios response promise
   */
  delete: (url: string, config: object = {}): Promise<unknown> => {
    return apiClient.delete(url, config);
  },

  /**
   * Upload file(s)
   * @param {string} url - Endpoint URL
   * @param {FormData} formData - Form data with files
   * @param {Function} onUploadProgress - Progress callback
   * @returns {Promise} - Axios response promise
   */
  //   upload: (url, formData, onUploadProgress) => {
  //     return apiClient.post(url, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       },
  //       onUploadProgress: onUploadProgress ? (progressEvent) => {
  //         const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
  //         onUploadProgress(percentCompleted);
  //       } : undefined
  //     });
  //   },

  // Get the base API client for custom requests
  client: apiClient,
};

export default api;
