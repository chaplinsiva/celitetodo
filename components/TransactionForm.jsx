'use client';

import { useState, useEffect } from 'react';

const TRANSACTION_TYPES = [
  { key: 'expense', label: 'Expense' },
  { key: 'income', label: 'Income' },
  { key: 'savings', label: 'Savings' },
  { key: 'investment', label: 'Investment' },
];

const CATEGORIES = [
  'General',
  'Food',
  'Groceries',
  'Transport',
  'Rent',
  'Bills',
  'Entertainment',
  'Shopping',
  'Health',
  'Education',
  'Salary',
  'Freelance',
  'Gift',
  'Emergency Fund',
  'Mutual Funds',
  'Stocks',
];

export default function TransactionForm({ initialData, onSubmit, onCancel, submitLabel }) {
  const [type, setType] = useState(initialData?.type || 'expense');
  const [amount, setAmount] = useState(initialData?.amount || '');
  const [label, setLabel] = useState(initialData?.label || '');
  const [category, setCategory] = useState(initialData?.category || 'General');
  const [description, setDescription] = useState(initialData?.description || '');
  const [date, setDate] = useState(
    initialData?.date || new Date().toISOString().split('T')[0]
  );
  const [amountError, setAmountError] = useState('');
  const [labelError, setLabelError] = useState('');

  useEffect(() => {
    setType(initialData?.type || 'expense');
    setAmount(initialData?.amount || '');
    setLabel(initialData?.label || '');
    setCategory(initialData?.category || 'General');
    setDescription(initialData?.description || '');
    setDate(initialData?.date || new Date().toISOString().split('T')[0]);
    setAmountError('');
    setLabelError('');
  }, [initialData]);

  function handleSubmit(e) {
    e.preventDefault();
    let valid = true;

    if (!amount || Number(amount) <= 0) {
      setAmountError('Enter a valid amount greater than 0.');
      valid = false;
    } else {
      setAmountError('');
    }

    if (!label.trim()) {
      setLabelError('Label is required.');
      valid = false;
    } else {
      setLabelError('');
    }

    if (!valid) return;

    onSubmit({
      type,
      amount: Number(amount),
      label: label.trim(),
      category,
      description: description.trim(),
      date,
    });
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Transaction Type */}
      <div className="flex flex-col gap-2 mb-5">
        <label className="text-xs font-semibold text-text-primary">Type</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {TRANSACTION_TYPES.map((t) => (
            <button
              key={t.key}
              type="button"
              className={`text-xs px-2.5 py-2 rounded-full border border-transparent cursor-pointer select-none transition-all text-center ${
                type === t.key
                  ? 'bg-white text-black font-semibold'
                  : 'bg-white/5 text-text-primary hover:bg-white/10'
              }`}
              onClick={() => setType(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Amount & Date row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-text-primary">
            Amount (₹) <span className="text-accent-red ml-0.5">*</span>
          </label>
          <input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              if (amountError) setAmountError('');
            }}
            className={`bg-surface-input border border-transparent rounded-sm text-white px-3 py-2 font-body text-sm outline-none transition-all w-full focus:bg-white/[0.08] focus:border-border-focus focus:shadow-[0_0_0_3px_rgba(0,113,227,0.15)] ${
              amountError ? 'border-accent-red focus:border-accent-red focus:shadow-[0_0_0_3px_rgba(255,69,58,0.2)]' : ''
            }`}
          />
          {amountError && (
            <span className="text-accent-red text-[0.7rem] transition-opacity duration-150">
              {amountError}
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-text-primary">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-surface-input border border-transparent rounded-sm text-white px-3 py-2 font-body text-sm outline-none transition-all w-full focus:bg-white/[0.08] focus:border-border-focus focus:shadow-[0_0_0_3px_rgba(0,113,227,0.15)]"
          />
        </div>
      </div>

      {/* Label */}
      <div className="flex flex-col gap-2 mb-5">
        <label className="text-xs font-semibold text-text-primary">
          Label / Title <span className="text-accent-red ml-0.5">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g. Groceries at Market"
          maxLength={80}
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
            if (labelError) setLabelError('');
          }}
          className={`bg-surface-input border border-transparent rounded-sm text-white px-3 py-2 font-body text-sm outline-none transition-all w-full focus:bg-white/[0.08] focus:border-border-focus focus:shadow-[0_0_0_3px_rgba(0,113,227,0.15)] ${
            labelError ? 'border-accent-red focus:border-accent-red focus:shadow-[0_0_0_3px_rgba(255,69,58,0.2)]' : ''
          }`}
        />
        {labelError && (
          <span className="text-accent-red text-[0.7rem] transition-opacity duration-150">
            {labelError}
          </span>
        )}
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2 mb-5">
        <label className="text-xs font-semibold text-text-primary">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="bg-surface-input border border-transparent rounded-sm text-white px-3 py-2 font-body text-sm outline-none transition-all w-full focus:bg-white/[0.08] focus:border-border-focus focus:shadow-[0_0_0_3px_rgba(0,113,227,0.15)]"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-2 mb-5">
        <label className="text-xs font-semibold text-text-primary">
          Description <span className="text-[0.65rem] text-text-secondary font-normal ml-1 bg-white/5 px-1 py-0.5 rounded-sm">Optional</span>
        </label>
        <textarea
          placeholder="Add extra details..."
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-surface-input border border-transparent rounded-sm text-white px-3 py-2 font-body text-sm outline-none transition-all w-full focus:bg-white/[0.08] focus:border-border-focus focus:shadow-[0_0_0_3px_rgba(0,113,227,0.15)]"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          className="bg-white/8 border-none text-white rounded-full px-5 py-2.5 font-heading text-sm font-medium cursor-pointer transition-all hover:bg-white/15 active:scale-98"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="bg-accent-blue text-white border-none rounded-full px-5 py-2.5 font-heading text-sm font-medium cursor-pointer transition-all hover:bg-accent-blue-hover active:scale-98"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
