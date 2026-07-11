'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getSupabase } from '@/lib/supabase';

// Map Supabase snake_case to frontend camelCase
function mapTransactionFromDB(row) {
  return {
    id: row.id,
    type: row.type,
    amount: Number(row.amount),
    label: row.label || '',
    category: row.category || 'General',
    description: row.description || '',
    date: row.date || '',
    createdAt: row.created_at,
  };
}

export function useFinance() {
  const [transactions, setTransactions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  // Fetch transactions from Supabase
  useEffect(() => {
    if (!user) {
      setTransactions([]);
      setIsLoaded(true);
      return;
    }

    async function fetchTransactions() {
      const supabase = getSupabase();
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error);
        setTransactions([]);
      } else {
        setTransactions(data.map(mapTransactionFromDB));
      }
      setIsLoaded(true);
    }

    fetchTransactions();
  }, [user]);

  const addTransaction = useCallback(async (txData) => {
    if (!user) return;
    const supabase = getSupabase();

    const newTx = {
      user_id: user.id,
      type: txData.type || 'expense',
      amount: Math.abs(Number(txData.amount) || 0),
      label: (txData.label || '').trim(),
      category: (txData.category || 'General').trim(),
      description: (txData.description || '').trim(),
      date: txData.date || new Date().toISOString().split('T')[0],
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert(newTx)
      .select()
      .single();

    if (error) {
      console.error('Error adding transaction:', error);
      return;
    }
    const mapped = mapTransactionFromDB(data);
    setTransactions((prev) => [mapped, ...prev]);
    return mapped;
  }, [user]);

  const deleteTransaction = useCallback(async (id) => {
    const supabase = getSupabase();
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) {
      console.error('Error deleting transaction:', error);
      return;
    }
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const updateTransaction = useCallback(async (id, updates) => {
    const supabase = getSupabase();
    const dbUpdates = { ...updates };
    if ('amount' in dbUpdates) {
      dbUpdates.amount = Math.abs(Number(dbUpdates.amount) || 0);
    }

    const { data, error } = await supabase
      .from('transactions')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating transaction:', error);
      return;
    }
    setTransactions((prev) => prev.map((t) => (t.id === id ? mapTransactionFromDB(data) : t)));
  }, []);

  const clearAllTransactions = useCallback(async () => {
    if (!user) return;
    const supabase = getSupabase();
    const { error } = await supabase.from('transactions').delete().eq('user_id', user.id);
    if (error) {
      console.error('Error clearing transactions:', error);
      return;
    }
    setTransactions([]);
  }, [user]);

  // Computed values (from state, client-side)
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSavings = transactions
    .filter((t) => t.type === 'savings')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalInvestment = transactions
    .filter((t) => t.type === 'investment')
    .reduce((sum, t) => sum + t.amount, 0);

  const availableBalance = totalIncome - totalExpenses - totalSavings - totalInvestment;

  // Get expense breakdown by category
  const expensesByCategory = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      const cat = t.category || 'General';
      expensesByCategory[cat] = (expensesByCategory[cat] || 0) + t.amount;
    });

  // Get all unique labels
  const allLabels = [...new Set(
    transactions
      .map((t) => t.label)
      .filter(Boolean)
  )].sort();

  return {
    transactions,
    isLoaded,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    clearAllTransactions,
    totalIncome,
    totalExpenses,
    totalSavings,
    totalInvestment,
    availableBalance,
    expensesByCategory,
    allLabels,
  };
}
