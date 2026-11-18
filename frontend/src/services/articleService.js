import api from './api';

export const articleService = {
  // Get articles
  getArticles: async (params = {}) => {
    const response = await api.get('/articles', { params });
    return response.data;
  },

  // Get article by slug
  getArticleBySlug: async (slug) => {
    const response = await api.get(`/articles/${slug}`);
    return response.data;
  },

  // Create article
  createArticle: async (articleData) => {
    const response = await api.post('/articles', articleData);
    return response.data;
  },

  // Update article
  updateArticle: async (id, articleData) => {
    const response = await api.put(`/articles/${id}`, articleData);
    return response.data;
  },

  // Delete article
  deleteArticle: async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
  },

  // Toggle like
  toggleLike: async (id) => {
    const response = await api.post(`/articles/${id}/like`);
    return response.data;
  },
};
