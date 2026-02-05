import React, { useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email, password });
        login(res.data);
        navigate('/');
      } else {
        await api.post('/auth/register', { username, email, password });
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Decorative ambient blobs behind the glass */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-16 items-center z-10">
        
        {/* --- LEFT: The Frosted Glass Card --- */}
        <div className="relative">
          {/* Thin border line for the glass edge effect */}
          <div className="absolute inset-0 rounded-3xl border border-white/20 pointer-events-none"></div>
          
          <div className="bg-white/5 backdrop-blur-2xl p-10 md:p-12 rounded-3xl shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] border border-white/10">
            <h2 className="text-xl text-pink-200 font-bold tracking-widest uppercase mb-1 text-center">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h2>
            <h1 className="text-4xl font-bold mb-8 text-white text-center tracking-tighter">
              PostPrep
            </h1>
            
            {error && (
              <div className="bg-red-500/20 border border-red-500/30 text-red-100 p-3 rounded-xl mb-6 text-sm text-center backdrop-blur-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {!isLogin && (
                <div className="group">
                  <input 
                    type="text" placeholder="Username" 
                    className="w-full px-6 py-4 bg-black/20 text-white rounded-full border border-white/10 focus:border-pink-500/50 focus:bg-black/40 focus:ring-1 focus:ring-pink-500/50 transition-all outline-none placeholder:text-white/30"
                    value={username} onChange={(e) => setUsername(e.target.value)} required
                  />
                </div>
              )}
              
              <div className="group">
                <input 
                  type="email" placeholder="example@email.com" 
                  className="w-full px-6 py-4 bg-black/20 text-white rounded-full border border-white/10 focus:border-pink-500/50 focus:bg-black/40 focus:ring-1 focus:ring-pink-500/50 transition-all outline-none placeholder:text-white/30"
                  value={email} onChange={(e) => setEmail(e.target.value)} required
                />
              </div>
              
              <div className="group">
                <input 
                  type="password" placeholder="••••••••" 
                  className="w-full px-6 py-4 bg-black/20 text-white rounded-full border border-white/10 focus:border-pink-500/50 focus:bg-black/40 focus:ring-1 focus:ring-pink-500/50 transition-all outline-none placeholder:text-white/30"
                  value={password} onChange={(e) => setPassword(e.target.value)} required
                />
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-gradient-to-r from-[#8B2E49] to-[#6b2338] hover:from-[#a03554] hover:to-[#8B2E49] text-white py-4 rounded-full font-bold tracking-widest shadow-lg shadow-pink-900/30 transition-all transform hover:scale-[1.02] mt-6 border border-white/10"
              >
                {isLogin ? 'ACCESS SYSTEM' : 'INITIALIZE'}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-white/50">
                {isLogin ? "Need an account?" : "Have an account?"}
                <button 
                  onClick={() => setIsLogin(!isLogin)} 
                  className="ml-2 text-pink-300 font-bold hover:text-white transition-colors"
                >
                  {isLogin ? 'Sign Up' : 'Log In'}
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* --- RIGHT: Cyber Text --- */}
        <div className="hidden md:block">
          <h2 className="text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Extract Data<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">In Seconds.</span>
          </h2>
          
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-16 bg-pink-500/50"></div>
            <p className="text-pink-200/80 text-lg tracking-wide">AI-Powered Analysis</p>
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm inline-block max-w-sm">
            <p className="text-white/70 leading-relaxed font-light">
              "Supports PDF and Raw Text processing with advanced entity recognition."
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
