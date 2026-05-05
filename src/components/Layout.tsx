import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import ProjectForm from './ProjectForm';
import TaskForm from './TaskForm';
import Modal from './Modal';
import Notifications from './Notifications';
import { useLocation, useNavigate } from 'react-router-dom';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleCloseProjectModal = () => {
    setShowProjectModal(false);
    if (location.pathname === '/projects/new') {
      navigate('/projects');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex transition-colors duration-300">
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
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl shadow-2xl flex items-center justify-center z-50 hover:scale-110 active:scale-95 transition-all shadow-indigo-500/20"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {/* Unified Modals */}
      <Modal
        isOpen={showProjectModal}
        onClose={handleCloseProjectModal}
        title="Nuovo Progetto"
        description="Compila i dettagli per creare un nuovo workspace."
      >
        <ProjectForm onCancel={handleCloseProjectModal} />
      </Modal>

      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Nuova Task"
        description="Aggiungi una nuova attività al tuo workspace."
      >
        <TaskForm onCancel={() => setShowTaskModal(false)} />
      </Modal>

      <Notifications />
    </div>
  );
};

export default Layout;
