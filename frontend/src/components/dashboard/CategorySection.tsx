'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { mockTopics } from '@/data/mockData';

export default function CategorySection() {
  const router = useRouter();

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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {mockTopics.map((topic, i) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07, type: 'spring', stiffness: 200 }}
            whileHover={{ y: -4, transition: { duration: 0.18 } }}
          >
            {/* Outer card — dùng div + onClick thay vì Link để tránh nested <a> */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => router.push(`/quiz?parent=${topic.id}`)}
              onKeyDown={(e) => { if (e.key === 'Enter') router.push(`/quiz?parent=${topic.id}`); }}
              className="card p-3.5 flex flex-col cursor-pointer hover:shadow-gold transition-all duration-200 group h-full"
            >
              {/* Icon + tên chủ đề cha */}
              <div className="flex items-center gap-2.5 mb-3">
                <div className="relative flex-shrink-0">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{ border: `1px dashed ${topic.color}40`, margin: -3 }}
                  />
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xl transition-transform group-hover:scale-110"
                    style={{
                      background: `radial-gradient(circle, ${topic.color}20 0%, ${topic.color}08 100%)`,
                      border: `1.5px solid ${topic.color}35`,
                      boxShadow: `0 2px 8px ${topic.color}18`,
                    }}
                  >
                    {topic.icon}
                  </div>
                </div>
                <div className="min-w-0">
                  <p
                    className="text-xs font-bold leading-tight group-hover:opacity-90 transition-all line-clamp-1"
                    style={{ color: topic.color }}
                  >
                    {topic.name}
                  </p>
                  <p className="text-[10px] mt-0.5" style={{ color: `${topic.color}99` }}>
                    {topic.children?.length ?? 0} chủ đề con
                  </p>
                </div>
              </div>

              {/* Sub-topic chips — dùng <a> thuần (không lồng Link) */}
              <div className="flex flex-col gap-1 flex-1">
                {topic.children?.slice(0, 3).map((child) => (
                  <a
                    key={child.id}
                    href={`/quiz?topic=${child.id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-medium transition-all hover:opacity-80 w-full"
                    style={{
                      background: `${topic.color}12`,
                      color: `${topic.color}CC`,
                      border: `1px solid ${topic.color}20`,
                    }}
                  >
                    <span className="text-[8px] flex-shrink-0">{child.icon}</span>
                    <span className="truncate">{child.name.split('(')[0].trim()}</span>
                  </a>
                ))}

                {/* "+N nữa" badge */}
                {topic.children && topic.children.length > 3 && (
                  <span
                    className="text-[9px] px-2 py-0.5 rounded-full font-medium text-center"
                    style={{
                      background: `${topic.color}08`,
                      color: `${topic.color}80`,
                    }}
                  >
                    +{topic.children.length - 3} chủ đề nữa
                  </span>
                )}
              </div>

              {/* Question count pill */}
              <div className="mt-2.5 pt-2" style={{ borderTop: `1px solid ${topic.color}15` }}>
                <span className="text-[9px] font-medium" style={{ color: `${topic.color}99` }}>
                  {topic.question_count}+ câu hỏi
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
