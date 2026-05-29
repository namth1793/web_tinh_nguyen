'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Loader2 } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import QuizCard from '@/components/quiz/QuizCard';
import { getChildIds } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { useLang } from '@/context/LangContext';
import { useMockData } from '@/hooks/useMockData';
import { useApiQuizzes } from '@/hooks/useApiQuizzes';

export default function QuizPage() {
  const { t } = useLang();
  const { topics, levels } = useMockData();
  const { quizzes, loading, getLevelName } = useApiQuizzes();

  const [search, setSearch] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedParent, setSelectedParent] = useState<number | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);

  const subTopics = useMemo(
    () => topics.find((tp) => tp.id === selectedParent)?.children ?? [],
    [selectedParent, topics],
  );
  const parentColor = useMemo(
    () => topics.find((tp) => tp.id === selectedParent)?.color ?? '#D4A017',
    [selectedParent, topics],
  );

  const filtered = useMemo(() => {
    return quizzes.filter((q) => {
      if (search && !q.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedLevel && q.level !== selectedLevel) return false;
      if (selectedTopic) {
        if (q.topic_id !== selectedTopic) return false;
      } else if (selectedParent) {
        const ids = getChildIds(selectedParent);
        if (!ids.includes(q.topic_id)) return false;
      }
      return true;
    });
  }, [search, selectedLevel, selectedTopic, selectedParent, quizzes]);

  return (
    <MainLayout showRightSidebar={false}>
      <div className="page-enter max-w-5xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-temple-dark dark:text-cream-100 mb-1">{t.quiz.title}</h1>
          <p className="text-temple-medium text-sm">{t.quiz.subtitle}</p>
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
                placeholder={t.quiz.searchPlaceholder}
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
                {t.quiz.allLevels}
              </button>
              {levels.map((l) => (
                <button
                  key={l._viName}
                  onClick={() => setSelectedLevel(l._viName === selectedLevel ? '' : l._viName)}
                  className={cn('px-3 py-1.5 rounded-xl text-xs font-medium transition-all', selectedLevel === l._viName ? 'text-white' : 'bg-cream-100 dark:bg-[#3A2A10] text-temple-medium hover:text-temple-dark')}
                  style={selectedLevel === l._viName ? { backgroundColor: l.color } : {}}
                >
                  {l.icon} {l.name}
                </button>
              ))}
            </div>
          </div>

          {/* Parent topic filter */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {topics.map((tp) => (
              <button
                key={tp.id}
                onClick={() => {
                  if (selectedParent === tp.id) { setSelectedParent(null); setSelectedTopic(null); }
                  else { setSelectedParent(tp.id); setSelectedTopic(null); }
                }}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all',
                  selectedParent === tp.id ? 'text-white border-transparent' : 'border-cream-200 dark:border-[#3A2A10] text-temple-medium hover:border-gold-300',
                )}
                style={selectedParent === tp.id ? { backgroundColor: tp.color, borderColor: tp.color } : {}}
              >
                {tp.icon} {tp.name}
                {tp.children && <span className="ml-1 opacity-70">({tp.children.length})</span>}
              </button>
            ))}
          </div>

          {/* Sub-topic filter */}
          <AnimatePresence>
            {selectedParent && subTopics.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex gap-1.5 mt-2 flex-wrap pl-1">
                  <span className="text-[10px] text-temple-medium self-center mr-1">↳</span>
                  {subTopics.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setSelectedTopic(selectedTopic === st.id ? null : st.id)}
                      className={cn(
                        'flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all',
                        selectedTopic === st.id ? 'text-white border-transparent' : 'border-cream-200 dark:border-[#3A2A10] text-temple-medium',
                      )}
                      style={selectedTopic === st.id
                        ? { backgroundColor: parentColor, borderColor: parentColor }
                        : { borderColor: `${parentColor}40` }}
                    >
                      <span>{st.icon}</span>
                      {st.name.split('(')[0].trim()}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-temple-medium">
            {t.quiz.found} <span className="font-semibold text-temple-dark dark:text-cream-100">{filtered.length}</span> {t.quiz.exams}
          </p>
          {(search || selectedLevel || selectedParent || selectedTopic) && (
            <button
              onClick={() => { setSearch(''); setSelectedLevel(''); setSelectedParent(null); setSelectedTopic(null); }}
              className="text-xs text-gold-500 hover:text-gold-600 font-medium flex items-center gap-1"
            >
              <X size={12} /> {t.quiz.clearFilter}
            </button>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 size={32} className="animate-spin text-gold-500" />
          </div>
        )}

        {/* Grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((quiz, i) => (
              <QuizCard key={quiz.id} quiz={quiz} index={i} getLevelName={getLevelName} />
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-temple-dark dark:text-cream-100 mb-2">{t.quiz.noResults}</h3>
            <p className="text-sm text-temple-medium">{t.quiz.noResultsHint}</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
