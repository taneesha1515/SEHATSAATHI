import api from './api';

export const notificationService = {
  // Get all notifications
  getMyNotifications: async () => {
    const response = await api.get('/notifications');
    return response.data;
  },

  // Mark single notification read
  markAsRead: async (id) => {
    const response = await api.put(`/notifications/${id}/read`);
    return response.data;
  },

  // Mark all notifications read
  markAllAsRead: async () => {
    const response = await api.put('/notifications/mark-all-read');
    return response.data;
  },

  // Delete notification
  deleteNotification: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },
};
