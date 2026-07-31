import { getSupabase } from '@/lib/supabase';

// In-memory fallback cache (capped at 100 items)
let inMemoryEvents = [
  {
    id: 'sample-1',
    event_type: 'push',
    title: 'Push to main',
    author: 'Siva',
    avatar_url: 'https://github.com/chaplinsiva.png',
    message: 'Fix login page and remove ad scripts',
    branch: 'main',
    repo_name: 'chaplinsiva/celitetodo',
    url: 'https://github.com/chaplinsiva/celitetodo/commit/main',
    created_at: new Date(Date.now() - 1000 * 60 * 18).toISOString(), // 18 mins ago
  },
  {
    id: 'sample-2',
    event_type: 'push',
    title: 'Push to develop',
    author: 'Siva',
    avatar_url: 'https://github.com/chaplinsiva.png',
    message: 'Add payment API & pricing plan integration',
    branch: 'develop',
    repo_name: 'chaplinsiva/celitetodo',
    url: 'https://github.com/chaplinsiva/celitetodo/commit/develop',
    created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString(), // 10 mins ago
  },
  {
    id: 'sample-3',
    event_type: 'pull_request',
    title: 'PR #4 Opened',
    author: 'chaplinsiva',
    avatar_url: 'https://github.com/chaplinsiva.png',
    message: 'Feature: AI task breakdown & routine scheduling',
    branch: 'feature/ai-routines',
    repo_name: 'chaplinsiva/celitetodo',
    url: 'https://github.com/chaplinsiva/celitetodo/pull/4',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];

/**
 * Save a new GitHub webhook event
 */
export async function saveGitHubEvent(eventData) {
  const event = {
    id: eventData.id || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    event_type: eventData.event_type || 'push',
    title: eventData.title || 'Push to main',
    author: eventData.author || 'GitHub User',
    avatar_url: eventData.avatar_url || null,
    message: eventData.message || 'Updated repository',
    branch: eventData.branch || 'main',
    repo_name: eventData.repo_name || 'celitetodo',
    url: eventData.url || null,
    payload: eventData.payload || null,
    created_at: eventData.created_at || new Date().toISOString(),
  };

  // Add to in-memory store
  inMemoryEvents.unshift(event);
  if (inMemoryEvents.length > 100) {
    inMemoryEvents = inMemoryEvents.slice(0, 100);
  }

  // Attempt Supabase persistence if available
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { error } = await supabase.from('github_events').insert([
        {
          event_type: event.event_type,
          title: event.title,
          author: event.author,
          avatar_url: event.avatar_url,
          message: event.message,
          branch: event.branch,
          repo_name: event.repo_name,
          url: event.url,
          payload: event.payload,
          created_at: event.created_at,
        },
      ]);
      if (error) {
        console.warn('Supabase insert warning for github_events (using memory store fallback):', error.message);
      }
    }
  } catch (err) {
    console.warn('Supabase not available for github_events, stored in memory:', err.message);
  }

  return event;
}

/**
 * Get all stored GitHub webhook events
 */
export async function getGitHubEvents() {
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('github_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && data && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Using in-memory events fallback:', err.message);
  }

  return inMemoryEvents;
}

/**
 * Clear stored GitHub events
 */
export async function clearGitHubEvents() {
  inMemoryEvents = [];
  try {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('github_events').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    }
  } catch (err) {
    // Ignore error
  }
  return true;
}
