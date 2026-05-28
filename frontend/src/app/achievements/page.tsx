'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Flame, Target, TrendingUp, Award } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useApp } from '@/context/ThemeContext';
import { useLang } from '@/context/LangContext';
import { mockStats } from '@/data/mockData';
import { LEVEL_NAMES } from '@/constants';
import { useMockData } from '@/hooks/useMockData';
import ProgressRing from '@/components/shared/ProgressRing';

const achievements = [
  {
    id: 1, icon: '🏆', name: 'Học viên xuất sắc', desc: 'Đạt điểm 90+ trong 5 bài thi liên tiếp',
    color: '#D4A017', earned: true, earnedDate: '12/03/2024',
  },
  {
    id: 2, icon: '🔥', name: 'Chuỗi 7 ngày', desc: 'Học liên tiếp 7 ngày không nghỉ',
    color: '#EA6C00', earned: true, earnedDate: '20/03/2024',
  },
  {
    id: 3, icon: '📚', name: 'Người đọc sách', desc: 'Hoàn thành 20 bài thi',
    color: '#1A9362', earned: true, earnedDate: '01/04/2024',
  },
  {
    id: 4, icon: '⭐', name: 'Sao sáng', desc: 'Đạt điểm tuyệt đối 100% trong một bài thi',
    color: '#B8860B', earned: true, earnedDate: '05/04/2024',
  },
  {
    id: 5, icon: '🧘', name: 'Thiền định sâu', desc: 'Hoàn thành 5 bài thi về Thiền học',
    color: '#8B2635', earned: false, earnedDate: null,
  },
  {
    id: 6, icon: '🌸', name: 'Hoa sen nở', desc: 'Đạt trình độ Trung cấp',
    color: '#D4A017', earned: false, earnedDate: null,
  },
  {
    id: 7, icon: '☸️', name: 'Bánh xe Pháp', desc: 'Thi qua tất cả 7 chủ đề',
    color: '#EA6C00', earned: false, earnedDate: null,
  },
  {
    id: 8, icon: '🦁', name: 'Sư tử Pháp', desc: 'Đứng top 10 bảng xếp hạng',
    color: '#8B2635', earned: false, earnedDate: null,
  },
];

const milestones = [
  { icon: <Target size={18} />, label: 'Bài thi hoàn thành', current: 12, target: 32, color: '#1A9362' },
  { icon: <Flame size={18} />, label: 'Ngày học liên tiếp', current: 7, target: 30, color: '#EA6C00' },
  { icon: <Star size={18} />, label: 'Điểm trung bình', current: 78, target: 90, color: '#B8860B' },
  { icon: <TrendingUp size={18} />, label: 'Câu hỏi đúng', current: 248, target: 500, color: '#8B2635' },
];

