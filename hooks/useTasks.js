'use client';

import { useState, useEffect, useCallback } from 'react';
import { generateUUID } from '@/lib/utils';

const STORAGE_KEY = 'todo-app-data';

// Routine reset logic
function checkRoutineResets(taskList) {
  const now = new Date();
  let updatedAny = false;

  const getWeekStartString = (d) => {
    const date = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const day = date.getDay();
    date.setDate(date.getDate() - day);
    return date.toDateString();
  };

  taskList.forEach((task) => {
    if (task.routine && task.completed && task.lastCompleted) {
      const last = new Date(task.lastCompleted);
      let shouldReset = false;

      if (task.routine === 'daily') {
        const lastDayStart = new Date(last.getFullYear(), last.getMonth(), last.getDate());
        const nowDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        shouldReset = nowDayStart > lastDayStart;
      } else if (task.routine === 'weekly') {
        const lastWeekStart = getWeekStartString(last);
        const nowWeekStart = getWeekStartString(now);
        shouldReset = nowWeekStart !== lastWeekStart && now > last;
      } else if (task.routine === 'monthly') {
        const lastMonthStart = new Date(last.getFullYear(), last.getMonth(), 1);
        const nowMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        shouldReset = nowMonthStart > lastMonthStart;
      }

      if (shouldReset) {
        task.completed = false;
        task.lastCompleted = null;
        updatedAny = true;
      }
    }
  });

  return updatedAny;
}

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        let parsed = JSON.parse(stored);

        // Clean up old mock tasks
        const mockTitles = [
          'Welcome to TodoApp! 🌟',
          'Try out Daily/Weekly/Monthly Routines ↻',
          'Organize with Labels and Filters 🏷️',
        ];
        parsed = parsed.filter((t) => !mockTitles.includes(t.title));

        // Run routine resets
        checkRoutineResets(parsed);

        setTasks(parsed);
      } catch (e) {
        console.error('Error parsing stored task data. Resetting.', e);
        setTasks([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever tasks change (after initial load)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: generateUUID(),
      title: taskData.title.trim(),
      description: (taskData.description || '').trim(),
      completed: false,
      labels: taskData.labels || [],
      dueDate: taskData.dueDate || '',
      routine: taskData.routine || '',
      lastCompleted: null,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const updated = { ...task, ...updates };
        // Track completion state changes
        if ('completed' in updates && updates.completed !== task.completed) {
          updated.lastCompleted = updates.completed ? new Date().toISOString() : null;
        }
        return updated;
      })
    );
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllTasks = useCallback(() => {
    setTasks([]);
  }, []);

  const toggleTask = useCallback((id) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        const completed = !task.completed;
        return {
          ...task,
          completed,
          lastCompleted: completed ? new Date().toISOString() : null,
        };
      })
    );
  }, []);

  return { tasks, isLoaded, addTask, updateTask, deleteTask, clearAllTasks, toggleTask };
}
