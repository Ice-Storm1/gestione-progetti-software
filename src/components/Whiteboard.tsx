import React, { useState, useRef, useEffect } from 'react';
import { WhiteboardElement } from '../context/AppContext';

interface WhiteboardProps {
  elements: WhiteboardElement[];
  onSave: (elements: WhiteboardElement[]) => void;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ elements, onSave }) => {
  const [localElements, setLocalElements] = useState<WhiteboardElement[]>(elements);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalElements(elements);
  }, [elements]);

  const handleAddElement = (type: 'sticky' | 'node') => {
    const newElement: WhiteboardElement = {
      id: Math.random().toString(36).substr(2, 9),
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      text: type === 'sticky' ? 'Nuova nota...' : 'Nuovo nodo...',
      element_type: type
    };
    const updated = [...localElements, newElement];
    setLocalElements(updated);
    onSave(updated);
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    const el = localElements.find(e => e.id === id);
    if (!el) return;
    setDraggingId(id);
    setOffset({
      x: e.clientX - el.x,
      y: e.clientY - el.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId) return;
    const updated = localElements.map(el => {
      if (el.id === draggingId) {
        return {
          ...el,
          x: e.clientX - offset.x,
          y: e.clientY - offset.y
        };
      }
      return el;
    });
    setLocalElements(updated);
  };

  const handleMouseUp = () => {
    if (draggingId) {
      onSave(localElements);
      setDraggingId(null);
    }
  };

  const handleTextChange = (id: string, text: string) => {
    const updated = localElements.map(el => el.id === id ? { ...el, text } : el);
    setLocalElements(updated);
    onSave(updated);
  };

  const handleDelete = (id: string) => {
    const updated = localElements.filter(el => el.id !== id);
    setLocalElements(updated);
    onSave(updated);
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full bg-white relative overflow-hidden glass-grid cursor-crosshair select-none"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* SVG Background Lines (Simplified mock connectors) */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full opacity-10">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Toolbar */}
      <div className="absolute top-6 left-6 z-10 flex flex-col gap-2">
        <div className="glass-panel p-2 rounded-2xl border border-slate-200 shadow-xl flex flex-col gap-1 backdrop-blur-3xl bg-white/90">
          <button
            onClick={() => handleAddElement('sticky')}
            title="Aggiungi Sticky Note"
            className="p-3 text-amber-600 hover:bg-amber-50 rounded-xl transition-all"
          >
            <span className="material-symbols-outlined text-3xl">sticky_note_2</span>
          </button>
          <button
            onClick={() => handleAddElement('node')}
            title="Aggiungi Nodo"
            className="p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
          >
            <span className="material-symbols-outlined text-3xl">account_tree</span>
          </button>
        </div>
      </div>

      {/* Elements */}
      {localElements.map((el) => (
        <div
          key={el.id}
          style={{
            left: `${el.x}px`,
            top: `${el.y}px`,
            cursor: draggingId === el.id ? 'grabbing' : 'grab'
          }}
          className={`absolute p-4 transition-shadow group ${
            el.element_type === 'sticky'
              ? 'w-60 h-60 bg-yellow-100 shadow-lg rotate-1 flex flex-col'
              : 'min-w-[200px] glass-panel rounded-2xl border-2 border-indigo-500/30'
          } ${draggingId === el.id ? 'shadow-2xl scale-105 z-50' : 'z-10 shadow-md hover:shadow-xl'}`}
          onMouseDown={(e) => handleMouseDown(e, el.id)}
        >
          <button
            onClick={() => handleDelete(el.id)}
            className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg flex items-center justify-center z-20"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>

          {el.element_type === 'sticky' ? (
            <textarea
              value={el.text}
              onChange={(e) => handleTextChange(el.id, e.target.value)}
              className="w-full h-full bg-transparent border-none resize-none outline-none font-medium text-slate-700 leading-relaxed text-lg"
              onMouseDown={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-indigo-600 border-b border-indigo-100 pb-2">
                <span className="material-symbols-outlined text-lg">bolt</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Process Node</span>
              </div>
              <input
                type="text"
                value={el.text}
                onChange={(e) => handleTextChange(el.id, e.target.value)}
                className="w-full bg-transparent border-none outline-none font-black text-slate-800 text-lg tracking-tight"
                onMouseDown={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>
      ))}

      {/* Minimap Mock */}
      <div className="absolute bottom-6 right-6 w-48 h-32 glass-panel rounded-2xl border border-slate-200 shadow-2xl opacity-50 pointer-events-none overflow-hidden">
        <div className="relative w-full h-full p-2">
          {localElements.map(el => (
            <div
              key={el.id}
              className={`absolute rounded-sm ${el.element_type === 'sticky' ? 'bg-yellow-400' : 'bg-indigo-400'}`}
              style={{
                left: `${(el.x / 2000) * 100}%`,
                top: `${(el.y / 2000) * 100}%`,
                width: '10px',
                height: '10px'
              }}
            />
          ))}
          <span className="absolute top-1 left-2 text-[8px] font-black uppercase text-slate-400">Whiteboard Canvas</span>
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
