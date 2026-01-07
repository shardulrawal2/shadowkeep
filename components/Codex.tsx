
import React, { useState } from 'react';
import { BookOpen, Search, HelpCircle, ArrowRight } from 'lucide-react';

const MODELS = [
  {
    title: "First Principles",
    desc: "Break down complex problems into basic elements and then reassemble them from the ground up.",
    questions: ["What are the fundamental truths?", "Can I rebuild this from scratch?"]
  },
  {
    title: "Second-Order Thinking",
    desc: "Consider the consequences of the consequences. Think beyond the immediate results.",
    questions: ["And then what?", "What are the long-term side effects?"]
  },
  {
    title: "Inversion",
    desc: "Instead of thinking about success, think about how to avoid failure.",
    questions: ["How could this project fail?", "What should I avoid doing?"]
  },
  {
    title: "Ockham’s Razor",
    desc: "Among competing hypotheses, the simplest one is usually correct.",
    questions: ["Is there a simpler explanation?", "Am I overcomplicating the solution?"]
  },
  {
    title: "Pareto Principle",
    desc: "80% of the effects come from 20% of the causes. Focus on the vital few.",
    questions: ["Which 20% of tasks lead to 80% of results?", "Am I doing 'low-value' work?"]
  },
  {
    title: "Circle of Competence",
    desc: "Know the boundaries of what you understand and stay within them.",
    questions: ["Is this inside my expertise?", "Who knows more about this than I do?"]
  }
];

const Codex: React.FC = () => {
  const [search, setSearch] = useState('');

  const filtered = MODELS.filter(m => m.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <header>
        <h2 className="text-5xl font-black tracking-tighter uppercase mb-2">The Codex</h2>
        <p className="text-zinc-600 text-xs font-medium tracking-wide">Essential mental models for decision hygiene.</p>
      </header>

      <div className="relative">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-700" size={20} />
        <input 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Query framework..."
          className="w-full bg-zinc-950 border border-zinc-900 rounded-2xl py-6 pl-16 pr-8 text-sm text-white outline-none focus:border-white transition-all"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(model => (
          <div key={model.title} className="bg-black border border-zinc-900 p-10 rounded-3xl hover:border-zinc-600 transition-all space-y-6 flex flex-col">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white text-black flex items-center justify-center font-black rounded-lg">
                {model.title[0]}
              </div>
              <h3 className="text-lg font-black uppercase tracking-tighter">{model.title}</h3>
            </div>
            
            <p className="text-zinc-500 text-sm leading-relaxed flex-1 italic">
              "{model.desc}"
            </p>

            <div className="space-y-3 pt-4 border-t border-zinc-900">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Reflection Prompts</p>
              {model.questions.map((q, i) => (
                <div key={i} className="flex items-start gap-2 group">
                  <ArrowRight size={12} className="mt-1 text-zinc-800 group-hover:text-white transition-colors" />
                  <p className="text-xs text-zinc-400 font-medium group-hover:text-zinc-200">{q}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Codex;
