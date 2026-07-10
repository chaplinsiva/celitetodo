'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Key,
  X,
  Check,
  Loader2,
  AlertCircle,
  ChevronUp,
  Trash2,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  BarChart3,
  FileText,
  Lightbulb,
  CheckSquare,
} from 'lucide-react';
import {
  getStoredApiKey,
  setStoredApiKey,
  parseMessage,
} from '@/lib/geminiAI';

const FINANCE_ICONS = {
  income: TrendingUp,
  expense: TrendingDown,
  savings: PiggyBank,
  investment: BarChart3,
};

const FINANCE_COLORS = {
  income: 'text-accent-green',
  expense: 'text-accent-red',
  savings: 'text-accent-blue',
  investment: 'text-accent-purple',
};

const FINANCE_BGS = {
  income: 'bg-accent-green/20',
  expense: 'bg-accent-red/20',
  savings: 'bg-accent-blue/20',
  investment: 'bg-accent-purple/20',
};

const NOTE_ICONS = {
  note: FileText,
  brainstorm: Lightbulb,
  checklist: CheckSquare,
};

const NOTE_COLORS = {
  note: 'text-accent-blue',
  brainstorm: 'text-accent-yellow',
  checklist: 'text-accent-purple',
};

const NOTE_BGS = {
  note: 'bg-accent-blue/20',
  brainstorm: 'bg-accent-yellow/20',
  checklist: 'bg-accent-purple/20',
};

