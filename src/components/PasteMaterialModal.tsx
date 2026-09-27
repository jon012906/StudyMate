import React, { useState } from 'react';
import { X, FileText, Lightbulb, HelpCircle, Calendar, Sparkles } from 'lucide-react';
import { StudyMode } from '../types';

interface PasteMaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formattedPrompt: string, mode: StudyMode) => void;
}

export const PasteMaterialModal: React.FC<PasteMaterialModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [materialText, setMaterialText] = useState('');
  const [targetAction, setTargetAction] = useState<StudyMode>('summary');
  const [subjectName, setSubjectName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialText.trim()) return;

    let prompt = '';
    const subjectPrefix = subjectName.trim() ? `[Mata Kuliah: ${subjectName.trim()}]\n\n` : '';

    if (targetAction === 'summary') {
      prompt = `${subjectPrefix}Tolong ringkas materi kuliah berikut ini secara terstruktur, jelas, dan komprehensif. Sertakan poin-poin utama, definisi konsep kunci, serta intisari penting:\n\n"""\n${materialText.trim()}\n"""`;
    } else if (targetAction === 'explain') {
      prompt = `${subjectPrefix}Dari materi perkuliahan berikut, tolong identifikasi dan jelaskan konsep-konsep kunci yang paling sulit/penting dengan bahasa sederhana, analogi intuitif, dan contoh konkret:\n\n"""\n${materialText.trim()}\n"""`;
    } else if (targetAction === 'quiz') {
      prompt = `${subjectPrefix}Berdasarkan materi perkuliahan berikut, buatkan 5 soal kuis pilihan ganda dan 2 soal penalaran/analitis beserta kunci jawaban dan pembahasan lengkapnya:\n\n"""\n${materialText.trim()}\n"""`;
    } else if (targetAction === 'plan') {
      prompt = `${subjectPrefix}Berdasarkan silabus atau materi perkuliahan berikut, buatkan rencana jadwal belajar yang terstruktur, bertahap, dan realistis untuk menguasai seluruh materi ini:\n\n"""\n${materialText.trim()}\n"""`;
    } else {
      prompt = `${subjectPrefix}Berikut materi perkuliahan saya. Mohon bantu saya memahaminya:\n\n"""\n${materialText.trim()}\n"""`;
    }

    onSubmit(prompt, targetAction);
    setMaterialText('');
    setSubjectName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Tempel Materi / Catatan Kuliah
              </h3>
              <p className="text-xs text-slate-500">
                Biarkan StudyMate menganalisis catatan atau silabusmu
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Mata Kuliah / Topik (Opsional)
            </label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="Contoh: Algoritma & Pemrograman, Pengantar Akuntansi, Biologi Sel..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Pilih Apa yang Ingin Kamu Lakukan:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTargetAction('summary')}
                className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-2 ${
                  targetAction === 'summary'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Ringkas Materi</div>
                  <div className="text-[11px] text-slate-500">Ekstrak poin inti & definisi</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTargetAction('explain')}
                className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-2 ${
                  targetAction === 'explain'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Jelaskan Konsep Sulit</div>
                  <div className="text-[11px] text-slate-500">Pakai analogi & contoh</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTargetAction('quiz')}
                className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-2 ${
                  targetAction === 'quiz'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Buat Soal Kuis</div>
                  <div className="text-[11px] text-slate-500">Latihan pilihan ganda & esai</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTargetAction('plan')}
                className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-start gap-2 ${
                  targetAction === 'plan'
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-600'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Rencana Belajar</div>
                  <div className="text-[11px] text-slate-500">Jadwal & target berkala</div>
                </div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tempel Teks Materi / Catatan Kuliah di Sini: <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={6}
              value={materialText}
              onChange={(e) => setMaterialText(e.target.value)}
              placeholder="Tempelkan slide kuliah, artikel jurnal, bab buku, atau catatan dosen di sini..."
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans text-slate-900"
              required
            />
            <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400">
              <span>{materialText.length} karakter</span>
              <span>Maksimal disarankan ~10.000 karakter</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!materialText.trim()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Proses dengan StudyMate</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
