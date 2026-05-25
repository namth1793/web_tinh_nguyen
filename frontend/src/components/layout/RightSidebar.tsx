'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, Flame, Star, Clock, BookOpen, Trophy } from 'lucide-react';
import { useApp } from '@/context/ThemeContext';
import { mockBadges, mockLeaderboard } from '@/data/mockData';
import { LEVEL_NAMES } from '@/constants';
import ProgressRing from '@/components/shared/ProgressRing';
import { cn } from '@/lib/utils';

export default function RightSidebar() {
  const { user, stats } = useApp();
  const badges = mockBadges.slice(0, 4);
  const leaderboard = mockLeaderboard.slice(0, 3);

  if (!user) return null;

  const levelInfo = LEVEL_NAMES[user.level_id] || { name: 'Trung cấp 2', maxXp: 1000 };
  const prevMaxXp = LEVEL_NAMES[user.level_id - 1]?.maxXp || 0;
  const xpProgress = Math.min(100, Math.round(((user.xp - prevMaxXp) / (levelInfo.maxXp - prevMaxXp)) * 100));
  const studyProgress = stats.total_questions > 0
    ? Math.round((stats.total_correct / stats.total_questions) * 100)
    : 0;

  return (
    <aside className="hidden xl:flex flex-col w-72 min-h-screen bg-transparent pt-0 pr-4 gap-4 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto pb-4">

      {/* ── User Card ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="card p-5"
      >
        {/* Card inner top ornament */}
        <div
          className="absolute top-0 left-6 right-6 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #D4A017, transparent)' }}
        />

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          {/* Avatar with spinning halo */}
          <div className="relative flex-shrink-0">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 rounded-full"
              style={{ border: '1.5px dashed rgba(212,160,23,0.4)', margin: -3 }}
            />
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
              style={{
                background: 'linear-gradient(135deg, #D4A017 0%, #EA6C00 100%)',
                boxShadow: '0 0 16px rgba(212,160,23,0.35)',
              }}
            >
              🧘
            </div>
            <div
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-white"
              style={{ background: '#1A9362' }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs mb-0.5" style={{ color: 'var(--text-light)' }}>Chào mừng,</p>
            <h3 className="font-bold truncate" style={{ color: 'var(--text-dark)', fontFamily: "'Philosopher', serif" }}>
              {user.name}
            </h3>
            <span
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold mt-0.5"
              style={{
                background: 'rgba(212,160,23,0.12)',
                border: '1px solid rgba(212,160,23,0.3)',
                color: '#B8860B',
              }}
            >
              ☸ Học viên
            </span>
          </div>
        </div>

        {/* Level & XP */}
        <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(212,160,23,0.06)', border: '1px solid rgba(212,160,23,0.15)' }}>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold" style={{ color: 'var(--text-dark)' }}>Cấp độ hiện tại</span>
            <span className="text-xs font-bold" style={{ color: '#B8860B' }}>{levelInfo.name}</span>
          </div>
          <div className="progress-bar">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1.2, delay: 0.3 }}
              className="progress-fill"
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px]" style={{ color: 'var(--text-light)' }}>{user.xp} XP</span>
            <span className="text-[10px]" style={{ color: 'var(--text-light)' }}>Mục tiêu: {levelInfo.maxXp} XP</span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Bài thi', value: stats.total_quizzes, icon: BookOpen, color: '#1A9362' },
            { label: 'Điểm TB', value: `${stats.avg_score}%`, icon: Star, color: '#B8860B' },
            { label: 'Top', value: `${stats.rankPercentage}%`, icon: Trophy, color: '#8B2635' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl p-2.5 text-center"
              style={{ background: 'rgba(212,160,23,0.06)', border: '1px solid rgba(212,160,23,0.12)' }}
            >
              <s.icon size={13} className="mx-auto mb-1" style={{ color: s.color }} />
              <p className="font-bold text-sm" style={{ color: 'var(--text-dark)' }}>{s.value}</p>
              <p className="text-[9px] mt-0.5 leading-tight" style={{ color: 'var(--text-light)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Study Progress ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-5"
      >
        <div className="section-header">
          <h2 className="text-base">Tiến độ học tập</h2>
          <Link href="/profile">
            <span className="text-xs font-medium flex items-center gap-1 transition-colors" style={{ color: '#B8860B' }}>
              Chi tiết <ChevronRight size={12} />
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <ProgressRing percentage={studyProgress} size={90} strokeWidth={8} />
          <div className="flex-1 space-y-2">
            {[
              { label: 'Bài đã làm', value: `${stats.total_quizzes}/32` },
              { label: 'Câu đúng', value: `${stats.total_correct}/${stats.total_questions}` },
              { label: 'Thời gian học', value: '18h 45m' },
              { label: 'Chuỗi ngày học', value: `${user.study_days} ngày 🔥` },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center">
                <span className="text-xs" style={{ color: 'var(--text-medium)' }}>{item.label}</span>
                <span className="text-xs font-semibold" style={{ color: 'var(--text-dark)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Badges ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-5"
      >
        <div className="section-header">
          <h2 className="text-base">Huy hiệu của tôi</h2>
          <Link href="/profile?tab=badges">
            <span className="text-xs font-medium flex items-center gap-1" style={{ color: '#B8860B' }}>
              Tất cả <ChevronRight size={12} />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 200 }}
              className="flex flex-col items-center gap-1 cursor-pointer group"
              title={badge.name}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl transition-all duration-200 group-hover:scale-110"
                style={{
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: badge.color + '50',
                  backgroundColor: badge.color + '12',
                  boxShadow: `0 0 8px ${badge.color}20`,
                }}
              >
                {badge.icon}
              </div>
              <p
                className="text-[8px] text-center leading-tight font-medium line-clamp-2"
                style={{ color: 'var(--text-medium)' }}
              >
                {badge.name}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Mini Leaderboard ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="card p-5"
      >
        <div className="section-header">
          <h2 className="text-base">Bảng xếp hạng</h2>
          <Link href="/ranking">
            <span className="text-xs font-medium flex items-center gap-1" style={{ color: '#B8860B' }}>
              Xem tất cả <ChevronRight size={12} />
            </span>
          </Link>
        </div>

        {/* Tab pills */}
        <div
          className="flex gap-1 mb-3 rounded-xl p-1"
          style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.12)' }}
        >
          {['Tuần này', 'Tháng này', 'Tổng'].map((tab, i) => (
            <button
              key={tab}
              className="flex-1 text-xs py-1 rounded-lg font-medium transition-all"
              style={i === 0
                ? { background: 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)', color: '#fff', boxShadow: '0 1px 4px rgba(184,134,11,0.3)' }
                : { color: 'var(--text-medium)' }
              }
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {leaderboard.map((entry, i) => {
            const medals = ['🥇', '🥈', '🥉'];
            const isMe = entry.isCurrentUser;
            return (
              <div
                key={entry.id}
                className={cn('flex items-center gap-3 p-2.5 rounded-xl transition-all')}
                style={isMe
                  ? { background: 'rgba(212,160,23,0.1)', border: '1px solid rgba(212,160,23,0.3)' }
                  : { border: '1px solid transparent' }
                }
                onMouseEnter={(e) => { if (!isMe) (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,23,0.05)'; }}
                onMouseLeave={(e) => { if (!isMe) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <span className="text-xl w-6 text-center flex-shrink-0">{medals[i]}</span>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, rgba(212,160,23,0.25) 0%, rgba(234,108,0,0.2) 100%)', color: '#B8860B' }}
                >
                  {entry.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: isMe ? '#B8860B' : 'var(--text-dark)' }}
                  >
                    {entry.name}
                    {isMe && <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-medium)' }}>(Bạn)</span>}
                  </p>
                </div>
                <span
                  className="text-xs font-bold whitespace-nowrap"
                  style={{ color: '#B8860B' }}
                >
                  {entry.xp} XP
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Daily Wisdom ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-5 text-center"
        style={{ background: 'linear-gradient(135deg, rgba(212,160,23,0.06) 0%, rgba(234,108,0,0.04) 100%)' }}
      >
        <div className="text-2xl mb-2" style={{ filter: 'drop-shadow(0 0 6px rgba(212,160,23,0.5))' }}>☸️</div>
        <p className="text-xs font-semibold mb-2" style={{ color: '#B8860B', fontFamily: "'Philosopher', serif" }}>
          Pháp ngôn hôm nay
        </p>
        <div className="lotus-divider"><span style={{ color: '#D4A017', fontSize: 10 }}>🪷</span></div>
        <p className="text-xs mt-2 leading-relaxed italic" style={{ color: 'var(--text-medium)' }}>
          "Hãy tự mình thắp đuốc lên mà đi. Hãy lấy Chánh pháp làm ngọn đuốc."
        </p>
        <p className="text-[10px] mt-2" style={{ color: 'var(--text-light)' }}>— Đức Phật Thích Ca Mâu Ni</p>
      </motion.div>
    </aside>
  );
}
