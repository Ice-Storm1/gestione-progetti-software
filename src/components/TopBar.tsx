import React from 'react';

const TopBar: React.FC = () => {
  return (
    <header className="fixed top-0 right-0 left-[280px] h-16 glass-panel flex justify-between items-center px-8 z-40">
      <div className="flex items-center gap-4 bg-white/40 px-4 py-2 rounded-full border border-white/20 w-96">
        <span className="material-symbols-outlined text-outline">search</span>
        <input
          className="bg-transparent border-none focus:ring-0 text-sm w-full outline-none"
          placeholder="Cerca progetti o task..."
          type="text"
        />
      </div>
      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-500 hover:bg-white/40 rounded-full transition-colors">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
        </button>
        <button className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all">
          Nuovo Progetto
        </button>
        <div className="w-10 h-10 rounded-xl overflow-hidden border-2 border-white shadow-sm cursor-pointer">
          <img
            alt="User profile"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAPfJENEnq64PmwAVYfqkLi6NLRihG5CBrJzx1l1tubeuNu1xJFO9RtYonE54ub9qvKhO_BI57aX4MeLSV2ZwF5KfY__fubFSNu_ElruSi-pXC9LAfDCXn_gI2tgXzC-EZ3NciXODVVd9vr11dXHIZ8ZvDqk63Loiyhik2r4-QlcifZRac1SgejTaLX9lCZt3Axry6wA8Mj8CeXVoO3KlSml_RqoCTek5Rw8JmOoHoEOg3yWgT1sqvbIp12E5p2NDrkNmfnQQb_z5v"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
