'use client';

import { CheckSquare, Wallet, FileText, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Header({ tasks, activeTab, onTabChange, financeStats, notesStats }) {
  const { user, signOut } = useAuth();
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const routinesTasks = tasks.filter((t) => !!t.routine).length;

  // Get first letter of email for avatar
  const avatarLetter = user?.email?.[0]?.toUpperCase() || '?';

  async function handleSignOut() {
    try {
      await signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  }

  return (
    <header className="flex flex-col gap-3 pb-3">
      <div className="flex justify-between items-center flex-wrap gap-3">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-[42px] h-[42px] rounded-[10px] bg-gradient-to-br from-blue-500 to-pink-500 text-white shadow-md shadow-pink-500/20">
            <CheckSquare className="text-white w-[22px] h-[22px]" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-pink-400 to-pink-500 bg-clip-text text-transparent">Celite Manager</h1>
            <p className="text-xs text-text-secondary font-normal">Tasks, finances &amp; notes, powered by AI</p>
          </div>
        </div>

        {/* Stats + User */}
        <div className="flex gap-4 items-center">
          {activeTab === 'tasks' && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-sm font-semibold text-white">{totalTasks}</span>
                <span className="text-xs text-text-secondary">Tasks</span>
              </div>
              <span className="text-text-muted">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-sm font-semibold text-accent-green">{completedTasks}</span>
                <span className="text-xs text-text-secondary">Done</span>
              </div>
              <span className="text-text-muted">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-sm font-semibold text-accent-purple">{routinesTasks}</span>
                <span className="text-xs text-text-secondary">Routines</span>
              </div>
            </>
          )}

          {activeTab === 'money' && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-sm font-semibold text-accent-green">
                  ₹{(financeStats?.totalIncome || 0).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-text-secondary">Income</span>
              </div>
              <span className="text-text-muted">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-sm font-semibold text-accent-red">
                  ₹{(financeStats?.totalExpenses || 0).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-text-secondary">Spent</span>
              </div>
              <span className="text-text-muted">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-sm font-semibold text-accent-blue">
                  ₹{(financeStats?.totalSavings || 0).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-text-secondary">Saved</span>
              </div>
            </>
          )}

          {activeTab === 'notes' && (
            <>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-sm font-semibold text-accent-blue">
                  {notesStats?.noteCount || 0}
                </span>
                <span className="text-xs text-text-secondary">Notes</span>
              </div>
              <span className="text-text-muted">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-sm font-semibold text-accent-yellow">
                  {notesStats?.brainstormCount || 0}
                </span>
                <span className="text-xs text-text-secondary">Ideas</span>
              </div>
              <span className="text-text-muted">•</span>
              <div className="flex items-center gap-1.5">
                <span className="font-heading text-sm font-semibold text-accent-purple">
                  {notesStats?.checklistCount || 0}
                </span>
                <span className="text-xs text-text-secondary">Checklists</span>
              </div>
            </>
          )}

          {/* User avatar + sign out */}
          {user && (
            <>
              <span className="text-text-muted hidden sm:inline">|</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[0.7rem] font-bold text-white bg-gradient-to-br from-blue-500 to-pink-500 flex-shrink-0"
                  title={user.email}
                >
                  {avatarLetter}
                </div>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-1 bg-transparent border-none text-text-secondary text-xs cursor-pointer hover:text-accent-red transition-colors py-1 px-1.5 rounded-md hover:bg-white/5"
                  title="Sign out"
                >
                  <LogOut size={13} />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="relative flex bg-white/5 border border-border-hairline rounded-full p-[3px] w-full max-w-[360px]">
        <button
          className={`relative z-10 flex-1 flex items-center gap-1.5 py-1.5 border-none bg-transparent font-heading text-[0.82rem] font-medium cursor-pointer rounded-full transition-colors justify-center ${
            activeTab === 'tasks' ? 'text-white' : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => onTabChange('tasks')}
        >
          <CheckSquare size={14} />
          <span>Tasks</span>
        </button>
        <button
          className={`relative z-10 flex-1 flex items-center gap-1.5 py-1.5 border-none bg-transparent font-heading text-[0.82rem] font-medium cursor-pointer rounded-full transition-colors justify-center ${
            activeTab === 'money' ? 'text-white' : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => onTabChange('money')}
        >
          <Wallet size={14} />
          <span>Money</span>
        </button>
        <button
          className={`relative z-10 flex-1 flex items-center gap-1.5 py-1.5 border-none bg-transparent font-heading text-[0.82rem] font-medium cursor-pointer rounded-full transition-colors justify-center ${
            activeTab === 'notes' ? 'text-white' : 'text-text-secondary hover:text-text-primary'
          }`}
          onClick={() => onTabChange('notes')}
        >
          <FileText size={14} />
          <span>Notes</span>
        </button>
        <div
          className="absolute top-[3px] left-[3px] w-[calc(33.333%-3px)] h-[calc(100%-6px)] bg-white/10 rounded-full transition-transform duration-300 ease-out pointer-events-none"
          style={{
            transform:
              activeTab === 'tasks'
                ? 'translateX(0)'
                : activeTab === 'money'
                ? 'translateX(100%)'
                : 'translateX(200%)',
          }}
        />
      </div>
    </header>
  );
}
