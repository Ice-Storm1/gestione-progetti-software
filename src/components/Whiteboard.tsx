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
      ctx.strokeStyle = 'rgba(0,0,0,0.03)';
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

    if (tool === 'pen' || tool === 'eraser') {
      const newEl: WhiteboardElement = {
        id: Date.now().toString(),
        x: 0, y: 0,
        element_type: 'path',
        text: JSON.stringify({ color: tool === 'eraser' ? '#ffffff' : color, width: tool === 'eraser' ? 20 : 3, points: [{ x, y }] })
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

    if (tool === 'pen' || tool === 'eraser') {
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
    <div className="w-full h-full bg-white relative flex flex-col z-0">
      {/* Excalidraw-like Toolbar */}
      <div className="absolute top-4 left-4 z-50 flex flex-col gap-4">
        <div className="flex gap-1 bg-white p-1 rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.1)] border border-slate-200">
          {[
            { id: 'pen', icon: 'edit' },
            { id: 'rect', icon: 'rectangle' },
            { id: 'circle', icon: 'circle' },
            { id: 'eraser', icon: 'ink_eraser' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTool(t.id as any)}
              className={`p-2.5 rounded-lg transition-all ${tool === t.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <span className="material-symbols-outlined text-lg">{t.icon}</span>
            </button>
          ))}
          <div className="w-px bg-slate-100 mx-1"></div>
          <button onClick={clear} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
            <span className="material-symbols-outlined text-lg">delete</span>
          </button>
        </div>

        <div className="flex flex-col gap-1 bg-white p-1 rounded-xl shadow-[0_2px_15px_rgba(0,0,0,0.1)] border border-slate-200 w-fit">
          {['#0058be', '#6b38d4', '#ba1a1a', '#22c55e', '#000000'].map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-lg border-2 transition-all ${color === c ? 'border-indigo-600 scale-105' : 'border-transparent hover:bg-slate-50'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="flex-1 cursor-crosshair touch-none bg-white"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
};

export default Whiteboard;
