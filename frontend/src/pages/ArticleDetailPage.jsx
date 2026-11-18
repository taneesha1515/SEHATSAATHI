import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { articleService } from '../services/articleService';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import {
  Clock,
  Eye,
  Heart,
  Share2,
  ArrowLeft,
  Calendar,
  User,
  CheckCircle,
} from 'lucide-react';

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await articleService.getArticleBySlug(slug);
        if (res.success) {
          setArticle(res.data);
        }
      } catch (err) {
        setError('Article not found or unavailable.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [slug]);

  const handleLike = async () => {
    if (!article) return;
    try {
      const res = await articleService.toggleLike(article._id);
      if (res.success) {
        setArticle({ ...article, likes: res.likes });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return <Loader size="lg" text="Loading health article..." />;
  }

  if (error || !article) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center space-y-4">
        <Alert type="error" message={error || 'Article not found'} />
        <Link
          to="/articles"
          className="inline-flex items-center space-x-2 text-sm font-bold text-teal-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Button */}
      <div>
        <Link
          to="/articles"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-teal-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Health Hub</span>
        </Link>
      </div>

      {/* Header Info */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-50 border border-teal-200 text-teal-800">
            {article.category}
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTime || '4 min read'}</span>
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        {/* Author bar */}
        <div className="flex items-center justify-between py-4 border-y border-slate-100">
          <div className="flex items-center space-x-3">
            <img
              src={
                article.author?.avatar ||
                `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                  article.authorName || 'Author'
                )}&backgroundColor=0d9488`
              }
              alt="Author"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-teal-500/20"
            />
            <div>
              <p className="text-sm font-bold text-slate-800">
                {article.authorName || article.author?.name || 'Dr. SehatSaathi'}
              </p>
              <p className="text-xs text-slate-500">Medical Contributor</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLike}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-bold transition flex items-center space-x-1.5"
            >
              <Heart className="w-4 h-4 fill-rose-500/10 text-rose-500" />
              <span>{article.likes || 0}</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition flex items-center space-x-1.5"
            >
              <Share2 className="w-4 h-4" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {article.coverImage && (
        <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-100 max-h-[450px]">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Summary Lead */}
      <div className="p-6 rounded-2xl bg-teal-50/70 border border-teal-100 text-teal-950 font-medium text-base sm:text-lg leading-relaxed">
        {article.summary}
      </div>

      {/* Body Content */}
      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-base space-y-4 whitespace-pre-line font-normal">
        {article.content}
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">
            Tags:
          </span>
          {article.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

export default ArticleDetailPage;
