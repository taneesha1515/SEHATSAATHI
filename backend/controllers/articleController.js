const Article = require('../models/Article');

// @desc    Get all published articles with category filter & search
// @route   GET /api/articles
// @access  Public
const getArticles = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 12 } = req.query;
    const query = { isPublished: true };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const total = await Article.countDocuments(query);
    const articles = await Article.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: articles.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      data: articles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single article by slug or ID
// @route   GET /api/articles/:slug
// @access  Public
const getArticleBySlug = async (req, res, next) => {
  try {
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(req.params.slug);
    const query = isObjectId ? { _id: req.params.slug } : { slug: req.params.slug };

    const article = await Article.findOne(query).populate(
      'author',
      'name avatar email'
    );

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    // Increment views
    article.views += 1;
    await article.save();

    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new article
// @route   POST /api/articles
// @access  Private (Doctor or Admin)
const createArticle = async (req, res, next) => {
  try {
    const { title, summary, content, category, coverImage, tags, readTime } =
      req.body;

    if (!title || !summary || !content) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, summary, and content',
      });
    }

    const article = await Article.create({
      title,
      summary,
      content,
      category: category || 'Wellness',
      coverImage:
        coverImage ||
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
      tags: tags || ['Health', 'Wellness'],
      readTime: readTime || '4 min read',
      author: req.user._id,
      authorName: req.user.role === 'doctor' ? `Dr. ${req.user.name}` : req.user.name,
      isPublished: true,
    });

    res.status(201).json({
      success: true,
      message: 'Article published successfully',
      data: article,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private (Author or Admin)
const updateArticle = async (req, res, next) => {
  try {
    let article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    const isAuthor = article.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to modify this article',
      });
    }

    const { title, summary, content, category, coverImage, tags, isPublished } =
      req.body;

    if (title) article.title = title;
    if (summary) article.summary = summary;
    if (content) article.content = content;
    if (category) article.category = category;
    if (coverImage) article.coverImage = coverImage;
    if (tags) article.tags = tags;
    if (isPublished !== undefined) article.isPublished = isPublished;

    const updated = await article.save();

    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private (Author or Admin)
const deleteArticle = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    const isAuthor = article.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this article',
      });
    }

    await article.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on article
// @route   POST /api/articles/:id/like
// @access  Private
const toggleLike = async (req, res, next) => {
  try {
    const article = await Article.findById(req.params.id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    article.likes += 1;
    await article.save();

    res.status(200).json({
      success: true,
      message: 'Liked article',
      likes: article.likes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getArticles,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
  toggleLike,
};
