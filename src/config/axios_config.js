// import axios from "axios";
import { setup } from 'axios-cache-adapter';
import { API_BASE_URL } from "../constants/url";

const client = setup({
    baseUrl: API_BASE_URL,
    cache: {
        maxAge: 15 * 60 * 1000
    }
})

// const client = axios.create({
//     baseUrl: API_BASE_URL,
//     adapter: cache.adapter,
// });

client.defaults.baseURL = API_BASE_URL;

client.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token !== null) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  
    return config;
  }, error => {
    return Promise.reject(error);
  });

export default client;