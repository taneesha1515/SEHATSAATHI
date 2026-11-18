import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Eye, Heart, BookOpen } from 'lucide-react';

const ArticleCard = ({ article, onLike }) => {
  const categoryColors = {
    Cardiology: 'bg-rose-50 text-rose-700 border-rose-200',
    'Mental Health': 'bg-purple-50 text-purple-700 border-purple-200',
    'Diabetes Care': 'bg-amber-50 text-amber-700 border-amber-200',
    Wellness: 'bg-teal-50 text-teal-700 border-teal-200',
    Nutrition: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Maternal Health': 'bg-pink-50 text-pink-700 border-pink-200',
  };

  const badgeClass =
    categoryColors[article.category] || 'bg-slate-100 text-slate-700 border-slate-200';

  const defaultImage =
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group">
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img
          src={article.coverImage || defaultImage}
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${badgeClass}`}
          >
            {article.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs text-slate-400 mb-2">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{article.readTime || '4 min read'}</span>
            </span>
            <span>•</span>
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>

          <Link to={`/articles/${article.slug || article._id}`}>
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors line-clamp-2">
              {article.title}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
            {article.summary}
          </p>
        </div>

        {/* Footer info & stats */}
        <div className="mt-5 pt-3 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-700 truncate max-w-[130px]">
              {article.authorName || article.author?.name || 'Dr. SehatSaathi'}
            </span>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span className="flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5" />
              <span>{article.views || 0}</span>
            </span>
            <button
              onClick={() => onLike && onLike(article._id)}
              className="flex items-center space-x-1 text-slate-400 hover:text-rose-500 transition"
            >
              <Heart className="w-3.5 h-3.5 fill-rose-50 hover:fill-rose-500" />
              <span>{article.likes || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
