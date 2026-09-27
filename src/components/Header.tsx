import React from 'react';
import {
  GraduationCap,
  Sparkles,
  Trash2,
  Download,
  FileText,
  BrainCircuit,
} from 'lucide-react';
import { StudyMode } from '../types';

interface HeaderProps {
  messageCount: number;
  studyMode: StudyMode;
  onSelectMode: (mode: StudyMode) => void;
  onClearChat: () => void;
  onExportChat: () => void;
  onOpenPasteModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  messageCount,
  onClearChat,
  onExportChat,
  onOpenPasteModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs px-4 py-3 sm:px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Branding */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 text-white shadow-md shadow-indigo-100">
            <GraduationCap className="w-6 h-6" />
            <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-white">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                StudyMate
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                <BrainCircuit className="w-3 h-3" />
                AI Mahasiswa
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Asisten belajar akademik cerdas berbahasa Indonesia
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {messageCount > 0 && (
            <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Konteks: {messageCount} pesan</span>
            </div>
          )}

          {/* Paste Lecture Material shortcut */}
          <button
            type="button"
            onClick={onOpenPasteModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            title="Tempel Materi / Catatan Kuliah"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">Tempel Catatan</span>
          </button>

          {/* Export Chat */}
          {messageCount > 0 && (
            <button
              type="button"
              onClick={onExportChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              title="Unduh Catatan Sesi (.md)"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Ekspor</span>
            </button>
          )}

          {/* Clear Chat Button */}
          {messageCount > 0 && (
            <button
              type="button"
              onClick={onClearChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors"
              title="Hapus Percakapan & Mulai Sesi Baru"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Hapus Chat</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
