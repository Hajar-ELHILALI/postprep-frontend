import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { AppUserDTO } from '../../types';
import { Trash2, User, Search } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<AppUserDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure? This will delete the user and all their articles.")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch (error) {
      alert("Failed to delete user");
    }
  };

  // Search by Username or Email
  const filteredUsers = users.filter(u => 
    (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (u.username && u.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Helper: Get Initials from Username (fallback to Email)
  const getInitials = (u: AppUserDTO) => {
    if (u.username) return u.username.charAt(0).toUpperCase();
    if (u.email) return u.email.charAt(0).toUpperCase();
    return '?';
  };

  return (
    <div className="max-w-6xl mx-auto pt-6 min-h-[80vh]">
      <h2 className="text-3xl font-bold text-white mb-8 tracking-tight flex items-center gap-3">
        <User className="text-blue-500" /> User Management
      </h2>

      {/* Search Bar */}
      <div className="mb-6 relative">
        <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by username or email..." 
          className="w-full bg-slate-900/50 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-slate-200 focus:outline-none focus:border-blue-500/50 transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-xs font-mono text-slate-400 uppercase tracking-wider">User</th>
              <th className="p-4 text-xs font-mono text-slate-400 uppercase tracking-wider">Role</th>
              <th className="p-4 text-xs font-mono text-slate-400 uppercase tracking-wider">Email</th>
              <th className="p-4 text-xs font-mono text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={4} className="p-8 text-center text-slate-500">Loading users...</td></tr>
            ) : filteredUsers.length === 0 ? (
               <tr><td colSpan={4} className="p-8 text-center text-slate-500">No users found.</td></tr>
            ) : filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {/* AVATAR */}
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {getInitials(user)}
                    </div>
                    {/* USERNAME DISPLAY */}
                    <span className="text-slate-200 font-medium">
                      {user.username || <span className="italic opacity-50">Unknown</span>}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold border ${
                    user.role === 'ADMIN' 
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30' 
                      : 'bg-slate-700/50 text-slate-400 border-slate-600'
                  }`}>
                    {user.role || 'USER'}
                  </span>
                </td>
                <td className="p-4 text-slate-400 text-sm font-mono">{user.email || 'No Email'}</td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleDelete(user.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete User"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
