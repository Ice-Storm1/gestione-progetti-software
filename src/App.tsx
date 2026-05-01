import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import ProjectDetail from './pages/ProjectDetail';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Kanban from './pages/Kanban';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import { useAppContext } from './context/AppContext';
import './App.css';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAppContext();
  const location = useLocation();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="material-symbols-outlined text-indigo-600">bolt</span>
          </div>
        </div>
        <p className="text-xs font-black text-indigo-700 uppercase tracking-widest animate-pulse">Inizializzazione Elite...</p>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const AppLayout: React.FC = () => {
  return (
    <AuthGuard>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/kanban" element={<Kanban />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </AuthGuard>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
