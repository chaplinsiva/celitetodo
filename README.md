# Celite Manager — AI-Powered Tasks, Finance & GitHub Webhooks

[![Next.js](https://img.shields.io/badge/Next.js-16.2.10-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-SSR-3ECF8E?logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?logo=vercel)](https://celitetodo.vercel.app/)

A smart, offline-first manager for tasks, finances, and notes powered by Gemini AI, featuring a live **GitHub Webhook Activity Dashboard** at [`/githubhistory`](https://celitetodo.vercel.app/githubhistory).

---

## 🌟 Features

- 🤖 **AI-Powered Parsing**: Create tasks, log finances, and structure notes using natural language powered by Gemini AI.
- 🔗 **Real-Time GitHub Webhooks**: Live GitHub commit & PR activity history page at [`/githubhistory`](https://celitetodo.vercel.app/githubhistory).
- 🌓 **Dynamic Theme Engine**: Seamless switching between sleek Dark Mode and clean Light Mode.
- 💳 **Pricing & Plans**: Tiered membership plans (Free, Pro, Enterprise) at `/pricing`.
- 📱 **PWA Ready**: Offline-first support with Service Worker & Web App Manifest.
- 🔐 **Supabase Backend**: Auth context & PostgreSQL database persistence.
- ⚡ **Automated Code Quality**: Pre-commit hooks powered by **Husky** and **lint-staged** with Prettier formatting.

---

## 🚀 Live Demo & Webhook Endpoint

- 🌐 **Live Web App**: [https://celitetodo.vercel.app](https://celitetodo.vercel.app)
- 📊 **GitHub Activity Feed**: [https://celitetodo.vercel.app/githubhistory](https://celitetodo.vercel.app/githubhistory)
- 📡 **GitHub Webhook Payload URL**: `https://celitetodo.vercel.app/api/github/webhook`

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router with Turbopack)
- **UI Library**: React 19 (`react`, `react-dom`)
- **Styling**: Tailwind CSS v3 & PostCSS
- **Icons**: Lucide React (`lucide-react`)
- **Backend & Database**: Supabase SSR (`@supabase/ssr`) & Supabase JS (`@supabase/supabase-js`)
- **AI Capabilities**: Gemini AI API
- **Code Quality**: Husky, lint-staged, Prettier, ESLint

---

## ⚙️ Quick Start & Local Setup

```bash
# 1. Clone repository
git clone https://github.com/chaplinsiva/celitetodo.git
cd celitetodo

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 Configuring GitHub Webhooks

To stream real-time GitHub commit history to your site:

1. Open your GitHub Repository (**Settings > Webhooks > Add webhook**).
2. Set **Payload URL**: `https://celitetodo.vercel.app/api/github/webhook`
3. Set **Content type**: `application/json`
4. Select **Just the push event** (or individual events).
5. Click **Add webhook**.

---

## 📜 Project Scripts

- `npm run dev` – Starts development server on port 3000
- `npm run build` – Builds production bundle
- `npm start` – Starts Next.js production server
- `npm run lint` – Runs ESLint checks
- `npm run format` – Formats code with Prettier

---

## 📄 License

Licensed under the [MIT License](LICENSE).
