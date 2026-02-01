import axios from 'axios';
import API_BASE_URL from '../config/api.config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Location API
export const getDisastersByLocation = async (locationData) => {
  const response = await api.post('/location/disasters', locationData);
  return response.data;
};

export const getStates = async () => {
  const response = await api.get('/location/states');
  return response.data;
};

// Disaster API
export const getAllDisasters = async () => {
  const response = await api.get('/disasters');
  return response.data;
};

export const getDisasterDetails = async (disasterId) => {
  const response = await api.get(`/disasters/${disasterId}`);
  return response.data;
};

export const getSafetySteps = async (disasterId) => {
  const response = await api.get(`/disasters/${disasterId}/safety-steps`);
  return response.data;
};

// Quiz API
export const getQuiz = async (disasterType) => {
  const response = await api.get(`/quiz/${disasterType}`);
  return response.data;
};

export const submitQuiz = async (quizData) => {
  const response = await api.post('/quiz/submit', quizData);
  return response.data;
};

export default api;
