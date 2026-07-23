<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project & Supabase Agent Guidelines

## 1. Project Overview
**Tudo** is an all-in-one productivity and personal management web application built with **Next.js (App Router)** and **Supabase**. It brings together task management, smart notes/brainstorming, finance tracking, and an integrated Gemini AI assistant.

### Key Capabilities
- **Tasks & Routines**: To-do items with routine resets (daily, weekly, monthly), labels, and due dates.
- **Notes & Ideas**: Smart note-taking supporting regular notes, brainstorms, and checklists.
- **Finance Tracking**: Personal income, expenses, savings, and investments dashboard with category breakdowns.
- **AI Chat & Assistance**: Gemini-powered AI chat assistant with semantic context retrieval across tasks, notes, and financial data.

---

## 2. Technology Stack & Directory Structure

- **Framework**: Next.js `16.2.10` (React `19.2.4`) - App Router (`/app`)
- **Styling**: Tailwind CSS (`v3`), Lucide React icons (`lucide-react`)
- **Database & Auth**: Supabase SSR (`@supabase/ssr`), `@supabase/supabase-js`
- **AI Engine**: Google Gemini API (`lib/geminiAI.js`)

### Directory Layout
```
d:\Tudo\next-app\
├── app/                  # Next.js App Router (pages, layout, styles)
│   ├── page.js           # Main Dashboard container
│   ├── login/            # Auth pages (Sign in / Sign up)
│   └── globals.css       # Global styles & Tailwind directives
├── components/           # UI Components
│   ├── Header.jsx        # Navigation header
│   ├── Sidebar.jsx       # Layout sidebar
│   ├── ChatBar.jsx       # Gemini AI chat interface
│   ├── TaskList.jsx      # Tasks UI components
│   ├── NotesDashboard.jsx# Notes manager
│   └── MoneyDashboard.jsx# Personal finance dashboard
├── context/              # React Context Providers
│   └── AuthContext.jsx   # Supabase Auth provider (user, session, login/logout)
├── hooks/                # Custom React Data Hooks
│   ├── useTasks.js       # CRUD operations for tasks table
│   ├── useNotes.js       # CRUD operations for notes table
│   └── useFinance.js     # CRUD operations for transactions table
├── lib/                  # Services & Utilities
│   ├── supabase.js       # Supabase browser client setup
│   ├── supabaseHttp.js   # Lightweight direct HTTP REST client
│   ├── geminiAI.js       # Gemini AI API integration
│   └── semanticSearch.js # Context search across user data
├── .env.local            # Environment variables (Supabase & Gemini credentials)
└── AGENTS.md             # AI Agent Guidelines (this file)
```

---

## 3. Supabase Integration & Architecture

### Environment Variables
Ensure the following variables are configured in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_GEMINI_API_KEY=<your-gemini-api-key>
```

### Supabase Client Setup
- **SDK Browser Client**: Implemented in [`lib/supabase.js`](file:///d:/Tudo/next-app/lib/supabase.js) using `@supabase/ssr`'s `createBrowserClient`.
- **Direct HTTP REST Client**: Implemented in [`lib/supabaseHttp.js`](file:///d:/Tudo/next-app/lib/supabaseHttp.js) and root `supabase-http.js` for standalone API calls without full SDK overhead via PostgREST endpoints (`/rest/v1/${tableName}`).

### Authentication
Managed via [`context/AuthContext.jsx`](file:///d:/Tudo/next-app/context/AuthContext.jsx):
- Uses `supabase.auth.getSession()` and `supabase.auth.onAuthStateChange()`.
- Provides `user`, `session`, `signIn(email, password)`, `signUp(email, password)`, and `signOut()`.

---

## 4. Database Schemas & Row Level Security (RLS)

All tables require **Row Level Security (RLS)** enabled, restricting operations to rows where `auth.uid() = user_id`.

### Table: `tasks`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` / `bigint` | Primary Key |
| `user_id` | `uuid` | Foreign Key (`auth.users.id`) |
| `title` | `text` | Task title |
| `description` | `text` | Detailed description |
| `completed` | `boolean` | Status flag |
| `labels` | `jsonb` / `text[]` | Array of labels |
| `due_date` | `text` / `timestamp` | Optional due date |
| `routine` | `text` | Routine interval (`'daily'`, `'weekly'`, `'monthly'`, or `''`) |
| `last_completed` | `timestamptz` | Timestamp when task was last checked |
| `created_at` | `timestamptz` | Auto-generated creation timestamp |

### Table: `notes`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` / `bigint` | Primary Key |
| `user_id` | `uuid` | Foreign Key (`auth.users.id`) |
| `title` | `text` | Note title (default: 'Untitled Note') |
| `content` | `text` | Body content |
| `type` | `text` | Note type (`'note'`, `'brainstorm'`, `'checklist'`) |
| `labels` | `jsonb` / `text[]` | Array of category/tags |
| `created_at` | `timestamptz` | Auto-generated creation timestamp |

### Table: `transactions`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | `uuid` / `bigint` | Primary Key |
| `user_id` | `uuid` | Foreign Key (`auth.users.id`) |
| `type` | `text` | Transaction type (`'income'`, `'expense'`, `'savings'`, `'investment'`) |
| `amount` | `numeric` | Monetary value |
| `label` | `text` | Label or tag |
| `category` | `text` | Category (e.g. `'General'`, `'Food'`, `'Salary'`) |
| `description` | `text` | Optional details |
| `date` | `date` / `text` | Transaction date |
| `created_at` | `timestamptz` | Auto-generated creation timestamp |

---

## 5. Coding Standards for AI Agents

1. **Snake Case vs. Camel Case Mapping**:
   - Supabase PostgreSQL columns use `snake_case` (e.g., `user_id`, `due_date`, `last_completed`).
   - Frontend state and hooks mapping functions (`mapTaskFromDB`, `mapNoteFromDB`, `mapTransactionFromDB`) convert DB rows to `camelCase` for React components.
2. **Auth Verification**:
   - Always verify `user?.id` exists before issuing `insert`, `update`, or `delete` queries against Supabase tables.
3. **Optimistic Updates & State Sync**:
   - Custom hooks in `hooks/` encapsulate all data operations and handle local state synchronization cleanly.
4. **UI Design & Micro-animations**:
   - Maintain modern, aesthetic UI components using custom CSS variables, sleek dark elements, subtle transitions, and Lucide icons.