export default function AchievementsPage() {
  const { user } = useApp();
  const { t } = useLang();
  const { getXpLevelName } = useMockData();
  const stats = mockStats;
  const levelInfo = LEVEL_NAMES[user?.level_id ?? 3] || { name: 'Trung cấp 2', maxXp: 1000 };
  const levelDisplayName = getXpLevelName(user?.level_id ?? 3);
  const earned = achievements.filter((a) => a.earned);

  return (
    <MainLayout showRightSidebar={false}>
      <div className="page-enter max-w-4xl">

        {/* Page header */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ background: 'rgba(212,160,23,0.12)', border: '1px solid rgba(212,160,23,0.3)', color: '#B8860B' }}
          >
            ☸ Hành trình tu học
          </div>
          <h1
            className="font-bold mb-2"
            style={{ fontFamily: "'Philosopher', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: 'var(--text-dark)' }}
          >
            {t.achievements.title}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-medium)' }}>
            {t.achievements.subtitle}
          </p>
        </div>

        {/* Summary card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 mb-6"
          style={{ background: 'linear-gradient(135deg, rgba(212,160,23,0.06) 0%, rgba(234,108,0,0.03) 100%)' }}
        >
          <div className="flex items-center gap-6">
            <ProgressRing percentage={Math.round((earned.length / achievements.length) * 100)} size={100} strokeWidth={9} label="Đạt được" />
            <div className="flex-1">
              <h2 className="font-bold text-xl mb-1" style={{ fontFamily: "'Philosopher', serif", color: 'var(--text-dark)' }}>
                {earned.length} / {achievements.length} thành tích
              </h2>
              <p className="text-sm mb-3" style={{ color: 'var(--text-medium)' }}>
                Bạn đã đạt được <span className="font-semibold" style={{ color: '#B8860B' }}>{earned.length}</span> thành tích.
                Còn <span className="font-semibold" style={{ color: '#EA6C00' }}>{achievements.length - earned.length}</span> thành tích đang chờ bạn chinh phục.
              </p>
              <div className="flex flex-wrap gap-2">
                {earned.map((a) => (
                  <span key={a.id} className="text-xl" title={a.name}>{a.icon}</span>
                ))}
              </div>
            </div>
            <div className="hidden md:flex flex-col items-center text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-2"
                style={{ background: 'linear-gradient(135deg, rgba(212,160,23,0.2) 0%, rgba(234,108,0,0.15) 100%)', border: '1px solid rgba(212,160,23,0.3)' }}
              >
                🏅
              </div>
              <p className="text-xs font-semibold" style={{ color: '#B8860B' }}>{levelDisplayName}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-light)' }}>{user?.xp ?? 750} XP</p>
            </div>
          </div>
        </motion.div>

        {/* Milestones */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-5 mb-6"
        >
          <h2 className="font-bold text-base mb-4 flex items-center gap-2" style={{ fontFamily: "'Philosopher', serif", color: 'var(--text-dark)' }}>
            <span style={{ color: '#D4A017' }}>❧</span> Mục tiêu đang theo dõi
          </h2>
          <div className="space-y-4">
            {milestones.map((m, i) => {
              const pct = Math.min(100, Math.round((m.current / m.target) * 100));
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span style={{ color: m.color }}>{m.icon}</span>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-dark)' }}>{m.label}</span>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: m.color }}>
                      {m.current} / {m.target}
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(212,160,23,0.12)' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 1, delay: 0.2 + i * 0.1 }}
                      className="h-full rounded-full"
                      style={{ background: `linear-gradient(90deg, ${m.color} 0%, ${m.color}BB 100%)` }}
                    />
                  </div>
                  <p className="text-[10px] mt-1 text-right" style={{ color: 'var(--text-light)' }}>{pct}% hoàn thành</p>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* All achievements */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-5"
        >
          <h2 className="font-bold text-base mb-5 flex items-center gap-2" style={{ fontFamily: "'Philosopher', serif", color: 'var(--text-dark)' }}>
            <span style={{ color: '#D4A017' }}>❧</span> Tất cả thành tích
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {achievements.map((ach, i) => (
              <motion.div
                key={ach.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: ach.earned ? 1 : 0.5, scale: 1 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-center gap-3 p-3 rounded-xl transition-all"
                style={{
                  background: ach.earned ? `${ach.color}08` : 'rgba(0,0,0,0.03)',
                  border: `1.5px solid ${ach.earned ? ach.color + '30' : 'rgba(0,0,0,0.06)'}`,
                  filter: ach.earned ? 'none' : 'grayscale(0.4)',
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: ach.earned ? `${ach.color}18` : 'rgba(0,0,0,0.05)' }}
                >
                  {ach.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold truncate" style={{ color: ach.earned ? 'var(--text-dark)' : 'var(--text-medium)' }}>
                      {ach.name}
                    </p>
                    {ach.earned && (
                      <Trophy size={11} style={{ color: ach.color, flexShrink: 0 }} />
                    )}
                  </div>
                  <p className="text-xs leading-tight" style={{ color: 'var(--text-medium)' }}>{ach.desc}</p>
                  {ach.earned && ach.earnedDate && (
                    <p className="text-[10px] mt-0.5" style={{ color: ach.color }}>Đạt ngày {ach.earnedDate}</p>
                  )}
                  {!ach.earned && (
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-light)' }}>Chưa đạt được</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
