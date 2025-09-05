import { useState } from 'react';
import { Plus, LogOut, User, Menu } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { openModal } = useTask();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-slate-50 to-gray-50 shadow-lg border-b border-gray-100 backdrop-blur-sm pl-16 lg:pl-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center space-x-3">
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