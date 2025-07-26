import React from 'react';
import { CheckSquare, Calendar, List, Grid3x3, Plus, LogOut, User } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { state, openModal, setViewMode } = useTask();
  const { user, signOut } = useAuth();
  const { viewMode, stats } = state;

  const viewButtons = [
    { mode: 'list' as const, icon: List, label: 'Liste' },
    { mode: 'board' as const, icon: Grid3x3, label: 'Kanban' },
    { mode: 'calendar' as const, icon: Calendar, label: 'Takvim' }
  ];

  return (
    <header className="bg-gradient-to-r from-slate-50 to-gray-50 shadow-lg border-b border-gray-100 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl shadow-lg">
                <CheckSquare className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">TaskPro</h1>
            </div>
            
            <div className="hidden sm:flex items-center space-x-6 ml-8">
              <div className="flex items-center space-x-2 px-3 py-1 bg-white/60 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                <span className="text-sm font-medium text-slate-700">{stats.total} Toplam</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-emerald-50/80 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-medium text-emerald-700">{stats.completed} Tamamlandı</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-blue-50/80 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-700">{stats.inProgress} Devam Ediyor</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1 bg-amber-50/80 rounded-full backdrop-blur-sm">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="text-sm font-medium text-amber-700">{stats.todo} Yapılacak</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-xl p-1 shadow-sm border border-gray-200/50">
              {viewButtons.map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    viewMode === mode
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
                  }`}
                  title={label}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>
            
            <button
              onClick={() => openModal()}
              className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Yeni Görev</span>
            </button>
            
            <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="hidden sm:inline text-slate-700 font-medium">
                  {user?.email?.split('@')[0]}
                </span>
              </div>
              
              <button
                onClick={() => signOut()}
                className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all duration-200"
                title="Çıkış Yap"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}