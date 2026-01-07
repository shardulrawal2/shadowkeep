
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Layout from './components/Layout.tsx';
import TodoSection from './components/TodoSection.tsx';
import NoteSection from './components/NoteSection.tsx';
import HabitTracker from './components/HabitTracker.tsx';
import FocusMode from './components/FocusMode.tsx';
import FlowAudit from './components/FlowAudit.tsx';
import Codex from './components/Codex.tsx';
import DecisionJournal from './components/DecisionJournal.tsx';
import SynthesisEngine from './components/SynthesisEngine.tsx';
import TriageProtocol from './components/TriageProtocol.tsx';
import Scratchpad from './components/Scratchpad.tsx';
import FloatingWidget from './components/FloatingWidget.tsx';
import Settings from './components/Settings.tsx';
import CommandPalette from './components/CommandPalette.tsx';
import { ViewMode, Task, Note, AppState, ClarityLog, Decision, Project, ScratchpadData, SystemSettings, RecycleBinItem } from './types.ts';
import { storageService } from './services/storageService.ts';
import { notificationService } from './services/notificationService.ts';
import { ShieldAlert, BrainCircuit, X, Plus } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<AppState>(() => storageService.loadData());

  const [activeView, setActiveView] = useState<ViewMode>(data.settings?.defaultView || 'tasks');
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [advisorMessage, setAdvisorMessage] = useState<{title: string, body: string, target: ViewMode} | null>(null);
  const notifiedIds = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    storageService.saveData(data);
  }, [data]);

  // Clean up Recycle Bin (Items older than 15 days)
  useEffect(() => {
    const fifteenDaysInMs = 15 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    setData(prev => ({
      ...prev,
      recycleBin: (prev.recycleBin || []).filter(item => (now - item.deletedAt) < fifteenDaysInMs)
    }));
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Apply Theme/Palette
  useEffect(() => {
    const palette = data.settings?.palette || 'monochrome';
    const root = document.documentElement;
    root.style.setProperty('--accent', 
      palette === 'emerald' ? '#10b981' : 
      palette === 'amber' ? '#f59e0b' : 
      palette === 'cobalt' ? '#3b82f6' : '#ffffff'
    );
  }, [data.settings?.palette]);

  const updateTask = (id: string, updates: Partial<Task>) => {
    setData(prev => ({ ...prev, tasks: (prev.tasks || []).map(t => t.id === id ? { ...t, ...updates } : t) }));
  };

  const deleteTask = (id: string) => {
    const taskToDelete = data.tasks.find(t => t.id === id);
    if (!taskToDelete) return;
    if (data.settings.confirmDelete && !confirm('Move this objective to Recycle Bin?')) return;
    
    setData(prev => ({ 
      ...prev, 
      tasks: prev.tasks.filter(t => t.id !== id),
      recycleBin: [...(prev.recycleBin || []), {
        id: Math.random().toString(36).substr(2, 9),
        originalId: id,
        type: 'task',
        data: taskToDelete,
        deletedAt: Date.now()
      }]
    }));
  };

  const deleteNote = (id: string) => {
    const noteToDelete = data.notes.find(n => n.id === id);
    if (!noteToDelete) return;
    if (data.settings.confirmDelete && !confirm('Move this note to Recycle Bin?')) return;
    
    setData(prev => ({ 
      ...prev, 
      notes: prev.notes.filter(n => n.id !== id),
      recycleBin: [...(prev.recycleBin || []), {
        id: Math.random().toString(36).substr(2, 9),
        originalId: id,
        type: 'note',
        data: noteToDelete,
        deletedAt: Date.now()
      }]
    }));
  };

  const deleteDecision = (id: string) => {
    const decisionToDelete = data.decisions.find(d => d.id === id);
    if (!decisionToDelete) return;
    
    setData(prev => ({ 
      ...prev, 
      decisions: prev.decisions.filter(d => d.id !== id),
      recycleBin: [...(prev.recycleBin || []), {
        id: Math.random().toString(36).substr(2, 9),
        originalId: id,
        type: 'decision',
        data: decisionToDelete,
        deletedAt: Date.now()
      }]
    }));
  };

  const restoreFromBin = (binId: string) => {
    const item = data.recycleBin.find(i => i.id === binId);
    if (!item) return;
    
    setData(prev => {
      const newBin = prev.recycleBin.filter(i => i.id !== binId);
      if (item.type === 'task') return { ...prev, recycleBin: newBin, tasks: [...(prev.tasks || []), item.data] };
      if (item.type === 'note') return { ...prev, recycleBin: newBin, notes: [...(prev.notes || []), item.data] };
      if (item.type === 'decision') return { ...prev, recycleBin: newBin, decisions: [...(prev.decisions || []), item.data] };
      return prev;
    });
  };

  const purgeFromBin = (binId: string) => {
    setData(prev => ({
      ...prev,
      recycleBin: (prev.recycleBin || []).filter(i => i.id !== binId)
    }));
  };

  const updateSettings = (updates: Partial<SystemSettings>) => {
    setData(prev => ({ ...prev, settings: { ...prev.settings, ...updates } }));
  };

  const addScratchpad = () => {
    const newPad: ScratchpadData = {
      id: Math.random().toString(36).substr(2, 9),
      content: '',
      x: 100 + ((data.scratchpads || []).length * 20),
      y: 100 + ((data.scratchpads || []).length * 20),
      w: 320,
      h: 400
    };
    setData(prev => ({ ...prev, scratchpads: [...(prev.scratchpads || []), newPad] }));
  };

  // Safe checks for rendering
  const clarityLogs = data.clarityLogs || [];
  const currentClarity = clarityLogs.length > 0 ? clarityLogs[clarityLogs.length - 1].level : 0;

  return (
    <Layout 
      activeView={activeView} 
      setView={setActiveView} 
      onAddScratchpad={addScratchpad}
      onOpenFocus={() => setIsFocusMode(true)}
      widgetEnabled={data.widgetEnabled}
      onToggleWidget={() => setData(d => ({...d, widgetEnabled: !d.widgetEnabled}))}
      clarityLevel={currentClarity}
      onLogClarity={(level) => setData(prev => ({ ...prev, clarityLogs: [...(prev.clarityLogs || []), { timestamp: Date.now(), level }] }))}
      settings={data.settings}
    >
      {advisorMessage && (
        <div className="fixed bottom-12 right-12 z-[3000] bg-white text-black p-10 rounded-[2.5rem] shadow-2xl border-4 border-black w-[400px] animate-in slide-in-from-right-10">
          <div className="flex items-start gap-6">
             <div className="w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shrink-0 shadow-lg"><BrainCircuit size={28} /></div>
             <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between"><p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">System Advisor</p><button onClick={() => setAdvisorMessage(null)}><X size={18}/></button></div>
                <h4 className="text-sm font-black uppercase tracking-tight">{advisorMessage.title}</h4>
                <p className="text-xs font-bold leading-relaxed italic text-zinc-700">"{advisorMessage.body}"</p>
                <button onClick={() => { setActiveView(advisorMessage.target); setAdvisorMessage(null); }} className="mt-2 text-[9px] font-black uppercase tracking-widest text-black underline underline-offset-4 decoration-2">Initiate Protocol</button>
             </div>
          </div>
        </div>
      )}

      {activeView === 'tasks' && <TodoSection tasks={data.tasks || []} projects={data.projects || []} onAddTask={(text, projectId) => setData(prev => ({ ...prev, tasks: [...(prev.tasks || []), { id: Math.random().toString(36).substr(2, 9), text, completed: false, status: 'todo', dueDate: null, createdAt: Date.now(), isPinned: false, timerEnd: null, subtasks: [], order: (prev.tasks || []).length, assumption: "", isSynthesized: false, projectId }] }))} onUpdateTask={updateTask} onDeleteTask={deleteTask} onAddProject={(name) => setData(prev => ({ ...prev, projects: [...(prev.projects || []), { id: Math.random().toString(36).substr(2, 9), name, color: '#FFFFFF', createdAt: Date.now(), isArchived: false }] }))} />}
      {activeView === 'triage' && <TriageProtocol tasks={data.tasks || []} onUpdateTask={updateTask} onDeleteTask={deleteTask} onFinish={() => setActiveView('tasks')} />}
      {activeView === 'notes' && <NoteSection notes={data.notes || []} onAddNote={(note) => setData(prev => ({ ...prev, notes: [...(prev.notes || []), { id: Math.random().toString(36).substr(2, 9), title: note.title || 'Untitled Entry', content: note.content || '', color: '#000000', isHighlighted: false, isVaulted: false, lastModified: Date.now() }] }))} onUpdateNote={(id, updates) => setData(prev => ({ ...prev, notes: (prev.notes || []).map(n => n.id === id ? { ...n, ...updates, lastModified: Date.now() } : n) }))} onDeleteNote={deleteNote} settings={data.settings} />}
      {activeView === 'decisions' && <DecisionJournal decisions={data.decisions || []} onAdd={(d) => setData(prev => ({ ...prev, decisions: [...(prev.decisions || []), d] }))} onUpdate={(id, updates) => setData(prev => ({ ...prev, decisions: (prev.decisions || []).map(d => d.id === id ? { ...d, ...updates } : d) }))} />}
      {activeView === 'synthesis' && <SynthesisEngine tasks={data.tasks || []} decisions={data.decisions || []} onUpdateTask={updateTask} onUpdateDecision={(id, updates) => setData(prev => ({ ...prev, decisions: (prev.decisions || []).map(d => d.id === id ? { ...d, ...updates } : d) }))} onAddNote={(note) => setData(prev => ({ ...prev, notes: [...(prev.notes || []), { id: Math.random().toString(36).substr(2, 9), ...note, lastModified: Date.now() } as any] }))} />}
      {activeView === 'habits' && <HabitTracker habits={data.habits || []} onUpdateHabits={(h) => setData(d => ({...d, habits: h}))} />}
      {activeView === 'audit' && <FlowAudit tasks={data.tasks || []} habits={data.habits || []} clarityLogs={data.clarityLogs || []} />}
      {activeView === 'codex' && <Codex />}
      {activeView === 'settings' && (
        <Settings 
          data={data} 
          onExport={() => { 
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); 
            const url = URL.createObjectURL(blob); 
            const a = document.createElement('a'); 
            a.href = url; a.download = `shadowkeep_v1.json`; a.click(); 
          }} 
          onImport={(imported) => setData(imported)} 
          onUpdateSettings={updateSettings}
          onRestoreFromBin={restoreFromBin}
          onPurgeFromBin={purgeFromBin}
        />
      )}

      {(data.scratchpads || []).map(pad => (
        <Scratchpad key={pad.id} data={pad} onChange={(v) => setData(prev => ({...prev, scratchpads: prev.scratchpads.map(p => p.id === pad.id ? {...p, content: v} : p)}))} onPositionChange={(x, y) => setData(prev => ({...prev, scratchpads: prev.scratchpads.map(p => p.id === pad.id ? {...p, x, y} : p)}))} onResize={(w, h) => setData(prev => ({...prev, scratchpads: prev.scratchpads.map(p => p.id === pad.id ? {...p, w, h} : p)}))} onClose={() => setData(prev => ({...prev, scratchpads: prev.scratchpads.filter(p => p.id !== pad.id)}))} />
      ))}

      {isSearchOpen && (
        <CommandPalette 
          data={data} 
          onClose={() => setIsSearchOpen(false)} 
          onNavigate={(view) => { setActiveView(view); setIsSearchOpen(false); }}
          onAction={(act) => act === 'focus' && setIsFocusMode(true)}
        />
      )}

      {data.widgetEnabled && <FloatingWidget tasks={data.tasks || []} habits={data.habits || []} decisions={data.decisions || []} position={data.widgetPos || {x: 20, y: 20}} onPositionChange={(pos) => setData(d => ({...d, widgetPos: pos}))} onToggleTask={(id) => updateTask(id, { completed: true, completedAt: Date.now() })} onLaunch={() => { window.focus(); setActiveView('tasks'); }} onClose={() => setData(d => ({...d, widgetEnabled: false}))} opacity={data.settings?.widgetOpacity ?? 1} />}
      {isFocusMode && <FocusMode tasks={data.tasks || []} onClose={() => setIsFocusMode(false)} defaultNoise={data.settings?.defaultFocusNoise || 'none'} />}
    </Layout>
  );
};

export default App;
