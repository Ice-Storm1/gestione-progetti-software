import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Projects: React.FC = () => {
  const { projects, searchQuery } = useAppContext();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<'Tutti' | 'Attivi' | 'Completati'>('Tutti');
  const navigate = useNavigate();

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'Tutti' || p.status === (filter === 'Attivi' ? 'Attivo' : 'Completato');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex flex-col gap-8 p-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white transition-colors">Progetti</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium transition-colors">Gestisci e monitora l'avanzamento dei tuoi workspace attivi.</p>
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
      <div className="glass-panel p-3 rounded-[2rem] flex flex-wrap items-center justify-between gap-4 border border-white/40 shadow-sm backdrop-blur-xl bg-white/40 dark:bg-slate-800/40 transition-colors">
        <div className="flex items-center gap-1 bg-slate-100/60 dark:bg-slate-700/60 p-1 rounded-2xl transition-colors">
          {(['Tutti', 'Attivi', 'Completati'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                filter === f
                  ? 'bg-white dark:bg-slate-600 shadow-md text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100/60 dark:bg-slate-700/60 p-1 rounded-2xl mr-2 transition-colors">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-slate-600 shadow-md text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <span className="material-symbols-outlined text-[22px]">grid_view</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white dark:bg-slate-600 shadow-md text-indigo-600 dark:text-indigo-400' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'}`}
            >
              <span className="material-symbols-outlined text-[22px]">view_list</span>
            </button>
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-50/50 dark:bg-slate-800/20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
          <span className="material-symbols-outlined text-6xl text-slate-300 mb-4 transition-colors">search_off</span>
          <p className="text-slate-500 dark:text-slate-400 font-bold transition-colors">Nessun progetto trovato</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="glass-panel p-8 rounded-[2rem] group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 border border-white/40 flex flex-col gap-6 cursor-pointer relative overflow-hidden bg-white/40 dark:bg-slate-800/40 hover:bg-white/60 dark:hover:bg-slate-800/60"
            >
              <div className="flex justify-between items-start relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner transition-colors">
                  <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                </div>
                <div className="relative group/menu">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-full transition-all">
                    <span className="material-symbols-outlined">more_vert</span>
                  </button>
                </div>
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{project.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                    project.status === 'Attivo' ? 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800' : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium line-clamp-2 leading-relaxed transition-colors">{project.description}</p>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-slate-400 transition-colors">
                  <span>Avanzamento</span>
                  <span className="text-indigo-600 dark:text-indigo-400 transition-colors">{project.progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100/50 dark:bg-slate-700/50 rounded-full overflow-hidden shadow-inner transition-colors">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>

              <div className="mt-2 pt-6 border-t border-slate-100/50 dark:border-slate-700 flex items-center justify-between text-xs relative z-10 transition-colors">
                <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-bold transition-colors">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  <span className="text-slate-600 dark:text-slate-300 transition-colors">{project.started_at}</span>
                </div>
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-black text-slate-500 dark:text-slate-400 shadow-sm transition-colors">
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full bg-indigo-50 dark:bg-indigo-900 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-black text-indigo-600 dark:text-indigo-400 shadow-sm transition-colors">
                    +{project.members_count}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-panel rounded-3xl border border-white/40 dark:border-slate-700 shadow-lg overflow-hidden bg-white/40 dark:bg-slate-800/40 transition-colors">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/40 dark:bg-slate-800/60 border-b border-white/20 dark:border-slate-700 transition-colors">
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Nome Progetto</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Status</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Progresso</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Data</th>
                <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/20 dark:divide-slate-700 transition-colors">
              {filteredProjects.map(project => (
                <tr
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="hover:bg-white/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer group"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined">rocket_launch</span>
                      </div>
                      <span className="font-black text-slate-800 dark:text-white text-lg transition-colors">{project.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${
                      project.status === 'Attivo' ? 'bg-green-50 text-green-700 border-green-100 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' : 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600'
                    }`}>
                      {project.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 w-64">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner transition-colors">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${project.progress}%` }}></div>
                      </div>
                      <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 transition-colors">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-slate-500 dark:text-slate-400 font-bold text-sm transition-colors">
                    {project.started_at}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-all">chevron_right</span>
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
