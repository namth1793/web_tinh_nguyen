'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sun, Moon, Menu, Bell, LogOut, User, Settings, X, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/ThemeContext';

const topNav = [
  { label: 'Trang chủ', href: '/dashboard' },
  { label: 'Thi theo chủ đề', href: '/quiz' },
  { label: 'Thi theo trình độ', href: '/quiz/level' },
  { label: 'Bài thi của tôi', href: '/profile' },
  { label: 'Bảng xếp hạng', href: '/ranking' },
  { label: 'Hướng dẫn', href: '/guide' },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { user, logout, setSidebarOpen, isLoggedIn } = useApp();
  const pathname = usePathname();
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header
      className="sticky top-0 z-30 h-14 backdrop-blur-md bg-[rgba(253,246,227,0.92)] dark:bg-[rgba(22,12,2,0.92)]"
      style={{
        borderBottom: '1px solid rgba(212,160,23,0.2)',
        boxShadow: '0 1px 0 rgba(212,160,23,0.08), 0 2px 12px rgba(42,21,5,0.06)',
      }}
    >
      {/* Bottom ornamental gold line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #D4A017 20%, #F5C842 50%, #D4A017 80%, transparent 100%)' }}
      />

      <div className="flex items-center h-full px-4 gap-2">
        {/* Mobile menu button */}
        <button
          className="lg:hidden p-2 rounded-xl transition-colors"
          style={{ color: 'var(--text-medium)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.12)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>

        {/* Logo (mobile only) */}
        <div className="lg:hidden flex items-center gap-2 mr-2">
          <span className="text-lg" style={{ filter: 'drop-shadow(0 0 4px rgba(212,160,23,0.5))' }}>🪷</span>
          <span
            className="font-black text-sm tracking-wider"
            style={{ fontFamily: "'Cinzel', serif", color: '#B8860B' }}
          >
            PHẬT PHÁP
          </span>
        </div>

        {/* Desktop nav links */}
        <nav className="hidden lg:flex items-center gap-0.5 flex-1">
          {topNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === '/quiz' && pathname.startsWith('/quiz/') && !pathname.startsWith('/quiz/level'));
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150 inline-block',
                    isActive
                      ? 'font-semibold'
                      : ''
                  )}
                  style={isActive
                    ? { color: '#B8860B', background: 'rgba(212,160,23,0.1)', borderBottom: '2px solid #D4A017' }
                    : { color: 'var(--text-medium)' }
                  }
                  onMouseEnter={(e) => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,23,0.08)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-dark)'; } }}
                  onMouseLeave={(e) => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-medium)'; } }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 ml-auto">
          {/* Search */}
          <AnimatePresence mode="wait">
            {showSearch ? (
              <motion.div
                key="search-open"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 200, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="relative"
              >
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm bài thi..."
                  className="w-full h-9 pl-3 pr-8 text-sm rounded-xl focus:outline-none transition-all"
                  style={{
                    border: '1.5px solid #D4A017',
                    background: 'rgba(253,246,227,0.9)',
                    color: 'var(--text-dark)',
                  }}
                />
                <button onClick={() => setShowSearch(false)} className="absolute right-2 top-1/2 -translate-y-1/2">
                  <X size={14} style={{ color: 'var(--text-medium)' }} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="search-icon"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setShowSearch(true)}
                className="p-2 rounded-xl transition-colors"
                style={{ color: 'var(--text-medium)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <Search size={18} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl transition-colors"
            style={{ color: theme === 'dark' ? '#D4A017' : 'var(--text-medium)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {/* Notification bell (logged-in only) */}
          {isLoggedIn && (
            <button
              className="p-2 rounded-xl transition-colors relative"
              style={{ color: 'var(--text-medium)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400 border border-white" />
            </button>
          )}

          {/* Auth section */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl transition-all"
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                {/* Avatar with gold halo */}
                <div className="relative">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{
                      background: 'linear-gradient(135deg, #D4A017 0%, #EA6C00 100%)',
                      boxShadow: '0 0 0 2px rgba(212,160,23,0.3), 0 2px 8px rgba(184,134,11,0.4)',
                    }}
                  >
                    {user?.name.charAt(0) ?? '?'}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-jade-500 border-2 border-white" />
                </div>
                <span
                  className="hidden sm:block text-sm font-semibold max-w-24 truncate"
                  style={{ color: 'var(--text-dark)' }}
                >
                  {user?.name}
                </span>
                <ChevronDown size={14} style={{ color: 'var(--text-medium)' }} className={cn('transition-transform', showUserMenu && 'rotate-180')} />
              </button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 rounded-2xl z-50 overflow-hidden bg-[#FFFDF7] dark:bg-[#1F1106]"
                    style={{
                      border: '1px solid rgba(212,160,23,0.25)',
                      boxShadow: '0 8px 32px rgba(42,21,5,0.15), 0 1px 0 rgba(212,160,23,0.1) inset',
                    }}
                  >
                    {/* User info header */}
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(212,160,23,0.15)' }}>
                      <p className="text-xs" style={{ color: 'var(--text-medium)' }}>Đã đăng nhập với</p>
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-dark)' }}>{user?.name}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-light)' }}>{user?.email}</p>
                    </div>
                    {/* Menu items */}
                    <div className="py-1">
                      <Link href="/profile" onClick={() => setShowUserMenu(false)}>
                        <div
                          className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer"
                          style={{ color: 'var(--text-dark)' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,23,0.08)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                          <User size={15} style={{ color: '#D4A017' }} /> Hồ sơ của tôi
                        </div>
                      </Link>
                      <Link href="/admin" onClick={() => setShowUserMenu(false)}>
                        <div
                          className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer"
                          style={{ color: 'var(--text-dark)' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,23,0.08)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                        >
                          <Settings size={15} style={{ color: '#D4A017' }} /> Quản trị
                        </div>
                      </Link>
                    </div>
                    {/* Divider */}
                    <div style={{ borderTop: '1px solid rgba(212,160,23,0.15)' }} />
                    <div className="py-1">
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                        style={{ color: '#DC2626' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.06)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <LogOut size={15} /> Đăng xuất
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <Link href="/login">
                <button className="btn-outline-gold py-1.5 px-4 text-sm">Đăng nhập</button>
              </Link>
              <Link href="/register">
                <button className="btn-saffron py-1.5 px-4 text-sm">Đăng ký</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
