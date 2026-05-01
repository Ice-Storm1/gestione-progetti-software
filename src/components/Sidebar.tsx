import React from 'react';
import { useAppContext } from '../context/AppContext';

const Sidebar: React.FC = () => {
  const { user } = useAppContext();

  const menuItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/' },
    { label: 'Progetti', icon: 'folder', path: '/projects' },
    { label: 'Task', icon: 'assignment', path: '/kanban' },
    { label: 'Calendario', icon: 'calendar_today', path: '/calendar' },
    { label: 'Impostazioni', icon: 'settings', path: '/settings' },
  ];

  const currentPath = window.location.pathname;

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] border-r border-white/20 bg-white/65 backdrop-blur-xl flex flex-col p-6 z-50">
      <div className="mb-10">
        <span className="text-3xl font-black bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tighter">Protype</span>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 px-1 font-bold">Elite Management</p>
      </div>
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <a
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-full transition-all duration-300 relative group ${
                isActive
                ? 'text-blue-700 bg-white/40 backdrop-blur-md font-semibold'
                : 'text-slate-600 opacity-80 hover:bg-white/30 hover:opacity-100'
              }`}
            >
              {isActive && (
                <span className="absolute left-0 w-1 h-2/3 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
              )}
              <span className={`material-symbols-outlined ${isActive ? 'text-blue-600' : 'group-hover:translate-x-0.5 transition-transform'}`}>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </a>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/20">
        <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/30 backdrop-blur-md border border-white/20">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden border border-white">
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="material-symbols-outlined text-blue-600">person</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">{user?.name || 'Utente'}</p>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{user?.role || 'Guest'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
