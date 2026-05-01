import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Projects: React.FC = () => {
  const { projects } = useAppContext();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900">Progetti</h2>
          <p className="text-slate-500 mt-1 font-medium">Gestisci e monitora l'avanzamento dei tuoi workspace attivi.</p>
        </div>
        <button
          onClick={() => navigate('/projects/new')}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined">add</span>
          Nuovo Progetto
        </button>
      </header>

      {/* Toolbar */}
      <div className="glass-panel p-3 rounded-[2rem] flex flex-wrap items-center justify-between gap-4 border border-white/40 shadow-sm backdrop-blur-xl bg-white/40">
        <div className="flex items-center gap-1 bg-slate-100/60 p-1 rounded-2xl">
          <button className="px-6 py-2 rounded-xl text-sm font-bold bg-white shadow-md text-indigo-600">Tutti</button>
          <button className="px-6 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-800 transition-all">Attivi</button>
          <button className="px-6 py-2 rounded-xl text-sm font-bold text-slate-500 hover:text-slate-800 transition-all">Completati</button>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100/60 p-1 rounded-2xl mr-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <span className="material-symbols-outlined text-[22px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white shadow-md text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <span className="material-symbols-outlined text-[22px]">view_list</span>
            </button>
          </div>
          <button className="glass-panel px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/80 transition-all border border-white/40 shadow-sm">
            <span className="material-symbols-outlined text-lg">filter_list</span>
            Ordina per
          </button>
        </div>
      </div>

      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="glass-panel p-8 rounded-[2rem] group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 border border-white/40 flex flex-col gap-6 cursor-pointer relative overflow-hidden bg-white/40 hover:bg-white/60"
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-inner">
                  <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                </div>
                <div className="relative group/menu">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    project.status === 'Attivo' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">{project.description}</p>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400">
                  <span>Avanzamento</span>
                  <span className="text-indigo-600">{project.progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100/50 rounded-full overflow-hidden shadow-inner">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>

              <div className="mt-2 pt-6 border-t border-slate-100/50 flex items-center justify-between text-xs relative z-10">
                <div className="flex items-center gap-2 text-slate-400 font-bold">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  <span className="text-slate-600">{project.started_at}</span>
                </div>
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-500 shadow-sm">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-indigo-50 border-2 border-white flex items-center justify-center text-[10px] font-black text-indigo-600 shadow-sm">
                    +{project.members_count}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* New Project Card */}
          <div
            onClick={() => navigate('/projects/new')}
            className="border-2 border-dashed border-slate-200 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-5 text-center group hover:border-indigo-400 hover:bg-indigo-50/20 transition-all cursor-pointer bg-transparent"
          >
            <div className="w-20 h-20 rounded-full bg-white shadow-xl flex items-center justify-center text-indigo-500 group-hover:scale-110 group-hover:rotate-90 transition-all duration-500 border border-slate-100">
              <span className="material-symbols-outlined text-4xl">add</span>
            </div>
            <div>
              <p className="font-black text-lg text-slate-800">Nuovo Workspace</p>
              <p className="text-sm text-slate-400 font-medium mt-1">Crea un nuovo ambiente elite per i tuoi progetti.</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-white/40 shadow-lg overflow-hidden bg-white/40">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/40 border-b border-white/20">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500">Nome Progetto</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500">Status</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500">Progresso</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500">Data</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20">
              {projects.map(project => (
                <tr
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="hover:bg-white/60 transition-colors cursor-pointer group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">rocket_launch</span>
                      </div>
                      <span className="font-black text-slate-800 text-lg">{project.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      project.status === 'Attivo' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-600 border-slate-100'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 w-64">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <span className="text-sm font-black text-indigo-600">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-slate-500 font-bold text-sm">
                    {project.started_at}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-indigo-600 transition-colors">chevron_right</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Projects;
