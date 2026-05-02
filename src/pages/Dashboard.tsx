import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { projects, tasks, user } = useAppContext();
  const navigate = useNavigate();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'Completati').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In corso').length;
  const blockedTasks = tasks.filter(t => t.status === 'Bloccati').length;

  const stats = [
    {
      label: 'Task Totali',
      value: totalTasks,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      icon: 'assignment',
      progress: 100
    },
    {
      label: 'Completati',
      value: completedTasks,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      icon: 'check_circle',
      progress: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    },
    {
      label: 'In Corso',
      value: inProgressTasks,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      icon: 'pending',
      progress: totalTasks > 0 ? (inProgressTasks / totalTasks) * 100 : 0
    },
    {
      label: 'Bloccati',
      value: blockedTasks,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      icon: 'block',
      progress: totalTasks > 0 ? (blockedTasks / totalTasks) * 100 : 0
    },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Dashboard Operativa</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium text-lg transition-colors">Bentornato {user?.name}, ecco il riepilogo delle attività.</p>
        </div>
        <button
          onClick={() => navigate('/projects/new')}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3.5 rounded-2xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all hover:shadow-indigo-500/40"
        >
          <span className="material-symbols-outlined">add</span>
          Nuovo Progetto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel p-8 rounded-[2rem] flex flex-col justify-between group hover:shadow-2xl transition-all duration-500 border border-white/40 bg-white/40 dark:bg-slate-800/40">
            <div className="flex justify-between items-start">
              <div className={`p-4 ${stat.bg} dark:bg-slate-700/50 rounded-2xl ${stat.color} dark:text-white shadow-inner transition-colors`}>
                <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
              </div>
              <span className={`text-xs font-black ${stat.color} dark:text-white bg-white/60 dark:bg-slate-700 px-3 py-1 rounded-full shadow-sm transition-colors`}>
                {stat.progress.toFixed(0)}%
              </span>
            </div>
            <div className="mt-6">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest transition-colors">{stat.label}</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-1 transition-colors">{stat.value}</h3>
            </div>
            <div className="mt-6 h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner transition-colors">
              <div
                className={`h-full ${stat.color.replace('text', 'bg')} rounded-full transition-all duration-1000`}
                style={{ width: `${stat.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Progetti Recenti</h4>
            <button onClick={() => navigate('/projects')} className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-colors">Vedi Tutti</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.length > 0 ? projects.slice(0, 4).map(p => (
              <div
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="glass-panel p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden relative border border-white/40 bg-white/40 dark:bg-slate-800/40"
              >
                <div className="flex flex-col h-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 w-fit px-2.5 py-1 rounded-lg mb-4 transition-colors">{p.category}</span>
                  <h5 className="text-lg font-black text-slate-900 dark:text-white mb-1 transition-colors">{p.name}</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-6 transition-colors">Iniziato: {p.started_at}</p>
                  <div className="mt-auto">
                    <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                      <span className="text-slate-400">Progresso</span>
                      <span className="text-indigo-600 dark:text-indigo-400">{p.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden transition-colors">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full" style={{ width: `${p.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )) : (
              <div className="col-span-2 py-20 text-center glass-panel rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-slate-400 font-bold">Nessun progetto attivo</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight transition-colors">Attività Recenti</h4>
          <div className="glass-panel p-8 rounded-[2rem] relative border border-white/40 bg-white/40 dark:bg-slate-800/40 transition-colors">
            <div className="absolute left-[47px] top-12 bottom-12 w-0.5 bg-slate-100 dark:bg-slate-700 transition-colors"></div>
            <ul className="space-y-8 relative">
              <li className="flex gap-4 group">
                <div className="relative z-10 w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center ring-4 ring-white dark:ring-slate-800 shadow-lg group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-white text-lg">add</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h6 className="text-sm font-black text-slate-900 dark:text-white transition-colors">Workspace Pronto</h6>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Live</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">Il sistema è sincronizzato.</p>
                </div>
              </li>
              {tasks.slice(0, 3).map(task => (
                 <li key={task.id} className="flex gap-4 group">
                    <div className={`relative z-10 w-10 h-10 rounded-full ${task.status === 'Completati' ? 'bg-emerald-500' : 'bg-amber-500'} flex items-center justify-center ring-4 ring-white dark:ring-slate-800 shadow-lg group-hover:scale-110 transition-transform`}>
                      <span className="material-symbols-outlined text-white text-lg">{task.status === 'Completati' ? 'check' : 'pending'}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h6 className="text-sm font-black text-slate-900 dark:text-white transition-colors truncate max-w-[120px]">{task.title}</h6>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Oggi</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium transition-colors">{task.status}</p>
                    </div>
                 </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
