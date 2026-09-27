import express from 'express';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn('⚠️ WARNING: GEMINI_API_KEY environment variable is not set. API calls will fail.');
}

const ai = new GoogleGenAI({
  apiKey: apiKey || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

const BASE_SYSTEM_INSTRUCTION = `Kamu adalah StudyMate, asisten belajar AI cerdas, ramah, dan solutif khusus untuk mahasiswa perguruan tinggi (universitas).
Tujuan utamamu adalah membantu mahasiswa memahami materi perkuliahan dengan lebih mudah, mendalam, praktis, dan terstruktur.

Karakteristik & Sikap:
1. Bahasa Default: Selalu berkomunikasi menggunakan Bahasa Indonesia yang fasih, sopan, bersahabat, dan bernuansa akademis mahasiswa (gunakan sapaan ramah seperti "kamu" atau "rekan mahasiswa"). Jika istilah teknis lazim dalam bahasa Inggris (seperti Big-O, Heap, Recursion, Mitochondria, Cash Flow, Marginal Cost), tetap gunakan istilah tersebut namun sertakan terjemahan atau konteksnya dalam bahasa Indonesia.
2. Penjelasan Konsep Sulit: Uraikan konsep teoretis/rumit dengan analogi intuitif sehari-hari, bahasa yang mudah dicerna, tanpa menghilangkan kedalaman ilmiahnya. Berikan contoh kasus nyata.
3. Ringkasan Materi: Buat ringkasan yang padat namun komprehensif, terstruktur dengan konsep utama (**bold**), poin-poin penting, dan kesimpulan intisari (takeaway).
4. Latihan Soal & Kuis:
   - Buat soal yang variatif dan relevan dengan standar ujian perguruan tinggi (pilihan ganda dengan opsi A, B, C, D atau soal penalaran analitis/studi kasus).
   - Selalu berikan pembahasan logis dan kunci jawaban yang jelas, atau pandu langkah demi langkah.
5. Rencana Belajar (Study Plan):
   - Buat jadwal belajar yang terukur, realistis, dan modular (misal per hari atau per sesi 45-60 menit berbasis metode Pomodoro / Active Recall).
   - Tentukan target capaian spesifik di setiap sesi.
6. Kejujuran Intelektual:
   - Jika suatu fakta tidak pasti, atau teori memiliki beberapa sudut pandang dalam literatur akademis, akui secara terbuka. JANGAN MENGARANG FAKTA.
7. Konfirmasi & Klarifikasi:
   - Jika pertanyaan pengguna terlalu singkat, samar, atau ambigu (misal hanya menulis "Kalkulus" atau "Hukum Pidana"), berikan respons pengantar singkat lalu tanyakan sub-topik spesifik atau silabus yang ingin difokuskan.
8. Format Respon:
   - Gunakan format Markdown yang indah dan terstruktur: judul (##, ###), penekanan teks (**tebal**), daftar bernomor/bullet, tabel perbandingan jika relevan, blockquote (>) untuk catatan penting/tips, dan blok kode dengan sintaks highlight untuk kode atau persamaan matematika.
9. Menjaga Konteks Percakapan:
   - Manfaatkan riwayat percakapan untuk menjawab pertanyaan lanjutan (follow-up) tanpa meminta pengguna mengulang dari awal.`;

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    appName: 'StudyMate',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Chat endpoint supporting SSE streaming
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, studyMode } = req.body as {
      messages: ChatMessage[];
      studyMode?: string;
    };

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({ error: 'Daftar pesan tidak boleh kosong.' });
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).json({
        error:
          'GEMINI_API_KEY belum dikonfigurasi di server. Silakan hubungkan API key di panel Secrets AI Studio.',
      });
      return;
    }

    let modeInstruction = '';
    if (studyMode === 'explain') {
      modeInstruction = '\n\n[Mode Aktif: Penjelasan Konsep] Fokuskan respons pada penjelasan konsep secara mendalam dengan analogi sederhana dan contoh kasus praktis.';
    } else if (studyMode === 'summary') {
      modeInstruction = '\n\n[Mode Aktif: Ringkasan Materi] Fokuskan respons pada ringkasan materi yang padat, terstruktur rapi dengan poin-poin utama, definisi kunci, dan intisari.';
    } else if (studyMode === 'quiz') {
      modeInstruction = '\n\n[Mode Aktif: Latihan Soal & Kuis] Fokuskan respons pada pembuatan latihan soal atau kuis interaktif (pilihan ganda/analitis) dengan opsi jawaban dan pembahasan mendidik.';
    } else if (studyMode === 'plan') {
      modeInstruction = '\n\n[Mode Aktif: Rencana Belajar] Fokuskan respons pada penyusunan rencana jadwal belajar yang sistematis, bertahap, dan realistis dengan target harian.';
    }

    // Sanitize and convert conversation messages for Gemini API
    // Ensure roles alternate and first message is from 'user'
    const formattedContents: Array<{ role: 'user' | 'model'; parts: [{ text: string }] }> = [];

    for (const msg of messages) {
      if (!msg.content || typeof msg.content !== 'string' || !msg.content.trim()) {
        continue;
      }

      const role: 'user' | 'model' = msg.role === 'assistant' ? 'model' : 'user';

      if (formattedContents.length === 0) {
        if (role === 'user') {
          formattedContents.push({ role: 'user', parts: [{ text: msg.content.trim() }] });
        }
      } else {
        const lastMsg = formattedContents[formattedContents.length - 1];
        if (lastMsg.role === role) {
          // Merge consecutive messages with the same role
          lastMsg.parts[0].text += `\n\n${msg.content.trim()}`;
        } else {
          formattedContents.push({ role, parts: [{ text: msg.content.trim() }] });
        }
      }
    }

    if (formattedContents.length === 0) {
      res.status(400).json({ error: 'Tidak ada pesan pengguna yang valid.' });
      return;
    }

    // Set SSE headers
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let streamSuccess = false;
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const responseStream = await ai.models.generateContentStream({
          model: modelName,
          contents: formattedContents,
          config: {
            systemInstruction: BASE_SYSTEM_INSTRUCTION + modeInstruction,
            temperature: 0.7,
          },
        });

        for await (const chunk of responseStream) {
          const text = chunk.text;
          if (text) {
            res.write(`data: ${JSON.stringify({ text })}\n\n`);
          }
        }

        streamSuccess = true;
        break; // Successfully streamed!
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} encountered an error:`, err?.message || err);
        const errMsg = String(err?.message || '');
        const isUnavailable = errMsg.includes('503') || errMsg.includes('UNAVAILABLE') || errMsg.includes('high demand');
        if (isUnavailable) {
          // Delay briefly before trying alternative model
          await new Promise((resolve) => setTimeout(resolve, 600));
          continue;
        } else {
          // Non-transient error, stop trying
          break;
        }
      }
    }

    if (!streamSuccess) {
      throw lastError || new Error('Gagal mendapatkan respon dari AI model.');
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    const errorMessage =
      error?.message || 'Terjadi kesalahan saat memproses permintaan dengan Gemini AI.';

    if (!res.headersSent) {
      res.status(500).json({ error: errorMessage });
    } else {
      res.write(`data: ${JSON.stringify({ error: errorMessage })}\n\n`);
      res.end();
    }
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`StudyMate server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
