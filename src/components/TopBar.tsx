import React from 'react';
import { useAppContext } from '../context/AppContext';

interface TopBarProps {
  onNewProject: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onNewProject }) => {
  const { user } = useAppContext();

  return (
    <header className="fixed top-0 right-0 left-[280px] h-16 bg-white/65 backdrop-blur-xl border-b border-white/20 flex justify-between items-center px-8 z-40 shadow-sm">
      <div className="flex items-center gap-4 bg-white/40 px-4 py-2 rounded-full border border-white/20 w-96">
        <span className="material-symbols-outlined text-slate-400" style={{ fontSize: '20px' }}>search</span>
        <input
          className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
          placeholder="Cerca progetti o task..."
          type="text"
        />
      </div>
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-500 hover:bg-white/40 rounded-full transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <button
          onClick={onNewProject}
          className="bg-gradient-to-br from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
        >
          Nuovo Progetto
        </button>
        <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm cursor-pointer">
          <img
            alt="User profile"
            src={user?.avatar_url || "https://lh3.googleusercontent.com/a/default-user"}
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
