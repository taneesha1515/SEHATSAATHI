import api from './api';

export const appointmentService = {
  // Create / Book new appointment
  createAppointment: async (appointmentData) => {
    const response = await api.post('/appointments', appointmentData);
    return response.data;
  },

  // Get user's appointments (Patient or Doctor)
  getMyAppointments: async (params = {}) => {
    const response = await api.get('/appointments', { params });
    return response.data;
  },

  // Get single appointment details
  getAppointmentById: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response.data;
  },

  // Update appointment status (confirm, complete, cancel)
  updateStatus: async (id, statusData) => {
    const response = await api.put(`/appointments/${id}/status`, statusData);
    return response.data;
  },
};
