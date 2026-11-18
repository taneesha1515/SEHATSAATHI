const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleLike,
} = require('../controllers/articleController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', getArticles);
router.get('/:slug', getArticleBySlug);

router.post('/', protect, authorize('doctor', 'admin'), createArticle);
router.put('/:id', protect, authorize('doctor', 'admin'), updateArticle);
router.delete('/:id', protect, authorize('doctor', 'admin'), deleteArticle);
router.post('/:id/like', protect, toggleLike);

module.exports = router;
