
import React, { useState } from 'react';
import { Habit } from '../types';
import { Box, Coffee, Info } from 'lucide-react';
import { format, addDays, eachDayOfInterval } from 'date-fns';

interface HabitTrackerProps {
  habits: Habit[];
  onUpdateHabits: (habits: Habit[]) => void;
}

const HabitTracker: React.FC<HabitTrackerProps> = ({ habits, onUpdateHabits }) => {
  const [newName, setNewName] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const last30Days = eachDayOfInterval({ start: addDays(new Date(), -29), end: new Date() });

  const toggleHabitDay = (habitId: string, dateStr: string) => {
    const newHabits = habits.map(h => {
      if (h.id === habitId) {
        if (h.isVacationMode) return h;
        const history = h.history.includes(dateStr) 
          ? h.history.filter(d => d !== dateStr) 
          : [...h.history, dateStr];
        return { ...h, history };
      }
      return h;
    });
    onUpdateHabits(newHabits);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-500 relative">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-5xl font-black tracking-tighter uppercase">Consistency</h2>
          <p className="text-zinc-600 text-xs font-medium tracking-wide">Ritual persistence visualization.</p>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setShowInfo(!showInfo)} className="p-2 text-zinc-800 hover:text-white transition-all"><Info size={20}/></button>
          <button onClick={() => onUpdateHabits(habits.map(h => ({...h, isVacationMode: !h.isVacationMode})))} className={`px-4 py-2 rounded-lg border flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${habits.some(h => h.isVacationMode) ? 'bg-white text-black border-white' : 'border-zinc-900 text-zinc-700 hover:text-white'}`}>
            <Coffee size={14} /> Freeze Streaks
          </button>
        </div>
      </header>

      {showInfo && (
        <div className="bg-zinc-900 border border-zinc-900 text-white p-8 rounded-[2rem] space-y-4 animate-in slide-in-from-top-4">
          <h4 className="text-xs font-black uppercase tracking-widest">Metacognitive Intent: Identity Reinforcement</h4>
          <p className="text-sm leading-relaxed font-medium">
            Habits are evidence for who you are. This visual grid provides <em>immediate feedback</em> on your discipline. "Freeze Streaks" is a psychological safety valve to prevent total collapse during periods of legitimate rest.
          </p>
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-t border-zinc-800 pt-4">
            Mechanism: Click grid cells to retroactively mark days. Consistency is more important than intensity.
          </div>
        </div>
      )}

      <form onSubmit={e => { 
        e.preventDefault(); 
        if(!newName.trim()) return;
        onUpdateHabits([...habits, { id: Math.random().toString(36).substr(2,9), name: newName, streak: 0, lastCompleted: null, history: [], schedule: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], isVacationMode: false }]);
        setNewName('');
      }} className="bg-zinc-950 border border-zinc-900 p-1 rounded-xl flex gap-1 focus-within:border-white transition-all">
        <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Establish new ritual..." className="bg-transparent flex-1 px-4 outline-none text-white text-sm" />
        <button type="submit" className="bg-white text-black px-6 py-2 rounded-lg font-black text-[10px] tracking-widest uppercase">Create</button>
      </form>

      <div className="grid grid-cols-1 gap-6">
        {habits.map(habit => {
          const count = habit.history.length;
          const today = format(new Date(), 'yyyy-MM-dd');
          const isDoneToday = habit.history.includes(today);
          return (
            <div key={habit.id} className="bg-black border border-zinc-900 p-8 rounded-2xl hover:border-zinc-800 transition-all">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 border border-zinc-700 flex items-center justify-center text-zinc-400"><Box size={20} /></div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-zinc-100">{habit.name}</h3>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700 mt-1">{count} iterations recorded</p>
                  </div>
                </div>
                <button onClick={() => toggleHabitDay(habit.id, today)} className={`px-6 py-2 rounded-lg font-black text-[10px] uppercase tracking-[0.2em] border transition-all ${isDoneToday ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-700 border-zinc-900 hover:text-white hover:border-white'}`}>{isDoneToday ? 'Verified Today' : 'Mark Today'}</button>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {last30Days.map(day => {
                  const ds = format(day, 'yyyy-MM-dd');
                  const isDone = habit.history.includes(ds);
                  return <button key={ds} onClick={() => toggleHabitDay(habit.id, ds)} title={`Mark ${format(day, 'MMM dd, yyyy')}`} className={`w-4 h-4 rounded-[2px] transition-all border ${isDone ? 'bg-white border-white' : 'bg-zinc-900/40 border-zinc-900 hover:border-white'}`} />;
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HabitTracker;
