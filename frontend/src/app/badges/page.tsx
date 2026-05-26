'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import { mockBadges } from '@/data/mockData';
import { useLang } from '@/context/LangContext';

export default function BadgesPage() {
  const { t } = useLang();
  const categories = [t.common.all, 'Học tập', 'Thời gian', 'Xã hội', 'Đặc biệt'];
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const badges = mockBadges;
  const earnedCount = badges.length;

  return (
    <MainLayout showRightSidebar={false}>
      <div className="page-enter max-w-4xl">

        {/* Page header */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{ background: 'rgba(212,160,23,0.12)', border: '1px solid rgba(212,160,23,0.3)', color: '#B8860B' }}
          >
            ☸ Kho tàng huy hiệu
          </div>
          <h1
            className="font-bold mb-2"
            style={{ fontFamily: "'Philosopher', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: 'var(--text-dark)' }}
          >
            {t.badges.title}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-medium)' }}>
            {t.badges.subtitle}
          </p>
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-5 mb-6"
          style={{ background: 'linear-gradient(135deg, rgba(212,160,23,0.07) 0%, rgba(234,108,0,0.04) 100%)' }}
        >
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-3xl font-black" style={{ color: '#B8860B', fontFamily: "'Philosopher', serif" }}>{earnedCount}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-medium)' }}>Huy hiệu đã đạt</p>
            </div>
            <div className="w-px h-10" style={{ background: 'rgba(212,160,23,0.25)' }} />
            <div className="text-center">
              <p className="text-3xl font-black" style={{ color: '#EA6C00', fontFamily: "'Philosopher', serif" }}>3</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-medium)' }}>Hiếm (Rare)</p>
            </div>
            <div className="w-px h-10" style={{ background: 'rgba(212,160,23,0.25)' }} />
            <div className="text-center">
              <p className="text-3xl font-black" style={{ color: '#1A9362', fontFamily: "'Philosopher', serif" }}>1</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-medium)' }}>Huyền thoại</p>
            </div>
            {/* Featured badge */}
            <div className="ml-auto hidden sm:flex flex-col items-center gap-1">
              <div
                className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                style={{ background: 'linear-gradient(135deg, rgba(212,160,23,0.2) 0%, rgba(234,108,0,0.15) 100%)', border: '2px solid rgba(212,160,23,0.4)', boxShadow: '0 0 16px rgba(212,160,23,0.2)' }}
              >
                {badges[0]?.icon ?? '🏆'}
              </div>
              <p className="text-[10px] font-medium" style={{ color: '#B8860B' }}>Huy hiệu nổi bật</p>
            </div>
          </div>
        </motion.div>

        {/* Category filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-xl text-sm font-medium transition-all duration-150"
              style={activeCategory === cat
                ? { background: 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)', color: '#fff', boxShadow: '0 2px 8px rgba(184,134,11,0.3)' }
                : { background: 'rgba(212,160,23,0.08)', color: 'var(--text-medium)', border: '1px solid rgba(212,160,23,0.15)' }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Badge grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.85, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: i * 0.06, type: 'spring', stiffness: 200 }}
              className="card p-4 flex flex-col items-center text-center cursor-pointer group"
              whileHover={{ y: -6 }}
            >
              {/* Badge icon with glow */}
              <div className="relative mb-3">
                {/* Outer glow ring */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  style={{ background: badge.color + '20', margin: -6 }}
                />
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110"
                  style={{
                    border: `2px solid ${badge.color}50`,
                    background: `linear-gradient(135deg, ${badge.color}20 0%, ${badge.color}08 100%)`,
                    boxShadow: `0 4px 16px ${badge.color}20`,
                  }}
                >
                  {badge.icon}
                </div>
                {/* Earned checkmark */}
                <div
                  className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: '#1A9362', color: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                >
                  ✓
                </div>
              </div>

              <p
                className="text-sm font-bold mb-1"
                style={{ color: badge.color, fontFamily: "'Philosopher', serif" }}
              >
                {badge.name}
              </p>
              <p className="text-[10px] leading-tight" style={{ color: 'var(--text-medium)' }}>
                {badge.description}
              </p>

              {/* Rarity indicator */}
              <div
                className="mt-2 px-2 py-0.5 rounded-full text-[9px] font-semibold"
                style={{ background: badge.color + '15', color: badge.color + 'CC' }}
              >
                {i < 1 ? '✦ Huyền thoại' : i < 3 ? '◆ Hiếm' : '• Thông thường'}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer quote */}
        <div className="lotus-divider mt-8 mb-4">
          <span style={{ color: '#D4A017', fontSize: 16 }}>🪷</span>
        </div>
        <p className="text-center text-xs italic" style={{ color: 'var(--text-medium)' }}>
          "Mỗi huy hiệu là một bước trên con đường giác ngộ." — Phật Pháp Test
        </p>
      </div>
    </MainLayout>
  );
}
