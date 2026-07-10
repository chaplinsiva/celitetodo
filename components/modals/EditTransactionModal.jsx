'use client';

import { useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import TransactionForm from '../TransactionForm';

export default function EditTransactionModal({ isOpen, transaction, onClose, onUpdate }) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !transaction) return null;

  function handleSubmit(data) {
    onUpdate(transaction.id, data);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000] p-4 max-h-[650px]:items-start max-h-[650px]:py-8 max-h-[650px]:overflow-y-auto"
      role="dialog"
      aria-label="Edit Transaction"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#1c1c1e] border border-border-hairline rounded-lg w-full max-w-[440px] p-7 shadow-[0_30px_60px_rgba(0,0,0,0.8)] animate-modal-in relative mx-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-heading text-xl font-semibold text-white">Edit Transaction</h2>
          <button
            className="bg-transparent border-none text-text-secondary cursor-pointer p-1 transition-colors hover:text-white"
            aria-label="Close modal"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <TransactionForm
          initialData={transaction}
          onSubmit={handleSubmit}
          onCancel={onClose}
          submitLabel="Save Changes"
        />
      </div>
    </div>
  );
}
