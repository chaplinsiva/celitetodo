'use client';

import { useState, useEffect } from 'react';

const NOTE_TYPES = [
  { key: 'note', label: 'Note' },
  { key: 'brainstorm', label: 'Brainstorm' },
  { key: 'checklist', label: 'Checklist' },
];

export default function NoteForm({ initialData, onSubmit, onCancel, submitLabel }) {
  const [type, setType] = useState(initialData?.type || 'note');
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [labels, setLabels] = useState(initialData?.labels?.join(', ') || '');
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    setType(initialData?.type || 'note');
    setTitle(initialData?.title || '');
    setContent(initialData?.content || '');
    setLabels(initialData?.labels?.join(', ') || '');
    setTitleError('');
  }, [initialData]);

  function handleSubmit(e) {
    e.preventDefault();
    let valid = true;

    if (!title.trim()) {
      setTitleError('Title is required.');
      valid = false;
    } else {
      setTitleError('');
    }

    if (!valid) return;

    // Convert labels from comma-separated string to array
    const labelsArray = labels
      .split(',')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    onSubmit({
      type,
      title: title.trim(),
      content: content.trim(),
      labels: labelsArray.length > 0 ? labelsArray : ['General'],
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Note Type */}
      <div className="flex flex-col gap-2 mb-5">
        <label className="text-xs font-semibold text-text-primary">Note Type</label>
        <div className="grid grid-cols-3 gap-2">
          {NOTE_TYPES.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`text-xs px-2.5 py-2 rounded-full border border-transparent cursor-pointer select-none transition-all text-center ${
                type === t.key
                  ? 'bg-white text-black font-semibold'
                  : 'bg-white/5 text-text-primary hover:bg-white/10'
              }`}
              onClick={() => setType(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2 mb-5">
        <label className="text-xs font-semibold text-text-primary">
          Title <span className="text-accent-red ml-0.5">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Project Goals"
          maxLength={100}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError('');
          }}
          className={`bg-surface-input border border-transparent rounded-sm text-white px-3 py-2 font-body text-sm outline-none transition-all w-full focus:bg-white/[0.08] focus:border-border-focus focus:shadow-[0_0_0_3px_rgba(0,113,227,0.15)] ${
            titleError ? 'border-accent-red focus:border-accent-red focus:shadow-[0_0_0_3px_rgba(255,69,58,0.2)]' : ''
          }`}
        />
        {titleError && (
          <span className="text-accent-red text-[0.7rem] transition-opacity duration-150">
            {titleError}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2 mb-5">
        <label className="text-xs font-semibold text-text-primary">Content</label>
        <textarea
          placeholder={
            type === 'checklist'
              ? 'Format lists like:\n- [ ] task 1\n- [ ] task 2'
              : 'Add note details...'
          }
          rows={6}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-surface-input border border-transparent rounded-sm text-white px-3 py-2 font-body text-sm outline-none transition-all w-full focus:bg-white/[0.08] focus:border-border-focus focus:shadow-[0_0_0_3px_rgba(0,113,227,0.15)]"
        />
      </div>

      {/* Labels */}
      <div className="flex flex-col gap-2 mb-5">
        <label className="text-xs font-semibold text-text-primary">
          Labels <span className="text-[0.65rem] text-text-secondary font-normal ml-1 bg-white/5 px-1 py-0.5 rounded-sm">Optional</span>
        </label>
        <input
          type="text"
          placeholder="Ideas, Work, Personal (comma separated)"
          value={labels}
          onChange={(e) => setLabels(e.target.value)}
          className="bg-surface-input border border-transparent rounded-sm text-white px-3 py-2 font-body text-sm outline-none transition-all w-full focus:bg-white/[0.08] focus:border-border-focus focus:shadow-[0_0_0_3px_rgba(0,113,227,0.15)]"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          className="bg-white/8 border-none text-white rounded-full px-5 py-2.5 font-heading text-sm font-medium cursor-pointer transition-all hover:bg-white/15 active:scale-98"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-accent-blue text-white border-none rounded-full px-5 py-2.5 font-heading text-sm font-medium cursor-pointer transition-all hover:bg-accent-blue-hover active:scale-98"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
