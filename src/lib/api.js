import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API
export const authAPI = {
  signup: async (userData) => {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },
  
  sendMagicLink: async (email) => {
    const response = await api.post('/auth/magic-link', { email });
    return response.data;
  },
};

// User API
export const userAPI = {
  getUser: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  
  updateUser: async (userId, updates) => {
    const response = await api.patch(`/users/${userId}`, updates);
    return response.data;
  },
};

// Building API
export const buildingAPI = {
  getBuildings: async (campus = null) => {
    const url = campus ? `/buildings?campus=${campus}` : '/buildings';
    const response = await api.get(url);
    return response.data;
  },
  
  getBuilding: async (buildingId) => {
    const response = await api.get(`/buildings/${buildingId}`);
    return response.data;
  },
};

// Schedule API
export const scheduleAPI = {
  addClass: async (userId, scheduleData) => {
    const response = await api.post(`/schedules/${userId}`, scheduleData);
    return response.data;
  },
  
  addBulkClasses: async (userId, schedules) => {
    const response = await api.post(`/schedules/${userId}/bulk`, { schedules });
    return response.data;
  },
  
  getSchedule: async (userId) => {
    const response = await api.get(`/schedules/${userId}`);
    return response.data;
  },
  
  deleteClass: async (scheduleId) => {
    const response = await api.delete(`/schedules/${scheduleId}`);
    return response.data;
  },
  
  uploadSchedule: async (userId, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`/schedules/${userId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

// Matching API
export const matchingAPI = {
  findMatches: async (userId) => {
    const response = await api.get(`/matches/${userId}`);
    return response.data;
  },
};

export default api;
