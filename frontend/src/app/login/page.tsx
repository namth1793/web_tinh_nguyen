'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/ThemeContext';
import { useLang } from '@/context/LangContext';
import { authApi } from '@/lib/api';
import { cn } from '@/lib/utils';

const DEMO_ACCOUNTS = [
  { labelKey: 'student' as const, email: 'minhtam@gmail.com', password: 'password123', icon: '🧘' },
  { labelKey: 'admin'   as const, email: 'admin@phatphap.vn',  password: 'admin123',     icon: '⚡' },
];

const DEMO_LABELS = {
  student: { vi: 'Học viên', 'zh-CN': '学员', 'zh-TW': '學員' },
  admin:   { vi: 'Admin',    'zh-CN': '管理员', 'zh-TW': '管理員' },
};

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();
  const { t, lang } = useLang();

  const [email, setEmail]             = useState('');
  const [password, setPassword]       = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      login(res.data.token, res.data.user);
      router.push(res.data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || t.common.error);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-cream-100 dark:bg-[#1A1208] flex flex-col">

      {/* ── Mobile hero banner ── */}
      <div className="md:hidden relative overflow-hidden flex flex-col items-center justify-center pt-10 pb-8 px-6"
        style={{ background: 'linear-gradient(135deg, #3D1C02 0%, #6B2F08 50%, #B8860B 100%)', minHeight: 200 }}>
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Ccircle cx='150' cy='150' r='130' fill='none' stroke='%23D4A017' stroke-width='1'/%3E%3Ccircle cx='150' cy='150' r='90' fill='none' stroke='%23D4A017' stroke-width='1'/%3E%3Ccircle cx='150' cy='150' r='50' fill='none' stroke='%23D4A017' stroke-width='1'/%3E%3C/svg%3E")`,
            backgroundSize: '280px', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
          }} />

        {/* Back link */}
        <Link href="/dashboard" className="absolute top-4 left-4">
          <span className="flex items-center gap-1.5 text-amber-200/80 text-sm font-medium">
            <ArrowLeft size={15} /> {t.login.backHome}
          </span>
        </Link>

        <motion.div
          animate={{ y: [-4, 4, -4] }}
          transition={{ duration: 3.5, repeat: Infinity }}
          className="text-6xl mb-3"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}
        >
          🪷
        </motion.div>
        <h1 className="font-black text-white text-lg mb-1" style={{ fontFamily: 'Cinzel, serif', letterSpacing: '0.08em' }}>
          {t.site.name.toUpperCase()}
        </h1>
        <p className="text-amber-200/75 text-xs text-center">{t.login.welcome}</p>
      </div>

      {/* ── Form area ── */}
      <div className="flex-1 md:flex md:items-center md:justify-center md:p-4">

        {/* Desktop two-panel card */}
        <div className="w-full md:max-w-4xl md:flex md:rounded-3xl md:overflow-hidden md:shadow-2xl">

          {/* Left panel — desktop only */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden md:flex flex-col justify-between w-2/5 p-10 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D4A017 40%, #B45309 100%)' }}
          >
            <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-black/10" />

            <div className="relative z-10">
              <Link href="/dashboard">
                <div className="flex items-center gap-3 mb-3 cursor-pointer">
                  <span className="text-4xl" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}>🪷</span>
                  <div>
                    <h1 className="font-black text-white text-lg leading-tight">{t.site.name.toUpperCase()}</h1>
                    <p className="text-amber-100 text-xs">{t.site.tagline}</p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="relative z-10 text-center">
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="text-8xl mb-6 block"
                style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.3))' }}
              >
                🧘
              </motion.div>
              <h2 className="text-2xl font-black text-white leading-tight mb-3">{t.login.welcome}</h2>
              <p className="text-amber-100 text-sm leading-relaxed">{t.login.welcomeSub}</p>
            </div>

            <div className="relative z-10">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                <p className="text-amber-50 text-xs italic leading-relaxed">{t.login.quote}</p>
                <p className="text-amber-200 text-xs mt-2 font-medium">{t.login.quoteAuthor}</p>
              </div>
            </div>
          </motion.div>

          {/* Right panel — form */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 bg-white dark:bg-[#251C0E] px-5 py-6 sm:p-8 md:p-10 flex flex-col justify-center"
          >
            {/* Desktop back link */}
            <div className="hidden md:block mb-6">
              <Link href="/dashboard">
                <span className="inline-flex items-center gap-2 text-sm text-temple-medium hover:text-gold-500 transition-colors font-medium group">
                  <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                  {t.login.backHome}
                </span>
              </Link>
            </div>

            <div className="mb-5 sm:mb-7">
              <h2 className="text-xl sm:text-2xl font-black text-temple-dark dark:text-cream-100 mb-1">
                {t.login.heading}
              </h2>
              <p className="text-sm text-temple-medium">
                {t.login.noAccount}{' '}
                <Link href="/register" className="text-gold-500 hover:text-gold-600 font-semibold transition-colors">
                  {t.login.registerNow}
                </Link>
              </p>
            </div>

            {/* Demo accounts */}
            <div className="mb-4 sm:mb-5">
              <p className="text-xs text-temple-medium mb-2 font-medium">{t.login.demoLogin}</p>
              <div className="flex gap-2">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => fillDemo(acc)}
                    className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-cream-200 dark:border-[#3A2A10] hover:border-gold-400 hover:bg-gold-50 dark:hover:bg-gold-900/20 transition-all text-left"
                  >
                    <span className="text-xl flex-shrink-0">{acc.icon}</span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-temple-dark dark:text-cream-100 leading-tight">
                        {DEMO_LABELS[acc.labelKey][lang]}
                      </p>
                      <p className="text-[10px] text-temple-medium truncate">{acc.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 mb-4 sm:mb-5">
              <hr className="flex-1 border-cream-200 dark:border-[#3A2A10]" />
              <span className="text-xs text-temple-medium px-2">{t.login.orEmail}</span>
              <hr className="flex-1 border-cream-200 dark:border-[#3A2A10]" />
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400 flex items-center gap-2"
              >
                <span>⚠️</span> {error}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-sm font-semibold text-temple-dark dark:text-cream-200 mb-1.5">
                  {t.login.email}
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-temple-medium" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    required
                    className={cn(
                      'w-full pl-10 pr-4 py-3 rounded-xl border-2 bg-cream-50 dark:bg-[#1A1208] text-sm text-temple-dark dark:text-cream-100 placeholder-temple-medium/60 focus:outline-none transition-all',
                      error ? 'border-red-300 focus:border-red-400' : 'border-cream-200 dark:border-[#3A2A10] focus:border-gold-400',
                    )}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-temple-dark dark:text-cream-200">
                    {t.login.password}
                  </label>
                  <button type="button" className="text-xs text-gold-500 hover:text-gold-600 font-medium transition-colors">
                    {t.login.forgotPassword}
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-temple-medium" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={cn(
                      'w-full pl-10 pr-11 py-3 rounded-xl border-2 bg-cream-50 dark:bg-[#1A1208] text-sm text-temple-dark dark:text-cream-100 placeholder-temple-medium/60 focus:outline-none transition-all',
                      error ? 'border-red-300 focus:border-red-400' : 'border-cream-200 dark:border-[#3A2A10] focus:border-gold-400',
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-temple-medium hover:text-temple-dark transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  type="checkbox"
                  className="w-4 h-4 rounded border-cream-300 accent-gold-500"
                />
                <label htmlFor="remember" className="text-sm text-temple-medium cursor-pointer select-none">
                  {t.login.rememberMe}
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={cn(
                  'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all',
                  loading
                    ? 'bg-gold-300 text-white cursor-not-allowed'
                    : 'bg-gold-500 hover:bg-gold-600 text-white shadow-gold hover:shadow-lg',
                )}
              >
                {loading
                  ? <><Loader2 size={17} className="animate-spin" /> {t.login.loading}</>
                  : <>{t.login.submit} <ArrowRight size={17} /></>}
              </motion.button>
            </form>

            <p className="text-center text-xs text-temple-medium mt-4 sm:mt-6">
              {t.login.terms}{' '}
              <span className="text-gold-500 cursor-pointer hover:underline">{t.login.termsLink}</span>
              {' '}{t.login.and}{' '}
              <span className="text-gold-500 cursor-pointer hover:underline">{t.login.privacy}</span>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
