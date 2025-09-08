import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Search, Filter, ChevronDown, X } from 'lucide-react';
import { CustomSelect } from './CustomSelect';
import { useTask } from '../context/TaskContext';

export function FilterBar() {
  const { state, setFilters } = useTask();
  const { filters } = state;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
  }, [isDropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (isDropdownOpen && buttonRef.current) {
        const target = event.target as Node;
        const dropdown = document.querySelector('[data-filter-dropdown]');
        
        // Close only if clicking outside both button and dropdown
        if (!buttonRef.current.contains(target) && 
            (!dropdown || !dropdown.contains(target))) {
          setIsDropdownOpen(false);
        }
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isDropdownOpen]);

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

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.status !== 'all') count++;
    if (filters.priority !== 'all') count++;
    if (filters.dateRange !== 'all') count++;
    return count;
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <>
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 group-focus-within:text-violet-500 transition-colors" />
              <input
                type="text"
                placeholder="Görevlerde ara..."
                value={filters.search}
                onChange={(e) => setFilters({ search: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-200 shadow-sm hover:shadow-md"
              />
            </div>
            
            {/* Desktop filters */}
            <div className="hidden md:flex items-center gap-3 flex-wrap w-full lg:w-auto">
              <div className="p-2 bg-white rounded-lg">
                <Filter className="h-4 w-4 text-gray-500" />
              </div>
              
              <div className="relative w-48">
                <CustomSelect
                  options={statusOptions}
                  value={String(filters.status)}
                  onChange={(val) => setFilters({ status: val as any })}
                />
              </div>
              
              <div className="relative w-48">
                <CustomSelect
                  options={priorityOptions}
                  value={String(filters.priority)}
                  onChange={(val) => setFilters({ priority: val as any })}
                />
              </div>
              
              <div className="relative w-48">
                <CustomSelect
                  options={dateOptions}
                  value={String(filters.dateRange)}
                  onChange={(val) => setFilters({ dateRange: val as any })}
                />
              </div>
            </div>

            {/* Mobile dropdown */}
            <div className="md:hidden relative">
              <button
                ref={buttonRef}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl bg-white hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">
                    Filtreler {activeFiltersCount > 0 && `(${activeFiltersCount})`}
                  </span>
                </div>
                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Dropdown - Portal to body */}
      {mounted && isDropdownOpen && createPortal(
        <div className="fixed inset-0 z-[99999999] pointer-events-none md:hidden">
          <div 
            data-filter-dropdown
            className="absolute bg-white rounded-xl shadow-2xl border border-gray-200 pointer-events-auto"
            style={{
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width
            }}
          >
            <div className="p-2 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Filtreler</h3>
                <button
                  onClick={() => setIsDropdownOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Durum</label>
                  <CustomSelect
                    options={statusOptions}
                    value={String(filters.status)}
                    onChange={(val) => setFilters({ status: val as any })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Öncelik</label>
                  <CustomSelect
                    options={priorityOptions}
                    value={String(filters.priority)}
                    onChange={(val) => setFilters({ priority: val as any })}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tarih</label>
                  <CustomSelect
                    options={dateOptions}
                    value={String(filters.dateRange)}
                    onChange={(val) => setFilters({ dateRange: val as any })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </>
  );
}