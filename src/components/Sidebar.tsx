import { useState } from 'react';
import { CheckSquare, List, Grid3x3, Calendar, ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { useI18n } from '../context/I18nContext';

const menuItems = [
  { mode: 'list' as const, icon: List, key: 'sidebar.list' },
  { mode: 'board' as const, icon: Grid3x3, key: 'sidebar.board' },
  { mode: 'calendar' as const, icon: Calendar, key: 'sidebar.calendar' },
  { mode: 'stats' as const, icon: BarChart2, key: 'sidebar.stats' },
];

export function Sidebar() {
  const { state, setViewMode } = useTask();
  const { stats, viewMode } = state;
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  return (
    <>
      {/* Mobile and tablet overlay */}
      {open && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside className={`fixed top-0 left-0 h-screen z-30 transition-all duration-300 ${open ? 'w-56' : 'w-16'} lg:${open ? 'w-64' : 'w-16'} bg-white shadow-lg border-r border-gray-100 flex flex-col`}> 
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <CheckSquare className="h-6 w-6 text-violet-600" />
            {open && <span className="text-xl font-bold text-violet-700">TaskPro</span>}
          </div>
          <button onClick={() => setOpen(o => !o)} className="p-1 rounded hover:bg-gray-100">
            {open ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </button>
        </div>
      <div className={`flex flex-col gap-2 mt-4 px-2 ${open ? '' : 'items-center'}`}> 
        <div className={`flex items-center gap-2 px-2 py-1 rounded-lg ${open ? 'justify-start' : 'justify-center'} bg-slate-50`}>
          <span className="w-2 h-2 bg-slate-400 rounded-full"></span>
          {open && <span className="text-sm text-slate-700">{stats.total} {t('sidebar.total')}</span>}
        </div>
        <div className={`flex items-center gap-2 px-2 py-1 rounded-lg ${open ? 'justify-start' : 'justify-center'} bg-emerald-50`}>
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          {open && <span className="text-sm text-emerald-700">{stats.completed} {t('sidebar.completed')}</span>}
        </div>
        <div className={`flex items-center gap-2 px-2 py-1 rounded-lg ${open ? 'justify-start' : 'justify-center'} bg-blue-50`}>
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          {open && <span className="text-sm text-blue-700">{stats.inProgress} {t('sidebar.inProgress')}</span>}
        </div>
        <div className={`flex items-center gap-2 px-2 py-1 rounded-lg ${open ? 'justify-start' : 'justify-center'} bg-amber-50`}>
          <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
          {open && <span className="text-sm text-amber-700">{stats.todo} {t('sidebar.todo')}</span>}
        </div>
      </div>
      <nav className={`flex flex-col gap-2 mt-8 px-2 ${open ? '' : 'items-center'}`}> 
        {menuItems.map(({ mode, icon: Icon, key }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full ${
              viewMode === mode
                ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg scale-105'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            } ${open ? 'justify-start' : 'justify-center'}`}
            title={t(key)}
          >
            <Icon className="h-5 w-5" />
            {open && <span>{t(key)}</span>}
          </button>
        ))}
      </nav>
      </aside>
    </>
  );
}

export default Sidebar; 