import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { TaskCard } from './TaskCard';

export function TaskCalendar() {
  const { state } = useTask();
  const { filteredTasks } = state;
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const weekDays = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

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

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="bg-gradient-to-br from-white to-gray-50/30 rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden backdrop-blur-sm">
      <div className="flex items-center justify-between p-6 border-b border-gray-200/50 bg-gradient-to-r from-white to-gray-50/50">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-slate-800">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 rounded-xl hover:from-violet-200 hover:to-purple-200 transition-all duration-200 font-medium shadow-sm"
          >
            Bugün
          </button>
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
          <div key={day} className="bg-gradient-to-b from-slate-50 to-gray-50 p-3 text-center text-sm font-semibold text-slate-700">
            {day}
          </div>
        ))}
        
        {days.map((day, index) => {
          const tasks = getTasksForDate(day);
          const isToday = day && day.toDateString() === new Date().toDateString();
          
          return (
            <div
              key={index}
              className={`p-3 min-h-[120px] transition-all duration-200 ${
                day ? 'bg-white hover:bg-gradient-to-br hover:from-violet-50 hover:to-purple-50 cursor-pointer' : 'bg-gray-50/50'
              } ${isToday ? 'bg-gradient-to-br from-violet-50 to-purple-50 ring-2 ring-violet-200' : ''}`}
            >
              {day && (
                <>
                  <div className={`text-sm font-semibold mb-2 ${
                    isToday ? 'text-violet-600' : 'text-slate-800'
                  }`}>
                    {day.getDate()}
                  </div>
                  
                  <div className="space-y-1.5">
                    {tasks.slice(0, 2).map(task => (
                      <div
                        key={task.id}
                        className={`text-xs p-2 rounded-lg truncate font-medium shadow-sm ${
                          task.priority === 'high' ? 'bg-gradient-to-r from-rose-100 to-pink-100 text-rose-800 border border-rose-200' :
                          task.priority === 'medium' ? 'bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-800 border border-amber-200' :
                          'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200'
                        }`}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                    
                    {tasks.length > 2 && (
                      <div className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-lg">
                        +{tasks.length - 2} daha
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
  );
}