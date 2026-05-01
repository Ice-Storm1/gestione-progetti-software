import React, { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import Notifications from './Notifications';
import Modal from './Modal';
import ProjectForm from './ProjectForm';
import TaskForm from './TaskForm';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Extend window to allow children to trigger modals if needed,
  // or use a custom hook/context. For simplicity here, we'll just pass props if needed
  // but the FAB in screens often triggers these.

  return (
    <div className="flex min-h-screen bg-surface font-body-sm text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[280px]">
        <TopBar onNewProject={() => setIsProjectModalOpen(true)} />
        <main className="p-8 mt-16 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>

      <Notifications />

      {/* Floating Action Button */}
      <button
        onClick={() => setIsTaskModalOpen(true)}
        className="fixed bottom-10 right-10 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>

      {/* Modals */}
      <Modal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Nuovo Progetto"
        description="Compila i dettagli per iniziare un nuovo workspace d'elite."
      >
        <ProjectForm onClose={() => setIsProjectModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Nuova Task"
        description="Aggiungi una nuova attività alla tua roadmap."
      >
        <TaskForm onClose={() => setIsTaskModalOpen(false)} />
      </Modal>
    </div>
  );
};

export default Layout;
