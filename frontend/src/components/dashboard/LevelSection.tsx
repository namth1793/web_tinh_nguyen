'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { LEVELS } from '@/constants';

export default function LevelSection() {
  return (
    <section className="mb-6">
      {/* Section header */}
      <div className="section-header">
        <h2>Thi theo trình độ</h2>
        <Link href="/quiz/level">
          <span
            className="text-sm font-medium flex items-center gap-1 transition-colors"
            style={{ color: '#B8860B' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#D4A017'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#B8860B'; }}
          >
            Xem tất cả <ChevronRight size={14} />
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {LEVELS.map((level, i) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -5, transition: { duration: 0.18 } }}
            className="card p-4 flex flex-col items-center text-center cursor-pointer group"
            style={{ borderColor: level.color + '30' }}
          >
            {/* Level number badge */}
            <div
              className="text-[10px] font-bold px-2 py-0.5 rounded-full mb-3"
              style={{
                background: level.color + '15',
                color: level.color,
                border: `1px solid ${level.color}30`,
              }}
            >
              TRÌNH ĐỘ {level.id}
            </div>

            {/* Icon with animated glow */}
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-3 transition-transform group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${level.color}15 0%, ${level.color}08 100%)`,
                border: `1.5px solid ${level.color}25`,
                boxShadow: `0 4px 16px ${level.color}15`,
              }}
            >
              {level.icon}
            </motion.div>

            {/* Title */}
            <h3
              className="font-bold text-base mb-1"
              style={{ fontFamily: "'Philosopher', serif", color: level.color }}
            >
              {level.name}
            </h3>

            {/* Description */}
            <p className="text-xs leading-relaxed mb-2 line-clamp-2" style={{ color: 'var(--text-medium)' }}>
              {level.description}
            </p>

            {/* Question count */}
            <div
              className="text-xs font-semibold px-2.5 py-1 rounded-full mb-3"
              style={{
                background: level.color + '10',
                color: level.color + 'CC',
              }}
            >
              {level.questionCount}+ câu hỏi
            </div>

            {/* CTA Button */}
            <Link href={`/quiz?level=${encodeURIComponent(level.name)}`} className="w-full">
              <button
                className="w-full py-2 rounded-xl text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5"
                style={{
                  background: `linear-gradient(135deg, ${level.color} 0%, ${level.color}CC 100%)`,
                  boxShadow: `0 2px 8px ${level.color}30`,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 4px 16px ${level.color}50`; e.currentTarget.style.transform = 'scale(1.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 2px 8px ${level.color}30`; e.currentTarget.style.transform = 'scale(1)'; }}
              >
                Bắt đầu <ArrowRight size={13} />
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
