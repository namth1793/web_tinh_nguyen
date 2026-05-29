'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, RotateCcw, Home, Loader2 } from 'lucide-react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import QuestionCard from '@/components/quiz/QuestionCard';
import QuizTimer from '@/components/quiz/QuizTimer';
import ProgressRing from '@/components/shared/ProgressRing';
import { useLang } from '@/context/LangContext';
import { useApiQuizDetail } from '@/hooks/useApiQuizzes';
import { cn } from '@/lib/utils';

export default function QuizDetailPage() {
  const params = useParams();
  const { t } = useLang();
  const quizId = Number(params.id);
  const { quiz, questions, loading, getLevelName } = useApiQuizDetail(quizId);

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  const handleAnswer = (optionIdx: number) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: optionIdx }));
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setShowResult(false);
    } else {
      setFinished(true);
      setTimeSpent(Math.round((Date.now() - startTime) / 1000 / 60));
    }
  };

  const handleTimeUp = useCallback(() => {
    setFinished(true);
    setTimeSpent(quiz?.time_limit ?? 0);
  }, [quiz?.time_limit]);

  const correctCount = questions.filter((q, i) => answers[i] === q.correct_answer).length;
  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const passed = score >= 60;

  // Loading state
  if (loading) {
    return (
      <MainLayout showRightSidebar={false}>
        <div className="flex justify-center items-center py-32">
          <Loader2 size={36} className="animate-spin text-gold-500" />
        </div>
      </MainLayout>
    );
  }

  // Quiz not found
  if (!quiz) {
    return (
      <MainLayout showRightSidebar={false}>
        <div className="max-w-2xl mx-auto py-16 text-center">
          <div className="text-6xl mb-4">📭</div>
          <h2 className="text-xl font-bold text-temple-dark dark:text-cream-100 mb-2">Không tìm thấy bộ đề</h2>
          <Link href="/quiz"><button className="btn-gold mt-4">← Quay lại danh sách</button></Link>
        </div>
      </MainLayout>
    );
  }

  // Result screen
  if (finished) {
    return (
      <MainLayout showRightSidebar={false}>
        <div className="max-w-2xl mx-auto py-8 page-enter">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card p-8 text-center"
          >
            <div className="text-6xl mb-4">{passed ? '🎉' : '😔'}</div>
            <h2 className="text-2xl font-black text-temple-dark dark:text-cream-100 mb-1">
              {passed ? t.quizDetail.congratsPassed : t.quizDetail.notPassed}
            </h2>
            <p className="text-temple-medium mb-6">{quiz.title}</p>

            <div className="flex justify-center mb-6">
              <ProgressRing
                percentage={score}
                size={140}
                strokeWidth={12}
                color={passed ? '#16a34a' : '#ef4444'}
                label={passed ? t.recent.passed : t.recent.failed}
              />
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: t.quizDetail.correctCount, value: `${correctCount}/${questions.length}` },
                { label: t.quizDetail.score,         value: `${score}%` },
                { label: t.quizDetail.time,          value: `${timeSpent} ${t.common.minutes}` },
              ].map((s) => (
                <div key={s.label} className="bg-cream-50 dark:bg-[#3A2A10] rounded-xl p-3">
                  <p className="text-xl font-black text-gold-500">{s.value}</p>
                  <p className="text-xs text-temple-medium mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 dark:bg-gold-900/30 rounded-xl text-gold-700 dark:text-gold-400 font-semibold text-sm mb-6">
              ⚡ +{Math.floor(score * 0.5 + (passed ? 20 : 5))} {t.quizDetail.xpEarned}
            </div>

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => { setStarted(false); setCurrentIndex(0); setAnswers({}); setShowResult(false); setFinished(false); }}
                className="flex items-center gap-2 btn-outline-gold"
              >
                <RotateCcw size={16} /> {t.quizDetail.retry}
              </button>
              <Link href="/dashboard">
                <button className="flex items-center gap-2 btn-gold">
                  <Home size={16} /> {t.quizDetail.backHome}
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  // Start screen
  if (!started) {
    return (
      <MainLayout showRightSidebar={false}>
        <div className="max-w-2xl mx-auto py-8 page-enter">
          <div className="card p-8">
            <Link href="/quiz" className="inline-flex items-center gap-2 text-sm text-temple-medium hover:text-gold-500 mb-6 transition-colors">
              <ArrowLeft size={16} /> {t.quizDetail.backToList}
            </Link>

            <div className="text-center mb-6">
              <div className="text-5xl mb-4">{quiz.topic_icon || '📚'}</div>
              <h1 className="text-2xl font-black text-temple-dark dark:text-cream-100 mb-2">{quiz.title}</h1>
              <span className="badge-level bg-gold-100 text-gold-700 text-sm px-3 py-1">
                {getLevelName(quiz.level)}
              </span>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-8 rounded-xl mb-6" style={{ border: '2px dashed rgba(212,160,23,0.3)', background: 'rgba(212,160,23,0.04)' }}>
                <div className="text-4xl mb-3">📝</div>
                <p className="font-semibold text-temple-dark dark:text-cream-100 mb-1">Bộ đề chưa có câu hỏi</p>
                <p className="text-sm text-temple-medium">Admin chưa thêm câu hỏi cho bộ đề này</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { icon: '📝', label: t.quizDetail.questions, value: `${questions.length} ${t.quizDetail.questions}` },
                    { icon: '⏱️', label: t.quizDetail.time,      value: `${quiz.time_limit} ${t.common.minutes}` },
                    { icon: '✅', label: t.quizDetail.passMark,  value: '60%' },
                  ].map((s) => (
                    <div key={s.label} className="bg-cream-50 dark:bg-[#3A2A10] rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">{s.icon}</div>
                      <p className="font-bold text-temple-dark dark:text-cream-100">{s.value}</p>
                      <p className="text-xs text-temple-medium">{s.label}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    💡 <strong>{t.quizDetail.note}</strong> {t.quizDetail.noteText}
                  </p>
                </div>

                <button onClick={() => setStarted(true)} className="w-full btn-gold py-3 text-base">
                  {t.quizDetail.startNow}
                </button>
              </>
            )}
          </div>
        </div>
      </MainLayout>
    );
  }

  const current = questions[currentIndex];

  return (
    <MainLayout showRightSidebar={false}>
      <div className="max-w-2xl mx-auto py-4 page-enter">
        {/* Quiz header */}
        <div className="flex items-center justify-between mb-4">
          <Link href="/quiz">
            <button className="flex items-center gap-1.5 text-sm text-temple-medium hover:text-gold-500 transition-colors">
              <ArrowLeft size={16} /> {t.quizDetail.exit}
            </button>
          </Link>
          <h2 className="text-sm font-semibold text-temple-dark dark:text-cream-100 text-center flex-1 px-4 truncate">
            {quiz.title}
          </h2>
          <QuizTimer totalSeconds={quiz.time_limit * 60} onTimeUp={handleTimeUp} />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentIndex}
            question={current}
            questionIndex={currentIndex}
            totalQuestions={questions.length}
            selectedAnswer={answers[currentIndex] ?? null}
            showResult={showResult}
            onAnswer={handleAnswer}
          />
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => { if (currentIndex > 0) { setCurrentIndex((i) => i - 1); setShowResult(!!answers[currentIndex - 1]); } }}
            disabled={currentIndex === 0}
            className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all', currentIndex === 0 ? 'opacity-30 cursor-not-allowed text-temple-medium' : 'text-temple-medium hover:bg-cream-100 dark:hover:bg-[#3A2A10]')}
          >
            <ArrowLeft size={16} /> {t.quizDetail.prev}
          </button>

          {showResult ? (
            <button onClick={handleNext} className="flex items-center gap-2 btn-gold">
              {currentIndex < questions.length - 1
                ? <>{t.quizDetail.next} <ArrowRight size={16} /></>
                : <><CheckCircle size={16} /> {t.quizDetail.submit}</>
              }
            </button>
          ) : (
            <span className="text-sm text-temple-medium">{t.quizDetail.selectAnswer}</span>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
