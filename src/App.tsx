import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { MyArticles } from './pages/MyArticles';
import { Navbar } from './components/Navbar';

// Admin Imports
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminArticles } from './pages/admin/AdminArticles';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  return <>{children}</>;
};

// New: Protected Admin Route
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  // Make sure your user object has the 'role' property!
  // If your user object stores roles as an array: user.roles.includes('ADMIN')
  if (!user || user.role !== 'ADMIN') return <Navigate to="/" />; 
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen text-slate-200">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            <Route path="/*" element={
              <ProtectedRoute>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <main className="flex-1 p-4 md:p-8">
                    <Routes>
                      {/* User Routes */}
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/my-articles" element={<MyArticles />} />
                      
                      {/* Admin Routes */}
                      <Route path="/admin" element={
                        <AdminRoute><AdminDashboard /></AdminRoute>
                      } />
                      <Route path="/admin/users" element={
                        <AdminRoute><AdminUsers /></AdminRoute>
                      } />
                      <Route path="/admin/articles" element={
                        <AdminRoute><AdminArticles /></AdminRoute>
                      } />
                    </Routes>
                  </main>
                </div>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
