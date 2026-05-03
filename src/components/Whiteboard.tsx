import React, { useRef, useEffect, useState } from 'react';
import { WhiteboardElement } from '../context/AppContext';
import rough from 'roughjs';

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
  const [currentPoints, setCurrentPoints] = useState<{x: number, y: number}[]>([]);
  const [startPoint, setStartPoint] = useState<{x: number, y: number} | null>(null);

  useEffect(() => {
    setLocalElements(elements);
  }, [elements]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const redraw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(0,0,0,0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
      }

      localElements.forEach(el => {
        try {
          const data = JSON.parse(el.text);
          const isEraser = data.color === '#ffffff';

          const roughOptions: any = {
            stroke: data.color,
            strokeWidth: data.width || 2,
            roughness: isEraser ? 0 : 1.2,
            bowing: isEraser ? 0 : 1,
            seed: parseInt(el.id) % 1000,
          };

          if (el.element_type === 'path') {
            if (data.points.length > 1) {
               rc.linearPath(data.points.map((p: any) => [p.x, p.y]), roughOptions);
            }
          } else if (el.element_type === 'rect') {
            rc.rectangle(data.x, data.y, data.w, data.h, roughOptions);
          } else if (el.element_type === 'circle') {
            const centerX = data.x + data.w / 2;
            const centerY = data.y + data.h / 2;
            const radius = Math.sqrt(data.w ** 2 + data.h ** 2) / 2;
            rc.circle(centerX, centerY, radius * 2, roughOptions);
          }
        } catch (e) {
          console.error("Redraw error", e);
        }
      });
    };

    redraw();
  }, [localElements]);

  const startDrawing = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setStartPoint({ x, y });

    if (tool === 'pen' || tool === 'eraser') {
      setCurrentPoints([{ x, y }]);
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        ctx.moveTo(x, y);
      }
    }
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !startPoint) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    if (tool === 'pen' || tool === 'eraser') {
      setCurrentPoints(prev => [...prev, { x, y }]);
      ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      ctx.lineWidth = tool === 'eraser' ? 25 : 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // Shape preview (optional, but let's keep it simple and just draw on stop for now
      // or we can add a basic preview)
    }
  };

  const stopDrawing = (e: React.MouseEvent) => {
    if (!isDrawing || !startPoint) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let newEl: WhiteboardElement | null = null;

    if (tool === 'pen' || tool === 'eraser') {
      newEl = {
        id: Date.now().toString(),
        x: 0, y: 0,
        element_type: 'path',
        text: JSON.stringify({
          color: tool === 'eraser' ? '#ffffff' : color,
          width: tool === 'eraser' ? 25 : 2,
          points: [...currentPoints, { x, y }]
        })
      };
    } else if (tool === 'rect') {
      newEl = {
        id: Date.now().toString(),
        x: Math.min(startPoint.x, x),
        y: Math.min(startPoint.y, y),
        element_type: 'rect',
        text: JSON.stringify({
          color: color,
          width: 2,
          x: Math.min(startPoint.x, x),
          y: Math.min(startPoint.y, y),
          w: Math.abs(x - startPoint.x),
          h: Math.abs(y - startPoint.y)
        })
      };
    } else if (tool === 'circle') {
       newEl = {
        id: Date.now().toString(),
        x: Math.min(startPoint.x, x),
        y: Math.min(startPoint.y, y),
        element_type: 'circle',
        text: JSON.stringify({
          color: color,
          width: 2,
          x: Math.min(startPoint.x, x),
          y: Math.min(startPoint.y, y),
          w: Math.abs(x - startPoint.x),
          h: Math.abs(y - startPoint.y)
        })
      };
    }

    if (newEl) {
      const updated = [...localElements, newEl];
      setLocalElements(updated);
      onSave(updated);
    }

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPoints([]);
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
