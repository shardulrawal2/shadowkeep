
import React, { useState } from 'react';
import { Download, Upload, Trash2, Shield, Info, Palette, Layout, Type, Bell, User, Gauge, Clock, Calendar, AlertTriangle, RefreshCcw, History } from 'lucide-react';
import { AppState, SystemSettings, ViewMode, RecycleBinItem } from '../types';
import { format, differenceInDays } from 'date-fns';

interface SettingsProps {
  data: AppState;
  onExport: () => void;
  onImport: (data: AppState) => void;
  onUpdateSettings: (updates: Partial<SystemSettings>) => void;
  onRestoreFromBin: (id: string) => void;
  onPurgeFromBin: (id: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ data, onExport, onImport, onUpdateSettings, onRestoreFromBin, onPurgeFromBin }) => {
  const { settings, recycleBin } = data;
  const [activeTab, setActiveTab] = useState<'config' | 'recycle'>('config');

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        onImport(imported);
        alert('Vault imported.');
      } catch {
        alert('Import failed.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-16 max-w-4xl pb-24 animate-in fade-in duration-500">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-6xl font-black tracking-tighter uppercase mb-2">Matrix</h2>
          <div className="flex gap-4">
             <button onClick={() => setActiveTab('config')} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'config' ? 'text-white underline underline-offset-8 decoration-2' : 'text-zinc-700'}`}>Configuration</button>
             <button onClick={() => setActiveTab('recycle')} className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${activeTab === 'recycle' ? 'text-white underline underline-offset-8 decoration-2' : 'text-zinc-700'}`}>Recycle Bin <span className="bg-zinc-900 px-1.5 py-0.5 rounded">{recycleBin.length}</span></button>
          </div>
        </div>
      </header>

      {activeTab === 'config' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Aesthetic Protocols */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-zinc-400">
              <Palette size={18} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Aesthetic Protocols</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-zinc-700">Neural Palette</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['monochrome', 'emerald', 'amber', 'cobalt'] as const).map(p => (
                    <button 
                      key={p} 
                      onClick={() => onUpdateSettings({ palette: p })}
                      className={`h-12 border-2 transition-all rounded-lg ${settings.palette === p ? 'border-white scale-105' : 'border-zinc-900 opacity-40'} ${
                        p === 'monochrome' ? 'bg-zinc-800' : 
                        p === 'emerald' ? 'bg-emerald-900' : 
                        p === 'amber' ? 'bg-amber-900' : 'bg-blue-900'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-zinc-700">UI Density</label>
                <div className="flex gap-2">
                  {(['tactical', 'zen'] as const).map(d => (
                    <button 
                      key={d} 
                      onClick={() => onUpdateSettings({ density: d })}
                      className={`flex-1 py-3 border-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${settings.density === d ? 'border-white bg-white text-black' : 'border-zinc-900 text-zinc-700'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-zinc-700">Widget Opacity ({Math.round(settings.widgetOpacity * 100)}%)</label>
                <input 
                  type="range" min="0.1" max="1" step="0.1" 
                  value={settings.widgetOpacity} 
                  onChange={e => onUpdateSettings({ widgetOpacity: parseFloat(e.target.value) })}
                  className="w-full accent-white"
                />
              </div>
            </div>
          </section>

          {/* Behavioral Protocols */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-zinc-400">
              <Gauge size={18} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Behavioral Protocols</h3>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-zinc-700">Command Alias</label>
                <input 
                  value={settings.commandAlias} 
                  onChange={e => onUpdateSettings({ commandAlias: e.target.value.toUpperCase() })}
                  className="w-full bg-zinc-950 border border-zinc-900 p-3 rounded-xl text-xs font-black uppercase tracking-widest text-white outline-none focus:border-white transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-zinc-700">System Threshold</label>
                <div className="flex items-center justify-between gap-4">
                  <input 
                    type="number" 
                    value={settings.overloadThreshold} 
                    onChange={e => onUpdateSettings({ overloadThreshold: parseInt(e.target.value) })}
                    className="bg-zinc-950 border border-zinc-900 p-3 rounded-xl text-xs font-black text-white outline-none w-20"
                  />
                  <span className="text-[8px] text-zinc-600 font-bold uppercase">Tasks before overload</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-900 rounded-xl">
                 <span className="text-[10px] font-black uppercase text-zinc-400">Confirm Deletion</span>
                 <button 
                   onClick={() => onUpdateSettings({ confirmDelete: !settings.confirmDelete })}
                   className={`w-10 h-5 rounded-full transition-all relative ${settings.confirmDelete ? 'bg-white' : 'bg-zinc-800'}`}
                 >
                   <div className={`absolute top-1 w-3 h-3 rounded-full transition-all ${settings.confirmDelete ? 'right-1 bg-black' : 'left-1 bg-zinc-600'}`} />
                 </button>
              </div>
            </div>
          </section>

          {/* Data & Security */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 text-zinc-400">
              <Shield size={18} />
              <h3 className="text-[10px] font-black uppercase tracking-[0.4em]">Data & Security</h3>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <button onClick={onExport} className="flex items-center gap-4 p-5 bg-black border border-zinc-900 rounded-xl hover:border-white transition-all text-left">
                  <Download size={16} />
                  <span className="text-[10px] font-black uppercase">Export</span>
                </button>
                <label className="flex items-center gap-4 p-5 bg-black border border-zinc-900 rounded-xl hover:border-white transition-all text-left cursor-pointer">
                  <Upload size={16} />
                  <span className="text-[10px] font-black uppercase">Import</span>
                  <input type="file" className="hidden" onChange={handleFileImport} />
                </label>
              </div>
              
              <button onClick={() => { if(confirm('Purge all cognitive records?')) { localStorage.clear(); window.location.reload(); } }} className="w-full flex items-center gap-4 p-5 bg-black border border-red-900/30 rounded-xl hover:bg-red-950 transition-all text-left group">
                <Trash2 size={16} className="text-red-900 group-hover:text-red-500" />
                <span className="text-[10px] font-black uppercase text-red-900 group-hover:text-red-500">Factory Hard Reset</span>
              </button>
            </div>
          </section>
        </div>
      ) : (
        <section className="space-y-12 animate-in fade-in duration-300">
           <div className="bg-zinc-950 border-l-4 border-l-white p-8 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                 <h4 className="text-sm font-black uppercase tracking-widest">Temporal Recycling</h4>
                 <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Deleted items are preserved for 15 days before permanent evaporation.</p>
              </div>
              <History className="text-zinc-800" size={32} />
           </div>

           <div className="space-y-3">
              {recycleBin.length === 0 ? (
                <div className="p-20 text-center border-2 border-dashed border-zinc-900 rounded-[3rem]">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800">Recycle Bin is empty</p>
                </div>
              ) : (
                recycleBin.sort((a,b) => b.deletedAt - a.deletedAt).map(item => (
                  <div key={item.id} className="bg-black border border-zinc-900 p-6 rounded-2xl flex items-center justify-between hover:border-zinc-700 transition-all group">
                     <div className="flex items-center gap-6">
                        <div className="px-3 py-1 bg-zinc-900 text-[8px] font-black uppercase rounded-full text-zinc-500">{item.type}</div>
                        <div>
                           <p className="text-sm font-black uppercase tracking-tight text-white">{item.type === 'task' ? item.data.text : item.data.title}</p>
                           <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest mt-1">Deleted {format(item.deletedAt, 'MMM dd')} ({15 - differenceInDays(Date.now(), item.deletedAt)} days remaining)</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onRestoreFromBin(item.id)} className="p-3 bg-zinc-900 hover:bg-white hover:text-black rounded-xl text-zinc-400 transition-all" title="Restore"><RefreshCcw size={16}/></button>
                        <button onClick={() => { if(confirm('Permanently delete this item?')) onPurgeFromBin(item.id); }} className="p-3 bg-zinc-900 hover:bg-red-900 hover:text-white rounded-xl text-zinc-400 transition-all" title="Purge"><Trash2 size={16}/></button>
                     </div>
                  </div>
                ))
              )}
           </div>
        </section>
      )}
      
      <footer className="pt-12 flex items-center justify-between border-t border-zinc-900 opacity-20">
        <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-[0.5em]">
          <Info size={12} />
          <span>v2.9.1-STABLE-OS</span>
        </div>
      </footer>
    </div>
  );
};

export default Settings;
