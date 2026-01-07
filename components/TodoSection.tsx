
import React, { useState, useEffect } from 'react';
import { Task, Project, SubTask } from '../types';
import { 
  Plus, Trash2, Circle, GripVertical, ChevronRight, ChevronDown, 
  Clock, Calendar, Check, X, Layers, Info, CheckCircle2, Zap
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';

interface TodoSectionProps {
  tasks: Task[];
  projects: Project[];
  onAddTask: (text: string, projectId?: string) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onAddProject: (name: string) => void;
}

const TodoSection: React.FC<TodoSectionProps> = ({ tasks, projects, onAddTask, onUpdateTask, onDeleteTask, onAddProject }) => {
  const [newTaskText, setNewTaskText] = useState('');
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

  const filteredTasks = selectedProject ? tasks.filter(t => t.projectId === selectedProject) : tasks;

  const toggleSubtask = (taskId: string, subId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const subtasks = task.subtasks.map(s => s.id === subId ? { ...s, completed: !s.completed } : s);
    onUpdateTask(taskId, { subtasks });
  };

  const addSubtask = (taskId: string) => {
    const text = prompt('Enter sub-objective:');
    if (!text) return;
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    const newSub: SubTask = { id: Math.random().toString(36).substr(2, 9), text, completed: false };
    onUpdateTask(taskId, { subtasks: [...task.subtasks, newSub] });
  };

  const startTimer = (taskId: string, minutes: number) => {
    const timerEnd = Date.now() + minutes * 60000;
    onUpdateTask(taskId, { timerEnd });
  };

  const clearTimer = (taskId: string) => {
    onUpdateTask(taskId, { timerEnd: null });
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto animate-in fade-in duration-500 pb-20 relative">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black tracking-tighter uppercase mb-2">Objectives</h2>
          <p className="text-zinc-600 text-xs font-medium tracking-wide">Command terminal.</p>
        </div>
        <div className="flex gap-2">
           <button onClick={() => setShowInfo(!showInfo)} className="p-2 text-zinc-800 hover:text-white transition-all"><Info size={20}/></button>
           <button onClick={() => { const n = prompt('Stack Name:'); if(n) onAddProject(n); }} className="bg-zinc-950 border border-zinc-900 p-2 rounded-lg text-zinc-600 hover:text-white"><Layers size={20}/></button>
        </div>
      </header>

      {showInfo && (
        <div className="bg-white text-black p-8 rounded-[2rem] space-y-4 animate-in slide-in-from-top-4">
          <p className="text-sm leading-relaxed font-bold italic">"Capture everything. Triage later. Focus now."</p>
        </div>
      )}

      <form onSubmit={e => { e.preventDefault(); if(newTaskText.trim()) onAddTask(newTaskText, selectedProject || undefined); setNewTaskText(''); }} className="bg-zinc-950 border border-zinc-900 p-1 rounded-xl flex gap-1 focus-within:border-white transition-all">
        <input value={newTaskText} onChange={e => setNewTaskText(e.target.value)} placeholder="Capture target..." className="bg-transparent flex-1 px-4 outline-none text-white text-sm" />
        <button type="submit" className="bg-white text-black px-6 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest">Capture</button>
      </form>

      <div className="space-y-4">
        {filteredTasks.filter(t => !t.completed).sort((a,b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)).map((task) => (
          <div key={task.id} className={`group bg-black border rounded-3xl overflow-hidden transition-all ${expandedTasks.includes(task.id) ? 'border-zinc-400' : 'border-zinc-900 hover:border-zinc-700'}`}>
            <div className="flex items-center gap-4 p-6">
              <button className="text-zinc-800 cursor-grab active:cursor-grabbing"><GripVertical size={16} /></button>
              <button onClick={() => onUpdateTask(task.id, { completed: true, completedAt: Date.now() })} className="text-zinc-800 hover:text-white"><Circle size={24} /></button>
              
              <div className="flex-1">
                {editingTaskId === task.id ? (
                  <input 
                    autoFocus 
                    value={task.text} 
                    onChange={e => onUpdateTask(task.id, { text: e.target.value })} 
                    onBlur={() => setEditingTaskId(null)}
                    onKeyDown={e => e.key === 'Enter' && setEditingTaskId(null)}
                    className="bg-transparent text-white border-b border-white outline-none w-full uppercase font-black"
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <p onClick={() => setEditingTaskId(task.id)} className="text-base font-black uppercase tracking-tight text-zinc-100 cursor-text">{task.text}</p>
                    {task.timerEnd && <LiveTimer timerEnd={task.timerEnd} onComplete={() => clearTimer(task.id)} />}
                  </div>
                )}
                {task.dueDate && <span className="text-[8px] font-black uppercase text-zinc-600 tracking-widest mt-1 block">Due: {task.dueDate}</span>}
              </div>

              <div className="flex items-center gap-2">
                <button onClick={() => setExpandedTasks(prev => prev.includes(task.id) ? prev.filter(x => x !== task.id) : [...prev, task.id])} className="text-zinc-800 p-2.5 hover:text-white">
                  {expandedTasks.includes(task.id) ? <ChevronDown size={22} /> : <ChevronRight size={22} />}
                </button>
                <button onClick={() => onDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 text-zinc-900 hover:text-red-500 p-2.5 transition-all"><Trash2 size={20} /></button>
              </div>
            </div>

            {expandedTasks.includes(task.id) && (
              <div className="bg-zinc-950 p-8 pt-0 pl-20 space-y-8 animate-in slide-in-from-top-2">
                
                {/* Tactical Scheduling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2"><Calendar size={12}/> Target Date</p>
                    <input 
                      type="date" 
                      value={task.dueDate || ''} 
                      onChange={e => onUpdateTask(task.id, { dueDate: e.target.value })}
                      className="w-full bg-black border border-zinc-900 p-3 rounded-xl text-xs text-white outline-none focus:border-white transition-all uppercase font-bold"
                    />
                  </div>
                  <div className="space-y-3">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2"><Clock size={12}/> Protocol Timer</p>
                    <div className="flex gap-2">
                      {[15, 25, 60].map(mins => (
                        <button 
                          key={mins}
                          onClick={() => startTimer(task.id, mins)}
                          className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${task.timerEnd ? 'border-zinc-900 text-zinc-700' : 'border-zinc-800 text-zinc-500 hover:border-white hover:text-white'}`}
                        >
                          {mins}M
                        </button>
                      ))}
                      {task.timerEnd && (
                        <button onClick={() => clearTimer(task.id)} className="p-2 border border-red-900 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sub-Objectives */}
                <div className="space-y-4">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-700 flex justify-between">
                    Sub-Objectives 
                    <button onClick={() => addSubtask(task.id)} className="text-white hover:underline">+ Add</button>
                  </p>
                  <div className="space-y-2">
                    {task.subtasks.map(s => (
                      <div key={s.id} className="flex items-center gap-3 p-3 bg-black border border-zinc-900 rounded-xl">
                        <button onClick={() => toggleSubtask(task.id, s.id)} className={s.completed ? 'text-white' : 'text-zinc-800'}>
                          {s.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                        </button>
                        <span className={`text-xs uppercase font-bold tracking-tight ${s.completed ? 'line-through text-zinc-700' : 'text-zinc-400'}`}>{s.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strategic Intent */}
                <div className="space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-700">Strategic Intent</p>
                  <textarea 
                    value={task.assumption || ''}
                    onChange={e => onUpdateTask(task.id, { assumption: e.target.value })}
                    placeholder="Describe the desired end-state..."
                    className="w-full bg-black border border-zinc-900 p-4 rounded-2xl text-xs text-zinc-400 outline-none focus:border-zinc-600 transition-all h-24 font-medium"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const LiveTimer: React.FC<{ timerEnd: number, onComplete: () => void }> = ({ timerEnd, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState('');
  
  useEffect(() => {
    const update = () => {
      const diff = timerEnd - Date.now();
      if (diff <= 0) {
        setTimeLeft('COMPLETE');
        return;
      }
      const m = Math.floor(diff / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [timerEnd]);

  return (
    <div className={`px-2 py-0.5 rounded text-[10px] font-black font-mono border ${timeLeft === 'COMPLETE' ? 'bg-white text-black border-white' : 'bg-zinc-900 text-white border-zinc-800 animate-pulse'}`}>
      {timeLeft}
    </div>
  );
};

export default TodoSection;
