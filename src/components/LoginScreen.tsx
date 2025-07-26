import React, { useState } from 'react';
import { CheckSquare, Shield, Users, Zap } from 'lucide-react';
import { AuthModal } from './AuthModal';

export function LoginScreen() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const features = [
    {
      icon: CheckSquare,
      title: 'Görev Yönetimi',
      description: 'Görevlerinizi kolayca oluşturun, düzenleyin ve takip edin'
    },
    {
      icon: Shield,
      title: 'Güvenli Depolama',
      description: 'Verileriniz güvenli bir şekilde bulutta saklanır'
    },
    {
      icon: Users,
      title: 'Kişisel Hesap',
      description: 'Her kullanıcının kendine özel görev alanı'
    },
    {
      icon: Zap,
      title: 'Hızlı ve Kolay',
      description: 'Sezgisel arayüz ile hızlı görev yönetimi'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl shadow-lg">
              <CheckSquare className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              TaskPro
            </h1>
          </div>
          
          <h2 className="text-2xl font-bold text-slate-800 mb-4">
            Görevlerinizi Profesyonelce Yönetin
          </h2>
          
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            TaskPro ile görevlerinizi organize edin, önceliklerinizi belirleyin ve 
            hedeflerinize daha hızlı ulaşın. Kişisel hesabınızla tüm görevleriniz güvende.
          </p>
          
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Hemen Başlayın
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-gray-50/30 rounded-2xl p-6 shadow-sm border border-gray-200/50 hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-violet-600" />
              </div>
              
              <h3 className="font-bold text-slate-800 mb-2">{feature.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
}