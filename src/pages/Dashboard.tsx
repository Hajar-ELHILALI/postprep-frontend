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
      const res = await api.post('/article/upload/text', text, {
        headers: { 'Content-Type': 'text/plain' }
      });
      setLastArticle(res.data);
    } catch (error) {
      console.error(error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-slate-800 mb-8">Process New Document</h2>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button onClick={() => setActiveTab('pdf')} className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'pdf' ? 'bg-slate-50 text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}>
            <FileType size={18} /> Upload PDF
          </button>
          <button onClick={() => setActiveTab('text')} className={`flex-1 py-4 text-sm font-medium flex items-center justify-center gap-2 ${activeTab === 'text' ? 'bg-slate-50 text-slate-900 border-b-2 border-slate-900' : 'text-slate-500 hover:bg-slate-50'}`}>
            <Type size={18} /> Paste Text
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'pdf' ? (
            <form onSubmit={handlePdfUpload} className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg p-10 bg-slate-50">
              <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" id="file-upload" />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                <Upload size={48} className="text-slate-400 mb-4" />
                <span className="text-slate-600 font-medium">{file ? file.name : "Click to select PDF"}</span>
              </label>
              <button type="submit" disabled={!file || uploading} className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition">
                {uploading ? 'Processing...' : 'Start Analysis'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleTextUpload}>
              <textarea className="w-full h-48 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="Paste raw text..." value={text} onChange={(e) => setText(e.target.value)} />
              <div className="mt-4 flex justify-end">
                <button type="submit" disabled={!text || uploading} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition">
                  {uploading ? 'Processing...' : 'Analyze Text'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {lastArticle && (
        <div className="mt-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">Analysis Result</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${lastArticle.status === ArticleStatus.COMPLETED ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {lastArticle.status}
            </span>
          </div>
          
          {lastArticle.outputJson ? (
             <div className="space-y-4">
               <div>
                  <h4 className="font-semibold text-sm text-slate-500 uppercase">Title</h4>
                  <p className="text-lg font-medium">{lastArticle.outputJson.title || "No Title Extracted"}</p>
               </div>
               <div>
                  <h4 className="font-semibold text-sm text-slate-500 uppercase">Summary</h4>
                  <p className="text-slate-700">{lastArticle.outputJson.summary}</p>
               </div>
               <div className="flex flex-wrap gap-2">
                 {lastArticle.outputJson.keywords?.map((k, i) => (
                   <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100">{k}</span>
                 ))}
               </div>
             </div>
          ) : (
            <p className="text-slate-500">Processing... Check back in "My Articles" shortly.</p>
          )}
        </div>
      )}
    </div>
  );
};
