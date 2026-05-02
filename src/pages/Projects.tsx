import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { STATUSES } from '../constants';

const Projects: React.FC = () => {
  const { projects, searchQuery, addProject, deleteProject } = useAppContext();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState('Tutti');
  const [filterDate, setFilterDate] = useState('');
  const [filterTime, setFilterTime] = useState('');
  const [sortBy, setSortBy] = useState<string>('Nome');
  const navigate = useNavigate();

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'Tutti' || p.status === filterStatus;
    const matchesDate = !filterDate || p.date === filterDate;
    const matchesTime = !filterTime || (p.time && p.time.startsWith(filterTime));
    return matchesSearch && matchesStatus && matchesDate && matchesTime;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'Nome') return a.name.localeCompare(b.name);
    if (sortBy === 'Data') return (a.date || '').localeCompare(b.date || '');
    if (sortBy === 'Orario') return (a.time || '').localeCompare(b.time || '');
    if (sortBy === 'Data di creazione') return (a.created_at || '').localeCompare(b.created_at || '');
    if (sortBy === 'Stato') return a.status.localeCompare(b.status);
    return 0;
  });

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const projectData = JSON.parse(event.target?.result as string);
            await addProject(projectData);
          } catch (err) {
            console.error('Import failed', err);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-on-surface tracking-tight">Progetti</h2>
          <p className="text-on-surface-variant mt-1 font-medium text-lg">Gestisci e monitora l'avanzamento dei tuoi workspace attivi.</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleImport}
            className="px-8 py-3.5 rounded-2xl font-bold border-2 border-outline-variant/20 text-on-surface-variant hover:bg-surface/50 transition-all active:scale-95 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-lg">upload</span>
            Importa Progetto
          </button>
          <button
            onClick={() => navigate('/projects/new')}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 hover:translate-y-[-2px] transition-all flex items-center gap-2 active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add</span>
            Nuovo Progetto
          </button>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-6 border border-outline-variant/20">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div className="flex flex-col gap-1.5 min-w-[180px]">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Stato</label>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full appearance-none bg-surface/50 border border-outline-variant/20 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all pr-10"
              >
                <option>Tutti</option>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Data</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-surface/50 border border-outline-variant/20 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Orario</label>
            <input
              type="time"
              value={filterTime}
              onChange={(e) => setFilterTime(e.target.value)}
              className="bg-surface/50 border border-outline-variant/20 rounded-xl px-4 py-2 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {(filterStatus !== 'Tutti' || filterDate || filterTime) && (
            <button
              onClick={() => { setFilterStatus('Tutti'); setFilterDate(''); setFilterTime(''); }}
              className="mt-5 px-4 py-2 text-xs font-black text-rose-500 hover:bg-rose-50 rounded-lg transition-all uppercase tracking-widest"
            >
              Resetta
            </button>
          )}
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

          <div className="relative group">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none glass-panel px-6 py-2 rounded-xl text-sm font-bold border border-outline-variant/20 bg-surface/50 outline-none focus:ring-2 focus:ring-primary/20 text-on-surface-variant pr-10 cursor-pointer"
            >
              <option disabled>Filtra per</option>
              <option>Nome</option>
              <option>Data</option>
              <option>Orario</option>
              <option>Data di creazione</option>
              <option>Stato</option>
            </select>
            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-outline text-lg">filter_list</span>
          </div>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {sortedProjects.map(p => (
            <div
              key={p.id}
              onClick={() => navigate(`/projects/${p.id}`)}
              className="glass-panel p-8 rounded-[2rem] group hover:shadow-2xl transition-all duration-500 border border-outline-variant/20 flex flex-col gap-6 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Sei sicuro di voler eliminare questo progetto?')) {
                      deleteProject(p.id);
                    }
                  }}
                  className="p-2 text-on-surface-variant hover:text-error transition-all active:scale-90 opacity-0 group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-black text-on-surface">{p.name}</h3>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                    p.status === 'Completato' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400'
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
                      {String.fromCharCode(65 + i)}
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
              {sortedProjects.map(p => (
                <tr key={p.id} className="hover:bg-surface/30 transition-colors group cursor-pointer" onClick={() => navigate(`/projects/${p.id}`)}>
                  <td className="px-8 py-6">
                    <div className="font-black text-on-surface">{p.name}</div>
                    <div className="text-xs text-on-surface-variant font-medium truncate max-w-[200px]">{p.description}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      p.status === 'Completato' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30' : 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/30'
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
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Sei sicuro di voler eliminare questo progetto?')) {
                            deleteProject(p.id);
                          }
                        }}
                        className="p-2 text-on-surface-variant hover:text-error transition-colors"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                      <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
                    </div>
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
