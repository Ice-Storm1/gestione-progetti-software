import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext, Project, WhiteboardElement } from '../context/AppContext';
import Kanban from './Kanban';
import Whiteboard from '../components/Whiteboard';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, tasks, updateProject, deleteProject, getWhiteboard, saveWhiteboard } = useAppContext();
  const [project, setProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'whiteboard' | 'settings'>('overview');
  const [whiteboardElements, setWhiteboardElements] = useState<WhiteboardElement[]>([]);

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

  const handleDelete = async () => {
    if (window.confirm('Sei sicuro di voler eliminare questo progetto?')) {
      await deleteProject(project.id);
      navigate('/projects');
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <header className="glass-panel p-8 rounded-3xl flex justify-between items-center border border-white/40 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl">
            <span className="material-symbols-outlined text-3xl">rocket_launch</span>
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{project.name}</h1>
            <p className="text-slate-500 font-medium">{project.category} • Iniziato il {project.started_at}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDelete}
            className="px-6 py-3 rounded-xl bg-error/10 text-error font-bold hover:bg-error/20 transition-all active:scale-95 border border-error/20"
          >
            Elimina
          </button>
          <button className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold hover:shadow-lg transition-all active:scale-95 shadow-md">
            Condividi
          </button>
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
                ? 'bg-white shadow-md text-indigo-600'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'
            }`}
          >
            {tab === 'overview' ? 'Panoramica' : tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[600px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="glass-panel p-8 rounded-3xl border border-white/40">
                <h3 className="text-xl font-black text-slate-900 mb-4">Descrizione</h3>
                <p className="text-slate-600 leading-relaxed text-lg">{project.description}</p>
              </section>

              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/40 flex flex-col gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Avanzamento</span>
                  <div className="flex justify-between items-end mb-1">
                    <span className="text-3xl font-black text-indigo-600">{project.progress}%</span>
                    <span className="text-xs font-bold text-slate-500">{projectTasks.length} Task Totali</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                  </div>
                </div>
                <div className="glass-panel p-6 rounded-2xl border border-white/40 flex flex-col justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Membri Team</span>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex -space-x-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500 shadow-sm">
                          {String.fromCharCode(64 + i)}
                        </div>
                      ))}
                      <div className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-xs font-bold text-indigo-600 shadow-sm">
                        +{project.members_count - 4}
                      </div>
                    </div>
                    <button className="p-2 rounded-full hover:bg-slate-100 text-indigo-600">
                      <span className="material-symbols-outlined">person_add</span>
                    </button>
                  </div>
                </div>
              </section>
            </div>

            <aside className="glass-panel p-8 rounded-3xl border border-white/40 flex flex-col gap-6">
              <h4 className="font-black text-slate-900 border-b border-slate-100 pb-4">Statistiche Rapide</h4>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined">task_alt</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Completati</p>
                    <p className="text-xl font-black text-slate-800">{projectTasks.filter(t => t.status === 'Completati').length}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-inner">
                    <span className="material-symbols-outlined">pending</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">In Corso</p>
                    <p className="text-xl font-black text-slate-800">{projectTasks.filter(t => t.status === 'In corso').length}</p>
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
          <div className="glass-panel p-12 rounded-3xl border border-white/40 max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-slate-900 mb-8">Impostazioni Progetto</h3>
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              updateProject(project);
            }}>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Nome Progetto</label>
                <input
                  type="text"
                  value={project.name}
                  onChange={(e) => setProject({...project, name: e.target.value})}
                  className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Categoria</label>
                <input
                  type="text"
                  value={project.category}
                  onChange={(e) => setProject({...project, category: e.target.value})}
                  className="w-full bg-white/50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>
              <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
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
