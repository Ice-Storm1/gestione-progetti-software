import React, { useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { MOCK_PROJECTS } from '../mockData';

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: string;
  category: string;
  started_at: string;
  members_count: number;
}

const Dashboard: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);

  useEffect(() => {
    invoke<Project[]>('get_projects')
      .then(setProjects)
      .catch((err) => {
        console.error("Backend not available, using mock data", err);
      });
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-h1-display text-4xl font-bold text-on-background">Dashboard Operativa</h1>
          <p className="text-lg text-slate-500 mt-1">Bentornato, ecco il riepilogo delle attività odierne.</p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-indigo-500/20 active:scale-95 transition-all">
          <span className="material-symbols-outlined">add</span>
          Nuovo Progetto
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Task Totali', value: '124', change: '+12%', color: 'indigo', icon: 'assignment', progress: 65 },
          { label: 'Completate', value: '86', change: '+5%', color: 'emerald', icon: 'check_circle', progress: 80 },
          { label: 'In Corso', value: '24', change: '-2%', color: 'amber', icon: 'pending', progress: 45 },
          { label: 'Bloccate', value: '14', change: 'Stabile', color: 'rose', icon: 'block', progress: 20 },
        ].map((stat) => (
          <div key={stat.label} className="glass-panel p-6 rounded-2xl flex flex-col justify-between group hover:shadow-xl transition-all duration-300">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl text-${stat.color}-600 bg-${stat.color}-50`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <span className={`text-xs font-bold text-${stat.color}-600 bg-${stat.color}-50 px-2 py-1 rounded-full`}>{stat.change}</span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <h3 className="text-3xl font-extrabold text-slate-900">{stat.value}</h3>
            </div>
            <div className="mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full bg-${stat.color}-500 rounded-full`} style={{ width: `${stat.progress}%` }}></div>
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
            <div className="glass-panel p-6 rounded-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer border-dashed border-2 border-slate-300 bg-transparent flex flex-col items-center justify-center text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-2">add_circle</span>
              <p className="font-bold">Crea Nuovo Progetto</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h4 className="text-2xl font-bold text-on-background">Attività Recenti</h4>
          <div className="glass-panel p-6 rounded-2xl relative">
            <div className="absolute left-[39px] top-8 bottom-8 w-px bg-slate-200"></div>
            <ul className="space-y-8 relative">
              {[
                { label: 'Nuovo task creato', time: '10:45', desc: 'Approvazione Wireframe per Client-X', color: 'indigo-500', icon: 'add' },
                { label: 'Task completato', time: '09:12', desc: 'Correzione bug checkout mobile', color: 'emerald-500', icon: 'check' },
                { label: 'Modifica stato', time: 'Ieri', desc: '"Ricerca IconSet" spostato in Bloccate', color: 'amber-500', icon: 'history' },
              ].map((activity, i) => (
                <li key={i} className="flex gap-4">
                  <div className={`relative z-10 w-8 h-8 rounded-full bg-${activity.color} flex items-center justify-center ring-4 ring-white`}>
                    <span className="material-symbols-outlined text-white text-sm">{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h6 className="text-sm font-bold text-slate-900">{activity.label}</h6>
                      <span className="text-[10px] text-slate-400 uppercase font-medium">{activity.time}</span>
                    </div>
                    <p className="text-xs text-slate-500">{activity.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button className="w-full mt-8 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors">
              Visualizza Storico Completo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
