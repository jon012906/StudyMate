/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header';
import { WelcomeScreen } from './components/WelcomeScreen';
import { ChatMessageBubble } from './components/ChatMessageBubble';
import { LoadingIndicator } from './components/LoadingIndicator';
import { ChatInput } from './components/ChatInput';
import { ClearChatModal } from './components/ClearChatModal';
import { PasteMaterialModal } from './components/PasteMaterialModal';
import { ChatMessage, StudyMode } from './types';
import { AlertCircle } from 'lucide-react';

const STORAGE_KEY = 'studymate_chat_history_v1';

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved messages:', e);
    }
    return [];
  });

  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [studyMode, setStudyMode] = useState<StudyMode>('all');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [isPasteModalOpen, setIsPasteModalOpen] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Sync messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Error saving messages to localStorage:', e);
    }
  }, [messages]);

  // Scroll to bottom when new messages arrive or when generating
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior,
      });
    }
  };

  useEffect(() => {
    scrollToBottom('smooth');
  }, [messages, isGenerating]);

  // Stop generation if user clicks stop
  const handleStopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsGenerating(false);
  };

  // Send message and stream AI response
  const handleSendMessage = async (textToSend?: string, modeOverride?: StudyMode) => {
    const rawText = textToSend !== undefined ? textToSend : input;
    const trimmed = rawText.trim();
    if (!trimmed || isGenerating) return;

    const activeSelectedMode = modeOverride || studyMode;
    setErrorMessage(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: Date.now(),
      mode: activeSelectedMode,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsGenerating(true);

    const assistantPlaceholderId = `assistant-${Date.now()}`;
    const assistantMessage: ChatMessage = {
      id: assistantPlaceholderId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      mode: activeSelectedMode,
    };

    setMessages([...newMessages, assistantMessage]);

    // Setup abort controller
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      // Map messages for Gemini context
      const payloadMessages = newMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: payloadMessages,
          studyMode: activeSelectedMode,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `Server error (${response.status}): Gagal memproses permintaan.`
        );
      }

      if (!response.body) {
        throw new Error('Response body kosong dari server.');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') {
              break;
            }
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.text) {
                accumulatedText += parsed.text;
                // Update assistant message with streaming chunk
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantPlaceholderId
                      ? { ...msg, content: accumulatedText }
                      : msg
                  )
                );
              } else if (parsed.error) {
                throw new Error(parsed.error);
              }
            } catch (err: any) {
              // Ignore non-json chunk lines unless it's a critical error
              if (err.message && !dataStr.startsWith('{')) {
                // Ignore raw SSE ping
              } else if (err.message) {
                throw err;
              }
            }
          }
        }
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Generation aborted by student.');
      } else {
        console.error('Chat error:', error);
        setErrorMessage(
          error.message ||
            'Maaf, terjadi kendala koneksi ke server AI StudyMate. Silakan periksa koneksi dan coba lagi.'
        );
        // If assistant has no content yet, remove placeholder or insert friendly error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantPlaceholderId && !msg.content
              ? {
                  ...msg,
                  content:
                    '⚠️ Maaf, StudyMate tidak dapat menghasilkan jawaban saat ini karena kendala jaringan atau server. Silakan coba kembali sesaat lagi.',
                }
              : msg
          )
        );
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  // Regenerate last assistant response
  const handleRegenerateLast = () => {
    if (isGenerating || messages.length === 0) return;

    // Find last user message
    let lastUserMessageIdx = -1;
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        lastUserMessageIdx = i;
        break;
      }
    }

    if (lastUserMessageIdx === -1) return;

    const trimmedHistory = messages.slice(0, lastUserMessageIdx);
    const lastUserMsg = messages[lastUserMessageIdx];

    setMessages(trimmedHistory);
    handleSendMessage(lastUserMsg.content, lastUserMsg.mode);
  };

  // Clear chat
  const handleConfirmClear = () => {
    handleStopGeneration();
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
    setErrorMessage(null);
  };

  // Export chat as Markdown (.md)
  const handleExportChat = () => {
    if (messages.length === 0) return;

    let markdown = `# Catatan Belajar StudyMate\n`;
    markdown += `Tanggal: ${new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })}\n\n`;
    markdown += `----\n\n`;

    messages.forEach((msg) => {
      const sender = msg.role === 'user' ? '👤 Mahasiswa' : '🎓 StudyMate AI';
      const time = new Date(msg.timestamp).toLocaleTimeString('id-ID');
      markdown += `### ${sender} (${time})\n\n`;
      markdown += `${msg.content}\n\n`;
      markdown += `---\n\n`;
    });

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `StudyMate-Catatan-${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Select sample prompt from welcome screen
  const handleSelectSamplePrompt = (promptText: string, mode?: StudyMode) => {
    if (mode) {
      setStudyMode(mode);
    }
    handleSendMessage(promptText, mode);
  };

  // Handle submit from paste lecture material modal
  const handlePasteSubmit = (formattedPrompt: string, mode: StudyMode) => {
    setStudyMode(mode);
    handleSendMessage(formattedPrompt, mode);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 text-slate-900 overflow-hidden font-sans">
      {/* Header bar */}
      <Header
        messageCount={messages.length}
        studyMode={studyMode}
        onSelectMode={setStudyMode}
        onClearChat={() => setIsClearModalOpen(true)}
        onExportChat={handleExportChat}
        onOpenPasteModal={() => setIsPasteModalOpen(true)}
      />

      {/* Main chat messages container */}
      <main
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto flex flex-col px-2 sm:px-4 py-4 w-full"
      >
        {messages.length === 0 ? (
          <WelcomeScreen
            onSelectPrompt={handleSelectSamplePrompt}
            onOpenPasteModal={() => setIsPasteModalOpen(true)}
          />
        ) : (
          <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col space-y-1">
            {messages.map((message, index) => {
              const isLast = index === messages.length - 1;
              // Skip rendering empty assistant message placeholder if still thinking (LoadingIndicator handles it)
              if (message.role === 'assistant' && !message.content && isGenerating) {
                return null;
              }

              return (
                <ChatMessageBubble
                  key={message.id}
                  message={message}
                  isLast={isLast}
                  isGenerating={isGenerating}
                  onRegenerate={handleRegenerateLast}
                />
              );
            })}

            {isGenerating && (
              <LoadingIndicator mode={studyMode} />
            )}
          </div>
        )}

        {/* Error notification banner */}
        {errorMessage && (
          <div className="max-w-4xl w-full mx-auto px-4 my-2">
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl shadow-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="flex-1">{errorMessage}</span>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="font-bold hover:underline ml-2"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Fixed bottom chat input */}
      <footer className="w-full bg-gradient-to-t from-slate-50 via-slate-50/90 to-transparent pt-2">
        <ChatInput
          input={input}
          setInput={setInput}
          onSend={() => handleSendMessage()}
          onStop={handleStopGeneration}
          isGenerating={isGenerating}
          activeMode={studyMode}
          setActiveMode={setStudyMode}
          onOpenPasteModal={() => setIsPasteModalOpen(true)}
        />
      </footer>

      {/* Helper Modals */}
      <ClearChatModal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        onConfirm={handleConfirmClear}
      />

      <PasteMaterialModal
        isOpen={isPasteModalOpen}
        onClose={() => setIsPasteModalOpen(false)}
        onSubmit={handlePasteSubmit}
      />
    </div>
  );
}
