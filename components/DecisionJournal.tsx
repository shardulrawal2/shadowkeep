
import React, { useState } from 'react';
import { Decision } from '../types';
import { Plus, X, Scale, Clock, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { format } from 'date-fns';

interface DecisionJournalProps {
  decisions: Decision[];
  onAdd: (decision: Decision) => void;
  onUpdate: (id: string, updates: Partial<Decision>) => void;
}

const DecisionJournal: React.FC<DecisionJournalProps> = ({ decisions, onAdd, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [newDecision, setNewDecision] = useState<Partial<Decision>>({
    title: '', context: '', expectedOutcome: '', confidence: 70
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDecision.title) return;
    const d: Decision = {
      id: Math.random().toString(36).substr(2, 9),
      title: newDecision.title!,
      context: newDecision.context || '',
      expectedOutcome: newDecision.expectedOutcome || '',
      confidence: newDecision.confidence || 70,
      timestamp: Date.now(),
      reviewed: false
    };
    onAdd(d);
    setIsAdding(false);
    setNewDecision({ title: '', context: '', expectedOutcome: '', confidence: 70 });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 relative">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black tracking-tighter uppercase mb-2">Decision Log</h2>
          <p className="text-zinc-600 text-xs font-medium tracking-wide">Objective logic preservation system.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowInfo(!showInfo)} className="p-2 text-zinc-800 hover:text-white transition-all"><Info size={20}/></button>
          <button onClick={() => setIsAdding(true)} className="bg-white text-black px-6 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2">
            <Plus size={16} /> Log Entry
          </button>
        </div>
      </header>

      {showInfo && (
        <div className="bg-zinc-900 border border-zinc-800 text-white p-8 rounded-[2rem] space-y-4 animate-in slide-in-from-top-4">
          <h4 className="text-xs font-black uppercase tracking-widest">Metacognitive Intent: De-biasing History</h4>
          <p className="text-sm leading-relaxed font-medium">
            We suffer from <em>hindsight bias</em>—believing we knew an outcome all along. By logging context, predictions, and confidence before you know the result, you freeze your logic in time.
          </p>
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-t border-zinc-800 pt-4">
            Mechanism: Wait 72 hours, then trigger an Outcome Audit to see the gap between your prediction and reality.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        {decisions.sort((a,b) => b.timestamp - a.timestamp).map(d => (
          <div key={d.id} className="bg-black border border-zinc-900 rounded-3xl p-10 hover:border-zinc-600 transition-all space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter">{d.title}</h3>
                <p className="text-[10px] text-zinc-700 font-black uppercase tracking-widest mt-1">
                  ID-{d.id.substr(0,4)} | {format(d.timestamp, 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-zinc-950 border border-zinc-900 rounded-full">
                <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span className="text-[10px] font-black uppercase text-white">{d.confidence}% CONFIDENCE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-800">Rationale & Context</p>
                <p className="text-sm text-zinc-400 italic leading-relaxed">"{d.context}"</p>
              </div>
              <div className="space-y-2">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-800">Predicted Outcome</p>
                <p className="text-sm text-zinc-100 font-medium leading-relaxed">{d.expectedOutcome}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-900">
              {d.reviewed ? (
                <div className="space-y-4 animate-in fade-in">
                  <p className="text-[9px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                    <CheckCircle2 size={12} /> Post-Mortem Results
                  </p>
                  <p className="text-sm text-zinc-500 bg-zinc-950 p-6 rounded-2xl border border-zinc-900">{d.actualOutcome}</p>
                </div>
              ) : (
                <button 
                  onClick={() => {
                    const result = prompt('What was the actual outcome? Be objective.');
                    if (result) onUpdate(d.id, { reviewed: true, actualOutcome: result });
                  }}
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-800 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <AlertCircle size={14} /> Trigger Outcome Audit
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[500] bg-black/95 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in">
          <div className="w-full max-w-2xl bg-black border border-zinc-800 rounded-[3rem] p-12 space-y-8 relative shadow-2xl">
            <button onClick={() => setIsAdding(false)} className="absolute top-8 right-8 text-zinc-800 hover:text-white">
              <X size={32} />
            </button>
            <h3 className="text-4xl font-black uppercase tracking-tighter">Decision Capture</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <input placeholder="What choice are you making?" className="w-full bg-zinc-950 border border-zinc-900 p-6 rounded-2xl text-lg font-black uppercase outline-none focus:border-white transition-all" value={newDecision.title} onChange={e => setNewDecision({...newDecision, title: e.target.value})} />
              <textarea placeholder="Current context and reasoning..." className="w-full h-32 bg-zinc-950 border border-zinc-900 p-6 rounded-2xl text-sm outline-none focus:border-white transition-all resize-none" value={newDecision.context} onChange={e => setNewDecision({...newDecision, context: e.target.value})} />
              <input placeholder="What is the expected outcome?" className="w-full bg-zinc-950 border border-zinc-900 p-6 rounded-2xl text-sm outline-none focus:border-white transition-all" value={newDecision.expectedOutcome} onChange={e => setNewDecision({...newDecision, expectedOutcome: e.target.value})} />
              <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-800">
                  <span>Confidence Level</span>
                  <span>{newDecision.confidence}%</span>
                </div>
                <input type="range" min="1" max="100" value={newDecision.confidence} onChange={e => setNewDecision({...newDecision, confidence: parseInt(e.target.value)})} className="w-full accent-white" />
              </div>
              <button type="submit" className="w-full bg-white text-black py-6 rounded-2xl font-black uppercase text-sm tracking-widest shadow-lg active:scale-95 transition-all">Freeze Decision Protocol</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DecisionJournal;
