'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useApp } from '@/context/ThemeContext';
import { authApi } from '@/lib/api';
import { cn } from '@/lib/utils';

const BENEFITS = [
  { icon: '📊', text: 'Theo dõi tiến độ học tập cá nhân' },
  { icon: '🏆', text: 'Thi đua bảng xếp hạng toàn quốc' },
  { icon: '🎖️', text: 'Nhận huy hiệu & thành tích đặc biệt' },
  { icon: '⚡', text: 'Tích lũy XP & nâng cấp trình độ' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordStrength = (() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 6) s++;
    if (password.length >= 10) s++;
    if (/[A-Z]/.test(password)) s++;
    if (/[0-9]/.test(password)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'][passwordStrength];
  const strengthColor = ['', 'bg-red-400', 'bg-yellow-400', 'bg-blue-400', 'bg-green-500'][passwordStrength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) return setError('Mật khẩu xác nhận không khớp.');
    if (!agreed) return setError('Vui lòng đồng ý với điều khoản sử dụng.');
    if (password.length < 6) return setError('Mật khẩu phải có ít nhất 6 ký tự.');

    setLoading(true);
    try {
      const res = await authApi.register(name, email, password);
      login(res.data.token, res.data.user);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
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
          style={{ background: 'linear-gradient(145deg, #92400e 0%, #b45309 40%, #d97706 100%)' }}
        >
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-black/10" />

          {/* Logo */}
          <div className="relative z-10">
            <Link href="/dashboard">
              <div className="flex items-center gap-3 cursor-pointer">
                <span className="text-4xl" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}>🪷</span>
                <div>
                  <h1 className="font-black text-white text-lg leading-tight">PHẬT PHÁP TEST</h1>
                  <p className="text-amber-100 text-xs">Học Phật · Hiểu Pháp · An Lạc</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Center */}
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="text-7xl text-center mb-6"
              style={{ filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.3))' }}
            >
              ☸️
            </motion.div>
            <h2 className="text-xl font-black text-white text-center mb-4">Tại sao nên tham gia?</h2>
            <div className="space-y-3">
              {BENEFITS.map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/20"
                >
                  <span className="text-xl">{b.icon}</span>
                  <p className="text-amber-50 text-xs leading-tight">{b.text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Bottom */}
          <div className="relative z-10 text-center">
            <p className="text-amber-200 text-xs">Miễn phí · Không quảng cáo · Thuần Phật pháp</p>
          </div>
        </motion.div>

        {/* Right panel - form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 bg-white dark:bg-[#251C0E] p-8 md:p-10 flex flex-col justify-center overflow-y-auto max-h-screen"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-5 md:hidden">
            <span className="text-3xl">🪷</span>
            <span className="font-black text-gold-500 text-lg">PHẬT PHÁP TEST</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-black text-temple-dark dark:text-cream-100 mb-1">Tạo tài khoản</h2>
            <p className="text-sm text-temple-medium">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-gold-500 hover:text-gold-600 font-semibold transition-colors">
                Đăng nhập
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600 dark:text-red-400"
            >
              ⚠️ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-temple-dark dark:text-cream-200 mb-1.5">Họ và tên</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-temple-medium" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nguyễn Văn A"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-cream-200 dark:border-[#3A2A10] bg-cream-50 dark:bg-[#1A1208] text-sm text-temple-dark dark:text-cream-100 placeholder-temple-medium/60 focus:outline-none focus:border-gold-400 dark:focus:border-gold-500 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-temple-dark dark:text-cream-200 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-temple-medium" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-cream-200 dark:border-[#3A2A10] bg-cream-50 dark:bg-[#1A1208] text-sm text-temple-dark dark:text-cream-100 placeholder-temple-medium/60 focus:outline-none focus:border-gold-400 dark:focus:border-gold-500 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-temple-dark dark:text-cream-200 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-temple-medium" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  className="w-full pl-10 pr-11 py-3 rounded-xl border-2 border-cream-200 dark:border-[#3A2A10] bg-cream-50 dark:bg-[#1A1208] text-sm text-temple-dark dark:text-cream-100 placeholder-temple-medium/60 focus:outline-none focus:border-gold-400 dark:focus:border-gold-500 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-temple-medium hover:text-temple-dark transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength bar */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={cn('flex-1 h-1 rounded-full transition-all duration-300', i <= passwordStrength ? strengthColor : 'bg-cream-200 dark:bg-[#3A2A10]')} />
                    ))}
                  </div>
                  <p className="text-xs text-temple-medium">Độ mạnh: <span className="font-medium">{strengthLabel}</span></p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="block text-sm font-semibold text-temple-dark dark:text-cream-200 mb-1.5">Xác nhận mật khẩu</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-temple-medium" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  required
                  className={cn(
                    'w-full pl-10 pr-11 py-3 rounded-xl border-2 bg-cream-50 dark:bg-[#1A1208] text-sm text-temple-dark dark:text-cream-100 placeholder-temple-medium/60 focus:outline-none transition-all',
                    confirmPassword && confirmPassword !== password
                      ? 'border-red-300 focus:border-red-400'
                      : confirmPassword && confirmPassword === password
                        ? 'border-green-400'
                        : 'border-cream-200 dark:border-[#3A2A10] focus:border-gold-400'
                  )}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-temple-medium hover:text-temple-dark transition-colors">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {confirmPassword && confirmPassword === password && (
                  <CheckCircle2 size={16} className="absolute right-9 top-1/2 -translate-y-1/2 text-green-500" />
                )}
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-cream-300 accent-gold-500"
              />
              <label htmlFor="terms" className="text-xs text-temple-medium cursor-pointer leading-relaxed">
                Tôi đã đọc và đồng ý với{' '}
                <span className="text-gold-500 hover:underline">Điều khoản sử dụng</span>
                {' '}và{' '}
                <span className="text-gold-500 hover:underline">Chính sách bảo mật</span>
                {' '}của Phật Pháp Test.
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
                <><Loader2 size={17} className="animate-spin" /> Đang tạo tài khoản...</>
              ) : (
                <>Tạo tài khoản <ArrowRight size={17} /></>
              )}
            </motion.button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-temple-medium hover:text-gold-500 transition-colors flex items-center justify-center gap-1">
              ← Quay lại đăng nhập
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
