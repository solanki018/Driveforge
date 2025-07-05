# DriveForge 🚀

**DriveForge** is a powerful file summarization and analytics platform built with [Next.js](https://nextjs.org), [Supabase](https://supabase.com), and [Gemini API](https://ai.google.dev/). It allows users to upload documents, automatically generate summaries, and view file analytics in a beautiful dashboard.

🔗 Live Site: [https://driveforge-nqwi.vercel.app](https://driveforge-nqwi.vercel.app)

---

## 🚦 Features

- 🔐 **Authentication** via Supabase
- 📤 **File Uploading** (PDF, DOCX, TXT, Images)
- 📄 **Auto Text Extraction** using `pdf-parse`, `mammoth`, and `Tesseract.js`
- 🤖 **AI Summarization** via Gemini 1.5 Flash API
- 📊 **Analytics Dashboard**
  - Total uploads
  - Auto-generated summaries
  - Total used storage
  - Upload history (line chart)
- 🗂️ **Supabase Storage** integration for file hosting
- 🔁 **Drag-and-Drop Sidebar Summarizer**
- 🌙 Dark UI with Tailwind CSS

---

## 🚀 Getting Started

First, install dependencies and run the development server:

```bash
npm install
npm run dev
# or
yarn dev
