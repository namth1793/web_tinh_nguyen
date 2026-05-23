'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import QuizCard from '@/components/quiz/QuizCard';
import { mockQuizzes, mockTopics } from '@/data/mockData';
import { LEVELS } from '@/constants';
import { cn } from '@/lib/utils';

export default function QuizPage() {
  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  const filtered = useMemo(() => {
    return mockQuizzes.filter((q) => {
      if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedLevel && q.level !== selectedLevel) return false;
      if (selectedTopic && q.topic_id !== selectedTopic) return false;
      return true;
    });
  }, [search, selectedLevel, selectedTopic]);

  return (
    <MainLayout showRightSidebar={false}>
      <div className="page-enter max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-temple-dark dark:text-cream-100 mb-1">📚 Ngân hàng đề thi</h1>
          <p className="text-temple-medium text-sm">Chọn bài thi phù hợp với trình độ và chủ đề của bạn</p>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-48">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-temple-medium" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm kiếm bài thi..."
                className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-cream-200 dark:border-[#3A2A10] bg-cream-50 dark:bg-[#1A1208] focus:outline-none focus:border-gold-400 text-temple-dark dark:text-cream-100"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2">
                  <X size={14} className="text-temple-medium" />
                </button>
              )}
            </div>

            {/* Level filter */}
            <div className="flex gap-1.5 flex-wrap">
              <button
                onClick={() => setSelectedLevel('')}
                className={cn('px-3 py-1.5 rounded-xl text-xs font-medium transition-all', !selectedLevel ? 'bg-gold-500 text-white' : 'bg-cream-100 dark:bg-[#3A2A10] text-temple-medium hover:text-temple-dark')}
              >
                Tất cả
              </button>
              {LEVELS.map((l) => (
                <button
                  key={l.name}
                  onClick={() => setSelectedLevel(l.name === selectedLevel ? '' : l.name)}
                  className={cn('px-3 py-1.5 rounded-xl text-xs font-medium transition-all', selectedLevel === l.name ? 'text-white' : 'bg-cream-100 dark:bg-[#3A2A10] text-temple-medium hover:text-temple-dark')}
                  style={selectedLevel === l.name ? { backgroundColor: l.color } : {}}
                >
                  {l.icon} {l.name}
                </button>
              ))}
            </div>
          </div>

          {/* Topic filter */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {mockTopics.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(selectedTopic === t.id ? null : t.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border-2 transition-all',
                  selectedTopic === t.id ? 'text-white border-transparent' : 'border-cream-200 dark:border-[#3A2A10] text-temple-medium hover:border-gold-300'
                )}
                style={selectedTopic === t.id ? { backgroundColor: t.color, borderColor: t.color } : {}}
              >
                {t.icon} {t.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-temple-medium">
            Tìm thấy <span className="font-semibold text-temple-dark dark:text-cream-100">{filtered.length}</span> bài thi
          </p>
          {(search || selectedLevel || selectedTopic) && (
            <button
              onClick={() => { setSearch(''); setSelectedLevel(''); setSelectedTopic(null); }}
              className="text-xs text-gold-500 hover:text-gold-600 font-medium flex items-center gap-1"
            >
              <X size={12} /> Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((quiz, i) => (
              <QuizCard key={quiz.id} quiz={quiz} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-temple-dark dark:text-cream-100 mb-2">Không tìm thấy bài thi</h3>
            <p className="text-sm text-temple-medium">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
