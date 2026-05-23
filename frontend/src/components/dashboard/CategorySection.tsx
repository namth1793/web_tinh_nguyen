'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { mockTopics } from '@/data/mockData';

export default function CategorySection() {
  return (
    <section className="mb-6">
      {/* Section header */}
      <div className="section-header">
        <h2>Thi theo chủ đề</h2>
        <Link href="/quiz">
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

      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {mockTopics.map((topic, i) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.06, type: 'spring', stiffness: 200 }}
            whileHover={{ y: -5, scale: 1.06, transition: { duration: 0.18 } }}
          >
            <Link href={`/quiz?topic=${topic.id}`}>
              <div className="card p-3 flex flex-col items-center text-center cursor-pointer hover:shadow-gold transition-all duration-200 group">
                {/* Mandala-style icon ring */}
                <div className="relative mb-2">
                  {/* Outer ring */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      border: `1px dashed ${topic.color}40`,
                      margin: -4,
                    }}
                  />
                  {/* Icon container */}
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
                    style={{
                      background: `radial-gradient(circle, ${topic.color}20 0%, ${topic.color}08 100%)`,
                      border: `1.5px solid ${topic.color}30`,
                      boxShadow: `0 2px 10px ${topic.color}15`,
                    }}
                  >
                    {topic.icon}
                  </div>
                </div>

                {/* Name */}
                <p
                  className="text-xs font-semibold leading-tight mb-1 group-hover:font-bold transition-all line-clamp-2"
                  style={{ color: topic.color }}
                >
                  {topic.name}
                </p>

                {/* Question count pill */}
                <span
                  className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
                  style={{
                    background: topic.color + '12',
                    color: topic.color + 'BB',
                  }}
                >
                  {topic.question_count} câu
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
