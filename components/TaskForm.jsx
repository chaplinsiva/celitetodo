'use client';

import { useState, useEffect, useRef } from 'react';
import { parseLabels, getFormattedDateOffset } from '@/lib/utils';

const QUICK_LABELS = ['Work', 'Personal', 'Study', 'Health', 'Shopping'];
const QUICK_DATES = [
  { label: 'Today', days: 0 },
  { label: 'Tomorrow', days: 1 },
  { label: 'Next Week', days: 7 },
];

export default function TaskForm({ initialData, onSubmit, onCancel, submitLabel }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [labels, setLabels] = useState(initialData?.labels?.join(', ') || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate || '');
  const [routine, setRoutine] = useState(initialData?.routine || '');
  const [completed, setCompleted] = useState(initialData?.completed || false);
  const [titleError, setTitleError] = useState('');
  const [descError, setDescError] = useState('');
  const dateRef = useRef(null);
  const showCompleted = !!initialData;

  // Reset form when initialData changes (e.g. opening edit modal with different task)
  useEffect(() => {
    setTitle(initialData?.title || '');
    setDescription(initialData?.description || '');
    setLabels(initialData?.labels?.join(', ') || '');
    setDueDate(initialData?.dueDate || '');
    setRoutine(initialData?.routine || '');
    setCompleted(initialData?.completed || false);
    setTitleError('');
    setDescError('');
  }, [initialData]);

  const selectedLabels = parseLabels(labels).map((l) => l.toLowerCase());

  function toggleQuickLabel(labelName) {
    const current = parseLabels(labels);
    const idx = current.findIndex((l) => l.toLowerCase() === labelName.toLowerCase());
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(labelName);
    }
    setLabels(current.join(', '));
  }

  function handleDateClick() {
    if (dateRef.current && typeof dateRef.current.showPicker === 'function') {
      try {
        dateRef.current.showPicker();
      } catch (e) {
        // showPicker not supported
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    let valid = true;

    if (!title.trim()) {
      setTitleError('Title is required.');
      valid = false;
    } else if (title.length > 100) {
      setTitleError(`Maximum length exceeded (${title.length}/100).`);
      valid = false;
    } else {
      setTitleError('');
    }

    if (description.length > 1000) {
      setDescError(`Maximum length exceeded (${description.length}/1000).`);
      valid = false;
    } else {
      setDescError('');
    }

    if (!valid) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      labels: parseLabels(labels),
      dueDate,
      routine,
      completed,
    });
  }

  // Determine which quick date is active
  const activeQuickDate = dueDate
    ? [0, 1, 7].find((days) => getFormattedDateOffset(days) === dueDate)
    : undefined;

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Title */}
      <div className="flex flex-col gap-2 mb-5">
        <label className="text-xs font-semibold text-text-primary">
          Task Title <span className="text-accent-red ml-0.5">*</span>
        </label>
        <input
          type="text"
          placeholder="What needs to be done?"
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
        <div className="flex justify-between items-center mt-1 min-h-[15px]">
          <span className={`text-accent-red text-[0.7rem] transition-opacity duration-150 ${titleError ? 'opacity-100' : 'opacity-0'}`}>
            {titleError}
          </span>
          <span className="text-[0.7rem] text-text-muted">{title.length}/100</span>
        </div>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2 mb-5">
        <label className="text-xs font-semibold text-text-primary">
          Description <span className="text-[0.65rem] text-text-secondary font-normal ml-1 bg-white/5 px-1 py-0.5 rounded-sm">Optional</span>
        </label>
        <textarea
          placeholder="Provide extra details..."
          rows={3}
          maxLength={1000}
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            if (descError) setDescError('');
          }}
          className={`bg-surface-input border border-transparent rounded-sm text-white px-3 py-2 font-body text-sm outline-none transition-all w-full focus:bg-white/[0.08] focus:border-border-focus focus:shadow-[0_0_0_3px_rgba(0,113,227,0.15)] ${
            descError ? 'border-accent-red focus:border-accent-red focus:shadow-[0_0_0_3px_rgba(255,69,58,0.2)]' : ''
          }`}
        />
        <div className="flex justify-between items-center mt-1 min-h-[15px]">
          <span className={`text-accent-red text-[0.7rem] transition-opacity duration-150 ${descError ? 'opacity-100' : 'opacity-0'}`}>
            {descError}
          </span>
          <span className="text-[0.7rem] text-text-muted">{description.length}/1000</span>
        </div>
      </div>

      {/* Labels */}
      <div className="flex flex-col gap-2 mb-5">
        <label className="text-xs font-semibold text-text-primary">
          Labels <span className="text-[0.65rem] text-text-secondary font-normal ml-1 bg-white/5 px-1 py-0.5 rounded-sm">Optional</span>
        </label>
        <input
          type="text"
          placeholder="Work, Personal, Urgent (comma separated)"
          value={labels}
          onChange={(e) => setLabels(e.target.value)}
          className="bg-surface-input border border-transparent rounded-sm text-white px-3 py-2 font-body text-sm outline-none transition-all w-full focus:bg-white/[0.08] focus:border-border-focus focus:shadow-[0_0_0_3px_rgba(0,113,227,0.15)]"
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {QUICK_LABELS.map((ql) => (
            <span
              key={ql}
              className={`text-xs px-2.5 py-1 rounded-full border border-transparent cursor-pointer select-none transition-all hover:bg-white/10 ${
                selectedLabels.includes(ql.toLowerCase())
                  ? 'bg-white text-black hover:bg-white'
                  : 'bg-white/5 text-text-primary'
              }`}
              onClick={() => toggleQuickLabel(ql)}
            >
              {ql}
            </span>
          ))}
        </div>
      </div>

      {/* Due Date & Routine */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-text-primary">
            Due Date <span className="text-[0.65rem] text-text-secondary font-normal ml-1 bg-white/5 px-1 py-0.5 rounded-sm">Optional</span>
          </label>
          <input
            type="date"
            ref={dateRef}
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            onClick={handleDateClick}
            className="bg-surface-input border border-transparent rounded-sm text-white px-3 py-2 font-body text-sm outline-none transition-all w-full focus:bg-white/[0.08] focus:border-border-focus focus:shadow-[0_0_0_3px_rgba(0,113,227,0.15)]"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {QUICK_DATES.map(({ label: lbl, days }) => (
              <span
                key={days}
                className={`text-xs px-2.5 py-1 rounded-full border border-transparent cursor-pointer select-none transition-all hover:bg-white/10 ${
                  activeQuickDate === days
                    ? 'bg-white text-black hover:bg-white'
                    : 'bg-white/5 text-text-primary'
                }`}
                onClick={() => setDueDate(getFormattedDateOffset(days))}
              >
                {lbl}
              </span>
            ))}
            <span
              className="text-xs px-2.5 py-1 rounded-full border border-transparent cursor-pointer select-none transition-all bg-accent-red/10 text-accent-red hover:bg-accent-red/20"
              onClick={() => setDueDate('')}
            >
              Clear
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-text-primary">
            Routine Type <span className="text-[0.65rem] text-text-secondary font-normal ml-1 bg-white/5 px-1 py-0.5 rounded-sm">Optional</span>
          </label>
          <select
            value={routine}
            onChange={(e) => setRoutine(e.target.value)}
            className="bg-surface-input border border-transparent rounded-sm text-white px-3 py-2 font-body text-sm outline-none transition-all w-full focus:bg-white/[0.08] focus:border-border-focus focus:shadow-[0_0_0_3px_rgba(0,113,227,0.15)]"
          >
            <option value="">One-time Task</option>
            <option value="daily">Daily Reset</option>
            <option value="weekly">Weekly Reset</option>
            <option value="monthly">Monthly Reset</option>
          </select>
        </div>
      </div>

      {/* Mark as completed (edit mode only) */}
      {showCompleted && (
        <div className="mt-3 mb-5">
          <label className="relative flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              className="absolute opacity-0 cursor-pointer h-0 w-0"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            <span
              className={`absolute top-0 left-0 h-[22px] w-[22px] rounded-full border transition-all checkmark-tick ${
                completed ? 'bg-accent-blue border-accent-blue' : 'border-text-secondary bg-transparent'
              }`}
            ></span>
            <span className="text-sm text-text-primary ml-8 select-none">Mark as completed</span>
          </label>
        </div>
      )}

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          className="bg-white/8 border-none text-white rounded-full px-5 py-2.5 font-heading text-sm font-medium cursor-pointer flex items-center justify-center transition-all hover:bg-white/15 active:scale-98"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-accent-blue text-white border-none rounded-full px-5 py-2.5 font-heading text-sm font-medium cursor-pointer flex items-center justify-center gap-2 w-full md:w-auto transition-all hover:bg-accent-blue-hover active:scale-98"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
