import React, { useState } from 'react';
import { api } from '../lib/api';
import { Upload, FileType, Type } from 'lucide-react';
import { Article, ArticleStatus } from '../types';

export const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pdf' | 'text'>('pdf');
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [lastArticle, setLastArticle] = useState<Article | null>(null);

  const handlePdfUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('pdfFile', file);

    try {
      // Matches Image: POST /api/v1/article/upload/pdf (Multipart)
      const res = await api.post('/article/upload/pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setLastArticle(res.data);
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleTextUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;

    setUploading(true);
    try {
      // Matches Image: POST /api/v1/article/upload/text
      // CRITICAL FIX: Image says "Upload raw text (JSON)", so we send JSON, not plain text.
      const res = await api.post('/article/upload/text', 
        { text: text }, // Wrapping text in a JSON object
        { headers: { 'Content-Type': 'application/json' } }
      );
      setLastArticle(res.data);
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pt-6 relative min-h-[80vh]">
       
      {/* --- BACKGROUND ATMOSPHERE (The Vibe) --- */}
      <div className="fixed top-20 left-[-10%] w-96 h-96 bg-pink-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse -z-10 pointer-events-none"></div>
      <div className="fixed bottom-20 right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse -z-10 pointer-events-none" style={{ animationDelay: '2s' }}></div>

      <h2 className="text-3xl font-bold text-white mb-8 tracking-tight drop-shadow-md">
        Process New Document
      </h2>

      {/* Main Glass Card */}
      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden relative z-10">
        
        {/* Tabs */}
        <div className="flex border-b border-white/10">
          <button 
            onClick={() => setActiveTab('pdf')} 
            className={`flex-1 py-5 text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              activeTab === 'pdf' 
                ? 'bg-white/10 text-pink-200 border-b-2 border-pink-500' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileType size={18} /> Upload PDF
          </button>
          <button 
            onClick={() => setActiveTab('text')} 
            className={`flex-1 py-5 text-sm font-medium flex items-center justify-center gap-2 transition-all ${
              activeTab === 'text' 
                ? 'bg-white/10 text-pink-200 border-b-2 border-pink-500' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Type size={18} /> Paste Text
          </button>
        </div>

        {/* Content Area */}
        <div className="p-8 md:p-10">
          {activeTab === 'pdf' ? (
            <form onSubmit={handlePdfUpload} className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-12 bg-black/20 hover:bg-black/30 transition-colors group">
              <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:scale-110 transition-transform">
                  <Upload size={32} className="text-pink-400" />
                </div>
                <span className="text-slate-300 font-medium group-hover:text-white transition-colors">
                  {file ? file.name : "Click to select PDF"}
                </span>
                <span className="text-xs text-slate-500 mt-2">Supported: PDF (Max 10MB)</span>
              </label>
               
              <button 
                type="submit" 
                disabled={!file || uploading} 
                className="mt-8 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {uploading ? 'Processing...' : 'Start Analysis'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTextUpload}>
              <textarea 
                className="w-full h-48 p-4 bg-black/30 border border-white/10 rounded-xl focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 text-slate-200 placeholder-slate-500 outline-none resize-none transition-all" 
                placeholder="Paste your raw text content here..." 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
              />
              <div className="mt-6 flex justify-end">
                <button 
                  type="submit" 
                  disabled={!text || uploading} 
                  className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {uploading ? 'Processing...' : 'Analyze Text'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Result Card */}
      {lastArticle && (
        <div className="mt-8 bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-xl animate-fade-in relative z-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Analysis Result</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide border ${
              lastArticle.status === ArticleStatus.COMPLETED ? 'bg-green-500/20 text-green-300 border-green-500/30' : 
              'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
            }`}>
              {lastArticle.status}
            </span>
          </div>
           
          {lastArticle.outputJson ? (
             <div className="space-y-6">
               <div>
                  <h4 className="font-mono text-xs text-pink-400 uppercase tracking-widest mb-2">Title</h4>
                  <p className="text-xl font-medium text-white">{lastArticle.outputJson.title || "No Title Extracted"}</p>
               </div>
               <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <h4 className="font-mono text-xs text-pink-400 uppercase tracking-widest mb-3">Summary</h4>
                  <p className="text-slate-300 leading-relaxed">{lastArticle.outputJson.summary}</p>
               </div>
               <div>
                  <h4 className="font-mono text-xs text-pink-400 uppercase tracking-widest mb-3">Keywords</h4>
                  <div className="flex flex-wrap gap-2">
                    {lastArticle.outputJson.keywords?.map((k, i) => (
                      <span key={i} className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-xs border border-purple-500/30">
                        {k}
                      </span>
                    ))}
                  </div>
               </div>
             </div>
          ) : (
            <p className="text-slate-400 italic">Processing initiated... Check "My Articles" shortly for full results.</p>
          )}
        </div>
      )}
    </div>
  );
};
