import React from 'react';
import {
  Lightbulb,
  FileText,
  HelpCircle,
  Calendar,
  Sparkles,
  ArrowRight,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import { StudyMode } from '../types';

interface WelcomeScreenProps {
  onSelectPrompt: (promptText: string, mode?: StudyMode) => void;
  onOpenPasteModal: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onSelectPrompt,
  onOpenPasteModal,
}) => {
  const primaryActions = [
    {
      id: 'explain-concept',
      mode: 'explain' as StudyMode,
      icon: Lightbulb,
      title: 'Explain this concept',
      titleId: 'Jelaskan Konsep Ini',
      description: 'Pahami konsep akademik yang rumit dengan analogi sederhana dan bahasa yang mudah dicerna.',
      samplePrompt: 'Jelaskan konsep Time Complexity (Big-O Notation) dalam algoritma pemrograman dengan analogi sederhana sehari-hari.',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-600',
    },
    {
      id: 'summarize-material',
      mode: 'summary' as StudyMode,
      icon: FileText,
      title: 'Summarize my material',
      titleId: 'Ringkas Materiku',
      description: 'Ekstrak poin penting, konsep kunci, dan intisari dari materi kuliah atau buku referensi.',
      samplePrompt: 'Tolong ringkas materi tentang Reaksi Terang & Gelap pada Fotosintesis menjadi 5 poin kunci dan tabel perbandingan.',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-100 text-blue-600',
      hasPasteAction: true,
    },
    {
      id: 'create-quiz',
      mode: 'quiz' as StudyMode,
      icon: HelpCircle,
      title: 'Create a quiz',
      titleId: 'Buat Kuis Singkat',
      description: 'Uji pemahamanmu dengan latihan soal pilihan ganda atau esai lengkap dengan kunci jawaban.',
      samplePrompt: 'Buatkan 5 soal kuis pilihan ganda tentang Hukum Termodinamika (Hukum I dan II) lengkap dengan pembahasan mendalam.',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-600',
    },
    {
      id: 'make-study-plan',
      mode: 'plan' as StudyMode,
      icon: Calendar,
      title: 'Make a study plan',
      titleId: 'Buat Rencana Belajar',
      description: 'Susun jadwal belajar terstruktur, realistis, dan sistematis sesuai target ujian atau tugas akhir.',
      samplePrompt: 'Buatkan rencana jadwal belajar 7 hari yang realistis untuk persiapan Ujian Akhir Semester (UAS) Kalkulus 1.',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      iconBg: 'bg-purple-100 text-purple-600',
    },
  ];

  const quickTopicSuggestions = [
    {
      label: 'Kalkulus Integral vs Diferensial',
      prompt: 'Jelaskan perbedaan mendasar antara Turunan (Diferensial) dan Integral dengan contoh penerapan di dunia nyata.',
      mode: 'explain' as StudyMode,
    },
    {
      label: 'Studi Kasus Analisis SWOT',
      prompt: 'Berikan contoh analisis SWOT lengkap untuk startup e-commerce mahasiswa di Indonesia.',
      mode: 'explain' as StudyMode,
    },
    {
      label: 'Latihan Soal Struktur Data: Stack & Queue',
      prompt: 'Buat 4 soal latihan penalaran tentang Stack dan Queue serta kapan sebaiknya masing-masing digunakan.',
      mode: 'quiz' as StudyMode,
    },
    {
      label: 'Rencana Belajar 14 Hari Skripsi / Tugas Akhir',
      prompt: 'Susun rencana aksi 14 hari untuk menyelesaikan Bab 2 (Tinjauan Pustaka) dan Bab 3 (Metodologi Penelitian) skripsi.',
      mode: 'plan' as StudyMode,
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-4xl mx-auto w-full my-auto">
      {/* Hero Welcome */}
      <div className="text-center mb-8 max-w-2xl">
        <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-100/80 text-indigo-600 mb-4 shadow-xs">
          <GraduationCap className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Halo, Mahasiswa! 👋
        </h2>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          Aku <span className="font-semibold text-indigo-600">StudyMate</span>, asisten belajarmu yang siap membantu memahami materi kuliah, merangkum bacaan tebal, menguji pemahaman dengan kuis, hingga menyusun jadwal belajar yang terstruktur.
        </p>
      </div>

      {/* 4 Main Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full mb-8">
        {primaryActions.map((action) => {
          const Icon = action.icon;
          return (
            <div
              key={action.id}
              className="group relative flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 text-left cursor-pointer"
              onClick={() => onSelectPrompt(action.samplePrompt, action.mode)}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className={`p-2.5 rounded-xl ${action.iconBg}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${action.badgeColor}`}>
                    {action.title}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors flex items-center gap-1.5">
                  {action.titleId}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {action.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-medium text-indigo-600 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  Coba prompt ini <ArrowRight className="w-3.5 h-3.5" />
                </span>
                {action.hasPasteAction && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenPasteModal();
                    }}
                    className="text-[11px] text-slate-500 hover:text-indigo-600 underline font-medium"
                  >
                    Tempel materi
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Popular Quick Suggestions */}
      <div className="w-full bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Contoh Pertanyaan Akademik Populer
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {quickTopicSuggestions.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectPrompt(item.prompt, item.mode)}
              className="text-left p-2.5 rounded-xl bg-white hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-200 text-xs text-slate-700 transition-all flex items-center justify-between gap-2 group"
            >
              <div className="flex items-center gap-2 truncate">
                <BookOpen className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500 shrink-0" />
                <span className="truncate font-medium">{item.label}</span>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-indigo-600 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
