'use client';

import { Layers, Circle, CheckCircle2, RefreshCw } from 'lucide-react';
import { getLabelColor } from '@/lib/utils';

import CompletedTasks from './CompletedTasks';

const FILTERS = [
  { key: 'all', label: 'All Tasks', icon: Layers },
  { key: 'active', label: 'Active', icon: Circle },
  { key: 'completed', label: 'Completed', icon: CheckCircle2 },
  { key: 'routine', label: 'Routine Tasks', icon: RefreshCw },
];

export default function Sidebar({
  tasks,
  activeFilter,
  onFilterChange,
  activeLabelFilter,
  onLabelFilterChange,
  onToggle,
  onDelete,
}) {
  const counts = {
    all: tasks.length,
    active: tasks.filter((t) => !t.completed).length,
    completed: tasks.filter((t) => t.completed).length,
    routine: tasks.filter((t) => !!t.routine).length,
  };

  // Extract unique labels with counts
  const labelCounts = {};
  tasks.forEach((task) => {
    task.labels.forEach((label) => {
      const clean = label.trim();
      if (!clean) return;
      labelCounts[clean] = (labelCounts[clean] || 0) + 1;
    });
  });
  const sortedLabels = Object.keys(labelCounts).sort((a, b) => a.localeCompare(b));

  return (
    <aside className="hidden md:grid md:grid-cols-2 md:gap-6 lg:flex lg:flex-col lg:gap-6 lg:h-full lg:overflow-y-auto lg:pr-2">
      <section className="bg-surface-panel border border-border-hairline backdrop-blur-3xl rounded-lg p-6">
        <h2 className="font-heading text-lg font-semibold mb-5 tracking-tight text-white">Filters</h2>
        <div className="flex flex-col gap-1.5" id="filterButtons">
          {FILTERS.map(({ key, label, icon: Icon }) => {
            const isActive = activeFilter === key;
            return (
              <button
                key={key}
                className={`border-none rounded-sm px-3 py-2 font-body text-sm cursor-pointer flex items-center gap-2.5 w-full transition-all ${
                  isActive
                    ? 'text-white bg-white/[0.08] font-medium'
                    : 'text-text-secondary bg-transparent font-normal hover:text-white hover:bg-white/[0.04]'
                }`}
                onClick={() => onFilterChange(key)}
              >
                <Icon size={16} />
                <span>{label}</span>
                <span
                  className={`ml-auto text-xs px-1.5 py-0.5 rounded-[6px] transition-all ${
                    isActive ? 'text-white bg-white/[0.12]' : 'text-text-secondary bg-white/[0.06]'
                  }`}
                >
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-5 pt-5 border-t border-border-hairline">
          <h3 className="text-[0.75rem] font-medium text-text-secondary uppercase tracking-wider mb-3">
            Filter by Labels
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {sortedLabels.length === 0 ? (
              <span className="text-xs text-text-muted">No labels in use.</span>
            ) : (
              sortedLabels.map((label) => {
                const color = getLabelColor(label);
                const isActive = activeLabelFilter?.toLowerCase() === label.toLowerCase();
                return (
                  <span
                    key={label}
                    className={`text-xs px-2.5 py-0.75 rounded-full border text-text-secondary cursor-pointer flex items-center gap-1.5 transition-all before:content-[''] before:inline-block before:w-1.5 before:h-1.5 before:rounded-full before:bg-current ${
                      isActive ? 'text-white' : ''
                    }`}
                    style={{
                      color,
                      backgroundColor: isActive ? `${color}25` : 'rgba(255, 255, 255, 0.04)',
                      borderColor: isActive ? color : 'rgba(255, 255, 255, 0.08)',
                    }}
                    onClick={() => onLabelFilterChange(isActive ? null : label)}
                  >
                    {label} ({labelCounts[label]})
                  </span>
                );
              })
            )}
          </div>
        </div>
      </section>

      <CompletedTasks tasks={tasks} onToggle={onToggle} onDelete={onDelete} />
    </aside>
  );
}

