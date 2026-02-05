import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, FileText, LayoutDashboard } from 'lucide-react';

export const Layout: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path 
    ? "bg-slate-800 text-white" 
    : "text-slate-400 hover:text-white hover:bg-slate-800";

  return (
    <div className="flex h-screen bg-background font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight">PostPrep</h1>
          <p className="text-xs text-slate-500 mt-1">Doc Intelligence</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <Link to="/" className={`flex items-center gap-3 px-4 py-3 rounded-md transition ${isActive('/')}`}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/articles" className={`flex items-center gap-3 px-4 py-3 rounded-md transition ${isActive('/articles')}`}>
            <FileText size={20} />
            <span>My Articles</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="mb-4 px-2">
            <p className="text-sm font-medium">{user?.email}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-md transition"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-slate-50 p-8">
        <Outlet />
      </main>
    </div>
  );
};
