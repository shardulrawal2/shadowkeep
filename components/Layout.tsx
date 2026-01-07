
import React from 'react';
import { ViewMode, SystemSettings } from '../types';
import { 
  CheckSquare, StickyNote, Target, Zap, 
  Settings, MessageSquareText, Layers, 
  Activity, BookOpen, BrainCircuit, Scale, RefreshCcw,
  ShieldAlert
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeView: ViewMode;
  setView: (view: ViewMode) => void;
  onAddScratchpad: () => void;
  onOpenFocus: () => void;
  widgetEnabled: boolean;
  onToggleWidget: () => void;
  clarityLevel: number;
  onLogClarity: (level: number) => void;
  settings: SystemSettings;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, activeView, setView, onAddScratchpad, 
  onOpenFocus, widgetEnabled, onToggleWidget,
  clarityLevel, onLogClarity, settings
}) => {
  const isZen = settings?.density === 'zen';
  const isRightSidebar = settings?.sidebarPosition === 'right';
  const labels = settings?.pulseLabels || ['Depleted', 'Static', 'Functional', 'High', 'Peak'];

  return (
    <div className={`flex h-screen w-full bg-black overflow-hidden text-white font-['Inter'] ${isRightSidebar ? 'flex-row-reverse' : 'flex-row'}`}>
      <nav className={`${isZen ? 'w-24 md:w-80' : 'w-20 md:w-64'} border-zinc-900 flex flex-col py-8 shrink-0 bg-black ${isRightSidebar ? 'border-l' : 'border-r'}`}>
        <div className="px-6 mb-12 flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-[var(--accent)] flex items-center justify-center">
            <div className="w-2 h-2 bg-[var(--accent)]"></div>
          </div>
          <h1 className="hidden md:block text-lg font-black tracking-tighter uppercase">ShadowKeep</h1>
        </div>

        <div className="flex-1 px-4 space-y-1 overflow-y-auto no-scrollbar">
          <NavItem active={activeView === 'tasks'} onClick={() => setView('tasks')} icon={<CheckSquare size={18} />} label="Tasks" zen={isZen} />
          <NavItem active={activeView === 'notes'} onClick={() => setView('notes')} icon={<StickyNote size={18} />} label="Vault" zen={isZen} />
          <NavItem active={activeView === 'decisions'} onClick={() => setView('decisions')} icon={<Scale size={18} />} label="Decisions" zen={isZen} />
          <NavItem active={activeView === 'habits'} onClick={() => setView('habits')} icon={<Target size={18} />} label="Consistency" zen={isZen} />
          <NavItem active={activeView === 'codex'} onClick={() => setView('codex')} icon={<BookOpen size={18} />} label="The Codex" zen={isZen} />
          
          <div className="pt-8 space-y-1">
            <p className="px-4 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-800 mb-2">Systems</p>
            <NavItem active={activeView === 'triage'} onClick={() => setView('triage')} icon={<ShieldAlert size={18} />} label="Triage" zen={isZen} />
            <NavItem active={activeView === 'synthesis'} onClick={() => setView('synthesis')} icon={<RefreshCcw size={18} />} label="The Loop" zen={isZen} />
            <NavItem active={activeView === 'audit'} onClick={() => setView('audit')} icon={<Activity size={18} />} label="Flow Audit" zen={isZen} />
            
            <p className="px-4 pt-6 text-[9px] font-black uppercase tracking-[0.4em] text-zinc-800 mb-2">Utilities</p>
            <button onClick={onOpenFocus} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-zinc-600 hover:text-[var(--accent)] hover:bg-zinc-900 transition-all font-bold text-xs">
              <Zap size={18} />
              <span className="hidden md:block">Focus Protocol</span>
            </button>
            <button onClick={onAddScratchpad} className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-zinc-600 hover:text-[var(--accent)] hover:bg-zinc-900 transition-all font-bold text-xs">
              <MessageSquareText size={18} />
              <span className="hidden md:block">New Scratchpad</span>
            </button>
            <button onClick={onToggleWidget} className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all font-bold text-xs ${widgetEnabled ? 'text-[var(--accent)] bg-zinc-900' : 'text-zinc-700 hover:text-[var(--accent)] hover:bg-zinc-900'}`}>
              <Layers size={18} />
              <span className="hidden md:block">Widget</span>
            </button>
          </div>
        </div>

        <div className="px-4 mt-auto pt-4 border-t border-zinc-900">
          <NavItem active={activeView === 'settings'} onClick={() => setView('settings')} icon={<Settings size={18} />} label="Settings" zen={isZen} />
        </div>
      </nav>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-zinc-900 flex items-center justify-between px-8 shrink-0 bg-black">
          <div className="flex items-center gap-4">
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700">Cognitive Pulse</span>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((lvl) => (
                <button 
                  key={lvl} 
                  onClick={() => onLogClarity(lvl)} 
                  title={labels[lvl-1] || 'Level ' + lvl}
                  className={`w-3 h-3 rounded-full border transition-all ${clarityLevel >= lvl ? 'bg-[var(--accent)] border-[var(--accent)] scale-110 shadow-[0_0_8px_var(--accent)]' : 'bg-transparent border-zinc-800 hover:border-zinc-500'}`} 
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BrainCircuit size={14} className="text-zinc-700" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-800">{(settings?.commandAlias || 'OPERATOR')} Matrix</span>
          </div>
        </header>

        <main className={`flex-1 overflow-y-auto bg-black no-scrollbar ${isZen ? 'p-16 md:p-24' : 'p-8 md:p-12'}`}>
          <div className={`${isZen ? 'max-w-6xl' : 'max-w-5xl'} mx-auto min-h-full`}>{children}</div>
        </main>
      </div>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label, zen }: any) => (
  <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${active ? 'bg-[var(--accent)] text-black font-black' : 'text-zinc-700 hover:text-zinc-300 hover:bg-zinc-900'} ${zen ? 'py-4' : 'py-3'}`}>
    {icon}
    <span className="hidden md:block text-xs uppercase tracking-widest">{label}</span>
  </button>
);

export default Layout;
