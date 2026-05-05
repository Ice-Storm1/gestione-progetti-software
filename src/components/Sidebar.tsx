import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navItems = [
    { to: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/projects', icon: 'folder_managed', label: 'Progetti' },
    { to: '/kanban', icon: 'route', label: 'Roadmap' },
    { to: '/calendar', icon: 'calendar_today', label: 'Calendario' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] border-r border-outline-variant/20 bg-surface/65 backdrop-blur-xl flex flex-col p-6 z-40 hidden md:flex">
      <div className="mb-10 flex flex-col items-start gap-1">
        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.href='/'}>
          <div className="w-8 h-8 flex items-center justify-center transition-transform group-hover:scale-110">
            <svg viewBox="0 0 57.14 50.4" className="w-full h-full fill-[#00B7DD]">
              <path d="M 19.44 41.256 L 28.44 41.256 L 24.12 50.4 L 33.12 50.4 L 56.88 0 L 47.88 0 L 28.44 41.256 L 9 0 L 0 0 Z" />
            </svg>
          </div>
          <span className="text-2xl font-black text-[#00B7DD] tracking-tighter group-hover:text-blue-400 transition-colors">Velkron</span>
        </div>
        <p className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60 font-black px-1">Elite Management</p>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-primary font-bold border-l-4 border-primary'
                  : 'text-on-surface-variant hover:bg-white/40 dark:hover:bg-slate-800/40 hover:text-on-surface'
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-outline-variant/20 space-y-2">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all duration-300 ${
              isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:bg-white/40 dark:hover:bg-slate-800/40'
            }`
          }
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-medium">Impostazioni</span>
        </NavLink>
        <NavLink
          to="/support"
          className={({ isActive }) =>
            `flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all duration-300 ${
              isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:bg-white/40 dark:hover:bg-slate-800/40'
            }`
          }
        >
          <span className="material-symbols-outlined">help</span>
          <span className="font-medium">Supporto</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
