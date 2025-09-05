import { useCallback } from 'react';
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
import { Sidebar } from './components/Sidebar';
import { Statistics } from './components/Statistics';

function AppContent() {
  const { state, dispatch } = useTask();
  const { user, loading } = useAuth();
  const { tasks, filters, viewMode } = state;

  // Handle filtering
  const setFilteredTasks = useCallback((filtered: any[]) => {
    dispatch({ type: 'SET_FILTERED_TASKS', payload: filtered });
  }, [dispatch]);

  const setStats = useCallback((stats: any) => {
    dispatch({ type: 'SET_STATS', payload: stats });
  }, [dispatch]);

  useTaskFilters(tasks, filters, setFilteredTasks, setStats);


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
      case 'stats':
        return <Statistics />;
      default:
        return <TaskList />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 flex">
      <Sidebar />
      <div className="flex-1 min-w-0 lg:ml-0 ml-16 flex flex-col">
        <Header />
        <FilterBar />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-purple-500/5 rounded-3xl -z-10"></div>
          {renderContent()}
        </main>
        <TaskModal />
      </div>
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