import React from 'react';

interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activePage, setActivePage }) => {
  const menuItems = [
    { id: 'dashboard', icon: 'dashboard', label: 'Dashboard' },
    { id: 'projects', icon: 'folder', label: 'Progetti' },
    { id: 'kanban', icon: 'assignment', label: 'Task' },
    { id: 'calendar', icon: 'calendar_today', label: 'Calendario' },
    { id: 'settings', icon: 'settings', label: 'Impostazioni' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] glass-panel flex flex-col p-6 z-50">
      <div className="mb-10">
        <span className="text-3xl font-black tracking-tighter bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Protype
        </span>
        <p className="text-[10px] uppercase tracking-widest text-outline mt-1 px-1 font-bold">Elite Management</p>
      </div>
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
              activePage === item.id
                ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-l-4 border-indigo-500 text-indigo-700 font-bold translate-x-1'
                : 'text-slate-500 hover:bg-indigo-50/50 hover:translate-x-1'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto pt-6 border-t border-white/20">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">person</span>
          </div>
          <div className="text-left">
            <p className="text-sm font-bold text-slate-900">Alessandro Rossi</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Project Lead</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
