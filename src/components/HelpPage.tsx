import React from 'react';
import { ArrowLeft, BookOpen, MessageCircleQuestion, Mail, Rocket, Shield, Smartphone, Globe2 } from 'lucide-react';

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
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-700 dark:text-gray-200" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Yardım Merkezi</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <BookOpen className="h-6 w-6 text-violet-600 mb-3" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Başlarken</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Görev ekleme, düzenleme ve filtreleme gibi temel özelliklerin hızlı özeti.</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <Shield className="h-6 w-6 text-violet-600 mb-3" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">Hesap ve Güvenlik</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Giriş, oturum ve şifre değiştirme ile ilgili sık sorulanlar.</p>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <Rocket className="h-6 w-6 text-violet-600 mb-3" />
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">İleri Özellikler</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">Takvim, Kanban ve İstatistik görünümlerini verimli kullanma.</p>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <MessageCircleQuestion className="h-5 w-5 text-violet-600 mr-2" /> Sık Sorulan Sorular
          </h3>
          <FAQItem q="Görev nasıl eklerim?" a={<>
            Sağ üstteki “Yeni Görev” butonuna tıklayın. Açılan modaldan başlık, açıklama, tarih ve önceliği girip Kaydet’e basın.
          </>} />
          <FAQItem q="Görünümü nasıl değiştiririm?" a={<> 
            Sol menüden Liste/Tahta/Takvim/İstatistik görünümlerini seçebilirsiniz. Varsayılan görünümü Ayarlar &gt; Varsayılan Görünüm’den kalıcı olarak ayarlayın.
          </>} />
          <FAQItem q="Şifremi nasıl değiştiririm?" a={<>
            Ayarlar  Güvenlik bölümünde mevcut şifrenizle doğrulayıp yeni şifreyi belirleyin.
          </>} />
          <FAQItem q="Dil ve tema nereden değişir?" a={<>
            Header’daki kısayollardan ya da Ayarlar sayfasındaki Dil/Tema bölümlerinden değiştirebilirsiniz.
          </>} />
          <FAQItem q="Verilerim nerede saklanıyor?" a={<>
            Verileriniz bulutta güvenle saklanır. Oturum bilgileriniz yenilemede korunur.
          </>} />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center"><Globe2 className="h-5 w-5 text-violet-600 mr-2" /> İpuçları</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li>Filtre çubuğunu kullanarak görevleri hızla daraltın.</li>
              <li>Kanban tahtasında sürükle-bırak ile durumu güncelleyin.</li>
              <li>Takvim görünümünde teslim tarihlerini görsel olarak takip edin.</li>
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center"><Smartphone className="h-5 w-5 text-violet-600 mr-2" /> Destek</h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">Sorun mu yaşıyorsunuz? Aşağıdaki kanallardan ulaşın:</p>
            <div className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
              <Mail className="h-4 w-4 text-violet-600" /> <span>osariahnetoglu@gmail.com</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Geri bildirimleriniz, ürünü geliştirmemize yardımcı olur.</p>
          </div>
        </section>
      </div>
    </div>
  );
}


