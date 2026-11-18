const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide article title'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    summary: {
      type: String,
      required: [true, 'Please provide short summary'],
      maxlength: [400, 'Summary cannot exceed 400 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide article content'],
    },
    category: {
      type: String,
      required: [true, 'Please select article category'],
      enum: [
        'Wellness',
        'Nutrition',
        'Cardiology',
        'Mental Health',
        'Diabetes Care',
        'Maternal Health',
        'Fitness & Lifestyle',
        'Preventive Care',
      ],
      default: 'Wellness',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      default: 'Dr. SehatSaathi Editorial',
    },
    readTime: {
      type: String,
      default: '4 min read',
    },
    coverImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
    },
    tags: {
      type: [String],
      default: ['Health', 'Wellness'],
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-generate slug from title before saving
articleSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .concat('-', Math.floor(1000 + Math.random() * 9000));
  }
  next();
});

module.exports = mongoose.model('Article', articleSchema);
