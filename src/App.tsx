import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { MyArticles } from './pages/MyArticles';
import { Navbar } from './components/Navbar';

// Admin Imports
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminArticles } from './pages/admin/AdminArticles';

// 1. The Layout Component (Handles the UI wrapper + Protection)
const PrivateLayout = () => {
  const { user, loading } = useAuth();

  // If we are still checking the session, show a spinner (prevents "flicker")
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // If checking is done and no user, kick them out
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If user exists, render the Navbar and the requested page (Outlet)
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 p-4 md:p-8">
        <Outlet /> {/* This is where Dashboard, MyArticles, etc. will appear */}
      </main>
    </div>
  );
};

// 2. The Admin Guard (Specific for Admin routes)
const AdminGuard = () => {
  const { user } = useAuth();
  
  // Note: We don't need to check 'loading' here because PrivateLayout already handled it
  if (!user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />; 
  }

  return <Outlet />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-slate-900 text-slate-200">
          <Routes>
            
            {/* PUBLIC ROUTES */}
            <Route path="/login" element={<Login />} />

            {/* PROTECTED ROUTES (Wrapped in PrivateLayout) */}
            <Route element={<PrivateLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/my-articles" element={<MyArticles />} />

              {/* NESTED ADMIN ROUTES */}
              <Route path="/admin" element={<AdminGuard />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="articles" element={<AdminArticles />} />
              </Route>
            </Route>

            {/* CATCH ALL (404) - Optional, redirects unknown paths to home */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
