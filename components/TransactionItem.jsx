'use client';

import { Trash2, TrendingUp, TrendingDown, PiggyBank, BarChart3, Clock } from 'lucide-react';
import { formatRelativeDate } from '@/lib/utils';

const TYPE_CONFIG = {
  income: {
    icon: TrendingUp,
    textColor: 'text-accent-green',
    bgColor: 'bg-accent-green/10',
    borderColor: 'border-accent-green/20',
    sign: '+',
    label: 'Income',
  },
  expense: {
    icon: TrendingDown,
    textColor: 'text-accent-red',
    bgColor: 'bg-accent-red/10',
    borderColor: 'border-accent-red/20',
    sign: '-',
    label: 'Expense',
  },
  savings: {
    icon: PiggyBank,
    textColor: 'text-accent-blue',
    bgColor: 'bg-accent-blue/10',
    borderColor: 'border-accent-blue/20',
    sign: '-',
    label: 'Savings',
  },
  investment: {
    icon: BarChart3,
    textColor: 'text-accent-purple',
    bgColor: 'bg-accent-purple/10',
    borderColor: 'border-accent-purple/20',
    sign: '-',
    label: 'Investment',
  },
};

export default function TransactionItem({ transaction, onDelete, onEdit }) {
  const tx = transaction;
  const config = TYPE_CONFIG[tx.type] || TYPE_CONFIG.expense;
  const Icon = config.icon;

  return (
    <li
      className="group bg-surface-card border border-border-hairline rounded-md p-4 flex gap-4 items-center transition-all duration-300 animate-spring-load hover:bg-surface-card-hover hover:border-white/12 cursor-pointer"
      onClick={() => onEdit(tx)}
    >
      <div className={`w-[38px] h-[38px] rounded-lg border flex items-center justify-center flex-shrink-0 ${config.bgColor} ${config.borderColor}`}>
        <Icon size={16} className={config.textColor} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-4">
          <span className="font-heading text-sm font-medium text-white truncate">{tx.label || tx.category}</span>
          <span className={`font-heading text-sm font-semibold whitespace-nowrap ${config.textColor}`}>
            {config.sign}₹{tx.amount.toLocaleString('en-IN')}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-1.5">
          <span className="text-[0.6rem] font-semibold text-text-secondary bg-white/5 border border-border-hairline px-2 py-0.5 rounded-sm">{tx.category}</span>
          <span className={`text-[0.6rem] font-semibold border px-1.5 py-0.5 rounded-sm ${config.textColor} ${config.borderColor.replace('/20', '/40')}`}>
            {config.label}
          </span>
          {tx.description && <span className="text-[0.7rem] text-text-secondary truncate max-w-[200px]" title={tx.description}>{tx.description}</span>}
          <span className="text-[0.65rem] text-text-muted inline-flex items-center gap-1">
            <Clock size={10} />
            {formatRelativeDate(tx.createdAt)}
          </span>
        </div>
      </div>
      <button
        className="opacity-0 group-hover:opacity-85 transition-opacity duration-150 bg-transparent border-none text-text-secondary w-7 h-7 rounded-sm flex items-center justify-center cursor-pointer hover:text-accent-red hover:bg-accent-red/10"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(tx.id);
        }}
        aria-label="Delete transaction"
      >
        <Trash2 size={14} />
      </button>
    </li>
  );
}
