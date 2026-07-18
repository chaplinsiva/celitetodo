'use client';

import { useState, useRef, useEffect } from 'react';
import { Edit3, Trash2, Calendar, AlertCircle, Clock, RefreshCw } from 'lucide-react';
import { getLabelColor, formatDate, formatRelativeDate, getTodayString } from '@/lib/utils';

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleToggle = () => {
    if (!task.completed && !isFadingOut) {
      setIsFadingOut(true);
      timeoutRef.current = setTimeout(() => {
        onToggle(task.id);
      }, 400);
    } else if (task.completed) {
      setIsFadingOut(false);
      onToggle(task.id);
    }
  };

  const todayStr = getTodayString();
  const isOverdue = !task.completed && task.dueDate && task.dueDate < todayStr;
  const isDueToday = !task.completed && task.dueDate && task.dueDate === todayStr;

  let dueBadgeClass = 'text-text-secondary border-border-hairline';
  let DueIcon = Calendar;
  let dueLabel = '';
  if (task.dueDate) {
    dueLabel = formatDate(task.dueDate);
    if (isOverdue) {
      dueBadgeClass = 'border-accent-red/30 text-accent-red';
      DueIcon = AlertCircle;
      dueLabel = `Overdue: ${dueLabel}`;
    } else if (isDueToday) {
      dueBadgeClass = 'border-accent-yellow/30 text-accent-yellow';
      DueIcon = Clock;
      dueLabel = `Due Today: ${dueLabel}`;
    }
  }

  const routineName = task.routine
    ? task.routine.charAt(0).toUpperCase() + task.routine.slice(1)
    : '';

  const isChecked = task.completed || isFadingOut;

  return (
    <li
      className={`group bg-surface-card border rounded-md p-5 flex gap-4 items-start transition-all duration-300 ${
        isFadingOut ? 'animate-task-fade-out pointer-events-none' : 'animate-spring-load'
      } hover:bg-surface-card-hover hover:border-white/12 ${
        isChecked ? 'border-border-hairline bg-white/[0.005]' : 'border-border-hairline'
      }`}
      data-id={task.id}
    >
      <label className="block relative w-[22px] h-[22px] cursor-pointer select-none mt-0.5" aria-label="Toggle task completion">
        <input
          type="checkbox"
          className="absolute opacity-0 cursor-pointer h-0 w-0"
          checked={isChecked}
          onChange={handleToggle}
        />
        <span
          className={`absolute top-0 left-0 h-[22px] w-[22px] rounded-full border transition-all checkmark-tick ${
            isChecked
              ? 'bg-accent-blue border-accent-blue'
              : 'border-text-secondary bg-transparent hover:border-white hover:bg-white/[0.04]'
          }`}
        ></span>
      </label>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4">
          <h3
            className={`font-heading text-base font-medium text-white leading-normal break-words overflow-wrap-break-word transition-all cursor-pointer hover:text-accent-blue-hover ${
              isChecked ? 'line-through text-text-secondary opacity-55' : ''
            }`}
            onClick={() => !isFadingOut && onEdit(task)}
          >
            {task.title}
          </h3>
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-85 transition-opacity duration-150">
            <button
              className="bg-transparent border-none text-text-secondary w-7 h-7 rounded-sm flex items-center justify-center cursor-pointer transition-all hover:text-white hover:bg-white/[0.08]"
              aria-label="Edit task"
              onClick={() => onEdit(task)}
            >
              <Edit3 size={14} />
            </button>
            <button
              className="bg-transparent border-none text-text-secondary w-7 h-7 rounded-sm flex items-center justify-center cursor-pointer transition-all hover:text-accent-red hover:bg-accent-red/10"
              aria-label="Delete task"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
        {task.description && (
          <p
            className={`text-xs text-text-secondary mt-1 break-words overflow-wrap-break-word leading-normal cursor-pointer hover:text-text-primary ${
              isChecked ? 'opacity-45' : ''
            }`}
            onClick={() => !isFadingOut && onEdit(task)}
          >
            {task.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 mt-3">
          {task.dueDate && (
            <span className={`text-[0.65rem] font-medium px-1.5 py-0.5 rounded-sm inline-flex items-center gap-1 border bg-transparent ${dueBadgeClass}`}>
              <DueIcon size={12} />
              {dueLabel}
            </span>
          )}
          {task.routine && (
            <span className="text-[0.65rem] font-medium px-1.5 py-0.5 rounded-sm inline-flex items-center gap-1 border bg-transparent border-accent-purple/30 text-accent-purple">
              <RefreshCw size={12} />
              {routineName}
            </span>
          )}
          {task.labels?.map((lbl) => {
            const color = getLabelColor(lbl);
            return (
              <span
                key={lbl}
                className="text-[0.65rem] font-medium px-2 py-0.5 rounded-sm bg-transparent border"
                style={{
                  backgroundColor: `${color}20`,
                  borderColor: `${color}40`,
                  color,
                }}
              >
                {lbl}
              </span>
            );
          })}
          <span
            className="text-[0.7rem] text-text-muted inline-flex items-center gap-1 ml-auto"
            title={`Created on ${new Date(task.createdAt).toLocaleString()}`}
          >
            <Clock size={12} />
            {formatRelativeDate(task.createdAt)}
          </span>
        </div>
      </div>
    </li>
  );
}
