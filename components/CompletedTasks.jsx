'use client';

import { useState } from 'react';
import { CheckCircle2, RotateCcw, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { formatRelativeDate } from '@/lib/utils';

export default function CompletedTasks({ tasks, onToggle, onDelete }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const completedTasks = tasks.filter((t) => t.completed);

  if (completedTasks.length === 0) {
    return (
      <section className="bg-surface-panel border border-border-hairline backdrop-blur-3xl rounded-lg p-5 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} className="text-accent-green" />
            <h2 className="font-heading text-base font-semibold text-white">Completed Tasks</h2>
          </div>
          <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-text-secondary font-medium">
            0
          </span>
        </div>
        <p className="text-xs text-text-muted mt-3">No completed tasks yet. Finish a task to see it here!</p>
      </section>
    );
  }

  return (
    <section className="bg-surface-panel border border-border-hairline backdrop-blur-3xl rounded-lg p-5 transition-all">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-left bg-transparent border-none cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-full bg-accent-green/15 flex items-center justify-center text-accent-green group-hover:bg-accent-green/25 transition-all">
            <CheckCircle2 size={15} />
          </div>
          <h2 className="font-heading text-base font-semibold text-white group-hover:text-accent-green transition-colors">
            Completed Tasks
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-accent-green/15 text-accent-green font-medium ml-1">
            {completedTasks.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-text-secondary hover:text-white p-1 rounded-sm transition-colors"
          aria-label={isExpanded ? 'Collapse completed tasks' : 'Expand completed tasks'}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {isExpanded && (
        <div className="flex flex-col gap-2 mt-3 max-h-[300px] overflow-y-auto pr-1">
          {completedTasks.map((task) => (
            <div
              key={task.id}
              className="group/item bg-white/[0.03] hover:bg-white/[0.06] border border-border-hairline/60 rounded-md p-2.5 flex items-center justify-between gap-3 transition-all animate-task-complete-in"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="w-4 h-4 rounded-full bg-accent-green/20 border border-accent-green text-accent-green flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={11} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-text-secondary line-through truncate font-medium">
                    {task.title}
                  </p>
                  {task.lastCompleted && (
                    <span className="text-[0.65rem] text-text-muted block truncate">
                      Completed {formatRelativeDate(task.lastCompleted)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={() => onToggle(task.id)}
                  title="Restore to active tasks"
                  className="p-1 rounded-sm text-text-secondary hover:text-accent-blue hover:bg-accent-blue/10 transition-all cursor-pointer"
                >
                  <RotateCcw size={13} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(task.id)}
                  title="Delete permanently"
                  className="p-1 rounded-sm text-text-secondary hover:text-accent-red hover:bg-accent-red/10 transition-all cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
