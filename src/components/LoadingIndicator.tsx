import React, { useEffect, useState } from 'react';
import { GraduationCap, Sparkles } from 'lucide-react';
import { StudyMode } from '../types';

interface LoadingIndicatorProps {
  mode: StudyMode;
}

const STATUS_TEXTS: Record<StudyMode, string[]> = {
  all: [
    'StudyMate sedang berpikir...',
    'Menganalisis pertanyaan akademikmu...',
    'Menyiapkan jawaban yang jelas & terstruktur...',
  ],
  explain: [
    'Mencari analogi sederhana yang mudah dipahami...',
    'Menghubungkan konsep teoretis dengan contoh nyata...',
    'Menyusun penjelasan langkah demi langkah...',
  ],
  summary: [
    'Membaca dan merangkum intisari materi...',
    'Menyaring konsep kunci dan glosarium penting...',
    'Menyusun ringkasan padat dan komprehensif...',
  ],
  quiz: [
    'Merancang kuis dan latihan soal interaktif...',
    'Menyiapkan kunci jawaban dan pembahasan analitis...',
    'Memastikan tingkat kesulitan sesuai standar perkuliahan...',
  ],
  plan: [
    'Menghitung alokasi waktu dan timeline belajar...',
    'Menyusun target harian dengan metode active recall...',
    'Menyelesaikan jadwal belajar yang realistis...',
  ],
};

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ mode }) => {
  const texts = STATUS_TEXTS[mode] || STATUS_TEXTS.all;
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % texts.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div className="flex w-full gap-3 py-3 px-2 sm:px-4 flex-row animate-fade-in">
      <div className="shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xs">
        <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>

      <div className="flex flex-col items-start max-w-[85%] sm:max-w-[75%]">
        <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px] text-slate-400 font-medium">
          <span className="text-slate-600 font-semibold">StudyMate</span>
          <span>•</span>
          <span className="text-indigo-600 font-medium flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 animate-spin" />
            Sedang memproses
          </span>
        </div>

        <div className="rounded-2xl rounded-tl-xs p-4 bg-white text-slate-700 border border-slate-200/90 shadow-xs flex items-center gap-3">
          <div className="flex items-center gap-1.5 py-1">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"></span>
          </div>
          <span className="text-xs sm:text-sm text-slate-600 font-medium">
            {texts[textIndex]}
          </span>
        </div>
      </div>
    </div>
  );
};
