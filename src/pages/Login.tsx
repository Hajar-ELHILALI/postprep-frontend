import React, { useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(''); // Changed from first/last name
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        // LoginRequestDTO matches { email, password }
        const res = await api.post('/auth/login', { email, password });
        login(res.data); // Backend returns the User object directly in the map
        navigate('/');
      } else {
        // RegisterRequestDTO matches { username, email, password }
        await api.post('/auth/register', { username, email, password });
        setIsLogin(true);
        setError('Registration successful! Please login.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-slate-800">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
             <input 
              type="text" placeholder="Username" 
              className="w-full p-3 border rounded focus:ring-2 focus:ring-primary outline-none"
              value={username} onChange={(e) => setUsername(e.target.value)} required
            />
          )}
          
          <input 
            type="email" placeholder="Email" 
            className="w-full p-3 border rounded focus:ring-2 focus:ring-primary outline-none"
            value={email} onChange={(e) => setEmail(e.target.value)} required
          />
          <input 
            type="password" placeholder="Password" 
            className="w-full p-3 border rounded focus:ring-2 focus:ring-primary outline-none"
            value={password} onChange={(e) => setPassword(e.target.value)} required
          />
          
          <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded hover:bg-slate-800 transition">
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-slate-600">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-medium hover:underline">
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </div>
    </div>
  );
};
