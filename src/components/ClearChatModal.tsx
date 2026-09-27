import React from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';

interface ClearChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ClearChatModal: React.FC<ClearChatModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600 mb-4">
          <Trash2 className="h-6 w-6" />
        </div>

        <h3 className="text-base font-bold text-slate-900">
          Hapus Riwayat Percakapan?
        </h3>

        <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
          Semua pesan dalam sesi ini akan dihapus dan memori konteks percakapan akan diatur ulang dari awal. Tindakan ini tidak dapat dibatalkan.
        </p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-700 shadow-xs transition-colors"
          >
            Ya, Hapus Chat
          </button>
        </div>
      </div>
    </div>
  );
};
