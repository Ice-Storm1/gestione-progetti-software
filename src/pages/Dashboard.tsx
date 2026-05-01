import React from 'react';
import { useAppContext } from '../context/AppContext';

const Dashboard: React.FC = () => {
  const { projects, tasks } = useAppContext();

  const stats = [
    { label: 'Task Totali', value: tasks.length, change: '+12%', color: 'indigo', icon: 'assignment', progress: 65 },
    { label: 'Completate', value: tasks.filter(t => t.status === 'Completato').length, change: '+5%', color: 'emerald', icon: 'check_circle', progress: 80 },
    { label: 'In Corso', value: tasks.filter(t => t.status === 'In corso').length, change: '-2%', color: 'amber', icon: 'pending', progress: 45 },
    { label: 'Bloccate', value: tasks.filter(t => t.status === 'Bloccato').length, change: 'Stabile', color: 'rose', icon: 'block', progress: 20 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-on-background tracking-tight">Dashboard Operativa</h1>
          <p className="text-lg text-slate-500 mt-1">Bentornato, ecco il riepilogo delle attività odierne.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-panel p-6 rounded-2xl flex flex-col justify-between group hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${
                stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
              }`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' :
                stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' :
                stat.color === 'amber' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
              }`}>{stat.change}</span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-3xl font-extrabold text-slate-900">{stat.value}</h3>
            </div>
            <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  stat.color === 'indigo' ? 'bg-indigo-500' :
                  stat.color === 'emerald' ? 'bg-emerald-500' :
                  stat.color === 'amber' ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${stat.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-2xl font-bold text-on-background">Progetti Recenti</h4>
            <button className="text-sm font-semibold text-indigo-600 hover:underline">Vedi Tutti</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.slice(0, 3).map((project) => (
              <div key={project.id} className="glass-panel p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden relative">
                <div className="flex flex-col h-full">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-500 bg-indigo-50 w-fit px-2 py-0.5 rounded-md mb-3">{project.category}</span>
                  <h5 className="text-lg font-bold text-slate-900 mb-1">{project.name}</h5>
                  <p className="text-xs text-slate-500 mb-6 line-clamp-2">{project.description}</p>
                  <div className="mt-auto">
                    <div className="flex justify-between text-xs font-bold mb-2">
                      <span className="text-slate-700">Progresso</span>
                      <span className="text-indigo-600">{project.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-2xl font-bold text-on-background">Attività Recenti</h4>
          <div className="glass-panel p-6 rounded-2xl relative">
            <div className="absolute left-[39px] top-8 bottom-8 w-px bg-slate-200"></div>
            <ul className="space-y-8 relative">
              <li className="flex gap-4">
                <div className="relative z-10 w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center ring-4 ring-white">
                  <span className="material-symbols-outlined text-white text-sm">add</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h6 className="text-sm font-bold text-slate-900">Nuovo progetto</h6>
                    <span className="text-[10px] text-slate-400 uppercase font-medium">Oggi</span>
                  </div>
                  <p className="text-xs text-slate-500">Iniziato Brand Identity 2024</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="relative z-10 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center ring-4 ring-white">
                  <span className="material-symbols-outlined text-white text-sm">check</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <h6 className="text-sm font-bold text-slate-900">Task completato</h6>
                    <span className="text-[10px] text-slate-400 uppercase font-medium">Ieri</span>
                  </div>
                  <p className="text-xs text-slate-500">Correzione bug checkout mobile</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
