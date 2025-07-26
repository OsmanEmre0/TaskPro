import React, { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider, useTask } from './context/TaskContext';
import { useAuth } from './context/AuthContext';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { TaskList } from './components/TaskList';
import { TaskBoard } from './components/TaskBoard';
import { TaskCalendar } from './components/TaskCalendar';
import { TaskModal } from './components/TaskModal';
import { LoginScreen } from './components/LoginScreen';
import { useTaskFilters } from './hooks/useTaskFilters';

function AppContent() {
  const { state, dispatch } = useTask();
  const { user, loading } = useAuth();
  const { tasks, filteredTasks, filters, viewMode } = state;

  // Handle filtering
  useTaskFilters(
    tasks,
    filters,
    (filtered) => dispatch({ type: 'SET_FILTERED_TASKS', payload: filtered }),
    (stats) => dispatch({ type: 'SET_STATS', payload: stats })
  );

  // Initialize filtered tasks when tasks change
  useEffect(() => {
    if (tasks.length > 0 && filteredTasks.length === 0 && !filters.search && filters.status === 'all' && filters.priority === 'all' && filters.dateRange === 'all') {
      dispatch({ type: 'SET_FILTERED_TASKS', payload: tasks });
    }
  }, [tasks, filteredTasks, filters, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  const renderContent = () => {
    switch (viewMode) {
      case 'board':
        return <TaskBoard />;
      case 'calendar':
        return <TaskCalendar />;
      default:
        return <TaskList />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
      <Header />
      <FilterBar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-3xl -z-10"></div>
        {renderContent()}
      </main>
      
      <TaskModal />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;