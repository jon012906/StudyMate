# StudyMate 🎓 — AI Study Assistant for University Students

**StudyMate** is an AI-powered academic study companion designed specifically for university students. Built with React, Express, and Google's Gemini API, it explains complex academic concepts in simple Indonesian, summarizes lecture notes, generates practice quizzes, and builds personalized study schedules.

---

## 🌟 Key Features

1. **💡 Explain Difficult Concepts (*Jelaskan Konsep Ini*)**
   - Breaks down challenging theoretical topics using intuitive analogies and concrete real-world examples in natural Indonesian.

2. **📝 Summarize Study Material (*Ringkas Materiku*)**
   - Quickly distills long lecture notes, textbook chapters, or slides into structured key points, important definitions, and core takeaways.
   - Includes a dedicated "Tempel Catatan Kuliah" (Paste Material) modal for quick text pasting.

3. **🎯 Create Short Quizzes & Practice Questions (*Buat Kuis Singkat*)**
   - Generates university-level multiple-choice and analytical reasoning questions complete with thorough explanations and answer keys.

4. **📅 Personalized Study Plans (*Buat Rencana Belajar*)**
   - Formulates structured, realistic study timetables for exam prep (UAS/UTS) or thesis writing leveraging Active Recall and Pomodoro techniques.

5. **💬 Multi-Turn Conversation Memory**
   - Retains context across messages so students can ask contextual follow-up questions seamlessly.

6. **📥 Export Study Notes**
   - Download any chat session directly as a formatted Markdown (`.md`) file to import into Notion, Obsidian, or Google Docs.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, React Markdown (`remark-gfm`)
- **Backend:** Node.js, Express, TypeScript (`tsx`)
- **AI Model:** Google Gemini (`gemini-3.8-flash`) via the modern `@google/genai` TypeScript SDK
- **Communication:** Server-Sent Events (SSE) for real-time streaming responses

---

## 🔒 Security & API Key Privacy

- **Server-Side Only:** The `GEMINI_API_KEY` is kept strictly on the backend (`server.ts`) and is **never** bundled or exposed to the client browser.
- **Git Protection:** `.gitignore` excludes all `.env` files (`.env*`) while preserving `.env.example`, preventing accidental credential leaks when pushing to GitHub.

---

## 🚀 Getting Started Locally

### Prerequisites

- Node.js (version 20 or higher recommended)
- npm or bun
- A Gemini API Key (get one for free at [Google AI Studio](https://aistudio.google.com/apikey))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/studymate.git
   cd studymate
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the example environment file:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and add your Gemini API key:
   ```env
   GEMINI_API_KEY="your_actual_gemini_api_key_here"
   PORT=3000
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 📦 Scripts

- `npm run dev`: Starts the full-stack development server with Vite middleware on port 3000.
- `npm run build`: Builds the production bundle in the `dist` folder.
- `npm run start`: Runs the production server (`node server.ts`).
- `npm run lint`: Runs TypeScript type checking (`tsc --noEmit`).

---

## 📄 License

This project is licensed under the Apache-2.0 License.
# StudyMate
