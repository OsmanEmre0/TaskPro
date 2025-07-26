import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useTask } from '../context/TaskContext';

export function FilterBar() {
  const { state, setFilters } = useTask();
  const { filters } = state;

  const statusOptions = [
    { value: 'all', label: 'Tüm Durumlar' },
    { value: 'todo', label: 'Yapılacak' },
    { value: 'in-progress', label: 'Devam Ediyor' },
    { value: 'completed', label: 'Tamamlandı' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'Tüm Öncelikler' },
    { value: 'high', label: 'Yüksek' },
    { value: 'medium', label: 'Orta' },
    { value: 'low', label: 'Düşük' }
  ];

  const dateOptions = [
    { value: 'all', label: 'Tüm Tarihler' },
    { value: 'today', label: 'Bugün' },
    { value: 'week', label: 'Bu Hafta' },
    { value: 'month', label: 'Bu Ay' }
  ];

  return (
    <div className="bg-gradient-to-r from-white to-gray-50/50 shadow-sm border-b border-gray-100 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-violet-500 transition-colors" />
            <input
              type="text"
              placeholder="Görevlerde ara..."
              value={filters.search}
              onChange={(e) => setFilters({ search: e.target.value })}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-200 shadow-sm hover:shadow-md"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/70 rounded-lg backdrop-blur-sm">
              <Filter className="h-4 w-4 text-gray-500" />
            </div>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value as any })}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ priority: e.target.value as any })}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ dateRange: e.target.value as any })}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {dateOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}