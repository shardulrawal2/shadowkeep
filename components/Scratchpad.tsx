
import React, { useState, useRef, useEffect } from 'react';
import { X, Zap, Maximize2 } from 'lucide-react';
import { ScratchpadData } from '../types';

interface ScratchpadProps {
  data: ScratchpadData;
  onChange: (v: string) => void;
  onPositionChange: (x: number, y: number) => void;
  onResize: (w: number, h: number) => void;
  onClose: () => void;
}

const Scratchpad: React.FC<ScratchpadProps> = ({ data, onChange, onPositionChange, onResize, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);
  const resizeRef = useRef<{ startX: number; startY: number; startW: number; startH: number } | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && dragRef.current) {
        onPositionChange(dragRef.current.startPosX + (e.clientX - dragRef.current.startX), dragRef.current.startPosY + (e.clientY - dragRef.current.startY));
      }
      if (isResizing && resizeRef.current) {
        onResize(Math.max(200, resizeRef.current.startW + (e.clientX - resizeRef.current.startX)), Math.max(150, resizeRef.current.startH + (e.clientY - resizeRef.current.startY)));
      }
    };
    const handleMouseUp = () => { setIsDragging(false); setIsResizing(false); };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => { window.removeEventListener('mousemove', handleMouseMove); window.removeEventListener('mouseup', handleMouseUp); };
  }, [isDragging, isResizing]);

  return (
    <div 
      className="fixed z-[5000] bg-black border-2 border-white rounded-2xl shadow-2xl flex flex-col overflow-hidden" 
      style={{ left: data.x, top: data.y, width: data.w, height: data.h }}
    >
      <div 
        onMouseDown={(e) => { setIsDragging(true); dragRef.current = { startX: e.clientX, startY: e.clientY, startPosX: data.x, startPosY: data.y }; }}
        className="flex items-center justify-between p-4 bg-zinc-950 border-b border-zinc-900 cursor-grab active:cursor-grabbing shrink-0"
      >
        <div className="flex items-center gap-2 text-white">
          <Zap size={14} className="animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">Fleeting Buffer</span>
        </div>
        <button onClick={onClose} className="p-1 text-zinc-800 hover:text-white transition-colors"><X size={16} /></button>
      </div>
      <textarea 
        autoFocus
        value={data.content} 
        onChange={e => onChange(e.target.value)}
        className="flex-1 bg-transparent p-6 outline-none text-xs text-zinc-400 leading-relaxed resize-none font-medium selection:bg-white selection:text-black"
        placeholder="Raw cognitive input..."
      />
      <div 
        onMouseDown={(e) => { e.stopPropagation(); setIsResizing(true); resizeRef.current = { startX: e.clientX, startY: e.clientY, startW: data.w, startH: data.h }; }}
        className="absolute bottom-0 right-0 p-1 cursor-nwse-resize text-zinc-800 hover:text-white"
      >
        <Maximize2 size={12} className="rotate-90" />
      </div>
    </div>
  );
};

export default Scratchpad;
