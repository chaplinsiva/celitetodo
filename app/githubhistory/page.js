'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  GitBranch,
  GitCommit,
  GitPullRequest,
  CheckCircle2,
  User,
  Clock,
  ExternalLink,
  RefreshCw,
  Plus,
  Trash2,
  Copy,
  Check,
  ArrowLeft,
  Search,
  Code,
  Sparkles,
  Database,
  Radio,
  FileText,
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
  const [webhookUrl, setWebhookUrl] = useState('');

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

  // Auto-refresh poll every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchEvents();
    }, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchEvents]);

  async function handleAddTestEvent(branch = 'main') {
    try {
      const messages = {
        main: ['Fix login page', 'Remove ad scripts and components', 'Update layout structure', 'Fix production build warning'],
        develop: ['Add payment API', 'Implement pricing dashboard', 'Add Gemini AI prompt parser', 'Refactor auth context'],
      };
      const msgList = messages[branch] || messages.main;
      const message = msgList[Math.floor(Math.random() * msgList.length)];

      const res = await fetch('/api/github/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch,
          author: 'Siva',
          message,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchEvents();
      }
    } catch (err) {
      console.error('Failed to create test event:', err);
    }
  }

  async function handleClearEvents() {
    if (!confirm('Are you sure you want to clear the GitHub activity history?')) return;
    try {
      await fetch('/api/github/events', { method: 'DELETE' });
      setEvents([]);
    } catch (err) {
      console.error('Failed to clear events:', err);
    }
  }

  function handleCopyWebhookUrl() {
    navigator.clipboard.writeText(webhookUrl || 'https://celitetodo.vercel.app/api/github/webhook');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Filter events
  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      (evt.message || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.branch || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (evt.title || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'main') return evt.branch === 'main';
    if (activeFilter === 'develop') return evt.branch === 'develop';
    if (activeFilter === 'push') return evt.event_type === 'push';
    if (activeFilter === 'pr') return evt.event_type === 'pull_request';
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
-- Supabase SQL Migration Script for GitHub Webhook Events Table
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

-- Enable RLS & public read policy
ALTER TABLE public.github_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read github_events" ON public.github_events FOR SELECT USING (true);
CREATE POLICY "Public insert github_events" ON public.github_events FOR INSERT WITH CHECK (true);
  `.trim();

  return (
    <div className="min-h-screen bg-black text-text-primary p-4 sm:p-6 md:p-8 font-body max-w-6xl mx-auto">
      {/* Top Navbar Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border-hairline mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 border border-border-hairline text-text-secondary hover:text-white hover:bg-white/10 transition-colors"
            title="Back to App"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <GitBranch className="text-blue-400 w-6 h-6" />
                Latest GitHub Events
              </h1>
              <span className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                Live Endpoint
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-0.5">
              Real-time webhook activity history for <code className="text-blue-400 font-mono">celitetodo.vercel.app</code>
            </p>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => handleAddTestEvent('main')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-medium transition-all"
            title="Simulate Push to main"
          >
            <Plus size={14} />
            <span>+ Test Push (main)</span>
          </button>
          <button
            onClick={() => handleAddTestEvent('develop')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-md bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-medium transition-all"
            title="Simulate Push to develop"
          >
            <Plus size={14} />
            <span>+ Test Push (develop)</span>
          </button>
        </div>
      </header>

      {/* Webhook Configuration Card */}
      <section className="bg-surface-panel border border-border-hairline rounded-lg p-5 mb-6 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              GitHub Repository Webhook Setup
            </h2>
            <p className="text-xs text-text-secondary">
              Set this Payload URL in your GitHub Repository Settings (<span className="text-white">Settings &gt; Webhooks &gt; Add webhook</span>):
            </p>
            <div className="flex items-center gap-2 mt-2 bg-black/50 border border-white/10 rounded-md px-3 py-2 max-w-2xl">
              <span className="text-xs font-mono text-emerald-400 select-all truncate">
                {webhookUrl || 'https://celitetodo.vercel.app/api/github/webhook'}
              </span>
              <button
                onClick={handleCopyWebhookUrl}
                className="ml-auto flex items-center gap-1 text-xs text-text-secondary hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2 py-1 rounded"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowSqlModal(!showSqlModal)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 text-xs text-text-secondary hover:text-white border border-border-hairline transition-all"
            >
              <Database size={14} />
              <span>Supabase SQL</span>
            </button>
          </div>
        </div>

        {/* SQL Modal Snippet Dropdown */}
        {showSqlModal && (
          <div className="mt-4 pt-4 border-t border-border-hairline bg-black/40 p-4 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-medium text-white flex items-center gap-1.5">
                <Code size={14} className="text-blue-400" />
                Optional Supabase SQL Table Setup:
              </span>
              <button
                onClick={() => navigator.clipboard.writeText(sqlSnippet)}
                className="text-xs text-blue-400 hover:underline"
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
            placeholder="Filter events, commits, authors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-card border border-border-hairline rounded-md pl-9 pr-3 py-2 text-xs text-white placeholder-text-muted focus:outline-none focus:border-accent-blue transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'all', label: 'All Events' },
            { id: 'main', label: 'main' },
            { id: 'develop', label: 'develop' },
            { id: 'pr', label: 'PRs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-white/10 text-white border-white/20'
                  : 'bg-transparent text-text-secondary border-transparent hover:text-white hover:bg-white/5'
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
            title="Toggle 5s live polling"
          >
            <Radio size={12} className={autoRefresh ? 'animate-pulse' : ''} />
            <span>{autoRefresh ? 'Auto 5s' : 'Paused'}</span>
          </button>

          <button
            onClick={fetchEvents}
            disabled={refreshing}
            className="p-2 rounded-md bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white border border-border-hairline transition-all"
            title="Refresh events"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          </button>

          <button
            onClick={handleClearEvents}
            className="p-2 rounded-md bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all"
            title="Clear history"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Events List Display (Matching User Requested Example) */}
      <main className="space-y-3">
        {loading ? (
          <div className="p-12 text-center text-text-secondary flex flex-col items-center gap-3">
            <RefreshCw className="animate-spin w-6 h-6 text-blue-400" />
            <p className="text-xs">Loading GitHub activity feed...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-surface-panel border border-border-hairline rounded-lg p-12 text-center text-text-secondary flex flex-col items-center gap-3">
            <GitCommit className="w-8 h-8 text-text-muted" />
            <p className="text-sm font-medium text-white">No GitHub events recorded yet</p>
            <p className="text-xs text-text-secondary max-w-sm">
              Events received via your GitHub Webhook endpoint or simulated test events will appear here in real-time.
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleAddTestEvent('main')}
                className="px-4 py-2 rounded-md bg-blue-600 text-white text-xs font-medium hover:bg-blue-500 transition-all shadow-md shadow-blue-500/20"
              >
                + Add Test Push (main)
              </button>
              <button
                onClick={() => handleAddTestEvent('develop')}
                className="px-4 py-2 rounded-md bg-purple-600 text-white text-xs font-medium hover:bg-purple-500 transition-all shadow-md shadow-purple-500/20"
              >
                + Add Test Push (develop)
              </button>
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
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{evt.title}</span>
                      </span>

                      {evt.branch && (
                        <span
                          className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
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
                      <span className="flex items-center gap-1 font-medium text-text-primary">
                        {evt.avatar_url ? (
                          // eslint-disable-next-next/no-img-element
                          <img
                            src={evt.avatar_url}
                            alt={evt.author}
                            className="w-4 h-4 rounded-full"
                          />
                        ) : (
                          <User size={14} className="text-text-secondary" />
                        )}
                        <span>👤 {evt.author}</span>
                      </span>
                    </div>

                    {/* Row 3: Commit Message */}
                    <div className="text-xs text-text-primary font-mono bg-black/30 border border-white/5 rounded px-3 py-2 flex items-start gap-2">
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
                          className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                          title="View on GitHub"
                        >
                          <span>View</span>
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
