'use client';

import { useState } from 'react';
import {
  Wallet,
  PiggyBank,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Search,
  ClipboardList,
} from 'lucide-react';
import TransactionItem from './TransactionItem';

const FILTER_TYPES = [
  { key: 'all', label: 'All' },
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expenses' },
  { key: 'savings', label: 'Savings' },
  { key: 'investment', label: 'Investments' },
];

export default function MoneyDashboard({
  transactions,
  totalIncome,
  totalExpenses,
  totalSavings,
  totalInvestment,
  availableBalance,
  expensesByCategory,
  onDeleteTransaction,
  onOpenAddModal,
  onEditTransaction,
}) {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter transactions
  let filtered = transactions;
  if (filterType !== 'all') {
    filtered = filtered.filter((t) => t.type === filterType);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (t) =>
        (t.label || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q)
    );
  }

  const sortedCategories = Object.entries(expensesByCategory)
    .sort((a, b) => b[1] - a[1]);

  const maxCategoryAmount = sortedCategories.length > 0 ? sortedCategories[0][1] : 1;

  return (
    <section className="flex flex-col gap-6 w-full lg:h-full lg:overflow-hidden">
      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface-panel border border-accent-blue/20 shadow-[0_0_15px_rgba(0,113,227,0.1)] rounded-lg p-5 flex items-center gap-4">
          <div className="w-[38px] h-[38px] rounded-lg bg-white/5 border border-border-hairline flex items-center justify-center text-white flex-shrink-0">
            <Wallet size={18} />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[0.7rem] text-text-secondary font-medium uppercase tracking-wider">Available Balance</span>
            <span className={`font-heading text-lg font-bold truncate ${availableBalance < 0 ? 'text-accent-red' : 'text-white'}`}>
              ₹{availableBalance.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="bg-surface-panel border border-accent-green/20 shadow-[0_0_15px_rgba(48,209,88,0.1)] rounded-lg p-5 flex items-center gap-4">
          <div className="w-[38px] h-[38px] rounded-lg bg-white/5 border border-border-hairline flex items-center justify-center text-white flex-shrink-0">
            <TrendingUp size={18} />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[0.7rem] text-text-secondary font-medium uppercase tracking-wider">Total Income</span>
            <span className="font-heading text-lg font-bold text-white truncate">
              ₹{totalIncome.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="bg-surface-panel border border-accent-blue/20 shadow-[0_0_15px_rgba(0,113,227,0.1)] rounded-lg p-5 flex items-center gap-4">
          <div className="w-[38px] h-[38px] rounded-lg bg-white/5 border border-border-hairline flex items-center justify-center text-white flex-shrink-0">
            <PiggyBank size={18} />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[0.7rem] text-text-secondary font-medium uppercase tracking-wider">Savings</span>
            <span className="font-heading text-lg font-bold text-white truncate">
              ₹{totalSavings.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="bg-surface-panel border border-accent-purple/20 shadow-[0_0_15px_rgba(191,90,242,0.1)] rounded-lg p-5 flex items-center gap-4">
          <div className="w-[38px] h-[38px] rounded-lg bg-white/5 border border-border-hairline flex items-center justify-center text-white flex-shrink-0">
            <BarChart3 size={18} />
          </div>
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-[0.7rem] text-text-secondary font-medium uppercase tracking-wider">Investments</span>
            <span className="font-heading text-lg font-bold text-white truncate">
              ₹{totalInvestment.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Expense Breakdown */}
      {sortedCategories.length > 0 && (
        <div className="bg-surface-panel border border-border-hairline rounded-lg p-5 flex flex-col gap-4">
          <h3 className="font-heading text-base font-semibold text-white tracking-tight">Expense Breakdown</h3>
          <div className="flex flex-col gap-3.5">
            {sortedCategories.map(([cat, amount]) => (
              <div key={cat} className="flex flex-col gap-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-text-primary font-medium">{cat}</span>
                  <span className="text-text-secondary font-semibold">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-accent-purple to-accent-blue rounded-full transition-all duration-500"
                    style={{ width: `${Math.max((amount / maxCategoryAmount) * 100, 4)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transaction Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4">
        <div className="flex flex-wrap gap-1.5">
          {FILTER_TYPES.map(({ key, label }) => (
            <button
              key={key}
              className={`border px-3.5 py-1.5 rounded-full font-body text-xs font-semibold cursor-pointer transition-all ${
                filterType === key
                  ? 'bg-white text-black border-white'
                  : 'bg-white/5 border-transparent text-text-secondary hover:bg-white/10 hover:text-white'
              }`}
              onClick={() => setFilterType(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:max-w-[240px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary w-3.5 h-3.5" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-transparent rounded-full text-white pl-9 pr-4 py-1.5 font-body text-xs outline-none w-full transition-all focus:bg-white/[0.08] focus:border-border-focus"
            />
          </div>
          <button
            type="button"
            className="bg-accent-blue text-white rounded-sm px-3.5 py-1.5 font-heading text-xs font-semibold hover:bg-accent-blue-hover cursor-pointer active:scale-98 transition-all shrink-0"
            onClick={onOpenAddModal}
          >
            + Add Entry
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="min-h-[250px] lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:pr-2">
        {filtered.length > 0 ? (
          <ul className="list-none flex flex-col gap-3">
            {filtered.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onDelete={onDeleteTransaction}
                onEdit={onEditTransaction}
              />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-transparent border border-dashed border-border-hairline rounded-lg">
            <div className="bg-transparent w-12 h-12 flex items-center justify-center border border-border-hairline rounded-full mb-4">
              <ClipboardList className="text-text-secondary w-6 h-6" size={24} />
            </div>
            <h3 className="font-heading text-base font-semibold mb-1 text-white">No transactions yet</h3>
            <p className="text-text-secondary text-xs max-w-[300px]">
              {searchQuery
                ? `No transactions matching "${searchQuery}".`
                : 'Type in the chat below to add income, expenses, savings, or investments.'}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
