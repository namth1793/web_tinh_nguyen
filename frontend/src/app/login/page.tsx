'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/ThemeContext';
import { authApi } from '@/lib/api';
import { cn } from '@/lib/utils';

const DEMO_ACCOUNTS = [
  { label: 'Học viên (Minh Tâm)', email: 'minhtam@gmail.com', password: 'password123', icon: '🧘' },
  { label: 'Admin', email: 'admin@phatphap.vn', password: 'admin123', icon: '⚡' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authApi.login(email, password);
      login(res.data.token, res.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại. Vui lòng thử lại.');
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
    <div className="min-h-screen bg-cream-100 dark:bg-[#1A1208] flex flex-col items-center justify-center p-4 gap-4">
      {/* Back to home */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl"
      >
        <Link href="/dashboard">
          <span className="inline-flex items-center gap-2 text-sm text-temple-medium hover:text-gold-500 transition-colors font-medium group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Quay về trang chủ
          </span>
        </Link>
      </motion.div>

      <div className="w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-2xl">

        {/* Left panel - decorative */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="hidden md:flex flex-col justify-between w-2/5 p-10 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D4A017 40%, #B45309 100%)' }}
        >
          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-white/10" />
          <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-black/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-white/5 border border-white/20" />

          {/* Top logo */}
          <div className="relative z-10">
            <Link href="/dashboard">
              <div className="flex items-center gap-3 mb-3 cursor-pointer">
                <span className="text-4xl" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}>🪷</span>
                <div>
                  <h1 className="font-black text-white text-lg leading-tight">PHẬT PHÁP TEST</h1>
                  <p className="text-amber-100 text-xs">Học Phật · Hiểu Pháp · An Lạc</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Center content */}
          <div className="relative z-10 text-center">
            <motion.div
              animate={{ y: [-8, 8, -8] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="text-8xl mb-6 block"
              style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.3))' }}
            >
              🧘
            </motion.div>
            <h2 className="text-2xl font-black text-white leading-tight mb-3">
              Chào mừng trở lại!
            </h2>
            <p className="text-amber-100 text-sm leading-relaxed">
              Tiếp tục hành trình học Phật pháp của bạn. Mỗi ngày một chút trí tuệ, cuộc sống thêm an lạc.
            </p>
          </div>

          {/* Bottom quote */}
          <div className="relative z-10">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
              <p className="text-amber-50 text-xs italic leading-relaxed">
                "Tâm bình thì thế giới bình. Tâm an thì vạn sự an."
              </p>
              <p className="text-amber-200 text-xs mt-2 font-medium">— Lời Phật dạy</p>
            </div>
          </div>
        </motion.div>

        {/* Right panel - form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 bg-white dark:bg-[#251C0E] p-8 md:p-12 flex flex-col justify-center"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 md:hidden">
            <span className="text-3xl">🪷</span>
            <span className="font-black text-gold-500 text-lg">PHẬT PHÁP TEST</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-black text-temple-dark dark:text-cream-100 mb-1">
              Đăng nhập
            </h2>
            <p className="text-sm text-temple-medium">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="text-gold-500 hover:text-gold-600 font-semibold transition-colors">
                Đăng ký ngay
              </Link>
            </p>
          </div>

          {/* Demo accounts */}
          <div className="mb-6">
            <p className="text-xs text-temple-medium mb-2 font-medium">Đăng nhập nhanh (demo):</p>
            <div className="flex gap-2">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc)}
                  className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-cream-200 dark:border-[#3A2A10] hover:border-gold-400 hover:bg-gold-50 dark:hover:bg-gold-900/20 transition-all text-left"
                >
                  <span className="text-lg">{acc.icon}</span>
                  <div>
                    <p className="text-xs font-semibold text-temple-dark dark:text-cream-100 leading-tight">{acc.label}</p>
                    <p className="text-[10px] text-temple-medium">{acc.email}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <hr className="flex-1 border-cream-200 dark:border-[#3A2A10]" />
            <span className="text-xs text-temple-medium px-2">hoặc đăng nhập bằng email</span>
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
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-temple-dark dark:text-cream-200 mb-1.5">
                Email
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
                    error ? 'border-red-300 focus:border-red-400' : 'border-cream-200 dark:border-[#3A2A10] focus:border-gold-400 dark:focus:border-gold-500'
                  )}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-semibold text-temple-dark dark:text-cream-200">
                  Mật khẩu
                </label>
                <button type="button" className="text-xs text-gold-500 hover:text-gold-600 font-medium transition-colors">
                  Quên mật khẩu?
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
                    error ? 'border-red-300 focus:border-red-400' : 'border-cream-200 dark:border-[#3A2A10] focus:border-gold-400 dark:focus:border-gold-500'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-temple-medium hover:text-temple-dark dark:hover:text-cream-100 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border-cream-300 text-gold-500 focus:ring-gold-400 accent-gold-500"
              />
              <label htmlFor="remember" className="text-sm text-temple-medium cursor-pointer select-none">
                Ghi nhớ đăng nhập
              </label>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className={cn(
                'w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all',
                loading
                  ? 'bg-gold-300 text-white cursor-not-allowed'
                  : 'bg-gold-500 hover:bg-gold-600 text-white shadow-gold hover:shadow-lg'
              )}
            >
              {loading ? (
                <><Loader2 size={17} className="animate-spin" /> Đang đăng nhập...</>
              ) : (
                <>Đăng nhập <ArrowRight size={17} /></>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-xs text-temple-medium mt-6">
            Bằng cách đăng nhập, bạn đồng ý với{' '}
            <span className="text-gold-500 cursor-pointer hover:underline">Điều khoản sử dụng</span>
            {' '}và{' '}
            <span className="text-gold-500 cursor-pointer hover:underline">Chính sách bảo mật</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