export default function ChatBar({
  onAddTask,
  onAddTransaction,
  onAddNote,
  onClearTasks,
  onClearTransactions,
  onClearNotes,
  activeTab,
}) {
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const stored = getStoredApiKey();
    setHasKey(!!stored);
    setApiKey(stored);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  function handleSaveKey() {
    const trimmed = apiKey.trim();
    if (trimmed) {
      setStoredApiKey(trimmed);
      setHasKey(true);
      setShowKeyInput(false);
      setError('');
    }
  }

  function handleRemoveKey() {
    setStoredApiKey('');
    setApiKey('');
    setHasKey(false);
    setShowKeyInput(false);
  }

  async function handleSend() {
    const text = message.trim();
    if (!text || isProcessing) return;

    if (!hasKey) {
      setShowKeyInput(true);
      setError('Set your Gemini API key first.');
      return;
    }

    setError('');
    setMessage('');
    setIsProcessing(true);
    setShowHistory(true);

    setChatHistory((prev) => [
      ...prev,
      { role: 'user', text, timestamp: Date.now() },
    ]);

    try {
      const actions = await parseMessage(text, getStoredApiKey(), activeTab);

      const newHistoryItems = [];

      actions.forEach((act) => {
        if (act.type === 'clear_finance') {
          onClearTransactions?.();
          newHistoryItems.push({
            role: 'system_action',
            text: 'Cleared all transactions.',
            timestamp: Date.now(),
          });
        } else if (act.type === 'clear_tasks') {
          onClearTasks?.();
          newHistoryItems.push({
            role: 'system_action',
            text: 'Cleared all tasks.',
            timestamp: Date.now(),
          });
        } else if (act.type === 'clear_notes') {
          onClearNotes?.();
          newHistoryItems.push({
            role: 'system_action',
            text: 'Cleared all notes.',
            timestamp: Date.now(),
          });
        } else if (act.type === 'clear_all') {
          onClearTransactions?.();
          onClearTasks?.();
          onClearNotes?.();
          newHistoryItems.push({
            role: 'system_action',
            text: 'Cleared all data.',
            timestamp: Date.now(),
          });
        } else if (act.type === 'finance') {
          onAddTransaction(act.data);
          newHistoryItems.push({
            role: 'finance',
            text: `${act.data.type}: ₹${act.data.amount.toLocaleString('en-IN')}`,
            financeData: act.data,
            timestamp: Date.now(),
          });
        } else if (act.type === 'note') {
          onAddNote(act.data);
          newHistoryItems.push({
            role: 'note',
            text: `Note: "${act.data.title}"`,
            noteData: act.data,
            timestamp: Date.now(),
          });
        } else {
          onAddTask(act.data);
          newHistoryItems.push({
            role: 'task',
            text: `Task: "${act.data.title}"`,
            taskData: act.data,
            timestamp: Date.now(),
          });
        }
      });

      setChatHistory((prev) => [...prev, ...newHistoryItems]);
    } catch (err) {
      const errMsg = err.message || 'Failed to process your request.';
      setChatHistory((prev) => [
        ...prev,
        { role: 'error', text: errMsg, timestamp: Date.now() },
      ]);
      setError(errMsg);
    } finally {
      setIsProcessing(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function clearHistory() {
    setChatHistory([]);
    setShowHistory(false);
  }

  const placeholders = {
    tasks: 'Type a task... "attend meeting tomorrow"',
    money: 'Type a transaction... "spent 500 on food"',
    notes: 'Type messy thoughts or ideas... "ideas for game dark theme custom icons"',
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] flex flex-col items-center pointer-events-none px-4">
      {/* Expandable chat history */}
      {showHistory && chatHistory.length > 0 && (
        <div className="w-full max-w-[800px] bg-surface-panel border border-border-hairline backdrop-blur-3xl rounded-t-lg shadow-2xl pointer-events-auto flex flex-col max-h-[300px] overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-border-hairline bg-white/[0.02]">
            <span className="font-heading text-xs font-semibold text-text-primary flex items-center gap-1.5">
              <Sparkles size={12} className="text-accent-purple" /> Chat History
            </span>
            <div className="flex items-center gap-1">
              <button
                className="bg-transparent border-none text-text-secondary w-6 h-6 rounded-sm flex items-center justify-center cursor-pointer transition-all hover:text-white hover:bg-white/10"
                onClick={clearHistory}
                title="Clear history"
              >
                <Trash2 size={13} />
              </button>
              <button
                className="bg-transparent border-none text-text-secondary w-6 h-6 rounded-sm flex items-center justify-center cursor-pointer transition-all hover:text-white hover:bg-white/10"
                onClick={() => setShowHistory(false)}
                title="Minimize"
              >
                <X size={13} />
              </button>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-3 overflow-y-auto">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'user' && (
                  <div className="max-w-[85%] px-3.5 py-2 rounded-lg text-xs leading-normal animate-spring-load bg-accent-blue text-white rounded-br-none">
                    {msg.text}
                  </div>
                )}
                {msg.role === 'task' && (
                  <div className="max-w-[85%] px-3.5 py-2 rounded-lg text-xs leading-normal animate-spring-load bg-accent-purple/10 border border-accent-purple/20 text-white rounded-bl-none flex items-start gap-2.5">
                    <Check size={12} className="w-4 h-4 text-accent-purple mt-0.5 flex-shrink-0" />
                    <div className="flex flex-col gap-1">
                      <span className="font-semibold text-white">{msg.taskData?.title}</span>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {msg.taskData?.labels?.map((l, j) => (
                          <span key={j} className="text-[0.6rem] font-semibold text-text-secondary bg-white/5 border border-border-hairline px-1.5 py-0.5 rounded-sm">
                            {l}
                          </span>
                        ))}
                        {msg.taskData?.dueDate && (
                          <span className="text-[0.65rem] text-text-muted">📅 {msg.taskData.dueDate}</span>
                        )}
                        {msg.taskData?.routine && (
                          <span className="text-[0.65rem] text-text-muted">↻ {msg.taskData.routine}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                {msg.role === 'finance' && (() => {
                  const fd = msg.financeData;
                  const FinIcon = FINANCE_ICONS[fd?.type] || TrendingDown;
                  const textColor = FINANCE_COLORS[fd?.type] || 'text-accent-red';
                  const bgColor = FINANCE_BGS[fd?.type] || 'bg-accent-red/20';
                  return (
                    <div className="max-w-[85%] px-3.5 py-2 rounded-lg text-xs leading-normal animate-spring-load bg-white/5 border border-border-hairline text-white rounded-bl-none flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${bgColor} ${textColor}`}>
                        <FinIcon size={12} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-white">{fd?.label || fd?.category}</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-[0.7rem] ${textColor}`}>
                            {fd?.type === 'income' ? '+' : '-'}₹{fd?.amount?.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[0.6rem] font-semibold text-text-secondary bg-white/5 border border-border-hairline px-1.5 py-0.5 rounded-sm">
                            {fd?.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}
                {msg.role === 'note' && (() => {
                  const nd = msg.noteData;
                  const NoteIcon = NOTE_ICONS[nd?.type] || FileText;
                  const textColor = NOTE_COLORS[nd?.type] || 'text-accent-blue';
                  const bgColor = NOTE_BGS[nd?.type] || 'bg-accent-blue/20';
                  return (
                    <div className="max-w-[85%] px-3.5 py-2 rounded-lg text-xs leading-normal animate-spring-load bg-white/5 border border-border-hairline text-white rounded-bl-none flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 ${bgColor} ${textColor}`}>
                        <NoteIcon size={12} />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-white">{nd?.title}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[0.6rem] font-semibold border px-1.5 py-0.5 rounded-sm ${textColor} ${bgColor.replace('/20', '/40')}`}>
                            {nd?.type}
                          </span>
                          {nd?.labels?.map((l, j) => (
                            <span key={j} className="text-[0.6rem] font-semibold text-text-secondary bg-white/5 border border-border-hairline px-1.5 py-0.5 rounded-sm">
                              {l}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })()}
                {msg.role === 'system_action' && (
                  <div className="max-w-[85%] px-3.5 py-2 rounded-lg text-xs leading-normal animate-spring-load bg-white/5 border border-border-hairline text-text-secondary rounded-bl-none flex items-center gap-2">
                    <Check size={12} className="text-accent-green" />
                    <span>{msg.text}</span>
                  </div>
                )}
                {msg.role === 'error' && (
                  <div className="max-w-[85%] px-3.5 py-2 rounded-lg text-xs leading-normal animate-spring-load bg-accent-red/10 border border-accent-red/20 text-accent-red rounded-bl-none flex items-center gap-2">
                    <AlertCircle size={12} />
                    <span>{msg.text}</span>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
      )}

      {/* API Key Panel */}
      {showKeyInput && (
        <div className="w-full max-w-[800px] p-4 bg-surface-panel border border-border-hairline backdrop-blur-3xl rounded-t-lg shadow-2xl pointer-events-auto flex flex-col gap-3 animate-spring-load">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
            <Key size={13} />
            <span>Gemini API Key</span>
          </div>
          <div className="flex gap-2">
            <input
              type="password"
              placeholder="Paste your API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveKey()}
              className="flex-1 bg-surface-input border border-transparent rounded-sm text-white px-3 py-1.5 font-body text-xs outline-none transition-all focus:bg-white/[0.08] focus:border-border-focus"
            />
            <button
              className="bg-accent-green text-white border-none rounded-sm w-8 h-8 flex items-center justify-center cursor-pointer transition-all hover:bg-accent-green/80 flex-shrink-0"
              onClick={handleSaveKey}
            >
              <Check size={14} />
            </button>
          </div>
          {hasKey && (
            <button
              className="bg-transparent border-none text-accent-red text-[0.7rem] font-semibold cursor-pointer text-left py-1 hover:opacity-75"
              onClick={handleRemoveKey}
            >
              Remove key
            </button>
          )}
          <p className="text-[0.65rem] text-text-muted">
            Get your free key at{' '}
            <a
              href="https://aistudio.google.com/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-blue hover:underline"
            >
              aistudio.google.com
            </a>
          </p>
        </div>
      )}

      {/* Main Input Bar */}
      <div className="w-full max-w-[800px] p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] bg-surface-panel/90 border border-border-hairline backdrop-blur-3xl rounded-t-xl shadow-2xl pointer-events-auto flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {chatHistory.length > 0 && !showHistory && (
            <button
              className="bg-transparent border-none text-text-secondary w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all hover:text-white hover:bg-white/10"
              onClick={() => setShowHistory(true)}
              title="Show chat history"
            >
              <ChevronUp size={16} />
            </button>
          )}
          <button
            className={`w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer transition-all ${
              hasKey
                ? 'text-accent-purple border-accent-purple/40 bg-accent-purple/5 hover:bg-accent-purple/10'
                : 'bg-transparent border-border-hairline text-text-secondary hover:text-white hover:bg-white/10'
            }`}
            onClick={() => setShowKeyInput(!showKeyInput)}
            title={hasKey ? 'API key set ✓' : 'Set API key'}
          >
            {hasKey ? <Sparkles size={16} /> : <Key size={16} />}
          </button>
          <input
            ref={inputRef}
            type="text"
            placeholder={hasKey ? (placeholders[activeTab] || placeholders.tasks) : 'Set API key to start chatting...'}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="flex-1 bg-surface-input border border-transparent rounded-full text-white px-4 py-2 font-body text-xs outline-none transition-all focus:bg-white/[0.08] focus:border-border-focus focus:shadow-[0_0_0_3px_rgba(0,113,227,0.1)]"
          />
          <button
            className={`w-8 h-8 rounded-full border-none flex items-center justify-center cursor-pointer transition-all flex-shrink-0 ${
              message.trim() && hasKey
                ? 'bg-gradient-to-r from-accent-purple to-accent-blue text-white shadow-[0_2px_12px_rgba(191,90,242,0.3)] hover:scale-105 active:scale-95'
                : 'bg-white/5 text-text-muted cursor-not-allowed opacity-50'
            }`}
            onClick={handleSend}
            disabled={!message.trim() || isProcessing || !hasKey}
          >
            {isProcessing ? (
              <Loader2 size={18} className="animate-spin text-white" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </div>
        {error && !showKeyInput && (
          <div className="flex items-center gap-1.5 text-[0.65rem] text-accent-red mt-1 px-1">
            <AlertCircle size={11} />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
