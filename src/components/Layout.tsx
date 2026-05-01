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

  return (
    <div className="flex min-h-screen bg-surface font-body-sm text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      <Sidebar />
      <div className="flex-1 flex flex-col md:ml-[280px]">
        <TopBar />
        <main className="p-8 mt-16 min-h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>

      <Notifications />

      {/* Floating Action Button */}
      <div className="fixed bottom-10 right-10 flex flex-col gap-4 z-50">
        <button
          onClick={() => setIsProjectModalOpen(true)}
          className="w-14 h-14 bg-white text-indigo-600 border border-indigo-100 rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative"
          title="Nuovo Progetto"
        >
          <span className="material-symbols-outlined text-3xl">create_new_folder</span>
          <span className="absolute right-full mr-4 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Nuovo Progetto</span>
        </button>
        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative"
          title="Nuova Task"
        >
          <span className="material-symbols-outlined text-3xl">add</span>
          <span className="absolute right-full mr-4 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Nuova Task</span>
        </button>
      </div>

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
