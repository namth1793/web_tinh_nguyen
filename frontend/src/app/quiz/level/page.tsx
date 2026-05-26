'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Star } from 'lucide-react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { LEVELS } from '@/constants';
import { mockQuizzes } from '@/data/mockData';
import QuizCard from '@/components/quiz/QuizCard';
import { useLang } from '@/context/LangContext';

export default function QuizLevelPage() {
  const { t } = useLang();
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);

  const activeLevel = selectedLevel !== null ? LEVELS[selectedLevel] : null;
  const filteredQuizzes = activeLevel
    ? mockQuizzes.filter((q) => q.level === activeLevel.name)
    : [];

  return (
    <MainLayout showRightSidebar={false}>
      <div className="page-enter max-w-5xl">
        {/* Page header */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-3"
            style={{
              background: 'rgba(212,160,23,0.12)',
              border: '1px solid rgba(212,160,23,0.3)',
              color: '#B8860B',
            }}
          >
            ☸ {t.levels.title}
          </div>
          <h1
            className="font-bold mb-2"
            style={{ fontFamily: "'Philosopher', serif", fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: 'var(--text-dark)' }}
          >
            {t.levels.title}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-medium)' }}>
            {t.quiz.subtitle}
          </p>
        </div>

        {/* Level cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {LEVELS.map((level, i) => {
            const isSelected = selectedLevel === i;
            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6, transition: { duration: 0.18 } }}
                onClick={() => setSelectedLevel(isSelected ? null : i)}
                className="card p-5 flex flex-col items-center text-center cursor-pointer"
                style={{
                  borderColor: isSelected ? level.color + '80' : level.color + '25',
                  borderWidth: isSelected ? 2 : 1,
                  background: isSelected
                    ? `linear-gradient(135deg, ${level.color}10 0%, ${level.color}05 100%)`
                    : undefined,
                  boxShadow: isSelected ? `0 4px 24px ${level.color}25` : undefined,
                }}
              >
                {/* Level badge */}
                <div
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full mb-4"
                  style={{ background: level.color + '18', color: level.color, border: `1px solid ${level.color}30` }}
                >
                  {t.levels.levelBadge} {level.id}
                </div>

                {/* Icon */}
                <motion.div
                  animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-center text-4xl mb-4"
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: '16px',
                    background: `linear-gradient(135deg, ${level.color}18 0%, ${level.color}08 100%)`,
                    border: `2px solid ${level.color}30`,
                    boxShadow: isSelected ? `0 0 20px ${level.color}30` : `0 4px 12px ${level.color}12`,
                  }}
                >
                  {level.icon}
                </motion.div>

                <h3
                  className="font-bold text-lg mb-2"
                  style={{ fontFamily: "'Philosopher', serif", color: level.color }}
                >
                  {level.name}
                </h3>

                <p className="text-xs leading-relaxed mb-4" style={{ color: 'var(--text-medium)' }}>
                  {level.description}
                </p>

                {/* Stats row */}
                <div className="flex items-center justify-center gap-4 mb-4 w-full">
                  <div className="flex items-center gap-1">
                    <BookOpen size={12} style={{ color: level.color }} />
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-dark)' }}>{level.questionCount}+</span>
                    <span className="text-xs" style={{ color: 'var(--text-light)' }}>{t.levels.questionsCount}</span>
                  </div>
                  <div className="w-px h-3" style={{ background: 'var(--border)' }} />
                  <div className="flex items-center gap-1">
                    <Clock size={12} style={{ color: level.color }} />
                    <span className="text-xs font-semibold" style={{ color: 'var(--text-dark)' }}>45</span>
                    <span className="text-xs" style={{ color: 'var(--text-light)' }}>{t.common.minutes}</span>
                  </div>
                </div>

                {/* Select button */}
                <button
                  className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5"
                  style={{
                    background: isSelected
                      ? `linear-gradient(135deg, ${level.color} 0%, ${level.color}CC 100%)`
                      : `${level.color}15`,
                    color: isSelected ? '#fff' : level.color,
                    boxShadow: isSelected ? `0 2px 12px ${level.color}40` : undefined,
                  }}
                >
                  {isSelected ? (
                    <><Star size={13} fill="currentColor" /> {t.quizLevel.selected}</>
                  ) : (
                    <>{t.quizLevel.selectThis} <ArrowRight size={13} /></>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Quiz list for selected level */}
        {activeLevel && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="lotus-divider mb-6">
              <span style={{ color: '#D4A017', fontSize: 16 }}>🪷</span>
            </div>

            <div className="flex items-center justify-between mb-5">
              <div>
                <h2
                  className="font-bold text-lg mb-0.5"
                  style={{ fontFamily: "'Philosopher', serif", color: 'var(--text-dark)' }}
                >
                  {t.quizLevel.examsForLevel} {activeLevel.name}
                </h2>
                <p className="text-xs" style={{ color: 'var(--text-medium)' }}>
                  {filteredQuizzes.length} {t.quizLevel.available}
                </p>
              </div>
              <Link href="/quiz">
                <span className="text-sm font-medium" style={{ color: '#B8860B' }}>
                  {t.quizLevel.byTopic}
                </span>
              </Link>
            </div>

            {filteredQuizzes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredQuizzes.map((quiz, i) => (
                  <QuizCard key={quiz.id} quiz={quiz} index={i} />
                ))}
              </div>
            ) : (
              <div
                className="text-center py-12 rounded-2xl"
                style={{ border: `2px dashed ${activeLevel.color}30`, background: `${activeLevel.color}05` }}
              >
                <div className="text-4xl mb-3">{activeLevel.icon}</div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-dark)' }}>
                  {t.quizLevel.noExams} {activeLevel.name}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-medium)' }}>
                  {t.quizLevel.noExamsSub}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* CTA if no level selected */}
        {!activeLevel && (
          <div className="text-center py-10">
            <div className="text-4xl mb-3" style={{ filter: 'drop-shadow(0 0 8px rgba(212,160,23,0.4))' }}>☸️</div>
            <p className="font-semibold" style={{ fontFamily: "'Philosopher', serif", color: 'var(--text-dark)' }}>
              {t.quizLevel.prompt}
            </p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-medium)' }}>
              {t.quizLevel.promptSub}
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
