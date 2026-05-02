import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Projects: React.FC = () => {
  const { projects, searchQuery, deleteProject } = useAppContext();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState('Tutti');
  const navigate = useNavigate();

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'Tutti' || p.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-on-surface tracking-tight">Progetti</h2>
          <p className="text-on-surface-variant mt-1 font-medium text-lg">Gestisci e monitora l'avanzamento dei tuoi workspace attivi.</p>
        </div>
        <button
          onClick={() => navigate('/projects/new')}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 hover:translate-y-[-2px] transition-all flex items-center gap-2 active:scale-95"
        >
          <span className="material-symbols-outlined text-lg">add</span>
          Nuovo Progetto
        </button>
      </div>

      <div className="glass-panel p-3 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-outline-variant/20">
        <div className="flex items-center gap-1 bg-surface/50 p-1 rounded-xl shadow-inner">
          {['Tutti', 'Attivo', 'Completato'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
                filter === f ? 'bg-surface shadow-md text-primary' : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-surface/50 p-1 rounded-xl shadow-inner">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg transition-all ${view === 'grid' ? 'bg-surface shadow-md text-primary' : 'text-on-surface-variant'}`}
            >
              <span className="material-symbols-outlined text-[20px]">grid_view</span>
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg transition-all ${view === 'list' ? 'bg-surface shadow-md text-primary' : 'text-on-surface-variant'}`}
            >
              <span className="material-symbols-outlined text-[20px]">view_list</span>
            </button>
          </div>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredProjects.map(p => (
            <div
              key={p.id}
              className="glass-panel p-8 rounded-[2rem] group hover:shadow-2xl transition-all duration-500 border border-outline-variant/20 flex flex-col gap-6"
            >
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                </div>
                <div className="flex gap-2">
                   <button
                    onClick={() => navigate(`/projects/${p.id}`)}
                    className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    onClick={() => deleteProject(p.id)}
                    className="p-2 text-on-surface-variant hover:text-error transition-colors"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
              <div onClick={() => navigate(`/projects/${p.id}`)} className="cursor-pointer">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-black text-on-surface">{p.name}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    p.status === 'Attivo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800' : 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                  }`}>
                    {p.status}
                  </span>
                </div>
                <p className="text-sm text-on-surface-variant font-medium line-clamp-2">{p.description}</p>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-black uppercase tracking-widest text-on-surface-variant">
                  <span>Avanzamento</span>
                  <span className="text-primary">{p.progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-outline-variant/20 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-1000"
                    style={{ width: `${p.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="pt-6 border-t border-outline-variant/10 flex items-center justify-between">
                <div className="flex items-center gap-2 text-on-surface-variant text-xs font-bold">
                  <span className="material-symbols-outlined text-sm">calendar_month</span>
                  {p.started_at}
                </div>
                <div className="flex -space-x-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-surface border-2 border-surface-container shadow-sm flex items-center justify-center text-[10px] font-black text-on-surface-variant">
                      U{i}
                    </div>
                  ))}
                  {p.members_count > 3 && (
                    <div className="w-8 h-8 rounded-full bg-primary text-white border-2 border-surface shadow-sm flex items-center justify-center text-[10px] font-black">
                      +{p.members_count - 3}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div
            onClick={() => navigate('/projects/new')}
            className="border-2 border-dashed border-outline-variant/40 rounded-[2rem] p-8 flex flex-col items-center justify-center gap-4 text-center group hover:border-primary hover:bg-primary/5 transition-all cursor-pointer min-h-[300px]"
          >
            <div className="w-16 h-16 rounded-full bg-surface shadow-lg flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">add_circle</span>
            </div>
            <div>
              <p className="font-black text-on-surface text-lg">Nuovo Progetto</p>
              <p className="text-xs text-on-surface-variant font-bold mt-1 uppercase tracking-widest">Inizia un nuovo workspace</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel rounded-[2rem] overflow-hidden border border-outline-variant/20">
          <table className="w-full text-left">
            <thead className="bg-surface/50 border-b border-outline-variant/10 text-on-surface-variant text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-8 py-5">Progetto</th>
                <th className="px-8 py-5">Stato</th>
                <th className="px-8 py-5">Categoria</th>
                <th className="px-8 py-5">Progresso</th>
                <th className="px-8 py-5">Membri</th>
                <th className="px-8 py-5 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {filteredProjects.map(p => (
                <tr key={p.id} className="hover:bg-surface/30 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-black text-on-surface">{p.name}</div>
                    <div className="text-xs text-on-surface-variant font-medium truncate max-w-[200px]">{p.description}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      p.status === 'Attivo' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30' : 'bg-slate-50 text-slate-500 border-slate-100 dark:bg-slate-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-on-surface-variant">{p.category}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-outline-variant/20 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-primary" style={{ width: `${p.progress}%` }}></div>
                      </div>
                      <span className="text-xs font-black text-primary">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex -space-x-2">
                       <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold border-2 border-surface shadow-sm">
                         {p.members_count}
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button onClick={() => navigate(`/projects/${p.id}`)} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
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
