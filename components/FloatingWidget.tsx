
import React, { useState, useEffect, useRef } from 'react';
import { Task, Habit, Decision } from '../types';
import { 
  Circle, Clock, X, Terminal, 
  Minus, Zap, Target, Scale, Layout,
  ShieldCheck
} from 'lucide-react';

interface FloatingWidgetProps {
  tasks: Task[];
  habits: Habit[];
  decisions: Decision[];
  onToggleTask: (id: string) => void;
  onClose: () => void;
  onLaunch: () => void;
  position: { x: number; y: number };
  onPositionChange: (pos: { x: number; y: number }) => void;
  opacity: number;
}

const FloatingWidget: React.FC<FloatingWidgetProps> = ({ 
  tasks, habits, decisions, onToggleTask, onClose, onLaunch, position, onPositionChange, opacity
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);

  const activeTasks = tasks.filter(t => !t.completed);
  const pendingDecisions = decisions.filter(d => !d.reviewed);
  const timedTasks = tasks.filter(t => t.timerEnd && t.timerEnd > Date.now() && !t.completed);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      onPositionChange({ 
        x: dragRef.current.startPosX + (e.clientX - dragRef.current.startX), 
        y: dragRef.current.startPosY + (e.clientY - dragRef.current.startY) 
      });
    };
    const handleMouseUp = () => { setIsDragging(false); dragRef.current = null; };
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, position, onPositionChange]);

  return (
    <div className="fixed z-[9999] select-none pointer-events-auto" style={{ left: position.x, top: position.y, opacity: opacity }}>
      <div className={`flex flex-col bg-black border-2 border-[var(--accent)] transition-all duration-300 shadow-[0_0_80px_rgba(0,0,0,1)] ${isExpanded ? 'w-80 rounded-[2.5rem]' : 'w-16 h-16 rounded-full items-center justify-center'}`}>
        
        {/* Header / Drag Control */}
        <div onMouseDown={handleMouseDown} className={`flex items-center justify-between px-6 py-4 cursor-grab active:cursor-grabbing bg-zinc-950 border-b border-zinc-900 ${isExpanded ? 'rounded-t-[2.5rem]' : 'hidden'}`}>
          <div className="flex items-center gap-3">
             <button onClick={onLaunch} className="w-5 h-5 border-2 border-white flex items-center justify-center hover:bg-white hover:text-black transition-all group" title="Launch System">
                <div className="w-1.5 h-1.5 bg-current"></div>
             </button>
             <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white">System Deck</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setIsExpanded(false)} className="p-1 text-zinc-600 hover:text-white"><Minus size={14} /></button>
            <button onClick={onClose} className="p-1 text-zinc-600 hover:text-white"><X size={14} /></button>
          </div>
        </div>

        {!isExpanded ? (
          <button onClick={() => setIsExpanded(true)} className="w-full h-full flex items-center justify-center text-white hover:scale-110 transition-transform bg-black border-2 border-white rounded-full p-4">
             <div className="w-4 h-4 bg-white animate-pulse"></div>
          </button>
        ) : (
          <div className="flex-1 overflow-hidden p-6 space-y-6 max-h-[600px] flex flex-col">
            
            {/* Real-time Status */}
            <div className="grid grid-cols-2 gap-2">
               <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-600"><Target size={12}/> <span className="text-[8px] font-black uppercase">Load</span></div>
                  <span className="text-[10px] font-black text-white">{activeTasks.length}</span>
               </div>
               <div className="p-3 bg-zinc-950 border border-zinc-900 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-zinc-600"><Scale size={12}/> <span className="text-[8px] font-black uppercase">Logic</span></div>
                  <span className="text-[10px] font-black text-white">{pendingDecisions.length}</span>
               </div>
            </div>

            {/* Expiring Protocols */}
            {timedTasks.length > 0 && (
              <div className="space-y-2">
                <p className="text-[8px] font-black text-white uppercase tracking-widest border-l-2 border-white pl-2">Live Protocols</p>
                {timedTasks.map(task => <WidgetTimerItem key={task.id} task={task} />)}
              </div>
            )}

            {/* Persistent Backlog Feed */}
            <div className="flex-1 flex flex-col min-h-0 space-y-3">
               <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest border-l-2 border-zinc-900 pl-2">Operational Feed</p>
               <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pr-1">
                  {activeTasks.map(task => (
                    <div key={task.id} className="flex items-start gap-3 p-4 bg-zinc-950 border border-zinc-900 rounded-2xl hover:border-zinc-500 transition-all group">
                      <button onClick={() => onToggleTask(task.id)} className="mt-0.5 text-zinc-800 group-hover:text-white transition-colors"><Circle size={14} /></button>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-zinc-300 truncate uppercase font-bold tracking-tight">{task.text}</p>
                        {task.dueDate && <p className="text-[7px] text-zinc-700 font-black mt-1 uppercase tracking-widest">{task.dueDate}</p>}
                      </div>
                      {task.isPinned && <Zap size={10} className="text-white fill-white mt-1 shrink-0 animate-pulse" />}
                    </div>
                  ))}
                  {activeTasks.length === 0 && (
                    <div className="py-12 text-center space-y-3">
                      <ShieldCheck size={28} className="mx-auto text-zinc-900" />
                      <p className="text-[8px] text-zinc-800 font-black uppercase tracking-widest">System Clear</p>
                    </div>
                  )}
               </div>
            </div>

            {/* System Link Footer */}
            <div className="pt-4 border-t border-zinc-900 flex justify-between items-center mt-auto">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                <span className="text-[8px] font-black uppercase text-zinc-700 tracking-widest">OS Sync Active</span>
              </div>
              <button onClick={onLaunch} className="text-[8px] font-black uppercase text-zinc-500 hover:text-white tracking-widest flex items-center gap-1.5 transition-colors">
                 Open Terminal <Layout size={10} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const WidgetTimerItem: React.FC<{ task: Task }> = ({ task }) => {
  const [timeLeft, setTimeLeft] = useState('');
  useEffect(() => {
    const update = () => {
      const diff = (task.timerEnd || 0) - Date.now();
      if (diff <= 0) return setTimeLeft('00:00');
      setTimeLeft(`${Math.floor(diff/60000).toString().padStart(2,'0')}:${Math.floor((diff%60000)/1000).toString().padStart(2,'0')}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [task.timerEnd]);
  
  return (
    <div className="flex items-center justify-between p-4 bg-white text-black rounded-2xl font-mono text-[16px] font-black uppercase tracking-tighter shadow-2xl">
      <div className="flex items-center gap-3">
        <Clock size={16} />
        <span>{timeLeft}</span>
      </div>
      <span className="truncate max-w-[110px] text-[8px] tracking-[0.1em] font-black text-zinc-500 uppercase">{task.text}</span>
    </div>
  );
};

export default FloatingWidget;
