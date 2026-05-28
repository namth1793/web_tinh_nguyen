'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit2, Award, FileText, Trophy, Flame, BookOpen, Star } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import ProgressRing from '@/components/shared/ProgressRing';
import RecentExamsTable from '@/components/dashboard/RecentExamsTable';
import { useApp } from '@/context/ThemeContext';
import { useLang } from '@/context/LangContext';
import { LEVEL_NAMES } from '@/constants';
import { useMockData } from '@/hooks/useMockData';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const { user, stats } = useApp();
  const { t } = useLang();
  const { badges: mockBadgesTranslated, getXpLevelName } = useMockData();
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = [
    { key: 'overview', label: t.profile.tabs.overview, icon: Trophy },
    { key: 'results', label: t.profile.tabs.history, icon: FileText },
  ];
  // Dùng badges từ user object (API) nếu có, fallback về mockBadges cho demo
  const badges = user?.badges?.length ? user.badges : mockBadgesTranslated;

  if (!user) return (
    <MainLayout>
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔐</div>
        <h2 className="text-xl font-bold text-temple-dark dark:text-cream-100 mb-2">{t.header.login}</h2>
        <p className="text-temple-medium">{t.login.noAccount}</p>
      </div>
    </MainLayout>
  );

  const levelInfo = LEVEL_NAMES[user.level_id] || { name: 'Trung cấp 2', maxXp: 1000 };
  const levelDisplayName = getXpLevelName(user.level_id);
  const prevMaxXp = LEVEL_NAMES[user.level_id - 1]?.maxXp || 0;
  const xpProgress = Math.min(100, Math.round(((user.xp - prevMaxXp) / (levelInfo.maxXp - prevMaxXp)) * 100));
  const studyProgress = stats.total_questions > 0
    ? Math.round((stats.total_correct / stats.total_questions) * 100)
    : 0;

  return (
    <MainLayout showRightSidebar={false}>
      <div className="max-w-4xl page-enter">
        {/* Profile header card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6"
        >
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gold-300 to-orange-400 flex items-center justify-center text-4xl shadow-gold">
                🧘
              </div>
              <button className="absolute -bottom-2 -right-2 w-7 h-7 bg-white dark:bg-[#251C0E] border border-cream-200 dark:border-[#3A2A10] rounded-full flex items-center justify-center shadow-sm hover:bg-gold-50 transition-colors">
                <Edit2 size={13} className="text-gold-500" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-black text-temple-dark dark:text-cream-100">{user.name}</h1>
                  <p className="text-sm text-temple-medium">{user.email}</p>
                </div>
                <span className="badge-level bg-gold-100 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 text-xs">
                  {levelDisplayName}
                </span>
              </div>

              {/* XP bar */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-temple-medium mb-1">
                  <span>{t.profile.level} {user.level_id}</span>
                  <span>{user.xp} / {levelInfo.maxXp} XP</span>
                </div>
                <div className="progress-bar">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${xpProgress}%` }}
                    transition={{ duration: 1 }}
                    className="progress-fill"
                  />
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-4 mt-3">
                {[
                  { icon: BookOpen, label: t.profile.totalQuizzes, value: stats.total_quizzes, color: 'text-blue-500' },
                  { icon: Star, label: t.profile.avgScore, value: `${stats.avg_score}%`, color: 'text-gold-500' },
                  { icon: Flame, label: t.profile.studyStreak, value: `${user.study_days} ${t.profile.days}`, color: 'text-orange-500' },
                  { icon: Trophy, label: t.ranking.rank, value: `#${stats.rank}`, color: 'text-purple-500' },
                ].map((s) => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <s.icon size={14} className={s.color} />
                    <span className="text-xs text-temple-medium">{s.label}:</span>
                    <span className="text-xs font-bold text-temple-dark dark:text-cream-100">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-1 bg-cream-100 dark:bg-[#3A2A10] rounded-2xl p-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
                activeTab === tab.key ? 'bg-white dark:bg-[#251C0E] text-gold-600 shadow-card' : 'text-temple-medium hover:text-temple-dark dark:hover:text-cream-100'
              )}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Study progress */}
            <div className="card p-5">
              <h3 className="section-title mb-4">{t.profile.studyProgress}</h3>
              <div className="flex items-center gap-4">
                <ProgressRing percentage={studyProgress} size={100} strokeWidth={10} label={t.common.finish} />
                <div className="flex-1 space-y-2">
                  {[
                    { label: t.sidebar.doneTasks, value: `${stats.total_quizzes}/32` },
                    { label: t.profile.totalCorrect, value: `${stats.total_correct}/${stats.total_questions}` },
                    { label: t.recent.passed, value: `${Math.round((stats.passed_count / stats.total_quizzes) * 100)}%` },
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between">
                      <span className="text-xs text-temple-medium">{item.label}</span>
                      <span className="text-xs font-bold text-temple-dark dark:text-cream-100">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Badges preview */}
            <div className="card p-5">
              <h3 className="section-title mb-4">{t.sidebar.myBadges} ({badges.length})</h3>
              <div className="grid grid-cols-3 gap-3">
                {badges.slice(0, 6).map((badge) => (
                  <div key={badge.id} className="flex flex-col items-center gap-1 group" title={badge.name}>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border-2 transition-transform group-hover:scale-110"
                      style={{ borderColor: badge.color + '40', backgroundColor: badge.color + '15' }}
                    >
                      {badge.icon}
                    </div>
                    <p className="text-[9px] text-temple-medium text-center leading-tight line-clamp-2">{badge.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'results' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <RecentExamsTable />
          </motion.div>
        )}

        {/* Quick links to dedicated pages */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 flex gap-3">
            <a href="/achievements" className="flex-1 card p-3 flex items-center gap-3 cursor-pointer hover:shadow-gold transition-all">
              <Trophy size={20} className="text-gold-500" />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>{t.achievements.title.replace(/🏅 /, '')}</p>
                <p className="text-xs" style={{ color: 'var(--text-medium)' }}>{t.recent.viewAll} →</p>
              </div>
            </a>
            <a href="/badges" className="flex-1 card p-3 flex items-center gap-3 cursor-pointer hover:shadow-gold transition-all">
              <Award size={20} className="text-saffron-500" />
              <div>
                <p className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>{t.nav.badges}</p>
                <p className="text-xs" style={{ color: 'var(--text-medium)' }}>{t.recent.viewAll} →</p>
              </div>
            </a>
          </motion.div>
        )}
      </div>
    </MainLayout>
  );
}
