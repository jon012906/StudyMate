import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  GraduationCap,
  User,
  Copy,
  Check,
  RotateCw,
  Lightbulb,
  FileText,
  HelpCircle,
  Calendar,
} from 'lucide-react';
import { ChatMessage, StudyMode } from '../types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
  isLast: boolean;
  isGenerating?: boolean;
  onRegenerate?: () => void;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  message,
  isLast,
  isGenerating,
  onRegenerate,
}) => {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy message:', e);
    }
  };

  const formatTime = (ts: number) => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(ts));
  };

  const getModeBadge = (mode?: StudyMode) => {
    switch (mode) {
      case 'explain':
        return { label: 'Penjelasan Konsep', icon: Lightbulb, color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'summary':
        return { label: 'Ringkasan Materi', icon: FileText, color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'quiz':
        return { label: 'Latihan Soal & Kuis', icon: HelpCircle, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'plan':
        return { label: 'Rencana Belajar', icon: Calendar, color: 'bg-purple-50 text-purple-700 border-purple-200' };
      default:
        return null;
    }
  };

  const modeBadge = getModeBadge(message.mode);

  return (
    <div
      className={`group flex w-full gap-3 py-2 px-2 sm:px-4 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl shadow-xs ${
          isUser
            ? 'bg-slate-800 text-white'
            : 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white'
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
        )}
      </div>

      {/* Message Content Container */}
      <div
        className={`flex flex-col max-w-[85%] sm:max-w-[78%] ${
          isUser ? 'items-end' : 'items-start'
        }`}
      >
        {/* Meta Header */}
        <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-600">
            {isUser ? 'Kamu' : 'StudyMate'}
          </span>
          {modeBadge && (
            <span
              className={`inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[10px] font-medium border ${modeBadge.color}`}
            >
              <modeBadge.icon className="w-2.5 h-2.5" />
              {modeBadge.label}
            </span>
          )}
          <span>•</span>
          <span>{formatTime(message.timestamp)}</span>
        </div>

        {/* Message Bubble Card */}
        <div
          className={`relative rounded-2xl p-4 sm:p-5 text-sm transition-shadow ${
            isUser
              ? 'bg-indigo-600 text-white rounded-tr-xs shadow-xs'
              : 'bg-white text-slate-900 border border-slate-200/90 rounded-tl-xs shadow-xs hover:border-slate-300'
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap leading-relaxed break-words font-normal">
              {message.content}
            </div>
          ) : (
            <div className="markdown-body text-slate-800">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ className, children, ...props }) {
                    const isInline = !className && typeof children === 'string' && !children.includes('\n');
                    if (isInline) {
                      return <code {...props}>{children}</code>;
                    }
                    return (
                      <div className="relative group/code my-2.5 rounded-lg overflow-hidden border border-slate-800">
                        <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 text-slate-400 text-xs font-mono border-b border-slate-800">
                          <span>{className?.replace('language-', '') || 'code'}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(String(children));
                            }}
                            className="hover:text-white transition-colors flex items-center gap-1 text-[11px]"
                            title="Salin Kode"
                          >
                            <Copy className="w-3 h-3" />
                            <span>Salin</span>
                          </button>
                        </div>
                        <pre className="!m-0 !p-3 !bg-slate-950 text-slate-100 overflow-x-auto text-xs">
                          <code {...props}>{children}</code>
                        </pre>
                      </div>
                    );
                  },
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {/* Action buttons below bubble */}
        <div
          className={`flex items-center gap-1.5 mt-1 px-1 opacity-80 group-hover:opacity-100 transition-opacity ${
            isUser ? 'flex-row-reverse' : 'flex-row'
          }`}
        >
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
            title="Salin teks pesan"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-emerald-600">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Salin</span>
              </>
            )}
          </button>

          {!isUser && isLast && !isGenerating && onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
              title="Buat ulang respon ini"
            >
              <RotateCw className="w-3 h-3" />
              <span>Regenerasi</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
