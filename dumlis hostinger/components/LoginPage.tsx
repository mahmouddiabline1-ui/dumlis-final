import React, { useState } from 'react';
import { LogIn, User, Lock, ArrowLeft, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate Network Delay
    setTimeout(() => {
      // Mock Authentication Logic
      if (username === 'president' && password === 'admin') {
        onLogin('super_admin');
      } else if (username === 'admin' && password === 'admin') {
        onLogin('faculty_admin');
      } else if (username === 'student' && password === 'student') {
        onLogin('student');
      } else {
        setError('اسم المستخدم أو كلمة المرور غير صحيحة');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-primary-900 rounded-b-[50px] md:rounded-b-[100px] z-0"></div>
      
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative z-10 animate-fade-in-up">
        
        {/* Right Side: Branding */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-primary-900 to-primary-800 p-12 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Decorative Circles */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-gold-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-40 h-40 bg-primary-500/30 rounded-full blur-2xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <img 
                src="/logo.PNG" 
                alt="Logo" 
                className="w-16 h-16 bg-white rounded-full p-1 shadow-lg border-2 border-gold-500 object-contain"
              />
              <div>
                <h1 className="text-3xl font-bold tracking-wider font-sans">DUMLIS</h1>
                <p className="text-sm text-gold-400 opacity-90 tracking-widest uppercase">Damietta University</p>
              </div>
            </div>
            
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              نظام إدارة شؤون طلاب <br/>
              <span className="text-gold-400">جامعة دمياط</span>
            </h2>
            <p className="text-primary-100 text-lg leading-relaxed opacity-90">
              المنصة الموحدة لإدارة الخدمات الأكاديمية، شؤون الطلاب، الكنترول، والجداول الدراسية بأحدث التقنيات.
            </p>
          </div>

          <div className="mt-12 flex gap-4 text-sm text-primary-300 relative z-10">
            <span>© 2024 جامعة دمياط</span>
            <span>•</span>
            <span>كلية الحاسبات والذكاء الاصطناعي</span>
          </div>
        </div>

        {/* Left Side: Login Form */}
        <div className="w-full md:w-1/2 p-12 bg-white flex flex-col justify-center">
          <div className="mb-8 text-center md:text-right">
            <h3 className="text-2xl font-bold text-gray-800 mb-2">تسجيل الدخول</h3>
            <p className="text-gray-500">مرحباً بك، يرجى إدخال بياناتك للمتابعة</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 text-red-700 text-sm rounded-lg flex items-center gap-2 animate-shake">
              <ShieldCheck className="w-5 h-5" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">اسم المستخدم / الكود</label>
              <div className="relative group">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                <input 
                  type="text" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  placeholder="أدخل الرقم التعريفي"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block">كلمة المرور</label>
              <div className="relative group">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                <span className="text-gray-600">تذكرني</span>
              </label>
              <a href="#" className="text-primary-600 hover:text-primary-800 font-medium">نسيت كلمة المرور؟</a>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-primary-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-500/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>دخول للنظام</span>
                  <ArrowLeft className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {/* Helper Text for Demo */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-2">بيانات تجريبية للدخول (اضغط للتعبئة):</p>
            <div className="flex flex-wrap justify-center gap-2 text-[10px] text-gray-500">
              <button 
                type="button"
                onClick={() => { setUsername('president'); setPassword('admin'); }}
                className="bg-gray-100 hover:bg-primary-50 hover:text-primary-700 px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-transparent hover:border-primary-200"
              >
                رئيس الجامعة: president / admin
              </button>
              <button 
                type="button"
                onClick={() => { setUsername('admin'); setPassword('admin'); }}
                className="bg-gray-100 hover:bg-primary-50 hover:text-primary-700 px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-transparent hover:border-primary-200"
              >
                أدمن الكلية: admin / admin
              </button>
              <button 
                type="button"
                onClick={() => { setUsername('student'); setPassword('student'); }}
                className="bg-gray-100 hover:bg-primary-50 hover:text-primary-700 px-3 py-1.5 rounded-full transition-colors cursor-pointer border border-transparent hover:border-primary-200"
              >
                طالب: student / student
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;