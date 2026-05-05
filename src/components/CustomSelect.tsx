import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: (string | Option)[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, label, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedOptions = options.map(opt =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find(opt => opt.value === value);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`} ref={containerRef}>
      {label && <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant px-1">{label}</label>}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full bg-surface/50 border border-outline-variant/30 rounded-2xl px-5 py-3.5 text-sm font-bold text-left flex items-center justify-between transition-all hover:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm ${isOpen ? 'ring-4 ring-primary/10 border-primary' : ''}`}
        >
          <span className={selectedOption ? 'text-on-surface' : 'text-on-surface-variant/60'}>
            {selectedOption ? selectedOption.label : (placeholder || 'Seleziona...')}
          </span>
          <span className={`material-symbols-outlined text-outline transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-outline-variant/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[200] overflow-hidden backdrop-blur-3xl"
            >
              <div className="max-h-60 overflow-y-auto py-2 custom-scrollbar relative z-[210]">
                {normalizedOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full px-5 py-3 text-sm font-bold text-left transition-colors flex items-center justify-between group ${opt.value === value ? 'bg-primary text-white' : 'text-on-surface hover:bg-surface'}`}
                  >
                    {opt.label}
                    {opt.value === value && <span className="material-symbols-outlined text-sm">check</span>}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomSelect;
