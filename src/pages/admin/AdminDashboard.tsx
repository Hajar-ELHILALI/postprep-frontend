import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { GlobalStats, ChartDataDTO } from '../../types';
import { Users, FileText, TrendingUp, Activity } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<GlobalStats>({ users: 0, articles: 0 });
  const [chartData, setChartData] = useState<ChartDataDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await api.get('/admin/dashboard');
      const chartRes = await api.get('/admin/dashboard/stats/daily');
      
      setStats(statsRes.data);
      setChartData(chartRes.data); // Assuming backend returns list of { label: "2023-10-01", value: 5 }
    } catch (error) {
      console.error("Admin stats failed", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to normalize chart bars height relative to max value
  const maxVal = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div className="max-w-6xl mx-auto pt-6 relative min-h-[80vh]">
      {/* Background Blobs */}
      <div className="fixed top-20 right-[-10%] w-96 h-96 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-pulse -z-10 pointer-events-none"></div>

      <h2 className="text-3xl font-bold text-white mb-8 tracking-tight drop-shadow-md flex items-center gap-3">
        <Activity className="text-pink-500" /> Admin Overview
      </h2>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Users</p>
            <p className="text-4xl font-bold text-white mt-2">{stats.users}</p>
          </div>
          <div className="h-16 w-16 bg-blue-500/10 rounded-full flex items-center justify-center text-blue-400 border border-blue-500/20">
            <Users size={32} />
          </div>
        </div>

        <div className="bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">Total Articles</p>
            <p className="text-4xl font-bold text-white mt-2">{stats.articles}</p>
          </div>
          <div className="h-16 w-16 bg-pink-500/10 rounded-full flex items-center justify-center text-pink-400 border border-pink-500/20">
            <FileText size={32} />
          </div>
        </div>
      </div>

      {/* CUSTOM NEON CHART */}
      <div className="bg-slate-900/60 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp size={20} className="text-green-400" /> Daily Activity
          </h3>
          <span className="text-xs text-slate-500 bg-white/5 px-2 py-1 rounded">Last 7 Days</span>
        </div>

        <div className="h-64 flex items-end justify-between gap-2 md:gap-4 mt-8">
          {loading ? (
             <div className="w-full text-center text-slate-500">Loading chart data...</div>
          ) : chartData.length === 0 ? (
             <div className="w-full text-center text-slate-500">No data available yet</div>
          ) : (
            chartData.map((data, index) => {
              const heightPercentage = (data.value / maxVal) * 100;
              return (
                <div key={index} className="flex-1 flex flex-col items-center group">
                  <div className="relative w-full max-w-[40px] flex items-end h-full">
                    {/* The Bar */}
                    <div 
                      style={{ height: `${heightPercentage}%` }} 
                      className="w-full bg-gradient-to-t from-pink-600/50 to-purple-500/80 rounded-t-md border-t border-x border-white/20 transition-all duration-500 group-hover:from-pink-500 group-hover:to-purple-400 relative"
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black/80 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                        {data.value} Articles
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-3 font-mono truncate w-full text-center">
                    {data.label}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
