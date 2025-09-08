import React, { useEffect, useState } from 'react';
import { ArrowLeft, Bell, Mail, Smartphone, Check, EyeOff } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

interface NotificationsPageProps {
  onBack: () => void;
}

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  type: 'email' | 'push' | 'task';
  read: boolean;
};

const now = Date.now();
const hours = (h: number) => new Date(now - h * 60 * 60 * 1000).toISOString();
const days = (d: number) => new Date(now - d * 24 * 60 * 60 * 1000).toISOString();

const mockData: NotificationItem[] = [
  { id: '1', title: 'Yeni görev oluşturuldu', description: '“Sunum Hazırlığı” görevi eklendi.', date: hours(2), type: 'task', read: false },
  { id: '2', title: 'Yaklaşan teslim tarihi', description: '“Teklif Dokümanı” için son 1 gün.', date: days(1), type: 'task', read: false },
  { id: '3', title: 'Haftalık özet', description: 'Bu hafta 5 görevi tamamladınız.', date: days(3), type: 'email', read: true },
  { id: '4', title: 'Görev durum güncellendi', description: '“Arayüz Revizyonu” tamamlandı olarak işaretlendi.', date: days(4), type: 'task', read: true },
  { id: '5', title: 'Yeni yorum', description: '“Mobil Ekranlar” görevi hakkında yorum var.', date: days(5), type: 'push', read: false },
  { id: '6', title: 'Görev hatırlatma', description: '“Pazarlama Raporu” bugün teslim.', date: days(0), type: 'push', read: false },
];

const TypeIcon: React.FC<{ t: NotificationItem['type'] }> = ({ t }) => {
  if (t === 'email') return <Mail className="h-4 w-4 text-violet-600" />;
  if (t === 'push') return <Smartphone className="h-4 w-4 text-violet-600" />;
  return <Bell className="h-4 w-4 text-violet-600" />;
};

export default function NotificationsPage({ onBack }: NotificationsPageProps) {
  const [items, setItems] = useState<NotificationItem[]>(mockData);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const { t, lang } = useI18n();

  const locale = lang === 'tr' ? 'tr-TR' : 'en-US';
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  const formatRelative = (iso: string) => {
    const then = new Date(iso).getTime();
    const diffMs = then - Date.now();
    const diffSec = Math.round(diffMs / 1000);
    const absSec = Math.abs(diffSec);

    if (absSec < 60) return rtf.format(Math.sign(diffSec) * Math.ceil(absSec / 1), 'second');
    const diffMin = Math.round(diffSec / 60);
    const absMin = Math.abs(diffMin);
    if (absMin < 60) return rtf.format(diffMin, 'minute');
    const diffHour = Math.round(diffMin / 60);
    const absHour = Math.abs(diffHour);
    if (absHour < 24) return rtf.format(diffHour, 'hour');
    const diffDay = Math.round(diffHour / 24);
    const absDay = Math.abs(diffDay);
    if (absDay < 7) return rtf.format(diffDay, 'day');
    const diffWeek = Math.round(diffDay / 7);
    return rtf.format(diffWeek, 'week');
  };

  const filtered = showUnreadOnly ? items.filter(i => !i.read) : items;

  const markAllRead = () => setItems(prev => prev.map(i => ({ ...i, read: true })));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-200" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('notifications.title')}</h1>
          </div>
          <div className="hidden sm:flex items-center space-x-2"></div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Summary + Controls */}
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full px-3 py-1">{t('notifications.total')}: {items.length}</span>
            <span className="text-xs sm:text-sm text-violet-700 bg-violet-50 border border-violet-200 rounded-full px-3 py-1">{t('notifications.unread')}: {items.filter(i=>!i.read).length}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowUnreadOnly(v => !v)}
              className={`h-10 px-3 rounded-lg text-sm font-medium flex items-center gap-2 border transition-colors ${showUnreadOnly ? 'bg-violet-600 text-white border-violet-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
            >
              <EyeOff className="h-4 w-4" />
              {showUnreadOnly ? t('notifications.all') : t('notifications.onlyUnread')}
            </button>
            <button
              onClick={markAllRead}
              className="h-10 px-3 rounded-lg text-sm font-medium flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 shadow-sm"
            >
              <Check className="h-4 w-4" />
              {t('notifications.markAllRead')}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-12">{t('notifications.empty')}</div>
          )}
          {filtered.map(item => (
            <div
              key={item.id}
              className={`rounded-xl border p-4 flex items-start justify-between ${item.read ? 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700' : 'bg-violet-50/50 border-violet-200'}`}
            >
              <button
                onClick={() => {
                  if (!item.read) {
                    setItems(prev => prev.map(i => i.id === item.id ? { ...i, read: true } : i));
                  }
                }}
                className="flex items-start space-x-3 text-left flex-1 hover:opacity-95"
              >
                <div className="relative mt-0.5">
                  <TypeIcon t={item.type} />
                  {!item.read && (
                    <span className="absolute -top-1.5 -right-1.5 inline-block h-2.5 w-2.5 rounded-full bg-violet-600" />
                  )}
                </div>
                <div>
                  <p className={`text-sm ${item.read ? 'font-medium' : 'font-semibold'} text-gray-800 dark:text-gray-100`}>{item.title}</p>
                  <p className={`text-sm ${item.read ? 'text-gray-600 dark:text-gray-300' : 'text-gray-700 dark:text-gray-200'}`}>{item.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatRelative(item.date)}</p>
                </div>
              </button>
              <div className="ml-3">
                {!item.read ? (
                  <button
                    onClick={() => setItems(prev => prev.map(i => i.id === item.id ? { ...i, read: true } : i))}
                    className="h-9 px-3 rounded-md text-sm font-medium text-violet-700 bg-white border border-violet-200 hover:bg-violet-50 dark:bg-gray-800 dark:text-violet-300 dark:border-violet-800"
                  >
                    {t('notifications.markRead')}
                  </button>
                ) : (
                  <button
                    onClick={() => setItems(prev => prev.map(i => i.id === item.id ? { ...i, read: false } : i))}
                    className="h-9 px-3 rounded-md text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent"
                  >
                    {t('notifications.markUnread')}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


