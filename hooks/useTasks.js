'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSupabase } from '@/lib/supabase';

// Map Supabase snake_case to frontend camelCase
function mapTaskFromDB(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description || '',
    completed: row.completed,
    labels: row.labels || [],
    dueDate: row.due_date || '',
    routine: row.routine || '',
    lastCompleted: row.last_completed,
    createdAt: row.created_at,
  };
}

// Routine reset logic (runs client-side on fetched data)
function checkRoutineResets(taskList) {
  const now = new Date();
  const resetIds = [];

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
        resetIds.push(task.id);
      }
    }
  });

  return resetIds;
}

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  // Fetch tasks from Supabase on mount / user change
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setIsLoaded(true);
      return;
    }

    async function fetchTasks() {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tasks:', error);
        setTasks([]);
      } else {
        const mapped = data.map(mapTaskFromDB);
        // Run routine resets on fetched data
        const resetIds = checkRoutineResets(mapped);
        if (resetIds.length > 0) {
          for (const id of resetIds) {
            await supabase
              .from('tasks')
              .update({ completed: false, last_completed: null })
              .eq('id', id);
          }
        }
        setTasks(mapped);
      }
      setIsLoaded(true);
    }

    fetchTasks();
  }, [user]);

  const addTask = useCallback(async (taskData) => {
    if (!user) return;
    const supabase = getSupabase();

    const newTask = {
      user_id: user.id,
      title: taskData.title.trim(),
      description: (taskData.description || '').trim(),
      completed: false,
      labels: taskData.labels || [],
      due_date: taskData.dueDate || '',
      routine: taskData.routine || '',
      last_completed: null,
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single();

    if (error) {
      console.error('Error adding task:', error);
      return;
    }
    setTasks((prev) => [mapTaskFromDB(data), ...prev]);
  }, [user]);

  const updateTask = useCallback(async (id, updates) => {
    const supabase = getSupabase();

    // Map frontend field names to DB column names
    const dbUpdates = {};
    if ('title' in updates) dbUpdates.title = updates.title;
    if ('description' in updates) dbUpdates.description = updates.description;
    if ('labels' in updates) dbUpdates.labels = updates.labels;
    if ('dueDate' in updates) dbUpdates.due_date = updates.dueDate;
    if ('routine' in updates) dbUpdates.routine = updates.routine;
    if ('completed' in updates) {
      dbUpdates.completed = updates.completed;
      dbUpdates.last_completed = updates.completed ? new Date().toISOString() : null;
    }

    const { data, error } = await supabase
      .from('tasks')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      return;
    }

    setTasks((prev) => prev.map((t) => (t.id === id ? mapTaskFromDB(data) : t)));
  }, []);

  const deleteTask = useCallback(async (id) => {
    const supabase = getSupabase();
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      console.error('Error deleting task:', error);
      return;
    }
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAllTasks = useCallback(async () => {
    if (!user) return;
    const supabase = getSupabase();
    const { error } = await supabase.from('tasks').delete().eq('user_id', user.id);
    if (error) {
      console.error('Error clearing tasks:', error);
      return;
    }
    setTasks([]);
  }, [user]);

  const toggleTask = useCallback(async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const completed = !task.completed;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from('tasks')
      .update({
        completed,
        last_completed: completed ? new Date().toISOString() : null,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error toggling task:', error);
      return;
    }
    setTasks((prev) => prev.map((t) => (t.id === id ? mapTaskFromDB(data) : t)));
  }, [tasks]);

  return { tasks, isLoaded, addTask, updateTask, deleteTask, clearAllTasks, toggleTask };
}
