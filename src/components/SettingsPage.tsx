import React, { useEffect, useState } from 'react';
import { ArrowLeft, Globe2, Moon, SunMedium, Bell, LayoutList, CalendarDays, KanbanSquare, BarChart3 } from 'lucide-react';
import { useTask } from '../context/TaskContext';
// removed unused useAuth import
import { useI18n } from '../context/I18nContext';

interface SettingsPageProps {
  onBack: () => void;
}

export function SettingsPage({ onBack }: SettingsPageProps) {
  const [isDark, setIsDark] = useState<boolean>(false);
  const { lang, setLanguage, t } = useI18n();
  const [emailReminders, setEmailReminders] = useState<boolean>(() => localStorage.getItem('emailReminders') === 'true');
  const [pushEnabled, setPushEnabled] = useState<boolean>(() => localStorage.getItem('pushEnabled') === 'true');
  const [weeklyReports, setWeeklyReports] = useState<boolean>(() => localStorage.getItem('weeklyReports') === 'true');
  const { setViewMode } = useTask();
  const [defaultView, setDefaultView] = useState<'list' | 'calendar' | 'board' | 'stats'>(() => (localStorage.getItem('defaultView') as any) || 'list');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') setIsDark(true);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    localStorage.setItem('emailReminders', String(emailReminders));
  }, [emailReminders]);

  useEffect(() => {
    localStorage.setItem('pushEnabled', String(pushEnabled));
  }, [pushEnabled]);

  useEffect(() => {
    localStorage.setItem('weeklyReports', String(weeklyReports));
  }, [weeklyReports]);

  useEffect(() => {
    localStorage.setItem('defaultView', defaultView);
  }, [defaultView]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-200" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('settings.title')}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <Globe2 className="h-5 w-5 text-violet-600 mr-2" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('settings.language')}</h2>
            </div>
            <div className="flex items-center space-x-3">
              {(['tr','en'] as const).map((code) => (
                <button
                  key={code}
                  onClick={() => { setLanguage(code); }}
                  className={`px-4 h-10 rounded-lg border text-sm font-medium transition-colors ${lang === code ? 'bg-violet-600 text-white border-violet-600' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <Moon className="h-5 w-5 text-violet-600 mr-2" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('settings.theme')}</h2>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsDark(false)}
                className={`px-4 h-10 rounded-lg border text-sm font-medium flex items-center space-x-2 transition-colors ${!isDark ? 'bg-violet-600 text-white border-violet-600' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <SunMedium className="h-4 w-4" />
                <span>{t('common.light')}</span>
              </button>
              <button
                onClick={() => setIsDark(true)}
                className={`px-4 h-10 rounded-lg border text-sm font-medium flex items-center space-x-2 transition-colors ${isDark ? 'bg-violet-600 text-white border-violet-600' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <Moon className="h-4 w-4" />
                <span>{t('common.dark')}</span>
              </button>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-4">
              <LayoutList className="h-5 w-5 text-violet-600 mr-2" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('settings.defaultView')}</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setDefaultView('list'); setViewMode('list'); }}
                className={`h-10 rounded-lg border text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${defaultView === 'list' ? 'bg-violet-600 text-white border-violet-600' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <LayoutList className="h-4 w-4" />
                <span>{t('sidebar.list')}</span>
              </button>
              <button
                onClick={() => { setDefaultView('calendar'); setViewMode('calendar'); }}
                className={`h-10 rounded-lg border text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${defaultView === 'calendar' ? 'bg-violet-600 text-white border-violet-600' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <CalendarDays className="h-4 w-4" />
                <span>{t('sidebar.calendar')}</span>
              </button>
              <button
                onClick={() => { setDefaultView('board'); setViewMode('board'); }}
                className={`h-10 rounded-lg border text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${defaultView === 'board' ? 'bg-violet-600 text-white border-violet-600' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <KanbanSquare className="h-4 w-4" />
                <span>{t('sidebar.board')}</span>
              </button>
              <button
                onClick={() => { setDefaultView('stats'); setViewMode('stats'); }}
                className={`h-10 rounded-lg border text-sm font-medium flex items-center justify-center space-x-2 transition-colors ${defaultView === 'stats' ? 'bg-violet-600 text-white border-violet-600' : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>{t('sidebar.stats')}</span>
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">{t('settings.defaultViewHelp')}</p>
          </section>

          <section className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center mb-2">
              <Bell className="h-5 w-5 text-violet-600 mr-2" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{t('settings.notifications')}</h2>
            </div>
            <div className="space-y-3">
              <ToggleRow label={t('settings.email')} checked={emailReminders} onChange={() => setEmailReminders(v => !v)} />
              <ToggleRow label={t('settings.push')} checked={pushEnabled} onChange={() => setPushEnabled(v => !v)} />
              <ToggleRow label={t('settings.reports.weekly')} checked={weeklyReports} onChange={() => setWeeklyReports(v => !v)} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

const ToggleRow: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm text-gray-700 dark:text-gray-200">{label}</span>
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <span className={`w-10 h-6 flex items-center bg-gray-300 dark:bg-gray-600 rounded-full p-1 transition-colors ${checked ? 'bg-violet-600' : ''}`}>
        <span className={`bg-white w-4 h-4 rounded-full transform transition-transform ${checked ? 'translate-x-4' : ''}`}></span>
      </span>
    </label>
  </div>
);

export default SettingsPage;


