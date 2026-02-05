import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Layout, FileText, Shield, Users } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.role === 'ADMIN';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-slate-900/50 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        <Link to="/" className="text-2xl font-bold text-white tracking-tighter hover:text-pink-300 transition-colors">
          PostPrep
        </Link>

        <div className="flex items-center gap-6">
          {/* USER LINKS */}
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
            <Layout size={18} /> <span className="hidden md:inline">Dashboard</span>
          </Link>
          <Link to="/my-articles" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
            <FileText size={18} /> <span className="hidden md:inline">My Articles</span>
          </Link>
          
          {/* ADMIN LINKS */}
          {isAdmin && (
            <>
              <div className="h-6 w-px bg-white/20 mx-2"></div>
              <Link to="/admin" className="flex items-center gap-2 text-sm font-bold text-blue-300 hover:text-blue-100 transition-colors">
                <Shield size={18} /> <span className="hidden md:inline">Admin</span>
              </Link>
              <Link to="/admin/users" className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1">
                <Users size={16} /> <span className="hidden lg:inline">Users</span>
              </Link>
              <Link to="/admin/articles" className="text-sm font-medium text-slate-300 hover:text-white flex items-center gap-1">
                <FileText size={16} /> <span className="hidden lg:inline">Articles</span>
              </Link>
            </>
          )}

          <div className="h-6 w-px bg-white/20 mx-2"></div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400 hidden md:block">
              {user?.email}
            </span>
            <button 
              onClick={handleLogout} 
              className="flex items-center gap-2 bg-pink-600/20 hover:bg-pink-600/40 text-pink-200 px-4 py-2 rounded-full text-xs font-bold transition-all border border-pink-500/30"
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
