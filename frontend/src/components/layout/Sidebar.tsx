'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BookOpen, BarChart2, FileText, Trophy, Award, Crown,
  MessageCircle, Info, HelpCircle, X, Flame, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/context/ThemeContext';
import { useLang } from '@/context/LangContext';

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useApp();
  const { t } = useLang();
  const w = sidebarCollapsed ? 64 : 224;

  const navItems = [
    { icon: Home,          label: t.nav.home,         href: '/dashboard' },
    { icon: BookOpen,      label: t.nav.quizByTopic,  href: '/quiz' },
    { icon: BarChart2,     label: t.nav.quizByLevel,  href: '/quiz/level' },
    { icon: FileText,      label: t.nav.myExams,      href: '/profile' },
    { icon: Trophy,        label: t.nav.achievements, href: '/achievements' },
    { icon: Award,         label: t.nav.badges,       href: '/badges' },
    { icon: Crown,         label: t.nav.ranking,      href: '/ranking' },
    { icon: MessageCircle, label: t.nav.qa,            href: '/qa' },
    { icon: Info,          label: t.nav.about,        href: '/about' },
    { icon: HelpCircle,    label: t.nav.guide,        href: '/guide' },
  ];

  return (
    <motion.aside
      animate={{ width: w }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className="hidden lg:flex flex-col min-h-screen fixed left-0 top-0 z-40 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #2A1505 0%, #1C0E02 60%, #140900 100%)',
        borderRight: '1px solid rgba(212,160,23,0.2)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.35)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cg fill='none' stroke='%23D4A017' stroke-width='1'%3E%3Ccircle cx='150' cy='150' r='130'/%3E%3Ccircle cx='150' cy='150' r='90'/%3E%3Ccircle cx='150' cy='150' r='50'/%3E%3Ccircle cx='150' cy='150' r='20'/%3E%3Cline x1='150' y1='20' x2='150' y2='280'/%3E%3Cline x1='20' y1='150' x2='280' y2='150'/%3E%3Cline x1='58' y1='58' x2='242' y2='242'/%3E%3Cline x1='242' y1='58' x2='58' y2='242'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '300px 300px', backgroundPosition: 'center bottom', backgroundRepeat: 'no-repeat',
        }}
      />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #D4A017, transparent)' }} />

      {/* Logo */}
      <div
        className={cn('flex items-center flex-shrink-0 h-14', sidebarCollapsed ? 'justify-center' : 'px-4 gap-3')}
        style={{ borderBottom: '1px solid rgba(212,160,23,0.15)' }}
      >
        <Link href="/dashboard" className="flex items-center gap-3 min-w-0">
          <motion.span
            animate={{ rotate: sidebarCollapsed ? [0, 360] : 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl flex-shrink-0"
            style={{ filter: 'drop-shadow(0 0 10px rgba(212,160,23,0.8))' }}
          >
            🪷
          </motion.span>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8, width: 0 }}
                animate={{ opacity: 1, x: 0, width: 'auto' }}
                exit={{ opacity: 0, x: -8, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <p className="font-bold text-xs tracking-widest uppercase"
                  style={{ color: '#F5C842', fontFamily: 'Cinzel, serif', letterSpacing: '0.12em' }}>
                  {t.site.name}
                </p>
                <p className="text-[9px] mt-0.5" style={{ color: 'rgba(212,160,23,0.55)' }}>
                  {t.site.tagline}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'none' }}>
        <ul className={cn('space-y-0.5', sidebarCollapsed ? 'px-2' : 'px-3')}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href === '/quiz' && pathname.startsWith('/quiz/') && !pathname.startsWith('/quiz/level'));

            return (
              <li key={item.href}>
                <Link href={item.href}>
                  <div
                    className={cn(
                      'relative flex items-center rounded-xl transition-all duration-150 group',
                      sidebarCollapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-3 py-2.5',
                    )}
                    style={isActive ? {
                      background: 'linear-gradient(135deg, rgba(212,160,23,0.9) 0%, rgba(184,134,11,0.9) 100%)',
                      boxShadow: '0 2px 10px rgba(184,134,11,0.4)',
                    } : {}}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = ''; }}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    {isActive && !sidebarCollapsed && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-white/60" />
                    )}
                    <Icon size={17} className="flex-shrink-0" style={{ color: isActive ? '#fff' : 'rgba(212,160,23,0.65)' }} />
                    <AnimatePresence>
                      {!sidebarCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -6 }}
                          transition={{ duration: 0.15 }}
                          className="text-sm font-medium whitespace-nowrap overflow-hidden"
                          style={{ color: isActive ? '#fff' : 'rgba(253,246,227,0.65)' }}
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {sidebarCollapsed && (
                      <div
                        className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 rounded-lg whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium shadow-xl"
                        style={{ background: '#2A1505', color: '#F5C842', border: '1px solid rgba(212,160,23,0.3)' }}
                      >
                        {item.label}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent" style={{ borderRightColor: '#2A1505' }} />
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mx-4 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,160,23,0.3), transparent)' }} />

      {/* Bottom */}
      <div className={cn('flex-shrink-0 py-3', sidebarCollapsed ? 'px-2 flex flex-col items-center gap-3' : 'px-3 py-4')}>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="mb-3"
            >
              <div className="rounded-xl p-3" style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.12)' }}>
                <p className="text-[9px] leading-relaxed italic text-center"
                  style={{ color: 'rgba(212,160,23,0.7)', fontFamily: 'Philosopher, serif' }}>
                  {t.quote.text.split('\n').map((line, i) => (
                    <span key={i}>{line}{i === 0 && <br />}</span>
                  ))}
                </p>
                <p className="text-[8px] text-center mt-1" style={{ color: 'rgba(212,160,23,0.4)' }}>{t.quote.author}</p>
              </div>
              <div className="flex items-center gap-2 px-1 mt-2.5">
                <Flame size={12} className="text-orange-400 flex-shrink-0" />
                <span className="text-xs whitespace-nowrap" style={{ color: 'rgba(253,246,227,0.5)' }}>
                  {t.streak.label} <span className="font-bold text-yellow-400">7 {t.streak.days}</span>
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {sidebarCollapsed && (
          <div className="flex flex-col items-center gap-0.5 group relative cursor-default" title={`${t.streak.label} 7 ${t.streak.days}`}>
            <Flame size={17} className="text-orange-400" />
            <span className="text-[9px] font-bold text-yellow-400">7</span>
            <div className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 rounded-lg whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-medium shadow-xl"
              style={{ background: '#2A1505', color: '#F5C842', border: '1px solid rgba(212,160,23,0.3)' }}>
              {t.streak.label} 7 {t.streak.days}
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent" style={{ borderRightColor: '#2A1505' }} />
            </div>
          </div>
        )}

        <button
          onClick={toggleSidebar}
          className={cn('flex items-center justify-center rounded-xl transition-all duration-200', sidebarCollapsed ? 'w-10 h-10' : 'w-full h-9 gap-2')}
          style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.2)', color: 'rgba(212,160,23,0.6)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.18)'; e.currentTarget.style.color = '#D4A017'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.08)'; e.currentTarget.style.color = 'rgba(212,160,23,0.6)'; }}
          title={sidebarCollapsed ? t.nav.expand : t.nav.collapse}
        >
          {sidebarCollapsed
            ? <ChevronRight size={15} />
            : <><ChevronLeft size={14} /><span className="text-xs font-medium">{t.nav.collapse}</span></>
          }
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #D4A017, transparent)' }} />
    </motion.aside>
  );
}

