# TaskPro

Modern, hızlı ve ölçeklenebilir bir görev yönetimi ve takvim uygulaması. Kanban, Liste, Takvim ve İstatistik görünümleriyle üretkenliğinizi artırın. Supabase ile kimlik doğrulama ve veri saklama, Vite + React + TypeScript ile performanslı bir frontend sunar.

## Özellikler
- **Kimlik Doğrulama (Supabase)**: E-posta ile kayıt/giriş, oturumun yenilemede kalıcı olması
- **Görev Yönetimi**: Oluşturma, güncelleme, silme; kategori, öncelik, durum, tarih alanları
- **Görünümler**: Liste, **Kanban** (sürükle-bırak için dnd-kit), **Takvim**, **İstatistikler** (Chart.js/Recharts)
- **Filtreleme ve Arama**: Durum/öncelik/tarih aralığı ve metin araması
- **Bildirimler ve Yardım**: Özel sayfalar ve içerikler
- **Profil ve Ayarlar**: Dil, varsayılan görünüm ve güvenlik ayarları
- **Uluslararasılaşma (i18n)**: Türkçe ve İngilizce dil desteği
- **Tema**: Tailwind CSS ile dark mode (class) desteği

## Teknoloji Stack
- **React 18 + TypeScript** (Vite 5 ile geliştirme ve üretim derlemesi)
- **Vite**: Hızlı dev sunucu ve build
- **Tailwind CSS 3**: Hızlı stil geliştirme, dark mode class tabanlı
- **Supabase JS v2**: Auth ve Postgres üzerinde `user_tasks` tablosu ile CRUD
- **dnd-kit**: Kanban sürükle-bırak deneyimi
- **Chart.js 4 + react-chartjs-2** ve/veya **Recharts 3**: İstatistik görselleştirme
- **Lucide React**: İkonlar
- **ESLint 9 + typescript-eslint**: Kod kalitesi

## Proje Yapısı
```text
src/
  components/         UI bileşenleri (Header, Sidebar, TaskList, TaskBoard, TaskCalendar, Statistics, ...)
  context/            Uygulama durumları (AuthContext, TaskContext, I18nContext)
  hooks/              Özel hook'lar (useTaskFilters, useLocalStorage)
  lib/                Dış servis istemcileri (supabase.ts)
  services/           İş mantığı ve API katmanı (taskService.ts)
  types/              Tip tanımları (Task.ts)
  main.tsx            Uygulama girişi
  App.tsx             Sayfa düzeni ve yönlendirme benzeri görünüm yönetimi
index.html            Giriş HTML
index.css             Tailwind giriş dosyası ve ufak global stiller
```

## Kurulum
### Gereksinimler
- Node.js 18+
- Supabase projesi (URL ve anon key)

### Başlangıç
```bash
# Bağımlılıkları kurun
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Üretim derlemesi
npm run build

# Üretim derlemesini lokal önizleme
npm run preview
```

## Ortam Değişkenleri
Supabase istemcisi `src/lib/supabase.ts` içinde `import.meta.env` üzerinden yapılandırılır. Aşağıdaki değişkenleri projenin kökünde `.env` dosyasına ekleyin:

```bash
VITE_SUPABASE_URL=YOUR_SUPABASE_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Notlar:
- Bu değişkenler Vite tarafından derleme zamanında enjekte edilir.
- `supabase.ts` dosyası değişkenler eksik ise hata fırlatır.

## Supabase Şema ve Veri Modeli
Uygulama `public.user_tasks` tablosunu kullanır. İlgili tipler `src/lib/supabase.ts` içerisinde tanımlıdır ve `taskService.ts` tarafından kullanılır.
- Alanlar: `id`, `user_id`, `title`, `description`, `priority('low'|'medium'|'high')`, `status('todo'|'in-progress'|'completed')`, `due_date`, `category`, `created_at`, `updated_at`
- CRUD operasyonları `src/services/taskService.ts` üzerinden gerçekleştirilir.

Migrasyonlar `supabase/migrations` klasöründedir. Projenizde Supabase CLI/Studio ile tabloyu senkronize edin.

## Durum Yönetimi
- **AuthContext**: Supabase oturumu izler, `signUp`, `signIn`, `signOut` metodlarını sağlar. Oturum olaylarını dinler ve kullanıcıyı saklar.
- **TaskContext**: Görev listesi, filtreler, seçili görev ve modal durumu ile görünüm modlarını yönetir. Servis katmanıyla konuşur.
- **I18nContext**: `tr` ve `en` mesajlarını içerir, seçilen dili `localStorage('lang')` ile kalıcı kılar. `t(key)` çeviri fonksiyonu sağlar.

## Stil ve Tema
- Tailwind içerik taraması `index.html` ve `src/**/*.{js,ts,jsx,tsx}` için aktiftir.

## Komutlar
`package.json` scriptleri:
- `npm run dev`: Vite geliştirme sunucusu
- `npm run build`: Üretim derlemesi
- `npm run preview`: Derlenmiş çıktıyı lokal önizleme
- `npm run lint`: ESLint ile statik analiz

## Geliştirme İpuçları
- Yeni bir sayfa/görünüm eklerken `TaskContext` içindeki `viewMode` ve `App.tsx` içindeki `renderContent` akışını izleyin.
- i18n metinleri `src/context/I18nContext.tsx` içinde tutulur; yeni anahtarlar eklerken her iki dilde de karşılığını eklemeyi unutmayın.
- Supabase erişimi için `.env` değişkenlerinin yüklü olduğundan emin olun; aksi halde uygulama başlangıçta hata verir.

## Dağıtım
- `npm run build` çıktısı `dist/` klasöründedir. Herhangi bir statik barındırma servisinde (Vercel, Netlify, GitHub Pages, Nginx, S3+CloudFront) yayınlanabilir.
- Ortam değişkenlerini üretim ortamında build öncesi sağlamalısınız.

## Lisans
Bu proje **MIT Lisansı** ile lisanslanmıştır. Ayrıntılar için kökteki `LICENSE` dosyasına bakın.

Telif Hakkı (c) 2025 Osman Emre Sarıahmetoğlu
