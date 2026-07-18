<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Overview & Guidelines

## GitHub Repository Details
- **Repository URL**: `https://github.com/chaplinsiva/celitetodo.git`
- **Primary Branches**: `main` / `master`
- **Current Active Branch**: `main`

## High-Level Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19 (`react`, `react-dom`)
- **Styling**: Tailwind CSS v3 & PostCSS
- **Icons**: Lucide React (`lucide-react`)
- **Backend & Auth**: Supabase SSR (`@supabase/ssr`) & Supabase Client (`@supabase/supabase-js`)
- **AI Capabilities**: Natural language parsing for tasks, finances, and notes via Gemini AI
- **PWA Features**: Service Worker & Web App Manifest support (`/manifest.json`, `PWAInstallPrompt`)

## App Launch & Build Commands
- `npm run dev` – Starts the development server (default port 3000)
- `npm run build` – Builds the application for production
- `npm start` – Starts the Next.js production server