export function MobileSidebar() {
  const { sidebarOpen, setSidebarOpen } = useApp();
  const { t } = useLang();
  const pathname = usePathname();

  const navItems = [
    { icon: Home,          label: t.nav.home,         href: '/dashboard' },
    { icon: BookOpen,      label: t.nav.quizByTopic,  href: '/quiz' },
    { icon: BarChart2,     label: t.nav.quizByLevel,  href: '/quiz/level' },
    { icon: FileText,      label: t.nav.myExams,      href: '/profile' },
    { icon: Trophy,        label: t.nav.achievements, href: '/achievements' },
    { icon: Award,         label: t.nav.badges,       href: '/badges' },
    { icon: Crown,         label: t.nav.ranking,      href: '/ranking' },
    { icon: MessageCircle, label: t.nav.qa,            href: '/qa' },
    { icon: Info,          label: t.nav.about,        href: '/about' },
    { icon: HelpCircle,    label: t.nav.guide,        href: '/guide' },
  ];

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.aside
            initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 z-50 w-64 h-full lg:hidden flex flex-col"
            style={{ background: 'linear-gradient(180deg, #2A1505 0%, #160C02 100%)', borderRight: '1px solid rgba(212,160,23,0.2)', boxShadow: '8px 0 32px rgba(0,0,0,0.5)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #D4A017, transparent)' }} />

            <div className="flex items-center justify-between px-4 h-14 flex-shrink-0"
              style={{ borderBottom: '1px solid rgba(212,160,23,0.15)' }}>
              <div className="flex items-center gap-2">
                <span className="text-2xl" style={{ filter: 'drop-shadow(0 0 8px rgba(212,160,23,0.8))' }}>🪷</span>
                <div>
                  <p className="font-bold text-xs tracking-widest" style={{ color: '#F5C842', fontFamily: 'Cinzel, serif' }}>{t.site.name}</p>
                  <p className="text-[9px]" style={{ color: 'rgba(212,160,23,0.5)' }}>{t.site.taglineMobile}</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg transition-colors" style={{ color: 'rgba(212,160,23,0.6)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}>
                <X size={17} />
              </button>
            </div>

            <nav className="flex-1 px-3 py-3 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              <ul className="space-y-0.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href === '/quiz' && pathname.startsWith('/quiz/') && !pathname.startsWith('/quiz/level'));
                  return (
                    <li key={item.href}>
                      <Link href={item.href} onClick={() => setSidebarOpen(false)}>
                        <div
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
                          style={isActive ? { background: 'linear-gradient(135deg, rgba(212,160,23,0.9), rgba(184,134,11,0.9))', boxShadow: '0 2px 10px rgba(184,134,11,0.4)' } : {}}
                          onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
                          onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = ''; }}
                        >
                          <Icon size={17} style={{ color: isActive ? '#fff' : 'rgba(212,160,23,0.6)', flexShrink: 0 }} />
                          <span className="text-sm font-medium" style={{ color: isActive ? '#fff' : 'rgba(253,246,227,0.65)' }}>
                            {item.label}
                          </span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="px-4 pb-5 pt-3 flex-shrink-0" style={{ borderTop: '1px solid rgba(212,160,23,0.12)' }}>
              <div className="rounded-xl p-3" style={{ background: 'rgba(212,160,23,0.07)', border: '1px solid rgba(212,160,23,0.12)' }}>
                <p className="text-[9px] italic text-center leading-relaxed"
                  style={{ color: 'rgba(212,160,23,0.6)', fontFamily: 'Philosopher, serif' }}>
                  {t.quote.text.split('\n').map((line, i) => (
                    <span key={i}>{line}{i === 0 && <br />}</span>
                  ))}
                </p>
              </div>
              <div className="flex items-center gap-2 mt-2.5 px-1">
                <Flame size={12} className="text-orange-400" />
                <span className="text-xs" style={{ color: 'rgba(253,246,227,0.5)' }}>
                  {t.streak.label} <span className="font-bold text-yellow-400">7 {t.streak.days}</span>
                </span>
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #D4A017, transparent)' }} />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
