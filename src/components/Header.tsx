import { useState, useRef, useEffect } from 'react';
import { Plus, LogOut, User, Settings, UserCircle, ChevronDown, Bell, HelpCircle, Moon, SunMedium, Languages } from 'lucide-react';
import { useTask } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';

interface HeaderProps {
  onProfileClick: () => void;
  onSettingsClick?: () => void;
  onHelpClick?: () => void;
  onNotificationsClick?: () => void;
}

export function Header({ onProfileClick, onSettingsClick, onHelpClick, onNotificationsClick }: HeaderProps) {
  const { openModal } = useTask();
  const { user, signOut } = useAuth();
  // Sidebar state removed (unused)
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { lang, setLanguage, t } = useI18n();

  // Close user menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }

    if (userMenuOpen) {
      // Add a small delay to prevent immediate closing
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [userMenuOpen]);

  

  const toggleLang = () => {
    const next = lang === 'tr' ? 'en' : 'tr';
    setLanguage(next);
  };

  return (
    <>
      <header className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-gray-200 backdrop-blur-sm pl-16 lg:pl-16">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
            
              <button
                onClick={toggleLang}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors flex items-center space-x-1 dark:border-gray-700 dark:hover:bg-gray-800 dark:text-gray-200"
                title={t('common.language')}
              >
                <Languages className="h-4 w-4" />
                <span className="text-xs font-medium uppercase">{lang}</span>
              </button>
              <button
                onClick={() => openModal()}
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">{t('header.newTask')}</span>
              </button>
              <div className="relative ml-2 pl-2 sm:ml-4 sm:pl-4 border-l border-gray-200">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-2 text-sm hover:bg-gray-50 rounded-xl p-1.5 sm:p-2 transition-all duration-200"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <span className="hidden sm:inline text-slate-700 font-medium">
                    {(user?.user_metadata as any)?.name || user?.email?.split('@')[0]}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* User Dropdown Menu - Fixed positioning for top layer */}
      {userMenuOpen && (
        <div className="fixed inset-0 z-[999999] pointer-events-none">
          <div className="absolute top-20 right-4 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 pointer-events-auto" ref={userMenuRef}>
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">{(user?.user_metadata as any)?.name || user?.email?.split('@')[0]}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            
            <div className="py-1">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setUserMenuOpen(false);
                        onProfileClick();
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <UserCircle className="h-4 w-4 mr-3 text-gray-400" />
                      {t('header.profile')}
                    </button>
              
              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  if (onSettingsClick) onSettingsClick();
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <Settings className="h-4 w-4 mr-3 text-gray-400" />
                {t('header.settings')}
              </button>

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  if (onNotificationsClick) onNotificationsClick();
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <Bell className="h-4 w-4 mr-3 text-gray-400" />
                {t('header.notifications')}
              </button>

              <button
                onClick={() => {
                  setUserMenuOpen(false);
                  if (onHelpClick) onHelpClick();
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <HelpCircle className="h-4 w-4 mr-3 text-gray-400" />
                {t('header.help')}
              </button>
            </div>
            
            <div className="border-t border-gray-100 py-1">
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setUserMenuOpen(false);
                  try {
                    const { error } = await signOut();
                    if (error) {
                      console.error('Çıkış yapma hatası:', error);
                    }
                    
                  } catch (err) {
                    console.error('Çıkış yapma hatası:', err);
                  }
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-3" />
                {t('header.logout')}
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
}