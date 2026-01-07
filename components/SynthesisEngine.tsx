
import React, { useState } from 'react';
import { Task, Decision, Note } from '../types';
import { RefreshCcw, ArrowRight, Brain, BookOpen, CheckCircle2, Scale, Info } from 'lucide-react';
import { format } from 'date-fns';

interface SynthesisEngineProps {
  tasks: Task[];
  decisions: Decision[];
  onAddNote: (note: Partial<Note>) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onUpdateDecision: (id: string, updates: Partial<Decision>) => void;
}

const SynthesisEngine: React.FC<SynthesisEngineProps> = ({ 
  tasks, decisions, onAddNote, onUpdateTask, onUpdateDecision 
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [lesson, setLesson] = useState('');
  const [step, setStep] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const pendingTasks = tasks.filter(t => t.completed && !t.isSynthesized);
  const pendingDecisions = decisions.filter(d => !d.reviewed && (Date.now() - d.timestamp > 259200000));
  const currentItem = [...pendingTasks, ...pendingDecisions].find(i => i.id === selectedId);

  const completeSynthesis = () => {
    if (!currentItem || !lesson) return;
    const title = `Lesson: ${'text' in currentItem ? currentItem.text : currentItem.title}`;
    const content = `
      <h3>Synthesis Context</h3>
      <p>${'text' in currentItem ? (currentItem.assumption || 'No assumption stated.') : (currentItem.context || 'No context stated.')}</p>
      <h3>The Lesson</h3>
      <p>${lesson}</p>
      <h3>System Adjustment</h3>
      <p>Derived on ${format(new Date(), 'yyyy-MM-dd HH:mm')}</p>
    `;

    onAddNote({ title, content, isVaulted: false });
    if ('text' in currentItem) {
      onUpdateTask(currentItem.id, { isSynthesized: true });
    } else {
      onUpdateDecision(currentItem.id, { reviewed: true, actualOutcome: lesson });
    }
    setSelectedId(null);
    setLesson('');
    setStep(0);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 max-w-4xl mx-auto pb-20 relative">
      <header className="text-center space-y-4 relative">
        <button onClick={() => setShowInfo(!showInfo)} className="absolute top-0 right-0 p-2 text-zinc-800 hover:text-white transition-all"><Info size={20}/></button>
        <div className="w-20 h-20 bg-white mx-auto rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.2)]">
          <RefreshCcw size={40} className="text-black" />
        </div>
        <div>
          <h2 className="text-5xl font-black tracking-tighter uppercase mb-2">The Loop</h2>
          <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.4em]">Recursive Synthesis System</p>
        </div>
      </header>

      {showInfo && (
        <div className="bg-zinc-900 text-white p-8 rounded-[2rem] border border-zinc-800 space-y-4 animate-in slide-in-from-top-4">
          <h4 className="text-xs font-black uppercase tracking-widest">Metacognitive Intent: Wisdom Extraction</h4>
          <p className="text-sm leading-relaxed font-medium">
            Most productivity ends at "Done." <strong>The Loop</strong> ensures your effort is never wasted. By performing a post-mortem on completed tasks and decisions, you extract universal rules that improve your future process.
          </p>
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-t border-zinc-800 pt-4">
            Mechanism: Review original intent vs actual outcome. Distill the delta into a permanent Vault note.
          </div>
        </div>
      )}

      {!selectedId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-10 space-y-6">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-white" />
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Pending Closures ({pendingTasks.length})</h3>
            </div>
            <div className="space-y-3">
              {pendingTasks.slice(0, 5).map(t => (
                <button key={t.id} onClick={() => setSelectedId(t.id)} className="w-full text-left p-4 bg-black border border-zinc-800 rounded-xl hover:border-white transition-all text-xs font-bold uppercase tracking-tight text-zinc-400">
                  {t.text}
                </button>
              ))}
              {pendingTasks.length === 0 && <p className="text-center py-10 text-zinc-800 text-[10px] uppercase font-black tracking-widest">Synthesis Buffer Clear</p>}
            </div>
          </div>

          <div className="bg-zinc-950 border border-zinc-900 rounded-[2.5rem] p-10 space-y-6">
            <div className="flex items-center gap-3">
              <Scale size={24} className="text-white" />
              <h3 className="text-sm font-black uppercase tracking-widest text-white">Awaiting Post-Mortem ({pendingDecisions.length})</h3>
            </div>
            <div className="space-y-3">
              {pendingDecisions.slice(0, 5).map(d => (
                <button key={d.id} onClick={() => setSelectedId(d.id)} className="w-full text-left p-4 bg-black border border-zinc-800 rounded-xl hover:border-white transition-all text-xs font-bold uppercase tracking-tight text-zinc-400">
                  {d.title}
                </button>
              ))}
              {pendingDecisions.length === 0 && <p className="text-center py-10 text-zinc-800 text-[10px] uppercase font-black tracking-widest">Decision Vault Audited</p>}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white text-black rounded-[3rem] p-16 space-y-10 animate-in slide-in-from-bottom-10 shadow-2xl">
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Synthesizing</p>
            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">
              {'text' in currentItem! ? currentItem.text : currentItem!.title}
            </h3>
          </div>

          <div className="space-y-8">
            {step === 0 && (
              <div className="space-y-6 animate-in fade-in">
                <p className="text-xl font-bold italic leading-relaxed">
                  "What was the actual outcome compared to your strategic intent?"
                </p>
                <div className="p-6 bg-zinc-100 rounded-2xl">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">Original Intent</p>
                  <p className="text-sm font-medium">{'text' in currentItem! ? (currentItem.assumption || "No intent logged.") : currentItem!.context}</p>
                </div>
                <button onClick={() => setStep(1)} className="w-full bg-black text-white py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-all">Proceed to Abstraction</button>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-6 animate-in fade-in">
                <p className="text-xl font-bold leading-relaxed">Refine this into a universal rule. What did you learn about your process?</p>
                <textarea value={lesson} onChange={e => setLesson(e.target.value)} placeholder="The lesson is..." autoFocus className="w-full h-40 bg-zinc-100 p-8 rounded-2xl text-lg font-medium outline-none border-2 border-transparent focus:border-black transition-all resize-none" />
                <div className="flex gap-4">
                  <button onClick={() => setStep(0)} className="flex-1 border-2 border-zinc-200 py-6 rounded-2xl font-black uppercase text-xs tracking-widest">Back</button>
                  <button onClick={completeSynthesis} disabled={!lesson} className="flex-[2] bg-black text-white py-6 rounded-2xl font-black uppercase text-sm tracking-widest hover:scale-105 transition-all disabled:opacity-20">Commit to Vault</button>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-center gap-2">
            {[0, 1].map(i => <div key={i} className={`w-2 h-2 rounded-full ${step === i ? 'bg-black' : 'bg-zinc-200'}`} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default SynthesisEngine;
