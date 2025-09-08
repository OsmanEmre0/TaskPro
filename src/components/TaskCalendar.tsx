import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { Task } from '../types/Task';
import { useI18n } from '../context/I18nContext';

export function TaskCalendar() {
  const { state } = useTask();
  const { filteredTasks } = state;
  const [currentDate, setCurrentDate] = useState(new Date());
  const [previewTask, setPreviewTask] = useState<Task | null>(null);
  const { lang, t } = useI18n();

  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const base = new Date(2021, 0, 3); // Sunday, Jan 3, 2021
    base.setDate(base.getDate() + i);
    return base.toLocaleDateString(locale, { weekday: 'short' });
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const getTasksForDate = (date: Date | null) => {
    if (!date) return [];
    
    // Get the date components for comparison
    const targetYear = date.getFullYear();
    const targetMonth = date.getMonth();
    const targetDay = date.getDate();
    
    return filteredTasks.filter(task => {
      try {
        const taskDate = new Date(task.dueDate);
        const taskYear = taskDate.getFullYear();
        const taskMonth = taskDate.getMonth();
        const taskDay = taskDate.getDate();
        
        return taskYear === targetYear && taskMonth === targetMonth && taskDay === targetDay;
      } catch (error) {
        console.error('Error parsing task date:', task.dueDate, error);
        return false;
      }
    });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(prevDate.getMonth() - 1);
      } else {
        newDate.setMonth(prevDate.getMonth() + 1);
      }
      return newDate;
    });
  };


  const days = getDaysInMonth(currentDate);

  return (
    <>
      <div className="bg-gradient-to-br from-white to-gray-50/30 rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 border-b border-gray-200/50 bg-gradient-to-r from-white to-gray-50/50 gap-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
              {currentDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-violet-50 rounded-xl transition-all duration-200 hover:shadow-sm"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-violet-50 rounded-xl transition-all duration-200 hover:shadow-sm"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200/50">
          {weekDays.map(day => (
            <div key={day} className="bg-gradient-to-b from-slate-50 to-gray-50 p-2 sm:p-3 text-center text-xs sm:text-sm font-semibold text-slate-700">
              {day}
            </div>
          ))}
          
          {days.map((day, index) => {
            const tasks = getTasksForDate(day);
            const isToday = day && day.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={index}
                className={`p-2 sm:p-3 min-h-[80px] sm:min-h-[120px] transition-all duration-200 ${
                  day ? 'bg-white hover:bg-gradient-to-br hover:from-violet-50 hover:to-purple-50 cursor-pointer' : 'bg-gray-50/50'
                } ${isToday ? 'bg-gradient-to-br from-violet-50 to-purple-50 ring-2 ring-violet-200' : ''}`}
              >
                {day && (
                  <>
                    <div className={`text-xs sm:text-sm font-semibold mb-1 sm:mb-2 ${
                      isToday ? 'text-violet-600' : 'text-slate-800'
                    }`}>
                      {day.getDate()}
                    </div>
                    
                    <div className="space-y-1 sm:space-y-1.5">
                      {tasks.slice(0, 2).map(task => (
                        <div
                          key={task.id}
                          className={`text-xs p-1 sm:p-2 rounded-lg truncate font-medium shadow-sm ${
                            task.priority === 'high' ? 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border border-rose-200' :
                            task.priority === 'medium' ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200' :
                            'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200'
                          }`}
                          title={task.title}
                          onClick={() => setPreviewTask(task)}
                          style={{ cursor: 'pointer' }}
                        >
                          {task.title}
                        </div>
                      ))}
                      
                      {tasks.length > 2 && (
                        <div className="text-xs text-slate-500 font-medium bg-slate-100 px-1 sm:px-2 py-1 rounded-lg">
                          {lang === 'tr' ? `+${tasks.length - 2} daha` : `+${tasks.length - 2} more`}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Önizleme Modalı */}
      {previewTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setPreviewTask(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-md mx-4 sm:mx-0 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
              onClick={() => setPreviewTask(null)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-2 text-violet-700">{previewTask.title}</h2>
            <p className="text-slate-700 mb-3">{previewTask.description}</p>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                previewTask.priority === 'high' ? 'bg-rose-100 text-rose-700' :
                previewTask.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                'bg-emerald-100 text-emerald-700'
              }`}>
                {previewTask.priority === 'high' ? t('filter.priority.high') : previewTask.priority === 'medium' ? t('filter.priority.medium') : t('filter.priority.low')}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                previewTask.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                previewTask.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                'bg-amber-100 text-amber-700'
              }`}>
                {previewTask.status === 'completed' ? t('filter.status.completed') : previewTask.status === 'in-progress' ? t('filter.status.inProgress') : t('filter.status.todo')}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                {new Date(previewTask.dueDate).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}