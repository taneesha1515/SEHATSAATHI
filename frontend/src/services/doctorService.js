import api from './api';

export const doctorService = {
  // Get all active doctors with optional query filters
  getAllDoctors: async (params = {}) => {
    const response = await api.get('/doctors', { params });
    return response.data;
  },

  // Get doctor by ID
  getDoctorById: async (id) => {
    const response = await api.get(`/doctors/${id}`);
    return response.data;
  },

  // Get logged-in doctor's clinical profile
  getDoctorProfile: async () => {
    const response = await api.get('/doctors/profile/me');
    return response.data;
  },

  // Update logged-in doctor's clinical profile
  updateDoctorProfile: async (doctorData) => {
    const response = await api.put('/doctors/profile/me', doctorData);
    return response.data;
  },

  // Get doctor dashboard statistics
  getDoctorStats: async () => {
    const response = await api.get('/doctors/dashboard/stats');
    return response.data;
  },
};
