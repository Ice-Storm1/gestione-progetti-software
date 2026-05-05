import React from 'react';

const Support: React.FC = () => {
  const sections = [
    {
      title: 'Panoramica App',
      icon: 'dashboard',
      content: 'Protype è un workspace elite progettato per semplificare la gestione dei progetti e dei team con un approccio elegante e preciso. Utilizza tecnologie all\'avanguardia per garantire prestazioni fluide e una UX intuitiva.'
    },
    {
      title: 'Gestione Progetti',
      icon: 'folder_managed',
      content: 'Crea nuovi workspace, importa configurazioni JSON o esporta i tuoi progressi. Ogni progetto supporta l\'editing inline di titolo e descrizione tramite doppio click e un selettore di stato globale sempre visibile.'
    },
    {
      title: 'Tasks e Produttività',
      icon: 'assignment',
      content: 'Gestisci le attività con la vista a lista ottimizzata. Ogni riga è cliccabile per modificare istantaneamente dettagli, priorità e stato. Il monitoraggio del rischio integrato ti aiuta a prevenire colli di bottiglia.'
    },
    {
      title: 'Calendario Intelligente',
      icon: 'calendar_today',
      content: 'Pianifica visivamente i tuoi task. Clicca su qualsiasi giorno del mese per aggiungere rapidamente un\'attività programmata per quella data. Ispirato ai migliori standard di settore per la massima scalabilità.'
    },
    {
      title: 'Whiteboard Creativa',
      icon: 'draw',
      content: 'Usa lo spazio creativo integrato per fare brainstorming. Disegna schemi, diagrammi o annotazioni che rimangono salvate all\'interno del contesto del progetto.'
    }
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-3xl shadow-inner mb-4">
          <span className="material-symbols-outlined text-5xl">help_center</span>
        </div>
        <h1 className="text-5xl font-black text-on-surface tracking-tighter">Centro Supporto</h1>
        <p className="text-xl text-on-surface-variant font-medium max-w-2xl mx-auto leading-relaxed">
          Tutto quello che devi sapere per padroneggiare il tuo nuovo elite workspace.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, i) => (
          <div key={i} className="glass-panel p-8 rounded-[2.5rem] border border-outline-variant/20 hover:shadow-2xl transition-all group">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">{section.icon}</span>
              </div>
              <h3 className="text-2xl font-black text-on-surface">{section.title}</h3>
            </div>
            <p className="text-on-surface-variant leading-relaxed font-medium">
              {section.content}
            </p>
          </div>
        ))}
      </div>

      <footer className="glass-panel p-10 rounded-[3rem] border border-outline-variant/20 text-center bg-gradient-to-br from-indigo-500/5 to-purple-500/5">
        <h4 className="text-2xl font-black text-on-surface mb-2">Serve altro aiuto?</h4>
        <p className="text-on-surface-variant font-bold mb-6">Il nostro team di elite management è sempre a tua disposizione.</p>
        <button className="px-10 py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all active:scale-95">
          Contatta Supporto
        </button>
      </footer>
    </div>
  );
};

export default Support;
