import { getSupabase } from '@/lib/supabase';

// In-memory event store (holds real events received during runtime)
let inMemoryEvents = [];

/**
 * Save a new real GitHub webhook event
 */
export async function saveGitHubEvent(eventData) {
  const event = {
    id: eventData.id || `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    event_type: eventData.event_type || 'push',
    title: eventData.title || 'GitHub Event',
    author: eventData.author || 'GitHub User',
    avatar_url: eventData.avatar_url || null,
    message: eventData.message || 'Updated repository',
    branch: eventData.branch || null,
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

  // Persist to Supabase database if configured
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
        console.warn('Supabase insert notice for github_events:', error.message);
      }
    }
  } catch (err) {
    console.warn('Database note: Staging event in server memory:', err.message);
  }

  return event;
}

/**
 * Get all real GitHub webhook events
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
    console.warn('Using in-memory events cache:', err.message);
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
