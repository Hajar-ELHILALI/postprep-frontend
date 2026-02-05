import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Article } from '../types';
import { Eye, Calendar, FileText, X, Tag, Layers, Hash } from 'lucide-react';

export const MyArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await api.get('/article/myArticles');
      setArticles(res.data);
    } catch (error) {
      console.error("Failed to fetch articles", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="max-w-6xl mx-auto pt-6 relative min-h-[80vh]">
      
      {/* --- BACKGROUND ATMOSPHERE --- */}
      {/* Fixed position ensures they don't scroll away when list is long */}
      <div className="fixed top-1/3 left-1/4 w-[500px] h-[500px] bg-pink-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse -z-10 pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse -z-10 pointer-events-none" style={{ animationDelay: '3s' }}></div>

      <h2 className="text-3xl font-bold text-white mb-8 tracking-tight drop-shadow-md">My Articles</h2>

      {loading ? (
        <div className="text-center py-12 text-slate-400 animate-pulse">Accessing database...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-dashed border-white/10 relative z-10">
          <p className="text-slate-400 text-lg">No documents processed yet.</p>
          <p className="text-slate-500 text-sm mt-2">Upload a file on the Dashboard to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4 relative z-10">
          {articles.map((article) => (
            <div key={article.id} className="bg-slate-900/60 backdrop-blur-lg p-5 rounded-xl border border-white/10 shadow-lg hover:border-pink-500/30 transition-all flex items-center justify-between group">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center text-pink-400 group-hover:text-pink-300 transition-colors">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-100 group-hover:text-white">
                    {article.title || article.outputJson?.title || "Untitled Document"}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(article.createdAt)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      article.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                      article.status === 'FAILED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {article.status}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedArticle(article)}
                className="p-3 text-slate-400 hover:text-white hover:bg-pink-600 rounded-full transition-all"
                title="View Details"
              >
                <Eye size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* --- DETAIL MODAL --- */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f172a] rounded-2xl shadow-2xl border border-white/10 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-xl font-bold text-white tracking-wide">Analysis Details</h3>
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
                  {/* Title */}
                  <div>
                    <label className="text-xs font-mono text-pink-400 uppercase tracking-widest mb-2 block">Document Title</label>
                    <p className="text-2xl font-bold text-white">{selectedArticle.outputJson.title}</p>
                  </div>

                  {/* Summary */}
                  <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                    <label className="text-xs font-mono text-pink-400 uppercase tracking-widest mb-3 block flex items-center gap-2">
                       Ai Summary
                    </label>
                    <p className="text-slate-300 leading-relaxed text-sm">
                      {selectedArticle.outputJson.summary}
                    </p>
                  </div>

                  {/* Keywords */}
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

                  {/* SEO & Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-5 border border-white/10 rounded-xl bg-white/[0.02]">
                      <label className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3 block flex items-center gap-2">
                        <Tag size={12} /> SEO Title
                      </label>
                      <p className="text-sm text-pink-200 font-medium">{selectedArticle.outputJson.seoTitle}</p>
                    </div>

                    <div className="p-5 border border-white/10 rounded-xl bg-white/[0.02]">
                      <label className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3 block flex items-center gap-2">
                        <Layers size={12} /> Categories
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {selectedArticle.outputJson.categories?.map((cat, i) => (
                          <span key={i} className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Raw Data Toggle */}
                  <div className="pt-6 border-t border-white/10">
                    <details className="text-xs text-slate-500 cursor-pointer group">
                      <summary className="group-hover:text-pink-400 transition-colors">Debug: View Raw JSON</summary>
                      <pre className="mt-4 p-4 bg-black/40 text-green-400 rounded-xl overflow-x-auto font-mono text-[10px] border border-white/5 shadow-inner">
                        {JSON.stringify(selectedArticle.outputJson, null, 2)}
                      </pre>
                    </details>
                  </div>
                </>
              )}
            </div>
            
            {/* Modal Footer */}
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
