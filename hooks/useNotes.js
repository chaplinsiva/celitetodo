'use client';

import { useState, useEffect, useCallback } from 'react';
import { generateUUID } from '@/lib/utils';

const STORAGE_KEY = 'celite-notes-data';

const DEFAULT_STATE = {
  notes: [],
};

export function useNotes() {
  const [data, setData] = useState(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData({
          notes: Array.isArray(parsed.notes) ? parsed.notes : [],
        });
      } catch (e) {
        console.error('Error parsing notes data. Resetting.', e);
        setData(DEFAULT_STATE);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    }
  }, [data, isLoaded]);

  const addNote = useCallback((noteData) => {
    const newNote = {
      id: generateUUID(),
      title: (noteData.title || 'Untitled Note').trim(),
      content: (noteData.content || '').trim(),
      type: noteData.type || 'note', // 'note' | 'brainstorm' | 'checklist'
      labels: Array.isArray(noteData.labels) ? noteData.labels : [],
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      notes: [newNote, ...prev.notes],
    }));
    return newNote;
  }, []);

  const deleteNote = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
    }));
  }, []);

  const updateNote = useCallback((id, updates) => {
    setData((prev) => ({
      ...prev,
      notes: prev.notes.map((n) => (n.id === id ? { ...n, ...updates } : n)),
    }));
  }, []);

  const clearAllNotes = useCallback(() => {
    setData({ notes: [] });
  }, []);

  const notes = data.notes;
  const noteCount = notes.filter((n) => n.type === 'note').length;
  const brainstormCount = notes.filter((n) => n.type === 'brainstorm').length;
  const checklistCount = notes.filter((n) => n.type === 'checklist').length;

  return {
    notes,
    isLoaded,
    addNote,
    deleteNote,
    updateNote,
    clearAllNotes,
    noteCount,
    brainstormCount,
    checklistCount,
  };
}
