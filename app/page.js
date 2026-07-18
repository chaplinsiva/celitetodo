'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTasks } from '@/hooks/useTasks';
import { useFinance } from '@/hooks/useFinance';
import { useNotes } from '@/hooks/useNotes';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import TaskList from '@/components/TaskList';
import MoneyDashboard from '@/components/MoneyDashboard';
import NotesDashboard from '@/components/NotesDashboard';
import ChatBar from '@/components/ChatBar';
import AddTaskModal from '@/components/modals/AddTaskModal';
import EditTaskModal from '@/components/modals/EditTaskModal';
import AddTransactionModal from '@/components/modals/AddTransactionModal';
import EditTransactionModal from '@/components/modals/EditTransactionModal';
import AddNoteModal from '@/components/modals/AddNoteModal';
import EditNoteModal from '@/components/modals/EditNoteModal';
import DeleteModal from '@/components/modals/DeleteModal';

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { tasks, isLoaded, addTask, updateTask, deleteTask, clearAllTasks, toggleTask } = useTasks();
  const finance = useFinance();
  const notes = useNotes();

  // Tab state
  const [activeTab, setActiveTab] = useState('tasks');

  // Task UI state
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeLabelFilter, setActiveLabelFilter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('word');
  const [sortBy, setSortBy] = useState('createdAt-desc');

  // Modal state
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  const [addTransactionModalOpen, setAddTransactionModalOpen] = useState(false);
  const [editTransaction, setEditTransaction] = useState(null);

  const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  function handleFilterChange(filter) {
    setActiveFilter(filter);
    setActiveLabelFilter(null);
  }

  function handleUpdate(id, data) {
    updateTask(id, {
      title: data.title,
      description: data.description,
      labels: data.labels,
      dueDate: data.dueDate,
      routine: data.routine,
      completed: data.completed,
    });
  }

  function handleUpdateTransaction(id, data) {
    finance.updateTransaction(id, data);
  }

  function handleUpdateNote(id, data) {
    notes.updateNote(id, data);
  }

  function handleConfirmDelete() {
    if (deleteTaskId) {
      deleteTask(deleteTaskId);
      setDeleteTaskId(null);
    }
  }

  // Show loading while auth is checking or if not authenticated (will redirect)
  if (authLoading || !user || !isLoaded || !finance.isLoaded || !notes.isLoaded) {
    return (
      <div data-app-shell className="w-full max-w-[1060px] flex flex-col items-center justify-center h-[calc(100vh-70px)]">
        <p className="text-text-secondary text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div data-app-shell>
      <div className="w-full max-w-[1060px] flex flex-col gap-6 md:gap-8 lg:gap-5 lg:h-[calc(100vh-70px)] lg:overflow-hidden p-4 md:p-6 lg:p-8 pb-0">
        <Header
          tasks={tasks}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          financeStats={{
            totalIncome: finance.totalIncome,
            totalExpenses: finance.totalExpenses,
            totalSavings: finance.totalSavings,
            totalInvestment: finance.totalInvestment,
            availableBalance: finance.availableBalance,
          }}
          notesStats={{
            noteCount: notes.noteCount,
            brainstormCount: notes.brainstormCount,
            checklistCount: notes.checklistCount,
          }}
        />

        {/* Tasks Tab Content */}
        {activeTab === 'tasks' && (
          <main className="grid grid-cols-1 lg:grid-cols-[310px_1fr] gap-8 items-start lg:flex-1 lg:min-h-0 lg:overflow-hidden lg:h-full">
            <Sidebar
              tasks={tasks}
              activeFilter={activeFilter}
              onFilterChange={handleFilterChange}
              activeLabelFilter={activeLabelFilter}
              onLabelFilterChange={setActiveLabelFilter}
              onToggle={toggleTask}
              onDelete={setDeleteTaskId}
            />

            <TaskList
              tasks={tasks}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchMode={searchMode}
              onSearchModeChange={setSearchMode}
              sortBy={sortBy}
              onSortChange={setSortBy}
              activeFilter={activeFilter}
              activeLabelFilter={activeLabelFilter}
              onToggle={toggleTask}
              onEdit={setEditTask}
              onDelete={setDeleteTaskId}
              onOpenAddModal={() => setAddTaskModalOpen(true)}
            />
          </main>
        )}

        {/* Money Tab Content */}
        {activeTab === 'money' && (
          <main className="flex-1 min-h-0 lg:overflow-y-auto w-full pb-8">
            <MoneyDashboard
              transactions={finance.transactions}
              totalIncome={finance.totalIncome}
              totalExpenses={finance.totalExpenses}
              totalSavings={finance.totalSavings}
              totalInvestment={finance.totalInvestment}
              availableBalance={finance.availableBalance}
              expensesByCategory={finance.expensesByCategory}
              onDeleteTransaction={finance.deleteTransaction}
              onOpenAddModal={() => setAddTransactionModalOpen(true)}
              onEditTransaction={setEditTransaction}
            />
          </main>
        )}

        {/* Notes Tab Content */}
        {activeTab === 'notes' && (
          <main className="flex-1 min-h-0 lg:overflow-y-auto w-full pb-8">
            <NotesDashboard
              notes={notes.notes}
              onDeleteNote={notes.deleteNote}
              onUpdateNote={notes.updateNote}
              onOpenAddModal={() => setAddNoteModalOpen(true)}
              onEditNote={setEditNote}
            />
          </main>
        )}
      </div>

      {/* Persistent Bottom Chat Bar */}
      <ChatBar
        onAddTask={addTask}
        onAddTransaction={finance.addTransaction}
        onAddNote={notes.addNote}
        onClearTasks={clearAllTasks}
        onClearTransactions={finance.clearAllTransactions}
        onClearNotes={notes.clearAllNotes}
        activeTab={activeTab}
      />

      {/* Modals */}
      <AddTaskModal
        isOpen={addTaskModalOpen}
        onClose={() => setAddTaskModalOpen(false)}
        onAdd={addTask}
      />

      <EditTaskModal
        isOpen={!!editTask}
        task={editTask}
        onClose={() => setEditTask(null)}
        onUpdate={handleUpdate}
      />

      <AddTransactionModal
        isOpen={addTransactionModalOpen}
        onClose={() => setAddTransactionModalOpen(false)}
        onAdd={finance.addTransaction}
      />

      <EditTransactionModal
        isOpen={!!editTransaction}
        transaction={editTransaction}
        onClose={() => setEditTransaction(null)}
        onUpdate={handleUpdateTransaction}
      />

      <AddNoteModal
        isOpen={addNoteModalOpen}
        onClose={() => setAddNoteModalOpen(false)}
        onAdd={notes.addNote}
      />

      <EditNoteModal
        isOpen={!!editNote}
        note={editNote}
        onClose={() => setEditNote(null)}
        onUpdate={handleUpdateNote}
      />

      <DeleteModal
        isOpen={!!deleteTaskId}
        onClose={() => setDeleteTaskId(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
