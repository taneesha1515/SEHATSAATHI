import api from './api';

export const adminService = {
  // Get administrative stats
  getAdminStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  // Get all registered users
  getAllUsers: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Toggle user active status
  toggleUserStatus: async (id) => {
    const response = await api.put(`/admin/users/${id}/status`);
    return response.data;
  },

  // Get all doctors
  getAllDoctorsAdmin: async () => {
    const response = await api.get('/admin/doctors');
    return response.data;
  },

  // Toggle doctor verification
  verifyDoctor: async (id) => {
    const response = await api.put(`/admin/doctors/${id}/verify`);
    return response.data;
  },
};
