import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ProjectForm from './ProjectForm';
import TaskForm from './TaskForm';
import { useAppContext } from '../context/AppContext';
import { useLocation } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const { notifications, removeNotification } = useAppContext();
  const location = useLocation();

  // Reset modals on navigation
  useEffect(() => {
    setShowProjectModal(false);
    setShowTaskModal(false);
  }, [location.pathname]);

  // Handle specialized navigation
  useEffect(() => {
    if (location.pathname === '/projects/new') {
      setShowProjectModal(true);
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-surface flex">
      <Sidebar />
      <div className="flex-1 md:ml-[280px] flex flex-col min-h-screen">
        <TopBar
          onNewProject={() => setShowProjectModal(true)}
          onNewTask={() => setShowTaskModal(true)}
        />
        <main className="flex-1">
          {children}
        </main>
      </div>

      <button
        onClick={() => setShowTaskModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all"
      >
        <span className="material-symbols-outlined">add</span>
      </button>

      {showProjectModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">Nuovo Progetto</h2>
              <button onClick={() => setShowProjectModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6">
              <ProjectForm onCancel={() => setShowProjectModal(false)} />
            </div>
          </div>
        </div>
      )}

      {showTaskModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">Nuova Task</h2>
              <button onClick={() => setShowTaskModal(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6">
              <TaskForm onCancel={() => setShowTaskModal(false)} />
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-8 right-8 z-[110] flex flex-col gap-4 w-80">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`glass-panel p-4 rounded-2xl shadow-xl flex gap-3 items-center border-l-4 ${
              n.type === 'success' ? 'border-l-green-500' : n.type === 'error' ? 'border-l-red-500' : 'border-l-blue-500'
            } animate-in slide-in-from-right duration-500`}
          >
            <div className={`text-${n.type === 'success' ? 'green' : n.type === 'error' ? 'red' : 'blue'}-500`}>
              <span className="material-symbols-outlined">
                {n.type === 'success' ? 'task_alt' : n.type === 'error' ? 'error' : 'info'}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">{n.message}</p>
            </div>
            <button onClick={() => removeNotification(n.id)} className="text-slate-400 hover:text-slate-600">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Layout;
