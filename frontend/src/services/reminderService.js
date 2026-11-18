import api from './api';

export const reminderService = {
  // Get all reminders
  getReminders: async (params = {}) => {
    const response = await api.get('/reminders', { params });
    return response.data;
  },

  // Create new reminder
  createReminder: async (reminderData) => {
    const response = await api.post('/reminders', reminderData);
    return response.data;
  },

  // Update reminder
  updateReminder: async (id, reminderData) => {
    const response = await api.put(`/reminders/${id}`, reminderData);
    return response.data;
  },

  // Delete reminder
  deleteReminder: async (id) => {
    const response = await api.delete(`/reminders/${id}`);
    return response.data;
  },

  // Log medication intake (taken / missed)
  logIntake: async (id, logData) => {
    const response = await api.post(`/reminders/${id}/log`, logData);
    return response.data;
  },
};
