
import React, { useRef, useEffect } from 'react';
import { Bold, Italic, Underline, Palette, Highlighter } from 'lucide-react';

interface RichTextEditorProps {
  initialValue: string;
  onChange: (html: string) => void;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ initialValue, onChange, className }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== initialValue) {
      editorRef.current.innerHTML = initialValue;
    }
  }, [initialValue]);

  const execCommand = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className={`flex flex-col border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30 ${className}`}>
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur">
        <ToolbarButton onClick={() => execCommand('bold')} icon={<Bold size={16} />} title="Bold" />
        <ToolbarButton onClick={() => execCommand('italic')} icon={<Italic size={16} />} title="Italic" />
        <ToolbarButton onClick={() => execCommand('underline')} icon={<Underline size={16} />} title="Underline" />
        <div className="w-px h-6 bg-zinc-800 mx-1 self-center" />
        
        <ToolbarButton 
          onClick={() => {
            const color = prompt('Enter color hex (e.g. #ff0000):', '#ffffff');
            if (color) execCommand('foreColor', color);
          }} 
          icon={<Palette size={16} />} 
          title="Text Color" 
        />
        
        <ToolbarButton 
          onClick={() => {
            const color = prompt('Enter highlight color hex (e.g. #ffff00):', '#4ade80');
            if (color) execCommand('backColor', color);
          }} 
          icon={<Highlighter size={16} />} 
          title="Highlight" 
        />
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="flex-1 p-6 min-h-[300px] focus:outline-none text-zinc-300 leading-relaxed"
        style={{ caretColor: 'white' }}
      />
    </div>
  );
};

const ToolbarButton: React.FC<{ onClick: () => void; icon: React.ReactNode; title: string }> = ({ onClick, icon, title }) => (
  <button
    onClick={(e) => { e.preventDefault(); onClick(); }}
    title={title}
    className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
  >
    {icon}
  </button>
);

export default RichTextEditor;
