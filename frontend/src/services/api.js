// src/services/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://code-orbit-scj0.onrender.com/api', // Your backend URL
  withCredentials: true
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  login(handle) {
    return API.post('/user/login', { handle });
  },
  getCurrentUser() {
    return API.get('/user/me');
  },
  updateBookmarks(bookmarks) {
    return API.put('/user/bookmarks', { bookmarks });
  },
  updateSolved(solved) {
    return API.put('/user/solved', { solved });
  },
};