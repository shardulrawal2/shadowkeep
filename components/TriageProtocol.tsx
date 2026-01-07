
import React, { useState } from 'react';
import { Task } from '../types';
import { ShieldAlert, Trash2, ArrowRight, Zap, Target, Users, Clock, CheckCircle2, Info } from 'lucide-react';
import { differenceInDays } from 'date-fns';

interface TriageProtocolProps {
  tasks: Task[];
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onFinish: () => void;
}

const TriageProtocol: React.FC<TriageProtocolProps> = ({ tasks, onUpdateTask, onDeleteTask, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const activeTasks = tasks.filter(t => !t.completed);
  const currentTask = activeTasks[currentIndex];

  const handleAction = (action: 'do' | 'defer' | 'delegate' | 'delete') => {
    if (!currentTask) return;
    switch (action) {
      case 'delete': onDeleteTask(currentTask.id); break;
      case 'do': onUpdateTask(currentTask.id, { isPinned: true }); break;
      case 'delegate': onUpdateTask(currentTask.id, { assumption: (currentTask.assumption || '') + '\n[DELEGATED]' }); break;
      case 'defer': onUpdateTask(currentTask.id, { order: currentTask.order + 10 }); break;
    }
    if (currentIndex < activeTasks.length - 1) setCurrentIndex(currentIndex + 1);
    else onFinish();
  };

  if (!currentTask) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
        <CheckCircle2 size={64} className="text-white animate-bounce" />
        <h2 className="text-4xl font-black uppercase tracking-tighter">Backlog Sanitized</h2>
        <button onClick={onFinish} className="bg-white text-black px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest">Return to Base</button>
      </div>
    );
  }

  const age = differenceInDays(Date.now(), currentTask.createdAt);

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in zoom-in duration-500 relative">
      <header className="flex items-center justify-between border-b border-zinc-900 pb-8">
        <div className="flex items-center gap-3">
          <ShieldAlert size={24} className="text-white" />
          <h2 className="text-2xl font-black uppercase tracking-tighter">Triage Protocol</h2>
        </div>
        <div className="flex items-center gap-6">
          <button onClick={() => setShowInfo(!showInfo)} className="p-2 text-zinc-800 hover:text-white transition-all"><Info size={20}/></button>
          <div className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Item {currentIndex + 1} / {activeTasks.length}</div>
        </div>
      </header>

      {showInfo && (
        <div className="bg-zinc-900 border border-zinc-800 text-white p-8 rounded-[2rem] space-y-4 animate-in slide-in-from-top-4">
          <h4 className="text-xs font-black uppercase tracking-widest">Metacognitive Intent: Eliminating Choice Paralysis</h4>
          <p className="text-sm leading-relaxed font-medium">
            Overloaded backlogs create <em>cognitive friction</em>. Triage forces binary decisions on your backlog. Process items quickly to clear mental bandwidth.
          </p>
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-t border-zinc-800 pt-4">
            Mechanism: Eisenhower Matrix. Decide what to Prioritize, Defer, Delegate, or Purge immediately.
          </div>
        </div>
      )}

      <div className="bg-zinc-950 border-2 border-white rounded-[3rem] p-16 space-y-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-[8px] font-black uppercase tracking-[0.5em] text-zinc-900">Inertia: {age} Days</div>
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600">Captured Objective</p>
          <h3 className="text-4xl font-black uppercase tracking-tight leading-none text-white">{currentTask.text}</h3>
        </div>
        {currentTask.assumption && (
          <div className="p-6 bg-black border border-zinc-900 rounded-2xl italic text-sm text-zinc-500">"{currentTask.assumption}"</div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ActionButton onClick={() => handleAction('do')} label="Pin as Primary" sub="Important & Urgent" icon={<Zap size={20}/>} color="bg-white text-black" />
        <ActionButton onClick={() => handleAction('defer')} label="Defer to Future" sub="Important / Not Urgent" icon={<Clock size={20}/>} color="bg-zinc-900 text-white" />
        <ActionButton onClick={() => handleAction('delegate')} label="Mark Delegate" sub="Urgent / Low Impact" icon={<Users size={20}/>} color="bg-zinc-900 text-white" />
        <ActionButton onClick={() => handleAction('delete')} label="Purge Objective" sub="Zero Value / Distraction" icon={<Trash2 size={20}/>} color="bg-red-950/20 text-red-500 border-red-900/50" />
      </div>

      <button onClick={onFinish} className="w-full text-center text-zinc-800 text-[10px] font-black uppercase tracking-[0.4em] pt-8 hover:text-white transition-colors">Abstain & Exit</button>
    </div>
  );
};

const ActionButton = ({ onClick, label, sub, icon, color }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center justify-center gap-3 p-10 rounded-3xl border border-zinc-900 hover:scale-[1.02] active:scale-95 transition-all group ${color}`}>
    {icon}
    <div className="text-center">
      <p className="text-xs font-black uppercase tracking-widest mb-1">{label}</p>
      <p className="text-[8px] font-black uppercase tracking-widest opacity-40">{sub}</p>
    </div>
  </button>
);

export default TriageProtocol;
