'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, BarChart2, User, Crown } from 'lucide-react';
import { useLang } from '@/context/LangContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { t } = useLang();

  const items = [
    { icon: Home,      label: t.nav.home,        href: '/dashboard' },
    { icon: BookOpen,  label: t.nav.quizByTopic, href: '/quiz' },
    { icon: BarChart2, label: t.nav.quizByLevel,  href: '/quiz/level' },
    { icon: User,      label: t.nav.myExams,     href: '/profile' },
    { icon: Crown,     label: t.nav.ranking,     href: '/ranking' },
  ];

  // Don't show on auth/admin pages
  if (['/login', '/register', '/admin'].some((p) => pathname.startsWith(p))) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
      style={{
        background: 'rgba(22,12,2,0.96)',
        borderTop: '1px solid rgba(212,160,23,0.22)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center h-14">
        {items.map(({ icon: Icon, label, href }) => {
          const isActive =
            pathname === href ||
            (href === '/quiz' && pathname.startsWith('/quiz/') && !pathname.startsWith('/quiz/level'));

          return (
            <Link key={href} href={href} className="flex-1">
              <div className="flex flex-col items-center justify-center gap-0.5 py-1.5 group">
                <div
                  className="w-10 h-7 flex items-center justify-center rounded-full transition-all duration-200"
                  style={isActive ? { background: 'rgba(212,160,23,0.18)' } : {}}
                >
                  <Icon
                    size={19}
                    style={{ color: isActive ? '#D4A017' : 'rgba(212,160,23,0.38)' }}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                </div>
                <span
                  className="text-[9px] font-semibold leading-none"
                  style={{ color: isActive ? '#D4A017' : 'rgba(212,160,23,0.38)' }}
                >
                  {/* Short labels for mobile */}
                  {href === '/dashboard' ? '🏠' + ' ' + (label.split(' ')[0]) :
                   href === '/quiz'      ? label.slice(0, 7) + (label.length > 7 ? '…' : '') :
                   href === '/quiz/level'? label.slice(0, 7) + '…' :
                   href === '/profile'   ? label.slice(0, 7) + (label.length > 7 ? '…' : '') :
                   label.slice(0, 7) + (label.length > 7 ? '…' : '')}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
