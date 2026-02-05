import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { LiteArticle, Article } from '../types';
import { Eye, FileText, X, Tag, Layers, Hash, Trash2, RefreshCw, Loader2, Code, Layout } from 'lucide-react';

export const MyArticles: React.FC = () => {
  // List only holds Lite data
  const [articles, setArticles] = useState<LiteArticle[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  
  // Selected holds the FULL data
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Toggle between "Pretty" and "JSON" view
  const [viewMode, setViewMode] = useState<'formatted' | 'json'>('formatted');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoadingList(true);
    try {
      const res = await api.get('/article/myArticles');
      setArticles(res.data);
    } catch (error) {
      console.error("Failed to fetch articles", error);
    } finally {
      setTimeout(() => setLoadingList(false), 500);
    }
  };

  const handleOpenDetail = async (id: string) => {
    setIsModalOpen(true);
    setLoadingDetail(true);
    setSelectedArticle(null);
    setViewMode('formatted'); // Reset to pretty view when opening new article

    try {
      const res = await api.get(`/article/${id}`);
      setSelectedArticle(res.data);
    } catch (error) {
      console.error("Failed to fetch article details", error);
      setIsModalOpen(false);
      alert("Could not load details.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm("Are you sure you want to delete this analysis?")) return;

    try {
      await api.delete(`/article/delete/${id}`);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto pt-6 relative min-h-[80vh]">
      
      {/* --- BACKGROUND ATMOSPHERE --- */}
      <div className="fixed top-1/3 left-1/4 w-[500px] h-[500px] bg-pink-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse -z-10 pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/20 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-pulse -z-10 pointer-events-none" style={{ animationDelay: '3s' }}></div>

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-white tracking-tight drop-shadow-md">My Articles</h2>
        <button 
          onClick={fetchArticles}
          disabled={loadingList}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white border border-white/10 hover:border-pink-500/30 rounded-lg transition-all disabled:opacity-50 group"
        >
          <RefreshCw size={18} className={`group-hover:text-pink-400 ${loadingList ? 'animate-spin text-pink-500' : ''}`} />
          <span className="text-sm font-medium hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* LIST VIEW */}
      {loadingList && articles.length === 0 ? (
        <div className="text-center py-12 text-slate-400 animate-pulse flex flex-col items-center">
           <RefreshCw size={24} className="animate-spin mb-4 opacity-50" />
           Accessing database...
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-dashed border-white/10 relative z-10">
          <p className="text-slate-400 text-lg">No documents processed yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 relative z-10">
          {articles.map((article) => (
            <div 
              key={article.id} 
              onClick={() => handleOpenDetail(article.id)}
              className="bg-slate-900/60 backdrop-blur-lg p-5 rounded-xl border border-white/10 shadow-lg hover:border-pink-500/30 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 bg-white/5 rounded-full flex items-center justify-center text-pink-400 group-hover:text-pink-300 transition-colors">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-slate-100 group-hover:text-white">
                    {article.title || "Untitled Document"}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                      article.status === 'COMPLETED' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                      article.status === 'FAILED' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {article.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => handleDelete(e, article.id)}
                  className="p-3 text-slate-400 hover:text-red-200 hover:bg-red-500/20 hover:border-red-500/30 border border-transparent rounded-full transition-all"
                >
                  <Trash2 size={20} />
                </button>
                <button className="p-3 text-slate-400 hover:text-white hover:bg-pink-600 rounded-full transition-all">
                  <Eye size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- DETAIL MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0f172a] rounded-2xl shadow-2xl border border-white/10 w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-xl font-bold text-white tracking-wide">Analysis Details</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-8 overflow-y-auto space-y-8 custom-scrollbar relative">
              
              {loadingDetail ? (
                <div className="flex flex-col items-center justify-center py-20 text-pink-400">
                  <Loader2 size={40} className="animate-spin mb-4" />
                  <p className="text-slate-400 text-sm">Retrieving full report...</p>
                </div>
              ) : !selectedArticle || !selectedArticle.outputJson ? (
                <div className="text-center py-12 text-slate-500 italic border border-dashed border-white/10 rounded-xl">
                  {selectedArticle?.status === 'PROCESSING' 
                    ? "This document is still processing. Please check back later."
                    : "Analysis data unavailable."}
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
                    </div>
                  ) : (
                    // --- JSON VIEW ---
                    <div className="animate-fade-in">
                       <div className="bg-black/40 p-6 rounded-xl border border-white/10 overflow-hidden">
                          <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                             <span className="text-xs font-mono text-slate-500">source_output.json</span>
                             <span className="text-xs font-mono text-green-500 bg-green-900/20 px-2 py-1 rounded">200 OK</span>
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
            
            {/* Modal Footer */}
            <div className="p-4 bg-white/5 border-t border-white/10 flex justify-end">
               <button 
                onClick={() => setIsModalOpen(false)}
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
