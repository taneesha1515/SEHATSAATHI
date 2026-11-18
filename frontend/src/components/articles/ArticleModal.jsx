import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import Alert from '../common/Alert';
import { articleService } from '../../services/articleService';

const ArticleModal = ({ isOpen, onClose, article, onSaveSuccess }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Wellness');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [readTime, setReadTime] = useState('4 min read');
  const [tagsInput, setTagsInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (article) {
      setTitle(article.title || '');
      setCategory(article.category || 'Wellness');
      setSummary(article.summary || '');
      setContent(article.content || '');
      setCoverImage(article.coverImage || '');
      setReadTime(article.readTime || '4 min read');
      setTagsInput(article.tags ? article.tags.join(', ') : '');
    } else {
      setTitle('');
      setCategory('Wellness');
      setSummary('');
      setContent('');
      setCoverImage(
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80'
      );
      setReadTime('4 min read');
      setTagsInput('Health, Wellness');
    }
  }, [article, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !summary.trim() || !content.trim()) {
      setError('Please provide title, summary, and article content.');
      return;
    }

    const tagsArray = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title,
      category,
      summary,
      content,
      coverImage:
        coverImage ||
        'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
      readTime,
      tags: tagsArray,
    };

    try {
      setLoading(true);
      if (article && article._id) {
        await articleService.updateArticle(article._id, payload);
      } else {
        await articleService.createArticle(payload);
      }
      onClose();
      if (onSaveSuccess) onSaveSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save article.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={article ? 'Edit Health Article' : 'Publish Health Education Article'}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Article Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 10 Essential Daily Habits for Optimal Cardiovascular Health"
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
              >
                <option value="Wellness">Wellness</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Nutrition">Nutrition</option>
                <option value="Mental Health">Mental Health</option>
                <option value="Diabetes Care">Diabetes Care</option>
                <option value="Maternal Health">Maternal Health</option>
                <option value="Fitness & Lifestyle">Fitness & Lifestyle</option>
                <option value="Preventive Care">Preventive Care</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Estimated Read Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="e.g. 5 min read"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Executive Summary (Brief Overview) *
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A 2-3 sentence overview of why this guide matters..."
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Article Body / Content (Markdown supported) *
            </label>
            <textarea
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write comprehensive, evidence-based healthcare tips..."
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Cover Image URL
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. Heart, Nutrition, Prevention"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-md shadow-teal-600/20 transition disabled:opacity-50"
            >
              {loading ? 'Publishing...' : article ? 'Update Article' : 'Publish Article'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ArticleModal;
