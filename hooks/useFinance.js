'use client';

import { useState, useEffect, useCallback } from 'react';
import { generateUUID } from '@/lib/utils';

const STORAGE_KEY = 'celite-finance-data';

const DEFAULT_STATE = {
  transactions: [],
};

export function useFinance() {
  const [data, setData] = useState(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setData({
          transactions: Array.isArray(parsed.transactions) ? parsed.transactions : [],
        });
      } catch (e) {
        console.error('Error parsing finance data. Resetting.', e);
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

  const addTransaction = useCallback((txData) => {
    const newTx = {
      id: generateUUID(),
      type: txData.type || 'expense', // 'income' | 'expense' | 'savings' | 'investment'
      amount: Math.abs(Number(txData.amount) || 0),
      label: (txData.label || '').trim(),
      category: (txData.category || 'General').trim(),
      description: (txData.description || '').trim(),
      date: txData.date || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };
    setData((prev) => ({
      ...prev,
      transactions: [newTx, ...prev.transactions],
    }));
    return newTx;
  }, []);

  const deleteTransaction = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.filter((t) => t.id !== id),
    }));
  }, []);

  const updateTransaction = useCallback((id, updates) => {
    setData((prev) => ({
      ...prev,
      transactions: prev.transactions.map((t) =>
        t.id === id ? { ...t, ...updates, amount: Math.abs(Number(updates.amount) || 0) } : t
      ),
    }));
  }, []);

  const clearAllTransactions = useCallback(() => {
    setData({ transactions: [] });
  }, []);

  // Computed values
  const transactions = data.transactions;

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
