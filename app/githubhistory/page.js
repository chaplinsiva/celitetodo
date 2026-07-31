'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  GitBranch,
  GitCommit,
  CheckCircle2,
  User,
  Clock,
  ExternalLink,
  RefreshCw,
  Trash2,
  Copy,
  Check,
  ArrowLeft,
  Search,
  Code,
  Sparkles,
  Database,
  Radio,
  GitPullRequest,
  AlertCircle,
} from 'lucide-react';

export default function GitHubHistoryPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [copied, setCopied] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('https://celitetodo.vercel.app/api/github/webhook');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      setWebhookUrl(`${origin}/api/github/webhook`);
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    try {
      setRefreshing(true);
      const res = await fetch('/api/github/events');
      const data = await res.json();
      if (data.success && Array.isArray(data.events)) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error('Failed to fetch GitHub events:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Live polling every 4 seconds for instant real webhook updates
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchEvents();
    }, 4000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchEvents]);

  async function handleClearEvents() {
    if (!confirm('Clear the current GitHub event logs?')) return;
    try {
      await fetch('/api/github/events', { method: 'DELETE' });
      setEvents([]);
    } catch (err) {
      console.error('Failed to clear events:', err);
    }
  }

  function handleCopyWebhookUrl() {
    navigator.clipboard.writeText(webhookUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      (evt.message || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.branch || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.title || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'push') return evt.event_type === 'push';
    if (activeFilter === 'pr') return evt.event_type === 'pull_request';
    if (activeFilter === 'issues') return evt.event_type === 'issues';
    return true;
  });

  function formatTime(isoString) {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return '';
    }
  }

  function formatRelativeTime(isoString) {
    if (!isoString) return '';
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(diffMs / (1000 * 60));
      if (mins < 1) return 'Just now';
      if (mins < 60) return `${mins}m ago`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    } catch {
      return '';
    }
  }

  const sqlSnippet = `
-- Supabase SQL Table for GitHub Webhook Events
CREATE TABLE IF NOT EXISTS public.github_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type TEXT NOT NULL DEFAULT 'push',
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  avatar_url TEXT,
  message TEXT,
  branch TEXT,
  repo_name TEXT,
  url TEXT,
  payload JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Public access policy
ALTER TABLE public.github_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read" ON public.github_events FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.github_events FOR INSERT WITH CHECK (true);
  `.trim();

  return (
    <div className="min-h-screen bg-surface-primary text-text-primary p-4 sm:p-6 md:p-8 font-body max-w-6xl mx-auto">
      {/* Top Navbar Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border-hairline mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-border-hairline text-text-secondary hover:text-text-primary hover:bg-white/10 transition-colors"
            title="Back to App"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-bold tracking-tight text-text-primary flex items-center gap-2">
                <GitPullRequest className="text-accent-blue w-6 h-6" />
                Live GitHub Webhook History
              </h1>
              <span className="flex items-center gap-1.5 text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                Real-Time Listening
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Live GitHub repository events for <code className="text-accent-blue font-mono">celitetodo</code>
            </p>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-2">
          <button
            onClick={fetchEvents}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary border border-border-hairline text-xs font-medium transition-all"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      {/* Real GitHub Webhook Configuration Setup Box */}
      <section className="bg-surface-panel border border-border-hairline rounded-lg p-5 mb-6 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-accent-yellow" />
              Configure Real GitHub Webhook
            </h2>
            <p className="text-xs text-text-secondary">
              Add this Payload URL in your GitHub repo under <span className="text-text-primary font-medium">Settings &gt; Webhooks &gt; Add webhook</span>:
            </p>
            <div className="flex items-center gap-2 mt-2 bg-black/50 border border-border-hairline rounded-md px-3 py-2 max-w-2xl">
              <span className="text-xs font-mono text-emerald-400 select-all truncate">
                {webhookUrl}
              </span>
              <button
                onClick={handleCopyWebhookUrl}
                className="ml-auto flex items-center gap-1 text-xs text-text-secondary hover:text-text-primary transition-colors bg-white/5 hover:bg-white/10 px-2.5 py-1 rounded"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? 'Copied URL!' : 'Copy'}</span>
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSqlModal(!showSqlModal)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 text-xs text-text-secondary hover:text-text-primary border border-border-hairline transition-all"
            >
              <Database size={14} />
              <span>Supabase Schema</span>
            </button>
          </div>
        </div>

        {/* Webhook Instructions */}
        <div className="mt-4 pt-3 border-t border-border-hairline grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-text-secondary">
          <div className="flex items-start gap-2">
            <span className="text-accent-blue font-bold">1.</span>
            <span>Content type: <strong className="text-text-primary font-mono">application/json</strong></span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-accent-blue font-bold">2.</span>
            <span>Events: Select <strong className="text-text-primary">Just the push event</strong> (or Individual events)</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-accent-blue font-bold">3.</span>
            <span>Click <strong className="text-emerald-400">Add webhook</strong> — events will stream live below!</span>
          </div>
        </div>

        {/* SQL Schema snippet dropdown */}
        {showSqlModal && (
          <div className="mt-4 pt-4 border-t border-border-hairline bg-black/40 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-text-primary flex items-center gap-1.5">
                <Code size={14} className="text-accent-blue" />
                Supabase SQL Setup Query:
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(sqlSnippet)}
                className="text-xs text-accent-blue hover:underline"
              >
                Copy SQL
              </button>
            </div>
            <pre className="text-[11px] font-mono text-text-secondary overflow-x-auto bg-black p-3 rounded border border-white/5 leading-relaxed">
              {sqlSnippet}
            </pre>
          </div>
        )}
      </section>

      {/* Controls & Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            placeholder="Search commits, authors, branches..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-card border border-border-hairline rounded-md pl-9 pr-3 py-2 text-xs text-text-primary placeholder-text-muted focus:outline-none focus:border-accent-blue transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'push', label: 'Pushes' },
            { id: 'pr', label: 'Pull Requests' },
            { id: 'issues', label: 'Issues' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-white/10 text-text-primary border-white/20'
                  : 'bg-transparent text-text-secondary border-transparent hover:text-text-primary hover:bg-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border transition-all ${
              autoRefresh
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                : 'bg-white/5 text-text-secondary border-border-hairline'
            }`}
            title="Toggle 4s live polling"
          >
            <Radio size={12} className={autoRefresh ? 'animate-pulse' : ''} />
            <span>{autoRefresh ? 'Live Polling 4s' : 'Polling Paused'}</span>
          </button>

          {events.length > 0 && (
            <button
              onClick={handleClearEvents}
              className="p-2 rounded-md bg-accent-red/10 hover:bg-accent-red/20 text-accent-red border border-accent-red/20 transition-all"
              title="Clear events log"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Events List Display */}
      <main className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-text-secondary flex flex-col items-center gap-3">
            <RefreshCw className="animate-spin w-6 h-6 text-accent-blue" />
            <p className="text-xs">Connecting to GitHub webhook stream...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-surface-panel border border-border-hairline rounded-lg p-12 text-center text-text-secondary flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-1">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <p className="text-base font-semibold text-text-primary">Awaiting Real GitHub Webhook Events...</p>
            <p className="text-xs text-text-secondary max-w-md leading-relaxed">
              No mock data generated. When you perform a <code className="text-accent-blue font-mono">git push</code> to your GitHub repository, GitHub will post the live payload to <code className="text-emerald-400 font-mono">/api/github/webhook</code> and it will display here automatically in real time!
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-black/40 border border-white/10 text-xs font-mono text-text-secondary">
              <AlertCircle size={13} className="text-accent-yellow" />
              <span>Ready & Listening on <strong className="text-text-primary">{webhookUrl}</strong></span>
            </div>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const isMain = evt.branch === 'main';
            const isDevelop = evt.branch === 'develop';

            return (
              <div
                key={evt.id}
                className="group relative bg-surface-panel hover:bg-surface-panel/90 border border-border-hairline hover:border-white/20 rounded-lg p-4 sm:p-5 transition-all duration-200 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Event Details */}
                  <div className="flex-1 space-y-2">
                    {/* Row 1: Event Title / Branch Badge */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-text-primary">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{evt.title}</span>
                      </span>

                      {evt.branch && (
                        <span
                          className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full border ${
                            isMain
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : isDevelop
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                              : 'bg-white/5 text-text-secondary border-white/10'
                          }`}
                        >
                          {evt.branch}
                        </span>
                      )}

                      {evt.repo_name && (
                        <span className="text-[11px] text-text-muted font-mono">
                          {evt.repo_name}
                        </span>
                      )}
                    </div>

                    {/* Row 2: Author */}
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <span className="flex items-center gap-1.5 font-medium text-text-primary">
                        {evt.avatar_url ? (
                          // eslint-disable-next-next/no-img-element
                          <img
                            src={evt.avatar_url}
                            alt={evt.author}
                            className="w-4 h-4 rounded-full border border-white/10"
                          />
                        ) : (
                          <User size={14} className="text-text-secondary" />
                        )}
                        <span>👤 {evt.author}</span>
                      </span>
                    </div>

                    {/* Row 3: Commit Message */}
                    <div className="text-xs text-text-primary font-mono bg-black/40 border border-white/5 rounded px-3 py-2 flex items-start gap-2">
                      <span className="text-text-secondary select-none">📝</span>
                      <span className="break-all">{evt.message}</span>
                    </div>
                  </div>

                  {/* Right side: Timestamp & External Link */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 border-white/5 pt-2 sm:pt-0 text-xs text-text-secondary gap-2">
                    <div className="flex items-center gap-1 font-mono text-text-secondary">
                      <Clock size={13} className="text-text-muted" />
                      <span>🕒 {formatTime(evt.created_at)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-text-muted">
                        {formatRelativeTime(evt.created_at)}
                      </span>

                      {evt.url && (
                        <a
                          href={evt.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs text-accent-blue hover:underline transition-colors"
                          title="View on GitHub"
                        >
                          <span>View Commit</span>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
