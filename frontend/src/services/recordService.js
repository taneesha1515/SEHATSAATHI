import api from './api';

export const recordService = {
  // Get medical records
  getMyRecords: async (params = {}) => {
    const response = await api.get('/records', { params });
    return response.data;
  },

  // Get single record
  getRecordById: async (id) => {
    const response = await api.get(`/records/${id}`);
    return response.data;
  },

  // Create new record
  createRecord: async (recordData) => {
    const response = await api.post('/records', recordData);
    return response.data;
  },

  // Update record
  updateRecord: async (id, recordData) => {
    const response = await api.put(`/records/${id}`, recordData);
    return response.data;
  },

  // Delete record
  deleteRecord: async (id) => {
    const response = await api.delete(`/records/${id}`);
    return response.data;
  },
};
