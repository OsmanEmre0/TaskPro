import React from 'react';
import { ArrowLeft, BookOpen, MessageCircleQuestion, Mail, Rocket, Shield, Smartphone, Globe2 } from 'lucide-react';
import { useI18n } from '../context/I18nContext';

interface HelpPageProps {
  onBack: () => void;
}

const FAQItem: React.FC<{ q: string; a: React.ReactNode }> = ({ q, a }) => (
  <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
    <p className="font-medium text-gray-900 dark:text-gray-100 mb-2">{q}</p>
    <div className="text-sm text-gray-700 dark:text-gray-300">{a}</div>
  </div>
);

export default function HelpPage({ onBack }: HelpPageProps) {
  const { t } = useI18n();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-200" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{t('help.title')}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <BookOpen className="h-6 w-6 text-violet-600 mb-3" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('help.sections.gettingStarted.title')}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('help.sections.gettingStarted.desc')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <Shield className="h-6 w-6 text-violet-600 mb-3" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('help.sections.account.title')}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('help.sections.account.desc')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <Rocket className="h-6 w-6 text-violet-600 mb-3" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">{t('help.sections.advanced.title')}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{t('help.sections.advanced.desc')}</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <MessageCircleQuestion className="h-5 w-5 text-violet-600 mr-2" /> {t('help.faq.title')}
          </h3>
          <FAQItem q={t('help.faq.q1')} a={<>{t('help.faq.a1')}</>} />
          <FAQItem q={t('help.faq.q2')} a={<>{t('help.faq.a2')}</>} />
          <FAQItem q={t('help.faq.q3')} a={<>{t('help.faq.a3')}</>} />
          <FAQItem q={t('help.faq.q4')} a={<>{t('help.faq.a4')}</>} />
          <FAQItem q={t('help.faq.q5')} a={<>{t('help.faq.a5')}</>} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center"><Globe2 className="h-5 w-5 text-violet-600 mr-2" /> {t('help.tips.title')}</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>{t('help.tips.1')}</li>
              <li>{t('help.tips.2')}</li>
              <li>{t('help.tips.3')}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center"><Smartphone className="h-5 w-5 text-violet-600 mr-2" /> {t('help.support.title')}</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{t('help.support.desc')}</p>
            <div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
              <Mail className="h-4 w-4 text-violet-600" /> <span>osariahnetoglu@gmail.com</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">{t('help.support.emailNote')}</p>
          </div>
        </section>
      </div>
    </div>
  );
}


