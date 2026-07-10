'use client';

import { useEffect, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DeleteModal({ isOpen, onClose, onConfirm }) {
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 w-screen h-screen bg-black/80 backdrop-blur-md flex items-center justify-center z-[1000] p-4 max-h-[650px]:items-start max-h-[650px]:py-8 max-h-[650px]:overflow-y-auto"
      role="dialog"
      aria-label="Delete Task"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#1c1c1e] border border-border-hairline rounded-lg w-full max-w-[350px] p-7 shadow-[0_30px_60px_rgba(0,0,0,0.8)] animate-modal-in relative mx-auto text-center">
        <div className="w-[42px] h-[42px] bg-accent-red/10 border border-accent-red/20 text-accent-red rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={20} />
        </div>
        <h2 className="font-heading text-lg font-semibold text-white mb-2">Delete Task?</h2>
        <p className="text-text-secondary text-xs leading-normal mb-5">
          Are you sure you want to permanently delete this task? This action is irreversible.
        </p>
        <div className="flex justify-center gap-3 mt-6 w-full">
          <button
            className="flex-1 bg-white/8 border-none text-white rounded-full px-5 py-2.5 font-heading text-sm font-medium cursor-pointer transition-all hover:bg-white/15 active:scale-98"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 bg-accent-red text-white border-none rounded-full px-5 py-2.5 font-heading text-sm font-medium cursor-pointer transition-all hover:bg-accent-red-hover active:scale-98"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
