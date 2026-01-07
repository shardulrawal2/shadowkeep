
import React, { useState } from 'react';
import { Task, Habit, ClarityLog } from '../types';
import { TrendingUp, Activity, CheckCircle, Zap, Brain, AlertTriangle, Layers, Info } from 'lucide-react';
import { format, differenceInHours, getHours } from 'date-fns';

interface FlowAuditProps {
  tasks: Task[];
  habits: Habit[];
  clarityLogs: ClarityLog[];
}

const FlowAudit: React.FC<FlowAuditProps> = ({ tasks, habits, clarityLogs }) => {
  const [showInfo, setShowInfo] = useState(false);
  const totalCompleted = tasks.filter(t => t.completed).length;
  const activeCount = tasks.filter(t => !t.completed).length;
  const velocity = totalCompleted > 0 ? (totalCompleted / (tasks.length || 1) * 100).toFixed(0) : 0;
  const totalHabitLogs = habits.reduce((acc, h) => acc + h.history.length, 0);
  const staleTasks = tasks.filter(t => !t.completed && differenceInHours(Date.now(), t.createdAt) > 72);
  const recentClarity = clarityLogs.slice(-10);
  const avgClarity = recentClarity.length > 0 ? (recentClarity.reduce((acc, l) => acc + l.level, 0) / recentClarity.length).toFixed(1) : "N/A";
  const clarityByHour = Array(24).fill(0).map((_, i) => {
    const logsInHour = clarityLogs.filter(l => getHours(l.timestamp) === i);
    if (logsInHour.length === 0) return 0;
    return logsInHour.reduce((acc, l) => acc + l.level, 0) / logsInHour.length;
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 relative">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black tracking-tighter uppercase mb-2">Flow Audit</h2>
          <p className="text-zinc-600 text-xs font-medium tracking-wide">Cognitive performance analysis.</p>
        </div>
        <button onClick={() => setShowInfo(!showInfo)} className="p-2 text-zinc-800 hover:text-white transition-all"><Info size={24}/></button>
      </header>

      {showInfo && (
        <div className="bg-zinc-900 border border-zinc-800 text-white p-8 rounded-[2rem] space-y-4 animate-in slide-in-from-top-4">
          <h4 className="text-xs font-black uppercase tracking-widest">Metacognitive Intent: Bio-Strategic Feedback</h4>
          <p className="text-sm leading-relaxed font-medium">
            Efficiency is a byproduct of clarity. The <strong>Biological Prime Time</strong> heatmap shows when you are naturally most focused. Align your hardest tasks with these high-intensity blocks. <strong>Inertia Tracking</strong> warns you when tasks are becoming psychological "rust."
          </p>
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-t border-zinc-800 pt-4">
            Mechanism: Clarity Pulse data is aggregated by hour to reveal your circadian focus rhythms.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Velocity" value={`${velocity}%`} subText={`${totalCompleted} closed`} icon={<TrendingUp size={20} />} />
        <StatCard label="Consistency" value={totalHabitLogs.toString()} subText="Ritual units" icon={<Activity size={20} />} />
        <StatCard label="Mental Clarity" value={avgClarity} subText="Avg Intensity" icon={<Brain size={20} />} />
        <StatCard label="Active Load" value={activeCount.toString()} subText="Pending" icon={<Zap size={20} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-black border border-zinc-900 rounded-[3rem] p-12 space-y-8">
             <h3 className="text-sm font-black uppercase tracking-[0.4em] flex items-center gap-2"><Layers size={18} className="text-white" /> Biological Prime Time</h3>
             <div className="flex items-end justify-between h-40 gap-1 px-4">
                {clarityByHour.map((lvl, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-help">
                    <div className="w-full bg-white/10 hover:bg-white transition-all rounded-t-sm" style={{ height: `${lvl * 20}%` }} />
                    <span className="text-[7px] font-black text-zinc-800 uppercase tracking-tighter hidden group-hover:block">{i}H</span>
                  </div>
                ))}
             </div>
             <p className="text-[9px] text-zinc-800 font-black uppercase text-center tracking-[0.2em]">Intensity Profile (00:00 - 23:59)</p>
          </div>
          <div className="bg-black border border-zinc-900 rounded-[3rem] p-12 space-y-8">
             <h3 className="text-sm font-black uppercase tracking-[0.4em] flex items-center gap-2"><CheckCircle size={18} className="text-white" /> Closure History</h3>
             <div className="space-y-6">
               {tasks.filter(t => t.completed).slice(-5).reverse().map((task) => (
                 <div key={task.id} className="flex items-center justify-between border-b border-zinc-900 pb-6 last:border-0">
                   <div>
                     <p className="text-sm font-black uppercase tracking-tight text-white">{task.text}</p>
                     <p className="text-[9px] text-zinc-700 font-black uppercase tracking-widest mt-1.5 flex items-center gap-2">ID-{task.id.substr(0,4)} {task.isSynthesized && <span className="bg-white text-black px-2 py-0.5 rounded text-[7px] uppercase">Synthesized</span>}</p>
                   </div>
                   <p className="text-[10px] text-zinc-600 font-mono">{format(task.createdAt, 'MM.dd.yy')}</p>
                 </div>
               ))}
               {totalCompleted === 0 && <p className="text-center text-zinc-900 py-20 font-black uppercase tracking-widest text-sm">Empty History</p>}
             </div>
          </div>
        </div>
        <div className="space-y-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[3rem] p-12 text-center space-y-6 border-l-4 border-l-red-900">
             <AlertTriangle size={32} className="mx-auto text-red-700" />
             <div>
               <h3 className="text-xl font-black uppercase tracking-tighter mb-2">Inertia Tracker</h3>
               <p className="text-[9px] text-zinc-600 uppercase tracking-widest">Targets stalled &gt;72 hours</p>
             </div>
             <div className="space-y-3">
                {staleTasks.slice(0, 3).map((t) => (
                  <div key={t.id} className="text-xs font-bold uppercase tracking-tight text-zinc-400 bg-black/50 p-3 rounded-xl border border-zinc-900">{t.text}</div>
                ))}
                {staleTasks.length === 0 && <p className="text-[9px] font-black uppercase text-zinc-800">No Stale Targets</p>}
             </div>
          </div>
          <div className="bg-black border border-zinc-900 rounded-[3rem] p-12 space-y-6">
             <h3 className="text-[10px] font-black uppercase tracking-widest text-white text-center">Clarity Pulse</h3>
             <div className="flex items-center justify-center gap-1">
                {clarityLogs.slice(-30).map((log, i) => (
                  <div key={i} className={`w-1 h-8 rounded-full ${log.level > 3 ? 'bg-white' : 'bg-zinc-900'}`} />
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, subText, icon }: any) => (
  <div className="bg-black border border-zinc-900 p-10 rounded-[2.5rem] hover:border-zinc-700 transition-all group overflow-hidden relative">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">{icon}</div>
    <div className="text-zinc-800 mb-8 group-hover:text-white transition-colors">{icon}</div>
    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 mb-2">{label}</p>
    <p className="text-5xl font-black tracking-tighter mb-4 text-white">{value}</p>
    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-800">{subText}</p>
  </div>
);

export default FlowAudit;
