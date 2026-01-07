
import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Wind, Volume2 } from 'lucide-react';
import { Task } from '../types';

interface FocusModeProps {
  tasks: Task[];
  onClose: () => void;
  defaultNoise: 'none' | 'white' | 'brown';
}

const FocusMode: React.FC<FocusModeProps> = ({ tasks, onClose, defaultNoise }) => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [audioMode, setAudioMode] = useState<'none' | 'white' | 'brown'>(defaultNoise);
  const [linkedTask, setLinkedTask] = useState<string | null>(null);
  
  const audioCtx = useRef<AudioContext | null>(null);
  const noiseSource = useRef<ScriptProcessorNode | null>(null);

  const stopAudio = () => {
    if (noiseSource.current) {
      try { noiseSource.current.disconnect(); } catch (e) {}
      noiseSource.current = null;
    }
  };

  const startAudio = async () => {
    stopAudio();
    if (audioMode === 'none' || !isActive) return;
    
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const ctx = audioCtx.current;
    if (ctx.state === 'suspended') await ctx.resume();
    
    const bufferSize = 4096;
    const node = ctx.createScriptProcessor(bufferSize, 1, 1);
    let b0 = 0; // brown noise filter state
    
    node.onaudioprocess = (e) => {
      const output = e.outputBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (audioMode === 'white') {
          output[i] = white * 0.03;
        } else if (audioMode === 'brown') {
          b0 = (white + b0 * 0.99) / 1.01;
          output[i] = b0 * 0.15;
        }
      }
    };
    node.connect(ctx.destination);
    noiseSource.current = node;
  };

  useEffect(() => {
    startAudio();
    return () => stopAudio();
  }, [audioMode, isActive]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const presets = [15, 25, 45, 60, 90];

  return (
    <div className="fixed inset-0 z-[2000] bg-black flex flex-col items-center justify-center p-8 overflow-hidden animate-in fade-in duration-700">
      <button onClick={onClose} className="absolute top-12 right-12 p-4 text-zinc-800 hover:text-white transition-all"><X size={48} /></button>
      
      <div className="text-center w-full max-w-4xl space-y-16">
        <div className="space-y-4">
           <p className="text-[10px] font-black uppercase tracking-[1.5em] text-zinc-800">Focus Protocol Active</p>
           <h1 className="text-[16rem] font-black leading-none tracking-tighter tabular-nums text-white">
             {Math.floor(timeLeft/60)}:{String(timeLeft%60).padStart(2,'0')}
           </h1>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {presets.map(p => (
            <button 
              key={p} 
              onClick={() => { setTimeLeft(p * 60); setIsActive(false); }}
              className={`px-6 py-2 border rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${Math.floor(timeLeft/60) === p ? 'bg-white text-black border-white' : 'border-zinc-900 text-zinc-600 hover:border-white hover:text-white'}`}
            >
              {p}m
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <select 
            value={linkedTask || ''} 
            onChange={e => setLinkedTask(e.target.value)}
            className="bg-black border border-zinc-900 px-8 py-4 rounded-lg text-white outline-none w-full max-w-md font-black uppercase text-[10px] tracking-widest text-center"
          >
            <option value="">Link Objective</option>
            {tasks.filter(t => !t.completed).map(t => <option key={t.id} value={t.id}>{t.text}</option>)}
          </select>
        </div>

        <div className="flex items-center justify-center gap-16">
           <div className="flex flex-col items-center gap-4">
              <div className="flex gap-2">
                <SoundBtn icon={<Wind size={18}/>} active={audioMode==='white'} onClick={()=>setAudioMode('white')} label="White" />
                <SoundBtn icon={<Volume2 size={18}/>} active={audioMode==='brown'} onClick={()=>setAudioMode('brown')} label="Brown" />
              </div>
              <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest">Acoustic Shield</span>
           </div>

           <button onClick={() => setIsActive(!isActive)} className="w-32 h-32 border-4 border-white flex items-center justify-center text-white active:scale-95 transition-all">
             {isActive ? <Pause size={48} /> : <Play size={48} className="ml-2" />}
           </button>

           <button onClick={() => { setIsActive(false); setTimeLeft(25*60); }} className="w-16 h-16 text-zinc-800 hover:text-white transition-all">
             <RotateCcw size={32} />
           </button>
        </div>
      </div>
    </div>
  );
};

const SoundBtn = ({ icon, active, onClick, label }: any) => (
  <button onClick={onClick} className={`flex flex-col items-center gap-1 p-4 rounded-lg transition-all border ${active ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-800 border-zinc-900 hover:text-zinc-500'}`}>
    {icon}
    <span className="text-[7px] font-black uppercase">{label}</span>
  </button>
);

export default FocusMode;
