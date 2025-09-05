import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isSignUp && password !== confirmPassword) {
      setError('Şifreler eşleşmiyor');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalıdır');
      setLoading(false);
      return;
    }

    try {
      const { error } = isSignUp 
        ? await signUp(email, password)
        : await signIn(email, password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Geçersiz email veya şifre');
        } else if (error.message.includes('User already registered')) {
          setError('Bu email adresi zaten kayıtlı');
        } else {
          setError(error.message);
        }
      } else {
        if (isSignUp) {
          setError('');
          alert('Kayıt başarılı! Giriş yapabilirsiniz.');
          setIsSignUp(false);
        } else {
          onClose();
        }
      }
    } catch (err) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError('');
    setShowPassword(false);
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-50 dark:bg-slate-50 rounded-2xl shadow-2xl w-full max-w-md border border-violet-100 dark:border-violet-200">
        <div className="flex items-center justify-between p-6 border-b border-violet-100 dark:border-violet-200 bg-gradient-to-r from-violet-50/80 to-purple-50/60 rounded-t-2xl">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            {isSignUp ? 'Hesap Oluştur' : 'Giriş Yap'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-violet-600 transition-colors p-2 hover:bg-violet-50 rounded-xl"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 dark:bg-rose-900 border border-rose-200 dark:border-rose-700 rounded-xl text-rose-600 dark:text-rose-300 text-sm font-medium">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-black mb-2 flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email Adresi
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-violet-400/40 focus:border-violet-400 transition-all duration-200 shadow-sm border-violet-100 placeholder:text-slate-400"
              placeholder="ornek@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-semibold text-black mb-2 flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-200"
                placeholder="En az 6 karakter"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <div>
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-black mb-2 flex items-center">
                <Lock className="h-4 w-4 mr-2" />
                Şifre Tekrar
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/70 backdrop-blur-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-200"
                placeholder="Şifrenizi tekrar girin"
                required={isSignUp}
                minLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 mt-2 bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 border-0"
          >
            {loading ? 'İşleniyor...' : (isSignUp ? 'Hesap Oluştur' : 'Giriş Yap')}
          </button>

          <div className="text-center pt-4">
            <button
              type="button"
              onClick={toggleMode}
              className="text-violet-600 hover:text-violet-700 font-medium text-sm transition-colors"
            >
              {isSignUp ? 'Zaten hesabınız var mı? Giriş yapın' : 'Hesabınız yok mu? Kayıt olun'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}