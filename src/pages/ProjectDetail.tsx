import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext, Project, WhiteboardElement, Task } from '../context/AppContext';
import TaskList from './TaskList';
import Whiteboard from '../components/Whiteboard';
import { STATUSES } from '../constants';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, tasks, updateProject, deleteProject, getWhiteboard, saveWhiteboard } = useAppContext();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'roadmap' | 'whiteboard' | 'settings'>('overview');
  const [whiteboardElements, setWhiteboardElements] = useState<WhiteboardElement[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const p = projects.find(p => p.id === id);
    if (p) {
      setProject(p);
    } else if (projects.length > 0) {
      navigate('/projects');
    }
  }, [id, projects, navigate]);

  useEffect(() => {
    if (id && activeTab === 'whiteboard') {
      getWhiteboard(id).then(setWhiteboardElements);
    }
  }, [id, activeTab, getWhiteboard]);

  if (!project) return null;

  const projectTasks = tasks.filter(t => t.project_id === id);

  const handleSaveWhiteboard = async (elements: WhiteboardElement[]) => {
    if (id) {
      await saveWhiteboard(id, elements);
      setWhiteboardElements(elements);
    }
  };

  const handleUpdate = async (updates: Partial<Project>) => {
    const updated = { ...project, ...updates };
    setProject(updated);
    await updateProject(updated);
  };

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `project_${project.name.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleDelete = async () => {
    if (window.confirm('Sei sicuro di voler eliminare questo progetto?')) {
      await deleteProject(project.id);
      navigate('/projects');
    }
  };

  const sortedTasks = [...projectTasks].sort((a, b) =>
    (a.start_date || a.due_date).localeCompare(b.start_date || b.due_date)
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="glass-panel p-8 rounded-3xl flex justify-between items-center border border-outline-variant/20 shadow-lg relative z-30">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl">
            <span className="material-symbols-outlined text-3xl">rocket_launch</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-on-surface tracking-tight">{project.name}</h1>
            <p className="text-on-surface-variant font-medium">{project.category} • Iniziato il {project.started_at}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <button onClick={handleDelete} className="px-8 py-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition-all active:scale-95 flex items-center gap-2">
            <span className="material-symbols-outlined text-lg">delete</span>
            Elimina
          </button>
          <div className="relative">
            <select
              value={project.status}
              onChange={(e) => handleUpdate({ status: e.target.value })}
              className="appearance-none px-8 py-3 rounded-xl bg-surface border-2 border-outline-variant/20 text-on-surface font-black hover:border-primary transition-all active:scale-95 shadow-sm pr-12 outline-none cursor-pointer"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 bg-surface/40 backdrop-blur-md p-1.5 rounded-2xl border border-outline-variant/10 w-fit self-center z-20">
        {['overview', 'tasks', 'roadmap', 'whiteboard', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-8 py-3 rounded-xl text-sm font-black capitalize transition-all ${
              activeTab === tab ? 'bg-surface shadow-md text-primary' : 'text-on-surface-variant hover:text-on-surface hover:bg-surface/40'
            }`}
          >
            {tab === 'overview' ? 'Panoramica' : tab === 'tasks' ? 'Tasks' : tab === 'roadmap' ? 'Roadmap' : tab === 'settings' ? 'Impostazioni' : tab}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[600px] relative z-10">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="lg:col-span-2 space-y-8">
              <section className="glass-panel p-8 rounded-3xl border border-outline-variant/20 relative">
                <h3 className="text-xl font-black text-on-surface mb-4">Descrizione</h3>
                <p className="text-on-surface-variant leading-relaxed text-lg p-4 rounded-2xl">{project.description || 'Nessuna descrizione fornita.'}</p>
              </section>
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl border border-outline-variant/20 flex flex-col gap-2">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Avanzamento</span>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-3xl font-black text-primary">{project.progress}%</span>
                    <span className="text-xs font-bold text-on-surface-variant">{projectTasks.length} Task Totali</span>
                  </div>
                  <div className="h-3 w-full bg-outline-variant/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-outline-variant/20 flex flex-col justify-between">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Membri Team</span>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full bg-surface border-2 border-surface-container flex items-center justify-center text-xs font-bold text-on-surface-variant shadow-sm">{String.fromCharCode(64 + i)}</div>
                      ))}
                      <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border-2 border-surface flex items-center justify-center text-xs font-bold text-primary shadow-sm">+{Math.max(0, project.members_count - 4)}</div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
            <aside className="glass-panel p-8 rounded-3xl border border-outline-variant/20 flex flex-col gap-6">
              <h4 className="font-black text-on-surface border-b border-outline-variant/10 pb-4">Statistiche Rapide</h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner"><span className="material-symbols-outlined">task_alt</span></div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase">Completati</p>
                    <p className="text-xl font-black text-on-surface">{projectTasks.filter(t => t.status === 'Completato').length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner"><span className="material-symbols-outlined">pending</span></div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase">In Corso</p>
                    <p className="text-xl font-black text-on-surface">{projectTasks.filter(t => t.status === 'In corso').length}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {activeTab === 'tasks' && <TaskList projectId={id} />}

        {activeTab === 'roadmap' && (
          <div className="glass-panel p-8 rounded-3xl border border-outline-variant/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-black text-on-surface mb-8">Cronoprogramma Progetto</h3>
            {sortedTasks.length === 0 ? (
              <div className="py-20 text-center bg-surface/30 rounded-3xl border-2 border-dashed border-outline-variant/10">
                <p className="text-on-surface-variant font-black uppercase tracking-widest text-sm">Nessuna attività pianificata</p>
              </div>
            ) : (
              <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant/20">
                {sortedTasks.map((t) => (
                  <div key={t.id} className="flex gap-6 relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border-4 border-surface shadow-md ${t.status === 'Completato' ? 'bg-emerald-500 text-white' : t.status === 'In corso' ? 'bg-indigo-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      <span className="material-symbols-outlined text-sm">{t.status === 'Completato' ? 'check' : 'schedule'}</span>
                    </div>
                    <div onClick={() => setEditingTask(t)} className="flex-1 bg-surface-container-low/50 dark:bg-slate-900/30 p-6 rounded-2xl border border-outline-variant/10 hover:shadow-lg transition-all group cursor-pointer">
                      <h4 className="font-black text-on-surface group-hover:text-primary transition-colors text-lg mb-2">{t.title}</h4>
                      <p className="text-sm text-on-surface-variant line-clamp-2 mb-4 leading-relaxed">{t.description || 'Nessun dettaglio aggiuntivo.'}</p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4">
                          <span className="text-xs font-black text-on-surface flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-primary">calendar_today</span>{t.start_date || t.due_date}</span>
                          <span className="text-xs font-black text-on-surface flex items-center gap-1.5"><span className="material-symbols-outlined text-sm text-rose-500">flag</span>{t.due_date}</span>
                        </div>
                        <span className="px-3 py-1 bg-white dark:bg-slate-800 rounded-lg border border-outline-variant/10 text-[10px] font-black">{t.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'whiteboard' && (
          <div className="h-[700px] w-full rounded-3xl overflow-hidden border border-outline-variant/20 shadow-2xl relative bg-white animate-in zoom-in-95 duration-500">
            <Whiteboard elements={whiteboardElements} onSave={handleSaveWhiteboard} />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="glass-panel p-12 rounded-3xl border border-outline-variant/20 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-center mb-8 border-b border-outline-variant/10 pb-6">
              <h3 className="text-2xl font-black text-on-surface">Impostazioni Progetto</h3>
              <button onClick={handleExport} className="px-6 py-2.5 rounded-xl border-2 border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined">download</span>Export JSON
              </button>
            </div>
            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); if (project) updateProject(project); }}>
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2 px-1 uppercase tracking-widest text-[10px]">Nome Progetto</label>
                <input type="text" value={project.name} onChange={(e) => setProject({...project, name: e.target.value})} className="w-full bg-surface/50 border border-outline-variant/20 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface font-bold" />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2 px-1 uppercase tracking-widest text-[10px]">Descrizione</label>
                <textarea value={project.description} rows={5} onChange={(e) => setProject({...project, description: e.target.value})} className="w-full bg-surface/50 border border-outline-variant/20 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface font-medium"></textarea>
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2 px-1 uppercase tracking-widest text-[10px]">Categoria</label>
                <input type="text" value={project.category} onChange={(e) => setProject({...project, category: e.target.value})} className="w-full bg-surface/50 border border-outline-variant/20 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface" />
              </div>
              <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:shadow-lg transition-all shadow-md active:scale-95">Salva Modifiche</button>
            </form>
          </div>
        )}
      </div>

      {editingTask && (
        <Modal
          isOpen={true}
          onClose={() => setEditingTask(null)}
          title="Modifica Task"
          description="Aggiorna i dettagli dell'attività"
        >
          <TaskForm
            onCancel={() => setEditingTask(null)}
            projectId={project.id}
            taskToEdit={editingTask}
          />
        </Modal>
      )}
    </div>
  );
};

export default ProjectDetail;
