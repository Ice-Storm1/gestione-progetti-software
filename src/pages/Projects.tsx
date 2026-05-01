import React from 'react';
import { useAppContext } from '../context/AppContext';

const Projects: React.FC = () => {
  const { projects } = useAppContext();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-on-background tracking-tight">Progetti</h1>
          <p className="text-lg text-slate-500 mt-1">Gestisci e monitora l'avanzamento dei tuoi workspace attivi.</p>
        </div>
      </div>

      <div className="glass-panel inner-glow p-3 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl">
          <button className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-white shadow-sm text-indigo-600">Tutti</button>
          <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">Attivi</button>
          <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">Completati</button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl mr-2">
            <button className="p-1.5 rounded-lg bg-white shadow-sm text-indigo-600">
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
            </button>
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
              <span className="material-symbols-outlined text-[20px]">view_list</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="glass-panel inner-glow p-6 rounded-[24px] group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500 border border-white/40 flex flex-col gap-5">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2">
                <span className="material-symbols-outlined text-2xl">rocket_launch</span>
              </div>
              <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-slate-900">{project.name}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                  project.status === 'Attivo' ? 'bg-green-100 text-green-600 border-green-200' : 'bg-slate-200 text-slate-600 border-slate-300'
                }`}>
                  {project.status}
                </span>
              </div>
              <p className="text-body-sm text-slate-500 line-clamp-2">{project.description}</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-tighter text-slate-400">
                <span>Avanzamento</span>
                <span className="text-indigo-600">{project.progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${project.progress === 100 ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'}`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
            <div className="mt-2 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <span className="material-symbols-outlined text-sm">calendar_month</span>
                Iniziato: <span className="text-slate-600 font-medium">{project.started_at}</span>
              </div>
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">+{project.members_count}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Projects;
