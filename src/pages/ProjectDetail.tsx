import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext, Project, WhiteboardElement } from '../context/AppContext';
import Kanban from './Kanban';
import Whiteboard from '../components/Whiteboard';
import { STATUSES } from '../constants';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, tasks, updateProject, deleteProject, getWhiteboard, saveWhiteboard } = useAppContext();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'whiteboard' | 'settings'>('overview');
  const [whiteboardElements, setWhiteboardElements] = useState<WhiteboardElement[]>([]);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    if (editingTitle && titleInputRef.current) titleInputRef.current.focus();
    if (editingDesc && descInputRef.current) descInputRef.current.focus();
  }, [editingTitle, editingDesc]);

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

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="glass-panel p-8 rounded-3xl flex justify-between items-center border border-white/40 shadow-lg relative">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl">
            <span className="material-symbols-outlined text-3xl">rocket_launch</span>
          </div>
          <div className="relative group">
            {editingTitle ? (
              <>
                <div className="fixed inset-0 bg-black/5 z-10" onClick={() => setEditingTitle(false)}></div>
                <input
                  ref={titleInputRef}
                  className="text-3xl font-black text-on-surface bg-white/50 dark:bg-slate-800/50 rounded-xl px-2 outline-none relative z-20"
                  value={project.name}
                  onChange={e => handleUpdate({ name: e.target.value })}
                  onBlur={() => setEditingTitle(false)}
                />
              </>
            ) : (
              <h1
                onDoubleClick={() => setEditingTitle(true)}
                className="text-3xl font-black text-on-surface tracking-tight cursor-pointer hover:text-primary transition-colors"
              >
                {project.name}
              </h1>
            )}
            <p className="text-on-surface-variant font-medium">{project.category} • Iniziato il {project.started_at}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="px-6 py-3 rounded-xl bg-error/10 text-error font-bold hover:bg-error/20 transition-all active:scale-95 border border-error/20"
          >
            Elimina
          </button>

          <div className="relative">
            <select
              value={project.status}
              onChange={(e) => handleUpdate({ status: e.target.value })}
              className="appearance-none px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-lg transition-all active:scale-95 shadow-md pr-12 outline-none"
            >
              {STATUSES.map(s => <option key={s} className="text-slate-900">{s}</option>)}
            </select>
            <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white">expand_more</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 w-fit self-center">
        {(['overview', 'tasks', 'whiteboard', 'settings'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 rounded-xl text-sm font-bold capitalize transition-all ${
              activeTab === tab
                ? 'bg-surface shadow-md text-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-white/40'
            }`}
          >
            {tab === 'overview' ? 'Panoramica' : (tab === 'tasks' ? 'Tasks' : tab)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="glass-panel p-8 rounded-3xl border border-white/40 relative">
                <h3 className="text-xl font-black text-on-surface mb-4">Descrizione</h3>
                {editingDesc ? (
                  <>
                    <div className="fixed inset-0 bg-black/5 z-10" onClick={() => setEditingDesc(false)}></div>
                    <textarea
                      ref={descInputRef}
                      rows={6}
                      className="w-full text-on-surface-variant leading-relaxed text-lg bg-white/50 dark:bg-slate-800/50 rounded-2xl p-4 outline-none relative z-20 shadow-inner"
                      value={project.description}
                      onChange={e => handleUpdate({ description: e.target.value })}
                      onBlur={() => setEditingDesc(false)}
                    />
                  </>
                ) : (
                  <p
                    onDoubleClick={() => setEditingDesc(true)}
                    className="text-on-surface-variant leading-relaxed text-lg cursor-pointer hover:bg-surface/30 p-4 rounded-2xl transition-all"
                  >
                    {project.description}
                  </p>
                )}
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/40 flex flex-col gap-2">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Avanzamento</span>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-3xl font-black text-primary">{project.progress}%</span>
                    <span className="text-xs font-bold text-on-surface-variant">{projectTasks.length} Task Totali</span>
                  </div>
                  <div className="h-3 w-full bg-outline-variant/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-white/40 flex flex-col justify-between">
                  <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Membri Team</span>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full bg-surface border-2 border-surface-container flex items-center justify-center text-xs font-bold text-on-surface-variant shadow-sm">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/30 border-2 border-surface flex items-center justify-center text-xs font-bold text-primary shadow-sm">
                        +{project.members_count - 4}
                      </div>
                    </div>
                    <button className="p-2 rounded-full hover:bg-surface text-primary">
                      <span className="material-symbols-outlined">person_add</span>
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <aside className="glass-panel p-8 rounded-3xl border border-white/40 flex flex-col gap-6">
              <h4 className="font-black text-on-surface border-b border-outline-variant/10 pb-4">Statistiche Rapide</h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined">task_alt</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase">Completati</p>
                    <p className="text-xl font-black text-on-surface">{projectTasks.filter(t => t.status === 'Completato').length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined">pending</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface-variant uppercase">In Corso</p>
                    <p className="text-xl font-black text-on-surface">{projectTasks.filter(t => t.status === 'In corso').length}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}

        {activeTab === 'tasks' && <Kanban projectId={id} />}

        {activeTab === 'whiteboard' && (
          <div className="h-[700px] w-full rounded-3xl overflow-hidden border border-white/40 shadow-2xl relative">
            <Whiteboard
              elements={whiteboardElements}
              onSave={handleSaveWhiteboard}
            />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="glass-panel p-12 rounded-3xl border border-white/40 max-w-2xl mx-auto space-y-8">
            <div className="flex justify-between items-center mb-8 border-b border-outline-variant/10 pb-6">
               <h3 className="text-2xl font-black text-on-surface">Impostazioni Progetto</h3>
               <button
                  onClick={handleExport}
                  className="px-6 py-2.5 rounded-xl border-2 border-primary/20 text-primary font-bold hover:bg-primary/5 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">download</span>
                  Export JSON
                </button>
            </div>

            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              updateProject(project);
            }}>
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2 px-1 uppercase tracking-widest text-[10px]">Nome Progetto</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => setProject({...project, name: e.target.value})}
                  className="w-full bg-surface/50 border border-outline-variant/20 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2 px-1 uppercase tracking-widest text-[10px]">Categoria</label>
                <input
                  type="text"
                  value={project.category}
                  onChange={(e) => setProject({...project, category: e.target.value})}
                  className="w-full bg-surface/50 border border-outline-variant/20 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-on-surface"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:shadow-lg transition-all shadow-md active:scale-95">
                Salva Modifiche
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetail;
