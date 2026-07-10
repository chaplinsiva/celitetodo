'use client';

import { useState } from 'react';
import {
  FileText,
  Lightbulb,
  CheckSquare,
  Trash2,
  Copy,
  Check,
  Search,
  ClipboardList,
} from 'lucide-react';
import { formatRelativeDate, getLabelColor } from '@/lib/utils';

const FILTER_TYPES = [
  { key: 'all', label: 'All', icon: FileText },
  { key: 'note', label: 'Notes', icon: FileText },
  { key: 'brainstorm', label: 'Brainstorms', icon: Lightbulb },
  { key: 'checklist', label: 'Checklists', icon: CheckSquare },
];

const TYPE_CONFIG = {
  note: { icon: FileText, color: 'text-accent-blue', bg: 'bg-accent-blue/10', border: 'border-accent-blue/20' },
  brainstorm: { icon: Lightbulb, color: 'text-accent-yellow', bg: 'bg-accent-yellow/10', border: 'border-accent-yellow/20' },
  checklist: { icon: CheckSquare, color: 'text-accent-purple', bg: 'bg-accent-purple/10', border: 'border-accent-purple/20' },
};

export default function NotesDashboard({ notes, onDeleteNote, onUpdateNote, onOpenAddModal, onEditNote }) {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  // Filter notes
  let filtered = notes;
  if (filterType !== 'all') {
    filtered = filtered.filter((n) => n.type === filterType);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (n) =>
        (n.title || '').toLowerCase().includes(q) ||
        (n.content || '').toLowerCase().includes(q) ||
        n.labels.some((l) => l.toLowerCase().includes(q))
    );
  }

  function handleCopy(note) {
    // Strip markdown checkbox markers if copying checklist
    const textToCopy = `${note.title}\n\n${note.content}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(note.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  function toggleChecklistItem(note, lineIndex) {
    const lines = note.content.split('\n');
    let currentIndex = 0;
    const newLines = lines.map((line) => {
      if (line.trim().startsWith('- [ ]') || line.trim().startsWith('- [x]')) {
        if (currentIndex === lineIndex) {
          currentIndex++;
          return line.includes('- [ ]')
            ? line.replace('- [ ]', '- [x]')
            : line.replace('- [x]', '- [ ]');
        }
        currentIndex++;
      }
      return line;
    });

    onUpdateNote(note.id, { content: newLines.join('\n') });
  }

  // Parse note content to HTML/React structure
  function renderNoteContent(note) {
    const content = note.content || '';

    if (note.type === 'checklist') {
      const lines = content.split('\n');
      let checkboxIdx = 0;

      return (
        <ul className="list-none flex flex-col gap-1.5 my-2">
          {lines.map((line, idx) => {
            const trimmed = line.trim();
            if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- [x]')) {
              const isChecked = trimmed.startsWith('- [x]');
              const labelText = trimmed.substring(5).trim();
              const thisIdx = checkboxIdx;
              checkboxIdx++;

              return (
                <li key={idx} className="flex items-center gap-2 text-xs">
                  <label className="relative flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      className="absolute opacity-0 cursor-pointer h-0 w-0"
                      checked={isChecked}
                      onChange={(e) => {
                        e.stopPropagation();
                        toggleChecklistItem(note, thisIdx);
                      }}
                    />
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                        isChecked
                          ? 'bg-accent-purple border-accent-purple text-white'
                          : 'border-text-secondary bg-transparent hover:border-white'
                      }`}
                    >
                      {isChecked && <Check size={10} strokeWidth={3} />}
                    </span>
                  </label>
                  <span className={`text-text-primary ${isChecked ? 'line-through text-text-muted opacity-60' : ''}`}>
                    {labelText}
                  </span>
                </li>
              );
            }
            return (
              <li key={idx} className="text-xs text-text-secondary pl-6">
                {line}
              </li>
            );
          })}
        </ul>
      );
    }

    // Default note/brainstorm view with line breaks
    return (
      <div
        className="text-xs text-text-secondary whitespace-pre-wrap leading-relaxed mt-2 select-text"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6 w-full lg:h-full lg:overflow-hidden">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex flex-wrap gap-1.5">
          {FILTER_TYPES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={`border px-3.5 py-1.5 rounded-full font-body text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
                filterType === key
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 border-transparent text-text-secondary hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => setFilterType(key)}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:max-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-transparent rounded-full text-white pl-9 pr-4 py-1.5 font-body text-xs outline-none w-full transition-all focus:bg-white/[0.08] focus:border-border-focus"
            />
          </div>
          <button
            type="button"
            className="bg-accent-blue text-white rounded-sm px-3.5 py-1.5 font-heading text-xs font-semibold hover:bg-accent-blue-hover cursor-pointer active:scale-98 transition-all shrink-0"
            onClick={onOpenAddModal}
          >
            + Add Note
          </button>
        </div>
      </div>

      {/* Grid of Notes */}
      <div className="min-h-[250px] lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:pr-2 pb-8">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((note) => {
              const config = TYPE_CONFIG[note.type] || TYPE_CONFIG.note;
              const TypeIcon = config.icon;
              return (
                <div
                  key={note.id}
                  className="group bg-surface-card border border-border-hairline rounded-lg p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:bg-surface-card-hover hover:border-white/12 cursor-pointer"
                  onClick={() => onEditNote(note)}
                >
                  <div className="flex flex-col gap-2 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center ${config.bg} ${config.color}`}>
                        <TypeIcon size={14} />
                      </div>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          className="bg-transparent border-none text-text-secondary w-7 h-7 rounded-sm flex items-center justify-center cursor-pointer transition-all hover:text-white hover:bg-white/[0.08]"
                          onClick={() => handleCopy(note)}
                          title="Copy content"
                        >
                          {copiedId === note.id ? <Check size={12} className="text-accent-green" /> : <Copy size={12} />}
                        </button>
                        <button
                          className="bg-transparent border-none text-text-secondary w-7 h-7 rounded-sm flex items-center justify-center cursor-pointer transition-all hover:text-accent-red hover:bg-accent-red/10"
                          onClick={() => onDeleteNote(note.id)}
                          title="Delete note"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    <h3 className="font-heading text-sm font-semibold text-white tracking-tight mt-1">
                      {note.title}
                    </h3>
                    {renderNoteContent(note)}
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border-hairline pt-3 mt-1">
                    <div className="flex flex-wrap gap-1">
                      {note.labels?.map((l) => {
                        const color = getLabelColor(l);
                        return (
                          <span
                            key={l}
                            className="text-[0.6rem] font-semibold px-1.5 py-0.5 rounded-sm bg-transparent border"
                            style={{
                              borderColor: `${color}40`,
                              color,
                            }}
                          >
                            {l}
                          </span>
                        );
                      })}
                    </div>
                    <span className="text-[0.65rem] text-text-muted">
                      {formatRelativeDate(note.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-transparent border border-dashed border-border-hairline rounded-lg">
            <div className="bg-transparent w-12 h-12 flex items-center justify-center border border-border-hairline rounded-full mb-4">
              <ClipboardList className="text-text-secondary w-6 h-6" size={24} />
            </div>
            <h3 className="font-heading text-base font-semibold mb-1 text-white">No notes yet</h3>
            <p className="text-text-secondary text-xs max-w-[300px]">
              {searchQuery
                ? `No notes matching "${searchQuery}".`
                : 'Type your thoughts in the chat below. The AI will clean them up and save them here.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
