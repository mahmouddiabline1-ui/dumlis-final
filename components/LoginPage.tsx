import React, { useState } from 'react';
import { LogIn, User, Lock, ArrowLeft, ShieldCheck, Mail, CheckCircle, X, ArrowRight } from 'lucide-react';
import { FACULTIES } from '../constants';
import { UserRole } from '../types';
import { authApi, AuthLoginResponse } from '../api';

interface LoginPageProps {
  onLogin: (payload: { role: UserRole; username?: string; facultyId?: string; studentId?: string; landing?: { tabId: string; subItemId?: string | null } }) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Forgot Password States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'email' | 'code' | 'success'>('email');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [sentCode, setSentCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const resp: AuthLoginResponse = await authApi.login({ username, password });
      // Persist auth data
      localStorage.setItem('authToken', resp.access_token);
      localStorage.setItem('userRole', resp.user_role);
      if (resp.student_id) {
        localStorage.setItem('currentStudentId', resp.student_id);
      }
      // Build landing based on role
      const landing =
        resp.user_role === 'faculty_admin'
          ? { tabId: 'dashboard' }
          : undefined;
      onLogin({
        role: resp.user_role,
        username: resp.username,
        facultyId: resp.faculty_id ?? undefined,
        studentId: resp.student_id ?? undefined,
        ...(landing ? { landing } : {}),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء تسجيل الدخول';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Forgot Password - Send Code
  const handleSendResetCode = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError('');
    
    if (!forgotPasswordEmail.trim()) {
      setForgotPasswordError('يرجى إدخال البريد الإلكتروني أو اسم المستخدم');
      return;
    }

    setForgotPasswordLoading(true);
    
    // Simulate sending reset code
    setTimeout(() => {
      // Generate a 6-digit code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSentCode(code);
      setForgotPasswordStep('code');
      setForgotPasswordLoading(false);
      // In production, this would be sent via email
    }, 1500);
  };

  // Handle Verify Code and Reset Password
  const handleVerifyCodeAndReset = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordError('');

    if (!resetCode.trim()) {
      setForgotPasswordError('يرجى إدخال رمز التحقق');
      return;
    }

    if (resetCode !== sentCode) {
      setForgotPasswordError('رمز التحقق غير صحيح');
      return;
    }

    if (!newPassword.trim() || newPassword.length < 6) {
      setForgotPasswordError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }

    if (newPassword !== confirmPassword) {
      setForgotPasswordError('كلمات المرور غير متطابقة');
      return;
    }

    setForgotPasswordLoading(true);

    // Simulate password reset
    setTimeout(() => {
      setForgotPasswordStep('success');
      setForgotPasswordLoading(false);
      
      // Auto close and reset after 3 seconds
      setTimeout(() => {
        setShowForgotPassword(false);
        setForgotPasswordStep('email');
        setForgotPasswordEmail('');
        setResetCode('');
        setNewPassword('');
        setConfirmPassword('');
        setSentCode('');
      }, 3000);
    }, 1500);
  };

  // Reset forgot password form
  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setForgotPasswordStep('email');
    setForgotPasswordEmail('');
    setResetCode('');
    setNewPassword('');
    setConfirmPassword('');
    setSentCode('');
    setForgotPasswordError('');
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

        {/* Left Side: Login Form / Forgot Password */}
        <div className="w-full md:w-1/2 p-12 bg-white flex flex-col justify-center">
          {!showForgotPassword ? (
            <>
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
              <button 
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-primary-600 hover:text-primary-800 font-medium transition-colors"
              >
                نسيت كلمة المرور؟
              </button>
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
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-3 text-center font-medium">🔐 بيانات تجريبية للدخول (اضغط للتعبئة والدخول الفوري):</p>

            <div className="space-y-3">
              {/* Quick Login Buttons */}
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    setUsername('2024006');
                    setPassword('test1234');
                    setTimeout(() => {
                      setUsername('2024006');
                      setPassword('test1234');
                      document.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true }));
                    }, 50);
                  }}
                  className="bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer border border-blue-200 hover:bg-blue-100 hover:shadow-md shadow-sm"
                >
                  👨‍🎓 طالب<br/><span className="text-[9px]">2024006 / test1234</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setUsername('admin_fcai');
                    setPassword('admin');
                    setTimeout(() => {
                      setUsername('admin_fcai');
                      setPassword('admin');
                      document.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true }));
                    }, 50);
                  }}
                  className="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer border border-green-200 hover:bg-green-100 hover:shadow-md shadow-sm"
                >
                  👨‍💼 مسؤول كلية<br/><span className="text-[9px]">admin_fcai / admin</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setUsername('super_admin');
                    setPassword('test1234');
                    setTimeout(() => {
                      setUsername('super_admin');
                      setPassword('test1234');
                      document.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true }));
                    }, 50);
                  }}
                  className="bg-purple-50 text-purple-700 px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer border border-purple-200 hover:bg-purple-100 hover:shadow-md shadow-sm"
                >
                  👑 مسؤول النظام<br/><span className="text-[9px]">super_admin / test1234</span>
                </button>
              </div>

              {/* Faculty Admins Grid */}
              <div className="bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                <p className="text-[10px] text-gray-400 mb-2 text-center uppercase tracking-wider font-bold">أدمن الكليات (FCAI: admin | الباقي: test1234)</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {FACULTIES.map(faculty => (
                    <button
                      key={faculty.id}
                      type="button"
                      onClick={() => { setUsername(`admin_${faculty.id.toLowerCase()}`); setPassword(faculty.id === 'FCAI' ? 'admin' : 'test1234'); }}
                      className="bg-white hover:bg-primary-50 hover:text-primary-700 px-2 py-1.5 rounded-lg text-[9px] transition-all cursor-pointer border border-gray-200 hover:border-primary-200 shadow-sm flex items-center justify-center gap-1 group"
                    >
                      <span className="opacity-70 group-hover:opacity-100">{faculty.icon}</span>
                      <span className="truncate">{faculty.id}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Demo Students Grid */}
              <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                <p className="text-[10px] text-blue-400 mb-2 text-center uppercase tracking-wider font-bold">👨‍🎓 طلاب تجريبيون (جميعهم: test1234)</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: '2024002', name: 'أحمد إبراهيم', level: 'الأول' },
                    { id: '2024033', name: 'إبراهيم حسين', level: 'الثاني' },
                    { id: '2024035', name: 'نور عبدالله', level: 'الثالث' },
                    { id: '2024034', name: 'مريم خالد', level: 'الرابع' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setUsername(s.id);
                        setPassword('test1234');
                        setTimeout(() => {
                          setUsername(s.id);
                          setPassword('test1234');
                          document.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true }));
                        }, 50);
                      }}
                      className="bg-white hover:bg-blue-50 px-2 py-2 rounded-lg text-xs transition-all cursor-pointer border border-blue-100 hover:border-blue-300 shadow-sm flex items-center gap-2 group"
                    >
                      <div className="w-7 h-7 rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center text-blue-700 font-bold text-sm shrink-0">
                        {s.name.charAt(0)}
                      </div>
                      <div className="text-right overflow-hidden">
                        <div className="font-medium text-gray-800 text-[10px] truncate">{s.name}</div>
                        <div className="text-[9px] text-blue-500">المستوى {s.level} · {s.id}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
            </>
          ) : (
            <>
              {/* Forgot Password Form */}
              <div className="mb-8 text-center md:text-right">
                <button
                  onClick={handleBackToLogin}
                  className="mb-4 flex items-center gap-2 text-gray-500 hover:text-primary-600 transition-colors text-sm"
                >
                  <ArrowRight className="w-4 h-4" />
                  العودة لتسجيل الدخول
                </button>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">استعادة كلمة المرور</h3>
                <p className="text-gray-500">
                  {forgotPasswordStep === 'email' && 'أدخل البريد الإلكتروني أو اسم المستخدم لإرسال رمز التحقق'}
                  {forgotPasswordStep === 'code' && 'أدخل رمز التحقق الذي تم إرساله إلى بريدك الإلكتروني'}
                  {forgotPasswordStep === 'success' && 'تم تغيير كلمة المرور بنجاح!'}
                </p>
              </div>

              {forgotPasswordError && (
                <div className="mb-6 p-4 bg-red-50 border-r-4 border-red-500 text-red-700 text-sm rounded-lg flex items-center gap-2 animate-shake">
                  <X className="w-5 h-5" />
                  {forgotPasswordError}
                </div>
              )}

              {forgotPasswordStep === 'success' ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">تم بنجاح!</h4>
                  <p className="text-gray-600 mb-6">تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.</p>
                  <button
                    onClick={handleBackToLogin}
                    className="w-full bg-primary-900 text-white py-3 rounded-xl font-medium hover:bg-primary-800 transition-all"
                  >
                    العودة لتسجيل الدخول
                  </button>
                </div>
              ) : forgotPasswordStep === 'email' ? (
                <form onSubmit={handleSendResetCode} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">البريد الإلكتروني / اسم المستخدم</label>
                    <div className="relative group">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                      <input 
                        type="text" 
                        value={forgotPasswordEmail}
                        onChange={(e) => setForgotPasswordEmail(e.target.value)}
                        className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                        placeholder="أدخل البريد الإلكتروني أو اسم المستخدم"
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={forgotPasswordLoading}
                    className="w-full bg-primary-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-500/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {forgotPasswordLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>إرسال رمز التحقق</span>
                        <ArrowLeft className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCodeAndReset} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">رمز التحقق</label>
                    <div className="relative group">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                      <input 
                        type="text" 
                        value={resetCode}
                        onChange={(e) => setResetCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all text-center text-2xl tracking-widest"
                        placeholder="000000"
                        maxLength={6}
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      تم إرسال رمز التحقق إلى: <span className="font-medium">{forgotPasswordEmail}</span>
                      <br />
                      <span className="text-primary-600">(في بيئة الإنتاج، سيتم إرساله إلى بريدك الإلكتروني)</span>
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">كلمة المرور الجديدة</label>
                    <div className="relative group">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                        placeholder="••••••••"
                        minLength={6}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 block">تأكيد كلمة المرور</label>
                    <div className="relative group">
                      <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
                        placeholder="••••••••"
                        minLength={6}
                        required
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={forgotPasswordLoading}
                    className="w-full bg-primary-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-800 focus:ring-4 focus:ring-primary-500/30 transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {forgotPasswordLoading ? (
                      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>تغيير كلمة المرور</span>
                        <ArrowLeft className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;