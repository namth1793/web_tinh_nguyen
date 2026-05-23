'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Crown, Flame } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { mockLeaderboard } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { LEVEL_NAMES } from '@/constants';

const extendedLeaderboard = [
  ...mockLeaderboard,
  { id: 5, rank: 4, name: 'Diệu Hạnh', xp: 620, level_id: 2 },
  { id: 6, rank: 5, name: 'Tâm Bình', xp: 340, level_id: 1 },
  { id: 7, rank: 6, name: 'Hỷ Xả', xp: 580, level_id: 2 },
  { id: 8, rank: 7, name: 'Giác Ngộ', xp: 480, level_id: 2 },
  { id: 9, rank: 8, name: 'Bình An', xp: 320, level_id: 1 },
];

const tabs = ['Tuần này', 'Tháng này', 'Tổng'];

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState('Tuần này');
  const top3 = extendedLeaderboard.slice(0, 3);
  const rest = extendedLeaderboard.slice(3);

  return (
    <MainLayout showRightSidebar={false}>
      <div className="max-w-2xl mx-auto page-enter">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">🏆</div>
          <h1 className="text-2xl font-black text-temple-dark dark:text-cream-100">Bảng Xếp Hạng</h1>
          <p className="text-temple-medium text-sm mt-1">Cùng nhau tinh tấn học Phật pháp mỗi ngày</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-cream-100 dark:bg-[#3A2A10] rounded-2xl p-1 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all',
                activeTab === tab ? 'bg-white dark:bg-[#251C0E] text-gold-600 shadow-card' : 'text-temple-medium hover:text-temple-dark'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        <div className="flex items-end justify-center gap-4 mb-8">
          {/* 2nd place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-2xl font-black text-gray-600 shadow-lg border-4 border-gray-300 mb-2">
              {top3[1]?.name.charAt(0)}
            </div>
            <div className="text-2xl mb-1">🥈</div>
            <p className="text-sm font-bold text-temple-dark dark:text-cream-100">{top3[1]?.name}</p>
            <p className="text-xs text-temple-medium">{top3[1]?.xp} XP</p>
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-t-2xl mt-2 flex items-end justify-center pb-2">
              <span className="text-2xl font-black text-gray-500">2</span>
            </div>
          </motion.div>

          {/* 1st place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <Crown size={24} className="text-gold-500 mb-1" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-300 to-orange-400 flex items-center justify-center text-3xl font-black text-white shadow-gold border-4 border-gold-400 mb-2">
              {top3[0]?.name.charAt(0)}
            </div>
            <div className="text-3xl mb-1">🥇</div>
            <p className="text-base font-black text-temple-dark dark:text-cream-100">{top3[0]?.name}</p>
            <p className="text-sm text-gold-500 font-bold">{top3[0]?.xp} XP</p>
            <div className="w-24 h-28 bg-gradient-to-t from-gold-400 to-gold-300 rounded-t-2xl mt-2 flex items-end justify-center pb-2 shadow-gold">
              <span className="text-3xl font-black text-white">1</span>
            </div>
          </motion.div>

          {/* 3rd place */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-200 to-amber-300 flex items-center justify-center text-2xl font-black text-orange-700 shadow-lg border-4 border-orange-300 mb-2">
              {top3[2]?.name.charAt(0)}
            </div>
            <div className="text-2xl mb-1">🥉</div>
            <p className="text-sm font-bold text-temple-dark dark:text-cream-100">{top3[2]?.name}</p>
            <p className="text-xs text-temple-medium">{top3[2]?.xp} XP</p>
            <div className="w-20 h-14 bg-orange-200 dark:bg-orange-900/50 rounded-t-2xl mt-2 flex items-end justify-center pb-2">
              <span className="text-2xl font-black text-orange-500">3</span>
            </div>
          </motion.div>
        </div>

        {/* Rest of leaderboard */}
        <div className="card overflow-hidden">
          {rest.map((entry, i) => {
            const levelName = LEVEL_NAMES[entry.level_id]?.name || 'Học viên';
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.06 }}
                className={cn(
                  'flex items-center gap-4 p-4 border-b border-cream-100 dark:border-[#3A2A10] last:border-0 hover:bg-cream-50 dark:hover:bg-[#3A2A10] transition-colors',
                  entry.isCurrentUser && 'bg-gold-50 dark:bg-gold-900/10'
                )}
              >
                <span className="w-8 text-center font-bold text-temple-medium text-sm">#{i + 4}</span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cream-200 to-cream-300 dark:from-[#3A2A10] dark:to-[#4A3A20] flex items-center justify-center font-bold text-temple-dark text-sm flex-shrink-0">
                  {entry.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className={cn('font-semibold text-sm', entry.isCurrentUser ? 'text-gold-600' : 'text-temple-dark dark:text-cream-100')}>
                    {entry.name} {entry.isCurrentUser && <span className="text-xs font-normal">(Bạn)</span>}
                  </p>
                  <p className="text-xs text-temple-medium">{levelName}</p>
                </div>
                <span className="font-bold text-gold-500 text-sm">{entry.xp} XP</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
}
