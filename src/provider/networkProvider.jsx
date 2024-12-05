import qs from "qs";
import axios from 'axios';
import { requestLogout } from './authProvider';

const apiAddress = import.meta.env.VITE_API_SERVER;
axios.defaults.withCredentials = true;
axios.defaults.paramsSerializer = params => {
  return qs.stringify(params, { arrayFormat: 'repeat' });
}

const apiInstance = axios.create({
  baseURL: apiAddress,
  timeout: 3000,
  headers: {
    post: {
      "Content-Type": "application/json"
    }
  }
});

// Before Request
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if(token != null) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// After response
apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Access Token Deprecated
      // Logout
      //console.log("requesting Logout");
      //requestLogout();
    }
    return Promise.reject(error);
  }
);

export default apiInstance;