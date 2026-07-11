'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSupabase } from '@/lib/supabase';

// Map Supabase snake_case to frontend camelCase
function mapNoteFromDB(row) {
  return {
    id: row.id,
    title: row.title || 'Untitled Note',
    content: row.content || '',
    type: row.type || 'note',
    labels: row.labels || [],
    createdAt: row.created_at,
  };
}

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  // Fetch notes from Supabase
  useEffect(() => {
    if (!user) {
      setNotes([]);
      setIsLoaded(true);
      return;
    }

    async function fetchNotes() {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notes:', error);
        setNotes([]);
      } else {
        setNotes(data.map(mapNoteFromDB));
      }
      setIsLoaded(true);
    }

    fetchNotes();
  }, [user]);

  const addNote = useCallback(async (noteData) => {
    if (!user) return;
    const supabase = getSupabase();

    const newNote = {
      user_id: user.id,
      title: (noteData.title || 'Untitled Note').trim(),
      content: (noteData.content || '').trim(),
      type: noteData.type || 'note',
      labels: Array.isArray(noteData.labels) ? noteData.labels : [],
    };

    const { data, error } = await supabase
      .from('notes')
      .insert(newNote)
      .select()
      .single();

    if (error) {
      console.error('Error adding note:', error);
      return;
    }
    const mapped = mapNoteFromDB(data);
    setNotes((prev) => [mapped, ...prev]);
    return mapped;
  }, [user]);

  const deleteNote = useCallback(async (id) => {
    const supabase = getSupabase();
    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (error) {
      console.error('Error deleting note:', error);
      return;
    }
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const updateNote = useCallback(async (id, updates) => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('notes')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating note:', error);
      return;
    }
    setNotes((prev) => prev.map((n) => (n.id === id ? mapNoteFromDB(data) : n)));
  }, []);

  const clearAllNotes = useCallback(async () => {
    if (!user) return;
    const supabase = getSupabase();
    const { error } = await supabase.from('notes').delete().eq('user_id', user.id);
    if (error) {
      console.error('Error clearing notes:', error);
      return;
    }
    setNotes([]);
  }, [user]);

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
