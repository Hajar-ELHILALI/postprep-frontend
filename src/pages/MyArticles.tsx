import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Article } from '../types';
import { Eye, Calendar, FileText, X, Tag, Layers, Hash } from 'lucide-react';

export const MyArticles: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State for the Detail Modal
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
	    // Matches @RequestMapping("/api/v1/article") + @GetMapping("/myArticles")
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
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-8">My Articles</h2>

      {loading ? (
        <div className="text-center py-12 text-slate-500">Loading your content...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-dashed border-slate-300">
          <p className="text-slate-500">You haven't processed any documents yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {articles.map((article) => (
            <div key={article.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">
                    {article.title || article.outputJson?.title || "Untitled Document"}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(article.createdAt)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      article.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                      article.status === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {article.status}
                    </span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedArticle(article)}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">Analysis Details</h3>
              <button onClick={() => setSelectedArticle(null)} className="text-slate-400 hover:text-slate-700 transition">
                <X size={24} />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {!selectedArticle.outputJson ? (
                <div className="text-center py-8 text-slate-500">
                  This file has not been processed yet or the analysis failed.
                </div>
              ) : (
                <>
                  {/* Title Section */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">Generated Title</label>
                    <p className="text-lg font-medium text-slate-900">{selectedArticle.outputJson.title}</p>
                  </div>

                  {/* Summary Section */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <label className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
                       Summary
                    </label>
                    <p className="text-slate-700 leading-relaxed text-sm">
                      {selectedArticle.outputJson.summary}
                    </p>
                  </div>

                  {/* Keywords */}
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
                      <Hash size={12} /> Keywords
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.outputJson.keywords?.map((k, i) => (
                        <span key={i} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
                          #{k}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* SEO & Categories Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border border-slate-200 rounded-lg">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
                        <Tag size={12} /> SEO Title
                      </label>
                      <p className="text-sm text-slate-700">{selectedArticle.outputJson.seoTitle}</p>
                    </div>

                    <div className="p-4 border border-slate-200 rounded-lg">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 block flex items-center gap-1">
                        <Layers size={12} /> Categories
                      </label>
                      <div className="flex flex-wrap gap-1">
                        {selectedArticle.outputJson.categories?.map((cat, i) => (
                          <span key={i} className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Raw Data Toggle (Optional) */}
                  <div className="pt-4 border-t border-slate-100">
                    <details className="text-xs text-slate-400 cursor-pointer">
                      <summary className="hover:text-slate-600">View Raw JSON</summary>
                      <pre className="mt-2 p-3 bg-slate-900 text-slate-200 rounded overflow-x-auto font-mono">
                        {JSON.stringify(selectedArticle.outputJson, null, 2)}
                      </pre>
                    </details>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
