import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Sidebar: React.FC = () => {
  const { user, logout } = useAppContext();

  const menuItems = [
    { label: 'Dashboard', icon: 'dashboard', path: '/' },
    { label: 'Progetti', icon: 'folder_copy', path: '/projects' },
    { label: 'Task', icon: 'checklist', path: '/kanban' },
    { label: 'Calendario', icon: 'calendar_today', path: '/calendar' },
    { label: 'Impostazioni', icon: 'settings', path: '/settings' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] border-r border-white/20 bg-white/65 backdrop-blur-xl flex flex-col p-6 z-50">
      <div className="mb-10 px-2">
        <span className="text-3xl font-black bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tighter">Protype</span>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-black">Elite Workspace</p>
      </div>

      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 relative group
              ${isActive
                ? 'text-indigo-700 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-l-4 border-indigo-600 font-black'
                : 'text-slate-500 hover:bg-white/40 hover:text-slate-900'
              }
            `}
          >
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
              {item.icon}
            </span>
            <span className="text-sm tracking-tight">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/20">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/40 backdrop-blur-md border border-white/20 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center overflow-hidden border border-white shadow-inner">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-indigo-600">person</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-black text-slate-900 truncate leading-tight">{user?.name}</p>
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-tighter">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-error bg-error/5 hover:bg-error/10 transition-all border border-error/10 text-xs font-black uppercase tracking-widest"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
