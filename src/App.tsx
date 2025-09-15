import { useCallback, useState } from 'react';
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
import { ProfilePage } from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import HelpPage from './components/HelpPage.tsx';
import NotificationsPage from './components/NotificationsPage.tsx';
import { useTaskFilters } from './hooks/useTaskFilters';
import { Sidebar } from './components/Sidebar';
import { Statistics } from './components/Statistics';
import { useI18n } from './context/I18nContext';

function AppContent() {
  const { state, dispatch } = useTask();
  const { user, loading } = useAuth();
  const { tasks, filters, viewMode } = state;
  const [currentPage, setCurrentPage] = useState('main');
  const { t } = useI18n();

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
          <p className="text-slate-600 font-medium">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  // If profile page is open, show only profile page
  if (currentPage === 'profile') {
    return <ProfilePage onBack={() => setCurrentPage('main')} />;
  }
  if (currentPage === 'settings') {
    return <SettingsPage onBack={() => setCurrentPage('main')} />;
  }
  if (currentPage === 'help') {
    return <HelpPage onBack={() => setCurrentPage('main')} />;
  }
  if (currentPage === 'notifications') {
    return <NotificationsPage onBack={() => setCurrentPage('main')} />;
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 flex h-full">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col ml-16 2xl:ml-0 bg-gradient-to-r from-violet-500/5 to-purple-500/5">
        <Header onProfileClick={() => setCurrentPage('profile')} onSettingsClick={() => setCurrentPage('settings')} onHelpClick={() => setCurrentPage('help')} onNotificationsClick={() => setCurrentPage('notifications')} />
        <FilterBar />
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative w-full z-10">
          <div className="absolute inset-0  rounded-3xl -z-10"></div>
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