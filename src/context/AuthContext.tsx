import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize State DIRECTLY from LocalStorage to avoid HMR resets
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('postprep_user');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [loading, setLoading] = useState(false); // Start false since we loaded from storage above

  const login = (userData: User) => {
    console.log("✅ Setting User in Context:", userData);
    setUser(userData);
    localStorage.setItem('postprep_user', JSON.stringify(userData));
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      console.error("Logout error", e);
    }
    setUser(null);
    localStorage.removeItem('postprep_user');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Use a named export for the hook to satisfy Vite HMR rules
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
