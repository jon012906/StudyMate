import React, { useRef, useEffect } from 'react';
import {
  Send,
  Lightbulb,
  FileText,
  HelpCircle,
  Calendar,
  Sparkles,
  Paperclip,
  Square,
} from 'lucide-react';
import { StudyMode } from '../types';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  onStop?: () => void;
  isGenerating: boolean;
  activeMode: StudyMode;
  setActiveMode: (mode: StudyMode) => void;
  onOpenPasteModal: () => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  input,
  setInput,
  onSend,
  onStop,
  isGenerating,
  activeMode,
  setActiveMode,
  onOpenPasteModal,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 160; // ~6 lines
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && input.trim()) {
        onSend();
      }
    }
  };

  const modeOptions: Array<{
    id: StudyMode;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }> = [
    { id: 'all', label: 'Semua Mode', icon: Sparkles, color: 'text-indigo-600' },
    { id: 'explain', label: 'Penjelasan Konsep', icon: Lightbulb, color: 'text-amber-600' },
    { id: 'summary', label: 'Ringkasan Materi', icon: FileText, color: 'text-blue-600' },
    { id: 'quiz', label: 'Kuis & Soal', icon: HelpCircle, color: 'text-emerald-600' },
    { id: 'plan', label: 'Rencana Belajar', icon: Calendar, color: 'text-purple-600' },
  ];

  const getPlaceholder = () => {
    switch (activeMode) {
      case 'explain':
        return 'Tanyakan konsep atau materi sulit yang ingin dijelaskan dengan sederhana... (Enter untuk kirim)';
      case 'summary':
        return 'Ketik atau tempel materi perkuliahan yang ingin diringkas... (Enter untuk kirim)';
      case 'quiz':
        return 'Tulis topik untuk dibuatkan kuis atau latihan soal ujian... (Enter untuk kirim)';
      case 'plan':
        return 'Tulis mata kuliah, tenggat waktu, atau target ujian untuk dibuatkan jadwal belajar...';
      default:
        return 'Tanyakan apa saja seputar kuliahmu (konsep, ringkasan, kuis, atau jadwal)...';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 pb-3 sm:pb-5 pt-1">
      {/* Mode selection pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
          Fokus:
        </span>
        {modeOptions.map((opt) => {
          const Icon = opt.icon;
          const isActive = activeMode === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setActiveMode(opt.id)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full whitespace-nowrap transition-all duration-150 font-medium ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : opt.color}`} />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Input Box Card */}
      <div className="relative rounded-2xl bg-white border border-slate-300 shadow-md focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          rows={1}
          disabled={isGenerating}
          className="w-full resize-none px-4 pt-3.5 pb-11 sm:pb-12 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none bg-transparent max-h-40 overflow-y-auto leading-relaxed"
        />

        {/* Action bar inside input bottom */}
        <div className="absolute bottom-2 left-3 right-2 flex items-center justify-between pointer-events-none">
          {/* Left tools */}
          <div className="flex items-center gap-1 pointer-events-auto">
            <button
              type="button"
              onClick={onOpenPasteModal}
              className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded-md transition-colors font-medium"
              title="Tempel teks materi / silabus kuliah"
            >
              <Paperclip className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tempel Teks Kuliah</span>
            </button>
          </div>

          {/* Right: keyboard tip & send/stop button */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <span className="text-[11px] text-slate-400 hidden md:inline">
              Shift + Enter untuk baris baru
            </span>

            {isGenerating ? (
              <button
                type="button"
                onClick={onStop}
                className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-xs transition-colors"
                title="Hentikan pembuatan respon"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onSend}
                disabled={!input.trim()}
                className={`inline-flex items-center justify-center p-2 rounded-xl text-white font-medium shadow-xs transition-all ${
                  input.trim()
                    ? 'bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-indigo-200'
                    : 'bg-slate-300 cursor-not-allowed text-slate-100'
                }`}
                title="Kirim pesan (Enter)"
              >
                <Send className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-2 pt-1.5 text-[11px] text-slate-400">
        <span>StudyMate didukung Gemini 3.8 Flash • Gratis & Cepat</span>
        <span>Akademis & Terpercaya</span>
      </div>
    </div>
  );
};
