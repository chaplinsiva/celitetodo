import { getSupabase } from '@/lib/supabase';
import fs from 'fs';
import path from 'path';

const TMP_FILE_PATH = path.join(process.cwd(), '.next', 'github_events_cache.json');
const ALT_TMP_PATH = '/tmp/github_events_cache.json';

function getFileCachePath() {
  try {
    if (fs.existsSync('/tmp')) return ALT_TMP_PATH;
    return TMP_FILE_PATH;
  } catch {
    return TMP_FILE_PATH;
  }
}

function readEventsFromFile() {
  try {
    const filePath = getFileCachePath();
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    // ignore read errors
  }
  return [];
}

function writeEventsToFile(events) {
  try {
    const filePath = getFileCachePath();
    fs.writeFileSync(filePath, JSON.stringify(events.slice(0, 100), null, 2), 'utf8');
  } catch (err) {
    // ignore write errors
  }
}

// Memory store initialized from file cache
let inMemoryEvents = readEventsFromFile();

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

  // Add to memory & disk cache
  inMemoryEvents = [event, ...inMemoryEvents.filter((item) => item.id !== event.id)].slice(0, 100);
  writeEventsToFile(inMemoryEvents);

  // Persist to Supabase database
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
        console.warn('Supabase notice for github_events:', error.message);
      }
    }
  } catch (err) {
    console.warn('Database fallback warning:', err.message);
  }

  return event;
}

/**
 * Get all real GitHub webhook events
 */
export async function getGitHubEvents() {
  let dbEvents = [];
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('github_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (!error && Array.isArray(data) && data.length > 0) {
        dbEvents = data;
      }
    }
  } catch (err) {
    console.warn('Database fetch warning:', err.message);
  }

  // Reload file cache
  const fileEvents = readEventsFromFile();

  // Combine DB events and File/Memory events seamlessly
  const combinedMap = new Map();
  dbEvents.forEach((evt) => combinedMap.set(evt.id || `${evt.title}-${evt.created_at}`, evt));
  fileEvents.forEach((evt) => combinedMap.set(evt.id || `${evt.title}-${evt.created_at}`, evt));
  inMemoryEvents.forEach((evt) => combinedMap.set(evt.id || `${evt.title}-${evt.created_at}`, evt));

  const result = Array.from(combinedMap.values());
  result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return result.slice(0, 100);
}

/**
 * Clear stored GitHub events
 */
export async function clearGitHubEvents() {
  inMemoryEvents = [];
  writeEventsToFile([]);
  try {
    const supabase = getSupabase();
    if (supabase) {
      await supabase
        .from('github_events')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');
    }
  } catch (err) {
    // Ignore error
  }
  return true;
}
