
import React, { useState } from 'react';
import { Note, SystemSettings } from '../types.ts';
import { Plus, X, Lock, ShieldCheck, LayoutGrid, Info, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import RichTextEditor from './RichTextEditor.tsx';

const BLUEPRINTS = [
  { title: "Learning Log", content: "<h3>Topic</h3><p></p><h3>First Principles</h3><ul><li></li></ul>" },
  { title: "Daily Reflection", content: "<h3>Wins</h3><p></p><h3>Blockers</h3><p></p>" }
];

interface NoteSectionProps {
  notes: Note[];
  onAddNote: (note: Partial<Note>) => void;
  onUpdateNote: (id: string, updates: Partial<Note>) => void;
  onDeleteNote: (id: string) => void;
  settings: SystemSettings;
}

const NoteSection: React.FC<NoteSectionProps> = ({ notes, onAddNote, onUpdateNote, onDeleteNote, settings }) => {
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [showBlueprints, setShowBlueprints] = useState(false);

  const isZen = settings?.density === 'zen';

  return (
    <div className={`space-y-12 animate-in fade-in duration-500 relative ${isZen ? 'max-w-6xl' : 'max-w-5xl'} mx-auto`}>
      <header className="flex justify-between items-end">
        <div><h2 className="text-5xl font-black tracking-tighter uppercase mb-2">Vault</h2><p className="text-zinc-600 text-xs font-medium tracking-wide">Cognitive persistence.</p></div>
        <div className="flex gap-2">
          <button onClick={() => setShowBlueprints(true)} className="p-3 bg-zinc-950 border border-zinc-900 rounded-lg text-zinc-600 hover:text-white"><LayoutGrid size={20} /></button>
          <button onClick={() => setEditingNote({ id: '', title: '', content: '', color: '#000000', isHighlighted: false, isVaulted: false, lastModified: Date.now() })} className="bg-white text-black px-6 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest flex items-center gap-2"><Plus size={16} /> New Entry</button>
        </div>
      </header>

      <div className={`grid grid-cols-1 ${isZen ? 'md:grid-cols-2 lg:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'} gap-4`}>
        {notes.map(note => (
          <div key={note.id} onClick={() => setEditingNote(note)} className={`group bg-black border border-zinc-900 ${isZen ? 'p-12' : 'p-8'} rounded-2xl hover:border-white cursor-pointer transition-all relative overflow-hidden`}>
             <button onClick={(e) => { e.stopPropagation(); onDeleteNote(note.id); }} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 text-zinc-800 hover:text-red-500 transition-all"><Trash2 size={16}/></button>
             <h3 className="text-sm font-black uppercase tracking-widest mb-4">{note.title}</h3>
             <div className="text-[10px] text-zinc-700 line-clamp-3 mb-6" dangerouslySetInnerHTML={{ __html: note.content }} />
             <div className="flex items-center justify-between text-[8px] text-zinc-800 font-black uppercase tracking-[0.2em] border-t border-zinc-900 pt-4"><span>ID-{note.id.substr(0,4)}</span><span>{format(note.lastModified, 'MM.dd.yy')}</span></div>
          </div>
        ))}
      </div>

      {editingNote && (
        <div className="fixed inset-0 z-[6000] bg-black p-12 flex flex-col animate-in fade-in">
           <div className="flex items-center justify-between mb-12">
              <input value={editingNote.title} onChange={e => setEditingNote({...editingNote, title: e.target.value})} className="text-5xl font-black bg-transparent outline-none flex-1 uppercase tracking-tighter" placeholder="Entry Title" />
              <div className="flex items-center gap-6">
                <button onClick={() => { if(editingNote.id) onDeleteNote(editingNote.id); setEditingNote(null); }} className="p-4 text-zinc-800 hover:text-red-500 transition-colors"><Trash2 size={28}/></button>
                <button onClick={() => { if(editingNote.id) onUpdateNote(editingNote.id, editingNote); else onAddNote(editingNote); setEditingNote(null); }} className="bg-white text-black px-10 py-4 rounded-lg font-black uppercase text-xs tracking-[0.2em]">Save</button>
                <button onClick={() => setEditingNote(null)} className="p-4 text-zinc-700 hover:text-white"><X size={32} /></button>
              </div>
           </div>
           <RichTextEditor initialValue={editingNote.content} onChange={c => setEditingNote({...editingNote, content: c})} className="flex-1 border-none bg-transparent" />
        </div>
      )}
    </div>
  );
};

export default NoteSection;
