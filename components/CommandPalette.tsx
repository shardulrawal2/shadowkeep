
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Zap, CheckSquare, StickyNote, Target, Command, ArrowRight, CornerDownLeft } from 'lucide-react';
import { AppState, ViewMode, Task, Note, Decision } from '../types';

interface PaletteProps {
  data: AppState;
  onClose: () => void;
  onNavigate: (view: ViewMode) => void;
  onAction: (action: string) => void;
}

interface SearchResult {
  id: string;
  type: 'task' | 'note' | 'decision' | 'view';
  title: string;
  sub: string;
  relevance: number;
  action: () => void;
}

const CommandPalette: React.FC<PaletteProps> = ({ data, onClose, onNavigate, onAction }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const calculateRelevance = (source: string, term: string) => {
    const s = source.toLowerCase();
    const t = term.toLowerCase();
    if (s === t) return 100;
    if (s.startsWith(t)) return 50;
    if (s.includes(t)) return 20;
    return 0;
  };

  const results = useMemo(() => {
    if (!query) return [];

    const searchItems: SearchResult[] = [];

    // Views
    [
      { id: 'tasks', label: 'Go to Tasks', icon: 'view', view: 'tasks' as ViewMode },
      { id: 'notes', label: 'Go to Vault', icon: 'view', view: 'notes' as ViewMode },
      { id: 'habits', label: 'Go to Habits', icon: 'view', view: 'habits' as ViewMode },
      { id: 'focus', label: 'Start Focus Protocol', icon: 'view', action: () => onAction('focus') },
      { id: 'settings', label: 'Go to Settings', icon: 'view', view: 'settings' as ViewMode },
      { id: 'triage', label: 'Run Triage', icon: 'view', view: 'triage' as ViewMode }
    ].forEach(v => {
      const relevance = calculateRelevance(v.label, query);
      if (relevance > 0) {
        searchItems.push({
          id: v.id,
          type: 'view',
          title: v.label,
          sub: 'System Module',
          relevance: relevance + 1, // Slight bias for views
          action: v.action || (() => onNavigate(v.view!))
        });
      }
    });

    // Tasks
    data.tasks.forEach(t => {
      const rel = calculateRelevance(t.text, query);
      if (rel > 0) {
        searchItems.push({
          id: t.id,
          type: 'task',
          title: t.text,
          sub: t.completed ? 'Completed Task' : 'Active Objective',
          relevance: rel,
          action: () => { onNavigate('tasks'); onClose(); }
        });
      }
    });

    // Notes
    data.notes.forEach(n => {
      const titleRel = calculateRelevance(n.title, query);
      const contentRel = calculateRelevance(n.content, query) * 0.5;
      const rel = Math.max(titleRel, contentRel);
      if (rel > 0) {
        searchItems.push({
          id: n.id,
          type: 'note',
          title: n.title,
          sub: 'Vault Entry',
          relevance: rel,
          action: () => { onNavigate('notes'); onClose(); }
        });
      }
    });

    // Decisions
    data.decisions.forEach(d => {
      const rel = calculateRelevance(d.title, query);
      if (rel > 0) {
        searchItems.push({
          id: d.id,
          type: 'decision',
          title: d.title,
          sub: 'Decision Log',
          relevance: rel,
          action: () => { onNavigate('decisions'); onClose(); }
        });
      }
    });

    return searchItems.sort((a, b) => b.relevance - a.relevance).slice(0, 10);
  }, [query, data, onNavigate, onAction, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      results[selectedIndex]?.action();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-start justify-center pt-[10vh] px-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-[0_32px_128px_-16px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-zinc-900 flex items-center gap-4">
          <Search size={24} className="text-zinc-500" />
          <input 
            autoFocus 
            onKeyDown={handleKeyDown}
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            placeholder="Query entire matrix..." 
            className="bg-transparent border-none outline-none flex-1 text-zinc-100 font-bold text-xl uppercase tracking-tight"
          />
          <div className="px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-[9px] text-zinc-600 font-black">ESC</div>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-4 no-scrollbar">
          {query === '' ? (
            <div className="p-8 text-center space-y-4">
               <div className="w-12 h-12 border-2 border-zinc-900 flex items-center justify-center mx-auto rounded-lg">
                  <Command size={20} className="text-zinc-800" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Enter query to activate search</p>
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((res, idx) => (
                <button 
                  key={res.id} 
                  onClick={res.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group ${idx === selectedIndex ? 'bg-white text-black' : 'hover:bg-zinc-900 text-zinc-400'}`}
                >
                  <div className={`p-2 rounded-lg ${idx === selectedIndex ? 'bg-black text-white' : 'bg-zinc-900 text-zinc-500'}`}>
                    {res.type === 'task' && <CheckSquare size={16} />}
                    {res.type === 'note' && <StickyNote size={16} />}
                    {res.type === 'decision' && <Scale size={16} />}
                    {res.type === 'view' && <ArrowRight size={16} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-black uppercase tracking-tight truncate ${idx === selectedIndex ? 'text-black' : 'text-zinc-100'}`}>{res.title}</p>
                    <p className={`text-[9px] font-bold uppercase tracking-widest ${idx === selectedIndex ? 'text-zinc-600' : 'text-zinc-800'}`}>{res.sub}</p>
                  </div>
                  {idx === selectedIndex && (
                    <CornerDownLeft size={16} className="text-zinc-400" />
                  )}
                </button>
              ))}
              {results.length === 0 && (
                <div className="p-12 text-center opacity-40">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em]">Zero matches found</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 bg-zinc-950/80 border-t border-zinc-900 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[8px] text-zinc-500">↑↓</kbd>
                 <span className="text-[8px] text-zinc-700 font-black uppercase">Navigate</span>
              </div>
              <div className="flex items-center gap-2">
                 <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[8px] text-zinc-500">ENTER</kbd>
                 <span className="text-[8px] text-zinc-700 font-black uppercase">Select</span>
              </div>
           </div>
           <div className="flex items-center gap-2 text-zinc-800">
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Shadow Intelligence Link</span>
           </div>
        </div>
      </div>
    </div>
  );
};

const Scale = ({size}: {size: number}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h18"/></svg>
);

export default CommandPalette;
