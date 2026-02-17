import axios from 'axios';
import API_BASE_URL from '../config/api.config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Authentication API Service
 * Handles all authentication-related API calls
 */

// Organization Auth
export const registerOrganization = async (data) => {
  const response = await api.post('/auth/organization/register', data);
  return response.data;
};

// In auth.api.js
export const loginOrganization = async (email, password) => {
  try {
    const response = await api.post('/auth/organization/login', { email, password });
    console.log('Raw API response:', response); // Add this
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Teacher Auth
export const registerTeacher = async (data) => {
  const response = await api.post('/auth/teacher/register', data);
  return response.data;
};

export const loginTeacher = async (email, password) => {
  const response = await api.post('/auth/teacher/login', { email, password });
  return response.data;
};

// Student Auth
export const registerStudent = async (data) => {
  const response = await api.post('/auth/student/register', data);
  return response.data;
};

export const loginStudent = async (email, password) => {
  const response = await api.post('/auth/student/login', { email, password });
  return response.data;
};

// Get current user
export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  const response = await api.get('/auth/me');
  return response.data;
};

// Set auth token
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('token', token);
  } else {
    delete api.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};

