import React, { useRef, useEffect, useState } from 'react';
import { WhiteboardElement } from '../context/AppContext';

interface WhiteboardProps {
  elements: WhiteboardElement[];
  onSave: (elements: WhiteboardElement[]) => void;
}

const Whiteboard: React.FC<WhiteboardProps> = ({ elements, onSave }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser' | 'rect' | 'circle'>('pen');
  const [color, setColor] = useState('#0058be');
  const [localElements, setLocalElements] = useState<WhiteboardElement[]>(elements);

  useEffect(() => {
    setLocalElements(elements);
  }, [elements]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas
    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 600;
      redraw();
    };

    const redraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Draw grid
      ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      localElements.forEach(el => {
        try {
          const data = JSON.parse(el.text);
          ctx.strokeStyle = data.color || '#000';
          ctx.lineWidth = data.width || 2;

          if (el.element_type === 'path') {
            ctx.beginPath();
            data.points.forEach((p: any, i: number) => {
              if (i === 0) ctx.moveTo(p.x, p.y);
              else ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
          } else if (el.element_type === 'rect') {
            ctx.strokeRect(data.x, data.y, data.w, data.h);
          } else if (el.element_type === 'circle') {
            ctx.beginPath();
            ctx.arc(data.x, data.y, data.r, 0, Math.PI * 2);
            ctx.stroke();
          }
        } catch (e) {}
      });
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [localElements]);

  const startDrawing = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setIsDrawing(true);

    if (tool === 'pen') {
      const newEl: WhiteboardElement = {
        id: Date.now().toString(),
        x: 0, y: 0,
        element_type: 'path',
        text: JSON.stringify({ color, width: 3, points: [{ x, y }] })
      };
      setLocalElements([...localElements, newEl]);
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'pen') {
      const last = localElements[localElements.length - 1];
      const data = JSON.parse(last.text);
      data.points.push({ x, y });
      const updated = [...localElements];
      updated[updated.length - 1] = { ...last, text: JSON.stringify(data) };
      setLocalElements(updated);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    onSave(localElements);
  };

  const clear = () => {
    setLocalElements([]);
    onSave([]);
  };

  return (
    <div className="w-full h-full bg-white relative flex flex-col">
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-white/80 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-slate-200">
        {[
          { id: 'pen', icon: 'edit' },
          { id: 'rect', icon: 'rectangle' },
          { id: 'circle', icon: 'circle' },
          { id: 'eraser', icon: 'ink_eraser' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTool(t.id as any)}
            className={`p-3 rounded-xl transition-all ${tool === t.id ? 'bg-primary text-white shadow-lg' : 'text-slate-400 hover:bg-slate-100'}`}
          >
            <span className="material-symbols-outlined">{t.icon}</span>
          </button>
        ))}
        <div className="w-px bg-slate-200 mx-2"></div>
        <button onClick={clear} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
          <span className="material-symbols-outlined">delete</span>
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="flex-1 cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />

      <div className="absolute bottom-6 left-6 z-20 glass-panel p-2 rounded-2xl flex gap-2 border border-slate-200 shadow-xl">
        {['#0058be', '#6b38d4', '#ba1a1a', '#22c55e', '#000000'].map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? 'border-primary scale-110' : 'border-transparent hover:scale-105'}`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>
    </div>
  );
};

export default Whiteboard;
