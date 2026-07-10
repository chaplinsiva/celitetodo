'use client';

import { Search, Brain, ClipboardList } from 'lucide-react';
import TaskItem from './TaskItem';
import { calculateSemanticScore } from '@/lib/semanticSearch';

export default function TaskList({
  tasks,
  searchQuery,
  onSearchChange,
  searchMode,
  onSearchModeChange,
  sortBy,
  onSortChange,
  activeFilter,
  activeLabelFilter,
  onToggle,
  onEdit,
  onDelete,
  onOpenAddModal,
}) {
  // 1. Calculate semantic scores if in semantic search mode
  const tasksWithScores = tasks.map(task => {
    if (searchMode === 'semantic' && searchQuery.trim()) {
      return {
        ...task,
        _semanticScore: calculateSemanticScore(searchQuery, task)
      };
    }
    return { ...task, _semanticScore: 0 };
  });

  // 2. Filter
  let filteredTasks = tasksWithScores.filter((task) => {
    // If in semantic mode, check score threshold (> 0.15 matches)
    if (searchMode === 'semantic' && searchQuery.trim()) {
      if (task._semanticScore <= 0.15) return false;
    } else if (searchQuery.trim()) {
      // Word Search (Lexical)
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(searchLower) ||
        (task.description || '').toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    if (activeFilter === 'active') return !task.completed;
    if (activeFilter === 'completed') return task.completed;
    if (activeFilter === 'routine') return !!task.routine;
    return true;
  });

  if (activeLabelFilter) {
    filteredTasks = filteredTasks.filter((task) =>
      task.labels.some((lbl) => lbl.toLowerCase() === activeLabelFilter.toLowerCase())
    );
  }

  // 3. Sort
  filteredTasks = [...filteredTasks].sort((a, b) => {
    // If semantic search is active, sort by score descending first
    if (searchMode === 'semantic' && searchQuery.trim()) {
      if (b._semanticScore !== a._semanticScore) {
        return b._semanticScore - a._semanticScore;
      }
    }

    // Fallback to normal sorting if semantic scores are equal (or word search is active)
    if (sortBy === 'createdAt-desc') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'createdAt-asc') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
    if (sortBy === 'dueDate-asc') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sortBy === 'dueDate-desc') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(b.dueDate) - new Date(a.dueDate);
    }
    return 0;
  });

  // Empty state message
  let emptyMsg = 'Your list is empty. Add a task to get started!';
  if (searchQuery) {
    if (searchMode === 'semantic') {
      emptyMsg = `No semantically similar tasks matching "${searchQuery}" found.`;
    } else {
      emptyMsg = `No tasks matching "${searchQuery}" found. Try broadening your keywords.`;
    }
  } else if (activeLabelFilter) {
    emptyMsg = `No tasks with the label "${activeLabelFilter}" fit the current filter criteria.`;
  } else if (activeFilter === 'completed') {
    emptyMsg = "You haven't completed any tasks yet. Finish a task to see it here!";
  } else if (activeFilter === 'active') {
    emptyMsg = 'All tasks are completed! Awesome job.';
  } else if (activeFilter === 'routine') {
    emptyMsg = 'No recurring routine tasks found. Select a Routine Type when creating a task.';
  }

  return (
    <section className="flex flex-col gap-8 lg:h-full lg:overflow-hidden">
      <div className="flex justify-between items-stretch gap-4 flex-wrap md:flex-row flex-col md:items-center">
        <div className="relative flex-1 min-w-[250px] w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary w-4 h-4 pointer-events-none" size={16} />
          <input
            type="text"
            className="bg-white/5 border border-transparent rounded-full text-white pl-10 pr-24 py-2 font-body text-sm outline-none w-full transition-all focus:bg-white/[0.08] focus:border-border-focus"
            placeholder={
              searchMode === 'semantic'
                ? "Semantic search: try 'workout', 'purchase', or 'chores'..."
                : "Search tasks by title or description..."
            }
            aria-label="Search tasks"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button
            type="button"
            className={`absolute right-1.5 top-1/2 -translate-y-1/2 border rounded-full px-2 py-1 text-[0.7rem] font-heading font-medium flex items-center gap-1 cursor-pointer transition-all hover:bg-white/[0.12] hover:text-white ${
              searchMode === 'semantic'
                ? 'bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 border-accent-purple/40 text-accent-purple shadow-[0_0_10px_rgba(191,90,242,0.15)] hover:from-accent-purple/30 hover:to-accent-blue/30 hover:border-accent-purple/60 hover:shadow-[0_0_12px_rgba(191,90,242,0.3)]'
                : 'bg-white/5 border-border-hairline text-text-secondary'
            }`}
            title={`Toggle Search Mode (Current: ${searchMode === 'semantic' ? 'Semantic' : 'Word'})`}
            onClick={() => onSearchModeChange(searchMode === 'word' ? 'semantic' : 'word')}
          >
            <Brain size={12} />
            <span>{searchMode === 'semantic' ? 'Semantic' : 'Word'}</span>
          </button>
        </div>
        <div className="flex items-center gap-3 justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <label htmlFor="taskSort" className="text-sm text-text-secondary">Sort by:</label>
            <select
              id="taskSort"
              className="bg-surface-card border border-border-hairline rounded-sm text-text-primary px-2.5 py-1.5 font-body text-xs outline-none cursor-pointer appearance-none pr-7 bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22%2386868b%22 stroke-width=%222%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 d=%22M19 9l-7 7-7-7%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.5rem_center] bg-[length:0.8rem] transition-all hover:border-white/25"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="dueDate-asc">Due Date (Soonest)</option>
              <option value="dueDate-desc">Due Date (Furthest)</option>
              <option value="title-asc">Title (A-Z)</option>
            </select>
          </div>
          <button
            type="button"
            className="bg-accent-blue text-white rounded-sm px-3.5 py-1.5 font-heading text-xs font-semibold hover:bg-accent-blue-hover cursor-pointer active:scale-98 transition-all"
            onClick={onOpenAddModal}
          >
            + Add Task
          </button>
        </div>
      </div>

      <div className="min-h-[250px] lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:pr-2">
        {filteredTasks.length > 0 ? (
          <ul className="list-none flex flex-col gap-3" aria-live="polite">
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-transparent border border-dashed border-border-hairline rounded-lg">
            <div className="bg-transparent w-12 h-12 flex items-center justify-center border border-border-hairline rounded-full mb-4">
              <ClipboardList className="text-text-secondary w-6 h-6" size={24} />
            </div>
            <h3 className="font-heading text-base font-semibold mb-1 text-white">No tasks found</h3>
            <p className="text-text-secondary text-xs max-w-[300px]">{emptyMsg}</p>
          </div>
        )}
      </div>
    </section>
  );
}
