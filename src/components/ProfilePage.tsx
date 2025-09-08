import React, { useMemo, useState } from 'react';
import { ArrowLeft, Calendar, Edit, Save, Bell, Lock, User as UserIcon, Shield, Activity, Clock, BarChart3, Target, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { CustomSelect } from './CustomSelect';
import { useTask } from '../context/TaskContext';
import { supabase } from '../lib/supabase';

// Phone helpers at module scope for reuse
const extractNationalDigits = (input: string) => {
  const digits = (input || '').replace(/\D/g, '');
  const withoutCountry = digits.startsWith('90') ? digits.slice(2) : digits;
  return withoutCountry.slice(0, 10);
};

const formatTrPhone = (national10: string) => {
  const a = national10.slice(0, 3);
  const b = national10.slice(3, 6);
  const c = national10.slice(6, 10);
  // No parenthesis until 3 digits entered
  if (a.length < 3) {
    return '+90 ' + a;
  }
  let out = '+90 (' + a + ')';
  if (b.length > 0 || c.length > 0) out += ' ';
  out += b;
  if (b.length === 3 && c.length > 0) out += ' ';
  out += c;
  return out;
};

interface ProfilePageProps {
  onBack: () => void;
}

export function ProfilePage({ onBack }: ProfilePageProps) {
  const { user } = useAuth();
  const { state } = useTask();
  const { tasks } = state;
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileData, setProfileData] = useState({
    name: (user?.user_metadata as any)?.name || user?.email?.split('@')[0] || 'Kullanıcı',
    email: user?.email || '',
    bio: 'Merhaba, ben bir TaskPro kullanıcısıyım! Görevlerimi düzenli olarak takip ediyorum ve hedeflerime ulaşmaya çalışıyorum.',
    location: 'İstanbul, Türkiye',
    website: 'https://example.com',
    phone: (user?.user_metadata as any)?.phone || '+90 555 123 45 67',
    joinedDate: '2023-01-15',
    lastActive: '2 saat önce',
    timezone: 'Europe/Istanbul',
    language: 'Türkçe'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    taskReminders: true,
    weeklyReports: false,
    projectUpdates: true,
    deadlineAlerts: true,
    teamMentions: false,
    systemUpdates: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: true,
    showEmail: false,
    showActivity: true,
    showLocation: false,
    showOnlineStatus: true,
    allowDirectMessages: true,
    showTaskProgress: false
  });


  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
    const todoTasks = tasks.filter(t => t.status === 'todo').length;

    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const overdueTasks = tasks.filter(t => t.status !== 'completed' && new Date(t.dueDate) < startOfToday).length;

    const productivityScore = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // Streak: consecutive days up to today with at least one task completed (using updatedAt as completion date proxy)
    const completedDates = new Set(
      tasks
        .filter(t => t.status === 'completed' && t.updatedAt)
        .map(t => new Date(new Date(t.updatedAt).getFullYear(), new Date(t.updatedAt).getMonth(), new Date(t.updatedAt).getDate()).toDateString())
    );
    let streakDays = 0;
    let cursor = new Date(startOfToday);
    while (completedDates.has(cursor.toDateString())) {
      streakDays += 1;
      cursor.setDate(cursor.getDate() - 1);
    }

    const categories = Array.from(new Set(tasks.map(t => t.category).filter(Boolean)));
    const totalProjects = categories.length;

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      overdueTasks,
      productivityScore,
      streakDays,
      totalProjects,
    };
  }, [tasks]);

  // Save handler is not used currently; edits are local-only.

  const handleBack = () => {
    onBack();
  };

  const handleChangePassword = async () => {
    setPasswordMessage(null);
    if (!user?.email) {
      setPasswordMessage({ type: 'error', text: 'Kullanıcı bilgisi bulunamadı.' });
      return;
    }
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Lütfen tüm alanları doldurun.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Yeni şifre ile doğrulama uyuşmuyor.' });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Yeni şifre en az 6 karakter olmalı.' });
      return;
    }

    setPasswordLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: currentPassword,
      });
      if (signInError) {
        setPasswordMessage({ type: 'error', text: 'Mevcut şifre hatalı.' });
        setPasswordLoading(false);
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) {
        setPasswordMessage({ type: 'error', text: updateError.message || 'Şifre güncellenemedi.' });
      } else {
        setPasswordMessage({ type: 'success', text: 'Şifre başarıyla güncellendi.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (e) {
      setPasswordMessage({ type: 'error', text: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil', icon: UserIcon },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'privacy', label: 'Gizlilik', icon: Shield },
    { id: 'security', label: 'Güvenlik', icon: Lock },
    { id: 'stats', label: 'İstatistikler', icon: BarChart3 }
  ];

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900">Profil Ayarları</h1>
            </div>
            <div className="flex items-center space-x-3"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Profile Header */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {profileData.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{profileData.name}</h2>
                <p className="text-sm text-gray-500">{profileData.email}</p>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'bg-violet-50 text-violet-700 border border-violet-200'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Kişisel Bilgiler</h3>
                    <div className="flex items-center space-x-3">
                      {!isEditing ? (
                        <button
                          onClick={() => setIsEditing(true)}
                          className="flex items-center space-x-2 px-4 h-11 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                        >
                          <Edit className="h-4 w-4" />
                          <span>Düzenle</span>
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => setIsEditing(false)}
                            className="px-4 h-11 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 transition-colors shadow-sm"
                          >
                            İptal
                          </button>
                          <SaveProfileButton profileData={profileData} onDone={() => setIsEditing(false)} />
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ad Soyad</label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        readOnly={!isEditing}
                        className={`w-full rounded-xl border border-gray-300/80 bg-white shadow-sm h-12 px-4 text-[15px] placeholder:text-gray-400 ${
                          isEditing ? 'focus:border-violet-500 focus:ring-4 focus:ring-violet-100' : 'bg-gray-50'
                        } transition-colors`}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-posta</label>
                      <input
                        type="email"
                        value={profileData.email}
                        readOnly
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 shadow-inner h-12 px-4 text-[15px] text-gray-700"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefon</label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={formatTrPhone(extractNationalDigits(profileData.phone))}
                        onChange={(e) => {
                          if (!isEditing) return;
                          const digits10 = extractNationalDigits(e.target.value);
                          setProfileData({ ...profileData, phone: '+90' + digits10 });
                        }}
                        onKeyDown={(e) => {
                          const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
                          if (allowed.includes(e.key)) return;
                          if (!/\d/.test(e.key)) {
                            e.preventDefault();
                          }
                        }}
                        readOnly={!isEditing}
                        maxLength={18}
                        placeholder="+90 (5xx) xxx xxxx"
                        className={`w-full rounded-xl border border-gray-300/80 bg-white shadow-sm h-12 px-4 text-[15px] ${
                          isEditing ? 'focus:border-violet-500 focus:ring-4 focus:ring-violet-100' : 'bg-gray-50'
                        } transition-colors`}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Katılım Tarihi</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{profileData.joinedDate}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Son Aktivite</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{profileData.lastActive}</p>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Saat Dilimi</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{profileData.timezone}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Bildirim Ayarları</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-700">E-posta Bildirimleri</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'emailNotifications', label: 'Genel E-posta Bildirimleri' },
                          { key: 'taskReminders', label: 'Görev Hatırlatıcıları' },
                          { key: 'weeklyReports', label: 'Haftalık Raporlar' },
                          { key: 'projectUpdates', label: 'Proje Güncellemeleri' },
                          { key: 'deadlineAlerts', label: 'Son Tarih Uyarıları' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">{item.label}</label>
                            <ToggleSwitch
                              checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                              onChange={() => setNotificationSettings(prev => ({ 
                                ...prev, 
                                [item.key]: !prev[item.key as keyof typeof notificationSettings] 
                              }))}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-700">Push Bildirimleri</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'pushNotifications', label: 'Push Bildirimleri' },
                          { key: 'teamMentions', label: 'Takım Bahsetmeleri' },
                          { key: 'systemUpdates', label: 'Sistem Güncellemeleri' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">{item.label}</label>
                            <ToggleSwitch
                              checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                              onChange={() => setNotificationSettings(prev => ({ 
                                ...prev, 
                                [item.key]: !prev[item.key as keyof typeof notificationSettings] 
                              }))}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy Tab */}
              {activeTab === 'privacy' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Gizlilik Ayarları</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-700">Profil Görünürlüğü</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'profileVisibility', label: 'Profil Görünürlüğü' },
                          { key: 'showEmail', label: 'E-posta Adresini Göster' },
                          { key: 'showActivity', label: 'Son Aktiviteyi Göster' },
                          { key: 'showLocation', label: 'Konum Bilgisini Göster' },
                          { key: 'showOnlineStatus', label: 'Çevrimiçi Durumunu Göster' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">{item.label}</label>
                            <ToggleSwitch
                              checked={privacySettings[item.key as keyof typeof privacySettings]}
                              onChange={() => setPrivacySettings(prev => ({ 
                                ...prev, 
                                [item.key]: !prev[item.key as keyof typeof privacySettings] 
                              }))}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-700">İletişim</h4>
                      <div className="space-y-3">
                        {[
                          { key: 'allowDirectMessages', label: 'Doğrudan Mesajlara İzin Ver' },
                          { key: 'showTaskProgress', label: 'Görev İlerlemesini Göster' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">{item.label}</label>
                            <ToggleSwitch
                              checked={privacySettings[item.key as keyof typeof privacySettings]}
                              onChange={() => setPrivacySettings(prev => ({ 
                                ...prev, 
                                [item.key]: !prev[item.key as keyof typeof privacySettings] 
                              }))}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Güvenlik Ayarları</h3>
                  
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-md font-medium text-gray-700">Şifre Değiştirme</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
                          <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full rounded-xl border border-gray-300/80 bg-white shadow-sm h-12 px-4 text-[15px] focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                          <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full rounded-xl border border-gray-300/80 bg-white shadow-sm h-12 px-4 text-[15px] focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre (Tekrar)</label>
                          <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full rounded-xl border border-gray-300/80 bg-white shadow-sm h-12 px-4 text-[15px] focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                          />
                        </div>
                      </div>
                      {passwordMessage && (
                        <div className={`${passwordMessage.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'} border rounded-lg p-3 text-sm`}>
                          {passwordMessage.text}
                        </div>
                      )}
                      <button
                        onClick={handleChangePassword}
                        disabled={passwordLoading}
                        className={`inline-flex items-center px-5 h-11 rounded-xl text-white font-medium shadow-sm transition-colors ${passwordLoading ? 'bg-violet-300' : 'bg-violet-600 hover:bg-violet-700'}`}
                      >
                        {passwordLoading ? 'Kaydediliyor...' : 'Şifreyi Güncelle'}
                      </button>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="h-5 w-5 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-800">Güvenlik Uyarısı</span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-1">
                        Şifrenizi düzenli olarak değiştirmenizi ve güçlü bir şifre kullanmanızı öneriyoruz.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Tab */}
              {activeTab === 'stats' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">İstatistikler</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">Toplam Görev</p>
                          <p className="text-2xl font-bold text-blue-900">{stats.totalTasks}</p>
                        </div>
                        <Target className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">Tamamlanan</p>
                          <p className="text-2xl font-bold text-green-900">{stats.completedTasks}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-yellow-600">Devam Eden</p>
                          <p className="text-2xl font-bold text-yellow-900">{stats.inProgressTasks}</p>
                        </div>
                        <Clock className="h-8 w-8 text-yellow-600" />
                      </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-600">Geciken</p>
                          <p className="text-2xl font-bold text-red-900">{stats.overdueTasks}</p>
                        </div>
                        <XCircle className="h-8 w-8 text-red-600" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">Performans</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">Verimlilik Skoru</span>
                            <span className="font-medium">{stats.productivityScore}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-violet-500 to-purple-600 h-2 rounded-full" 
                              style={{ width: `${stats.productivityScore}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Seri Günler</span>
                          <span className="text-lg font-semibold text-gray-900">{stats.streakDays} gün</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="text-md font-semibold text-gray-900 mb-4">Kategoriler</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Toplam Kategori</span>
                          <span className="font-medium">{stats.totalProjects}</span>
                        </div>
                        {/* Takım Üyeleri bilgisi mevcut değil; gerekirse eklenebilir */}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Toggle Switch Component
const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        className="sr-only"
        checked={!!checked}
        onChange={onChange}
      />
      <div className={`block w-10 h-6 rounded-full transition-colors ${checked ? 'bg-violet-600' : 'bg-gray-300'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-full' : ''}`}></div>
    </div>
  </label>
);

// Save Profile Button Component
const SaveProfileButton: React.FC<{ profileData: { name: string; phone: string }; onDone: () => void }> = ({ profileData, onDone }) => {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSave = async () => {
    setMessage(null);
    setSaving(true);
    try {
      const digits10 = extractNationalDigits(profileData.phone);
      const e164 = '+90' + digits10;
      const { error } = await supabase.auth.updateUser({ data: { name: profileData.name, phone: e164 } });
      if (error) {
        setMessage({ type: 'error', text: error.message || 'Kaydedilemedi.' });
      } else {
        setMessage({ type: 'success', text: 'Profil güncellendi.' });
        onDone();
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Bir hata oluştu.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {message && (
        <span className={`text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</span>
      )}
      <button
        onClick={handleSave}
        disabled={saving}
        className={`flex items-center space-x-2 px-4 h-11 rounded-xl ${saving ? 'bg-violet-300' : 'bg-violet-600 hover:bg-violet-700'} text-white transition-colors shadow-sm`}
      >
        <Save className="h-4 w-4" />
        <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
      </button>
    </div>
  );
};
