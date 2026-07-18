---
name: deploy-app
description: Standardized deployment guide and automated checklist for building, verifying, and deploying the Celite Manager Next.js 16 application to platforms like Vercel, Netlify, Docker, or self-hosted Node servers. Trigger this skill whenever preparing a release, deploying the app, or configuring deployment CI/CD.
---

# Celite Manager - App Deployment Skill

This skill defines the complete workflow for testing, building, and deploying the Celite Manager Next.js application to production environments.

## 1. Pre-Deployment Verification Checklist

Before deploying to production, execute the pre-deployment verification steps:

```bash
# 1. Ensure working directory is clean on main/release branch
git status

# 2. Verify environment variables exist
# Required variables:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - GEMINI_API_KEY (or NEXT_PUBLIC_GEMINI_API_KEY)

# 3. Test production build locally
npm run build
```

---

## 2. Deployment Targets

### Option A: Vercel (Recommended for Next.js App Router)

Vercel provides native zero-config support for Next.js 16 App Router and Server Components.

#### Method 1: Vercel CLI Deployment
```bash
# Deploy preview environment
npx vercel

# Deploy directly to production
npx vercel --prod
```

#### Method 2: GitHub Integration
1. Push release branch to GitHub: `https://github.com/chaplinsiva/celitetodo.git`
2. Connect repository on [Vercel Dashboard](https://vercel.com/new).
3. Configure Environment Variables under **Project Settings > Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `GEMINI_API_KEY`
4. Trigger production build on merge to `main`.

---

### Option B: Docker Container Deployment

For containerized cloud hosting (AWS ECS, GCP Cloud Run, DigitalOcean App Platform):

1. Configure standalone output in `next.config.mjs`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
};
export default nextConfig;
```

2. Build and run Docker image:
```bash
# Build image
docker build -t celitetodo:latest .

# Run container locally on port 3000
docker run -d -p 3000:3000 --env-file .env.local --name celitetodo celitetodo:latest
```

---

### Option C: Self-Hosted Node.js / PM2 Server

For Linux VPS / Dedicated server deployments:

```bash
# Pull latest code and install dependencies
git pull origin main
npm ci

# Build optimized production bundle
npm run build

# Start or reload process using PM2
pm2 reload celite-manager || pm2 start npm --name "celite-manager" -- start
```

---

## 3. Post-Deployment Verification Checklist

After deployment completes, verify critical application paths:

- [ ] **Home Page**: Verify main dashboard renders tasks, finance widgets, and notes without console errors.
- [ ] **Auth Flow**: Confirm Supabase login, signup, and session persistence across page refreshes.
- [ ] **AI Assistant**: Test natural language command parsing (e.g. adding a task or expense via ChatBar).
- [ ] **Pricing Page**: Verify navigation to `/pricing` and plan checkout modal functionality.
- [ ] **PWA Features**: Check `/manifest.json` asset accessibility and offline service worker status.
