import React, { useState, useEffect } from 'react';
import { articleService } from '../services/articleService';
import ArticleCard from '../components/articles/ArticleCard';
import ArticleModal from '../components/articles/ArticleModal';
import Loader from '../components/common/Loader';
import Alert from '../components/common/Alert';
import { Search, BookOpen, Plus, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ArticlesPage = () => {
  const { user, isDoctor, isAdmin } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = [
    'All',
    'Wellness',
    'Cardiology',
    'Nutrition',
    'Mental Health',
    'Diabetes Care',
    'Maternal Health',
  ];

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;

      const res = await articleService.getArticles(params);
      if (res.success) {
        setArticles(res.data);
      }
    } catch (err) {
      setError('Unable to fetch articles.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchArticles();
  };

  const handleLike = async (id) => {
    try {
      const res = await articleService.toggleLike(id);
      if (res.success) {
        setArticles((prev) =>
          prev.map((a) => (a._id === id ? { ...a, likes: res.likes } : a))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const canPublish = isDoctor || isAdmin;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-800 to-emerald-800 rounded-3xl p-8 lg:p-12 text-white space-y-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-teal-300">
              Verified Medical Insights
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Health & Wellness Knowledge Hub
            </h1>
            <p className="text-sm text-teal-100">
              Evidence-based clinical guides and preventive lifestyle recommendations written by doctors.
            </p>
          </div>

          {canPublish && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 rounded-2xl bg-white text-teal-800 hover:bg-teal-50 font-bold text-xs shadow-lg transition flex items-center justify-center space-x-2 shrink-0 self-start md:self-auto"
            >
              <Plus className="w-4 h-4 text-teal-600" />
              <span>Write Health Article</span>
            </button>
          )}
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl p-2 shadow-2xl flex flex-col sm:flex-row items-center gap-2 max-w-2xl text-slate-800"
        >
          <div className="flex-1 flex items-center px-3 w-full">
            <Search className="w-5 h-5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by topic, symptom, diet, mental health..."
              className="w-full text-sm py-2 focus:outline-none placeholder:text-slate-400 font-medium"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition shrink-0"
          >
            Search
          </button>
        </form>
      </div>

      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold shrink-0 transition ${
              selectedCategory === cat
                ? 'bg-teal-600 text-white shadow-sm'
                : 'bg-white border border-slate-200 text-slate-700 hover:border-teal-500 hover:bg-teal-50/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <Loader size="lg" text="Loading health guides..." />
      ) : articles.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Articles Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try searching for another keyword or selecting a different health category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article._id} article={article} onLike={handleLike} />
          ))}
        </div>
      )}

      {/* Article Publication Modal */}
      <ArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveSuccess={fetchArticles}
      />
    </div>
  );
};

export default ArticlesPage;
