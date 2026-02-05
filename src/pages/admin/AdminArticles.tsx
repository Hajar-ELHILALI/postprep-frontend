import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { ArticleDTO } from '../../types';
import { Trash2, FileText, Eye, X, Hash, Tag, Layers, Layout, Code } from 'lucide-react';

export const AdminArticles: React.FC = () => {
  const [articles, setArticles] = useState<ArticleDTO[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedArticle, setSelectedArticle] = useState<ArticleDTO | null>(null);
  const [viewMode, setViewMode] = useState<'formatted' | 'json'>('formatted');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await api.get('/admin/articles');
      setArticles(res.data);
    } catch (error) {
      console.error("Failed to fetch articles", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Permanently delete this article?")) return;
    try {
      await api.delete(`/admin/articles/${id}`);
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      alert("Delete failed");
    }
  };

  // Since admin API sends full DTO, we can open modal directly
  const handleView = (article: ArticleDTO) => {
    setSelectedArticle(article);
    setViewMode('formatted');
  };

  return (
    <div className="max-w-6xl mx-auto pt-6 min-h-[80vh]">
      <h2 className="text-3xl font-bold text-white mb-8 tracking-tight flex items-center gap-3">
        <FileText className="text-pink-500" /> Global Articles
      </h2>

      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-xs font-mono text-slate-400 uppercase tracking-wider">Title</th>
              <th className="p-4 text-xs font-mono text-slate-400 uppercase tracking-wider">Status</th>
              <th className="p-4 text-xs font-mono text-slate-400 uppercase tracking-wider">Owner ID</th>
              <th className="p-4 text-xs font-mono text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">Loading articles...</td></tr>
            ) : articles.length === 0 ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">No articles found.</td></tr>
            ) : articles.map((article) => (
              <tr key={article.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <span className="text-slate-200 font-medium block max-w-md truncate">
                    {article.title || article.outputJson?.title || "Untitled"}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                      article.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                      article.status === 'FAILED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                      'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                  }`}>
                    {article.status}
                  </span>
                </td>
                <td className="p-4 text-slate-500 text-xs font-mono">{article.owner}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => handleView(article)}
                      className="p-2 text-slate-500 hover:text-white hover:bg-blue-500/20 rounded-lg transition-all"
                      title="View Details"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(article.id)}
                      className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Delete Permanently"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- ADMIN DETAIL MODAL --- */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f172a] rounded-2xl shadow-2xl border border-white/10 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-xl font-bold text-white tracking-wide">
                Admin Inspection
                <span className="ml-3 text-xs font-normal text-slate-500 font-mono border border-white/10 px-2 py-0.5 rounded">
                  ID: {selectedArticle.id}
                </span>
              </h3>
              <button onClick={() => setSelectedArticle(null)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
              
              {!selectedArticle.outputJson ? (
                <div className="text-center py-12 text-slate-500 italic border border-dashed border-white/10 rounded-xl">
                  Analysis data unavailable or processing failed.
                </div>
              ) : (
                <>
                  {/* --- VIEW SWITCHER --- */}
                  <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-lg w-max border border-white/5">
                    <button 
                      onClick={() => setViewMode('formatted')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${
                        viewMode === 'formatted' 
                        ? 'bg-pink-600 text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Layout size={14} /> Formatted
                    </button>
                    <button 
                      onClick={() => setViewMode('json')}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wide transition-all ${
                        viewMode === 'json' 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Code size={14} /> Raw JSON
                    </button>
                  </div>

                  {/* --- CONDITIONAL RENDERING --- */}
                  {viewMode === 'formatted' ? (
                    <div className="animate-fade-in space-y-8">
                      <div>
                        <label className="text-xs font-mono text-pink-400 uppercase tracking-widest mb-2 block">Document Title</label>
                        <p className="text-2xl font-bold text-white">{selectedArticle.outputJson.title}</p>
                      </div>

                      <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                        <label className="text-xs font-mono text-pink-400 uppercase tracking-widest mb-3 block">Ai Summary</label>
                        <p className="text-slate-300 leading-relaxed text-sm">{selectedArticle.outputJson.summary}</p>
                      </div>

                      <div>
                        <label className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3 block flex items-center gap-1">
                          <Hash size={12} /> Keywords
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {selectedArticle.outputJson.keywords?.map((k, i) => (
                            <span key={i} className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10">
                              #{k}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="p-5 border border-white/10 rounded-xl bg-white/[0.02]">
                          <label className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3 block flex items-center gap-2">
                            <Tag size={12} /> SEO Title
                          </label>
                          <p className="text-sm text-pink-200 font-medium">{selectedArticle.outputJson.seoTitle}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // --- JSON VIEW ---
                    <div className="animate-fade-in">
                       <div className="bg-black/40 p-6 rounded-xl border border-white/10 overflow-hidden">
                          <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                             <span className="text-xs font-mono text-slate-500">database_record.json</span>
                             <span className="text-xs font-mono text-green-500 bg-green-900/20 px-2 py-1 rounded">VALID</span>
                          </div>
                          <pre className="text-xs sm:text-sm font-mono text-green-400 overflow-x-auto whitespace-pre-wrap break-words leading-relaxed">
                            {JSON.stringify(selectedArticle.outputJson, null, 2)}
                          </pre>
                       </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="p-4 bg-white/5 border-t border-white/10 flex justify-end">
               <button 
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
