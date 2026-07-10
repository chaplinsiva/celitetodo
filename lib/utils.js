// Label Colors Mapping
export const LABEL_COLORS = {
  work: '#a855f7',
  personal: '#3b82f6',
  study: '#f59e0b',
  health: '#10b981',
  shopping: '#ec4899',
};

// Fallback dynamic HSL label color generator
export function getLabelColor(label) {
  const cleanLabel = label.trim().toLowerCase();
  if (LABEL_COLORS[cleanLabel]) {
    return LABEL_COLORS[cleanLabel];
  }
  let hash = 0;
  for (let i = 0; i < cleanLabel.length; i++) {
    hash = cleanLabel.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 65%, 55%)`;
}

// Generate a simple UUID v4
export function generateUUID() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Date formatting: "Jan 15, 2026"
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Relative date: "5m ago", "2h ago", "Yesterday"
export function formatRelativeDate(isoStr) {
  if (!isoStr) return '';
  const date = new Date(isoStr);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Parse comma-separated labels into unique trimmed array
export function parseLabels(labelText) {
  if (!labelText) return [];
  return labelText
    .split(',')
    .map((label) => label.trim())
    .filter((label) => label.length > 0)
    .filter((value, index, self) => self.indexOf(value) === index);
}

// Get formatted date string offset by N days from today
export function getFormattedDateOffset(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Get today's date string in YYYY-MM-DD
export function getTodayString() {
  return new Date().toISOString().split('T')[0];
}
