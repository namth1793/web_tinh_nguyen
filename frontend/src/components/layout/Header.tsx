'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Menu, LogOut, User, Settings, ChevronDown, Globe } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/ThemeContext';
import { useLang } from '@/context/LangContext';
import type { Lang } from '@/i18n/translations';

const LANG_OPTIONS: { code: Lang; label: string; short: string }[] = [
  { code: 'vi',    label: 'Tiếng Việt', short: 'VI' },
  { code: 'zh-CN', label: '简体中文',    short: '简' },
  { code: 'zh-TW', label: '繁體中文',    short: '繁' },
];

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { user, logout, setSidebarOpen, isLoggedIn } = useApp();
  const { lang, setLang, t } = useLang();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setShowLangMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header
      className="sticky top-0 z-30 h-14 backdrop-blur-md bg-[rgba(253,246,227,0.92)] dark:bg-[rgba(22,12,2,0.92)]"
      style={{
        borderBottom: '1px solid rgba(212,160,23,0.2)',
        boxShadow: '0 1px 0 rgba(212,160,23,0.08), 0 2px 12px rgba(42,21,5,0.06)',
      }}
    >
      <div
        className="absolute bottom-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #D4A017 20%, #F5C842 50%, #D4A017 80%, transparent 100%)' }}
      />

      <div className="flex items-center h-full px-4 gap-2">
        {/* Mobile menu */}
        <button
          className="lg:hidden p-2 rounded-xl transition-colors"
          style={{ color: 'var(--text-medium)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.12)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={20} />
        </button>

        {/* Logo mobile */}
        <div className="lg:hidden flex items-center gap-2 mr-2">
          <span className="text-lg" style={{ filter: 'drop-shadow(0 0 4px rgba(212,160,23,0.5))' }}>🪷</span>
          <span className="font-black text-sm tracking-wider" style={{ fontFamily: "'Cinzel', serif", color: '#B8860B' }}>
            PHẬT PHÁP
          </span>
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-1">

          {/* ── Language switcher ── */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 px-2 py-1.5 rounded-xl transition-colors text-xs font-bold"
              style={{ color: 'var(--text-medium)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Globe size={15} />
              <span className="hidden sm:inline font-semibold" style={{ color: '#B8860B', fontSize: 11 }}>
                {LANG_OPTIONS.find(l => l.code === lang)?.short}
              </span>
            </button>

            <AnimatePresence>
              {showLangMenu && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-2 w-44 rounded-2xl z-50 overflow-hidden bg-[#FFFDF7] dark:bg-[#1F1106]"
                  style={{ border: '1px solid rgba(212,160,23,0.25)', boxShadow: '0 8px 32px rgba(42,21,5,0.15)' }}
                >
                  <div className="px-3 py-2" style={{ borderBottom: '1px solid rgba(212,160,23,0.12)' }}>
                    <p className="text-[10px] font-semibold flex items-center gap-1" style={{ color: 'var(--text-light)' }}>
                      🌐 Language
                    </p>
                  </div>
                  {LANG_OPTIONS.map((opt) => {
                    const active = lang === opt.code;
                    return (
                      <button
                        key={opt.code}
                        onClick={() => { setLang(opt.code); setShowLangMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors text-left"
                        style={{ color: active ? '#B8860B' : 'var(--text-dark)' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,23,0.08)'; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                      >
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0"
                          style={{
                            background: active ? 'linear-gradient(135deg,#D4A017,#B8860B)' : 'rgba(212,160,23,0.12)',
                            color: active ? '#fff' : '#B8860B',
                          }}
                        >
                          {opt.short}
                        </span>
                        <span className="font-medium">{opt.label}</span>
                        {active && <span className="ml-auto text-xs">✓</span>}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl transition-colors"
            style={{ color: mounted && theme === 'dark' ? '#D4A017' : 'var(--text-medium)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            {mounted ? (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />) : <Moon size={18} />}
          </button>

          {/* Auth */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl transition-all"
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div className="relative">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #D4A017 0%, #EA6C00 100%)', boxShadow: '0 0 0 2px rgba(212,160,23,0.3), 0 2px 8px rgba(184,134,11,0.4)' }}
                  >
                    {user?.name.charAt(0) ?? '?'}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-jade-500 border-2 border-white" />
                </div>
                <span className="hidden sm:block text-sm font-semibold max-w-24 truncate" style={{ color: 'var(--text-dark)' }}>
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
                    style={{ border: '1px solid rgba(212,160,23,0.25)', boxShadow: '0 8px 32px rgba(42,21,5,0.15), 0 1px 0 rgba(212,160,23,0.1) inset' }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(212,160,23,0.15)' }}>
                      <p className="text-xs" style={{ color: 'var(--text-medium)' }}>{t.header.loggedInAs}</p>
                      <p className="text-sm font-semibold truncate" style={{ color: 'var(--text-dark)' }}>{user?.name}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-light)' }}>{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link href="/profile" onClick={() => setShowUserMenu(false)}>
                        <div className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer" style={{ color: 'var(--text-dark)' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,23,0.08)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                          <User size={15} style={{ color: '#D4A017' }} /> {t.header.profile}
                        </div>
                      </Link>
                      <Link href="/admin" onClick={() => setShowUserMenu(false)}>
                        <div className="flex items-center gap-3 px-4 py-2.5 text-sm transition-colors cursor-pointer" style={{ color: 'var(--text-dark)' }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,23,0.08)'; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                          <Settings size={15} style={{ color: '#D4A017' }} /> {t.header.admin}
                        </div>
                      </Link>
                    </div>
                    <div style={{ borderTop: '1px solid rgba(212,160,23,0.15)' }} />
                    <div className="py-1">
                      <button
                        onClick={() => { logout(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                        style={{ color: '#DC2626' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.06)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <LogOut size={15} /> {t.header.logout}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <Link href="/login">
                <button className="btn-outline-gold py-1.5 px-4 text-sm">{t.header.login}</button>
              </Link>
              <Link href="/register">
                <button className="btn-saffron py-1.5 px-4 text-sm">{t.header.register}</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
