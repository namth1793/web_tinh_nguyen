'use client';

import { useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, RotateCcw, Home, Loader2, PenLine, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import QuestionCard from '@/components/quiz/QuestionCard';
import QuizTimer from '@/components/quiz/QuizTimer';
import ProgressRing from '@/components/shared/ProgressRing';
import { useLang } from '@/context/LangContext';
import { useApiQuizDetail } from '@/hooks/useApiQuizzes';
import { cn } from '@/lib/utils';

// ── Essay question card ─────────────────────────────────────────────────────
function EssayQuestionCard({
  question, questionIndex, totalQuestions, answer, onChange, showModel,
}: {
  question: any;
  questionIndex: number;
  totalQuestions: number;
  answer: string;
  onChange: (v: string) => void;
  showModel: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      key={questionIndex}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-temple-medium">
          Câu {questionIndex + 1}/{totalQuestions}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div key={i} className={cn('h-1.5 rounded-full transition-all', i <= questionIndex ? 'bg-violet-400 w-5' : 'bg-cream-200 dark:bg-[#3A2A10] w-3')} />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="card p-5 mb-4 border-l-4" style={{ borderLeftColor: '#7c3aed' }}>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(139,92,246,0.1)', color: '#7c3aed' }}>
            ✍️ Tự luận
          </span>
        </div>
        <h3 className="text-base font-semibold text-temple-dark dark:text-cream-100 leading-relaxed">
          {question.question}
        </h3>
      </div>

      {!showModel ? (
        /* Answer textarea */
        <div>
          <label className="block text-xs font-semibold text-temple-medium mb-1.5">
            Câu trả lời của bạn:
          </label>
          <textarea
            value={answer}
            onChange={(e) => onChange(e.target.value)}
            rows={6}
            placeholder="Nhập câu trả lời của bạn tại đây..."
            className="w-full px-4 py-3 rounded-xl text-sm focus:outline-none resize-none text-temple-dark dark:text-cream-100"
            style={{
              border: '2px solid rgba(139,92,246,0.3)',
              background: 'rgba(139,92,246,0.04)',
              lineHeight: 1.7,
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'; }}
          />
          <p className="text-xs text-temple-medium mt-1.5">
            {answer.length} ký tự · Bạn có thể để trống và tiếp tục
          </p>
        </div>
      ) : (
        /* Model answer (after submit) */
        <div className="space-y-3">
          {/* Student's answer */}
          <div className="rounded-xl p-4" style={{ border: '1.5px solid rgba(139,92,246,0.2)', background: 'rgba(139,92,246,0.04)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: '#7c3aed' }}>✏️ Câu trả lời của bạn:</p>
            <p className="text-sm text-temple-dark dark:text-cream-100 leading-relaxed whitespace-pre-wrap">
              {answer || <span className="text-temple-medium italic">Bạn chưa trả lời câu này</span>}
            </p>
          </div>
          {/* Model answer */}
          {question.explanation && (
            <div className="rounded-xl p-4" style={{ border: '1.5px solid rgba(16,185,129,0.25)', background: 'rgba(16,185,129,0.06)' }}>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center justify-between w-full text-left"
              >
                <p className="text-xs font-semibold" style={{ color: '#059669' }}>💡 Đáp án mẫu / Gợi ý:</p>
                {expanded ? <ChevronUp size={14} style={{ color: '#059669' }} /> : <ChevronDown size={14} style={{ color: '#059669' }} />}
              </button>
              <AnimatePresence>
                {expanded && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-sm mt-2 leading-relaxed overflow-hidden"
                    style={{ color: '#065f46' }}
                  >
                    {question.explanation}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ── Main page ───────────────────────────────────────────────────────────────
export default function QuizDetailPage() {
  const params = useParams();
  const { t } = useLang();
  const quizId = Number(params.id);
  const { quiz, questions, loading, getLevelName } = useApiQuizDetail(quizId);

  const isEssay = quiz?.quiz_type === 'tu_luan';

  // Trắc nghiệm state
  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  // Tự luận state
  const [essayAnswers, setEssayAnswers] = useState<Record<number, string>>({});
  const [essayFinished, setEssayFinished] = useState(false);
  const [essayReviewIndex, setEssayReviewIndex] = useState(0);

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
    if (isEssay) {
      setEssayFinished(true);
    } else {
      setFinished(true);
      setTimeSpent(quiz?.time_limit ?? 0);
    }
  }, [quiz?.time_limit, isEssay]);

  const correctCount = questions.filter((q, i) => answers[i] === q.correct_answer).length;
  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  const passed = score >= 60;

  const resetQuiz = () => {
    setStarted(false); setCurrentIndex(0); setAnswers({}); setShowResult(false);
    setFinished(false); setEssayAnswers({}); setEssayFinished(false); setEssayReviewIndex(0);
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <MainLayout showRightSidebar={false}>
        <div className="flex justify-center items-center py-32">
          <Loader2 size={36} className="animate-spin text-gold-500" />
        </div>
      </MainLayout>
    );
  }

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

  // ── ESSAY: result review screen ──────────────────────────────────────────
  if (isEssay && essayFinished) {
    const answeredCount = Object.values(essayAnswers).filter(v => v.trim()).length;
    return (
      <MainLayout showRightSidebar={false}>
        <div className="max-w-2xl mx-auto py-8 page-enter">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card p-6 text-center mb-6">
            <div className="text-6xl mb-3">🌸</div>
            <h2 className="text-xl font-black text-temple-dark dark:text-cream-100 mb-1">Hoàn thành bài tự luận!</h2>
            <p className="text-temple-medium text-sm mb-4">{quiz.title}</p>
            <div className="flex justify-center gap-6 mb-5">
              <div className="text-center">
                <p className="text-2xl font-black" style={{ color: '#7c3aed' }}>{answeredCount}</p>
                <p className="text-xs text-temple-medium">Đã trả lời</p>
              </div>
              <div className="w-px bg-cream-200 dark:bg-[#3A2A10]" />
              <div className="text-center">
                <p className="text-2xl font-black text-temple-dark dark:text-cream-100">{questions.length - answeredCount}</p>
                <p className="text-xs text-temple-medium">Để trống</p>
              </div>
              <div className="w-px bg-cream-200 dark:bg-[#3A2A10]" />
              <div className="text-center">
                <p className="text-2xl font-black" style={{ color: '#D4A017' }}>+{Math.floor(questions.length * 8)} XP</p>
                <p className="text-xs text-temple-medium">Nhận được</p>
              </div>
            </div>
            <p className="text-xs text-temple-medium mb-5">So sánh câu trả lời của bạn với đáp án mẫu bên dưới để tự đánh giá</p>
            <div className="flex gap-3 justify-center">
              <button onClick={resetQuiz} className="flex items-center gap-2 btn-outline-gold">
                <RotateCcw size={15} /> Làm lại
              </button>
              <Link href="/dashboard">
                <button className="flex items-center gap-2 btn-gold">
                  <Home size={15} /> Trang chủ
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Review all answers */}
          <div className="space-y-4">
            {questions.map((q, i) => (
              <div key={i} className="card p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>{i + 1}</span>
                  <p className="text-sm font-semibold text-temple-dark dark:text-cream-100 leading-snug flex-1">{q.question}</p>
                </div>

                <div className="rounded-xl p-3 mb-2" style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}>
                  <p className="text-[10px] font-semibold mb-1" style={{ color: '#7c3aed' }}>Câu trả lời của bạn:</p>
                  <p className="text-sm text-temple-dark dark:text-cream-100 leading-relaxed whitespace-pre-wrap">
                    {essayAnswers[i]?.trim() || <span className="text-temple-medium italic text-xs">Chưa trả lời</span>}
                  </p>
                </div>

                {q.explanation && (
                  <div className="rounded-xl p-3" style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <p className="text-[10px] font-semibold mb-1" style={{ color: '#059669' }}>💡 Đáp án mẫu:</p>
                    <p className="text-sm leading-relaxed" style={{ color: '#065f46' }}>{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    );
  }

  // ── TRẮC NGHIỆM: result screen ───────────────────────────────────────────
  if (!isEssay && finished) {
    return (
      <MainLayout showRightSidebar={false}>
        <div className="max-w-2xl mx-auto py-8 page-enter">
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="card p-8 text-center">
            <div className="text-6xl mb-4">{passed ? '🎉' : '😔'}</div>
            <h2 className="text-2xl font-black text-temple-dark dark:text-cream-100 mb-1">
              {passed ? t.quizDetail.congratsPassed : t.quizDetail.notPassed}
            </h2>
            <p className="text-temple-medium mb-6">{quiz.title}</p>
            <div className="flex justify-center mb-6">
              <ProgressRing percentage={score} size={140} strokeWidth={12}
                color={passed ? '#16a34a' : '#ef4444'}
                label={passed ? t.recent.passed : t.recent.failed} />
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold-100 dark:bg-gold-900/30 rounded-xl text-gold-700 font-semibold text-sm mb-6">
              ⚡ +{Math.floor(score * 0.5 + (passed ? 20 : 5))} {t.quizDetail.xpEarned}
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={resetQuiz} className="flex items-center gap-2 btn-outline-gold">
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

  // ── Start screen (shared) ─────────────────────────────────────────────────
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
              <h1 className="text-2xl font-black text-temple-dark dark:text-cream-100 mb-3">{quiz.title}</h1>
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <span className="badge-level bg-gold-100 text-gold-700 text-sm px-3 py-1">
                  {getLevelName(quiz.level)}
                </span>
                <span className="text-sm px-3 py-1 rounded-full font-semibold"
                  style={isEssay
                    ? { background: 'rgba(139,92,246,0.12)', color: '#7c3aed' }
                    : { background: 'rgba(16,185,129,0.12)', color: '#059669' }}>
                  {isEssay ? '✍️ Tự luận' : '📝 Trắc nghiệm'}
                </span>
              </div>
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
                    { icon: isEssay ? '✍️' : '📝', label: isEssay ? 'Câu hỏi' : t.quizDetail.questions, value: `${questions.length} câu` },
                    { icon: '⏱️', label: t.quizDetail.time, value: `${quiz.time_limit} ${t.common.minutes}` },
                    { icon: isEssay ? '🌸' : '✅', label: isEssay ? 'Điểm số' : t.quizDetail.passMark, value: isEssay ? 'Tự đánh giá' : '60%' },
                  ].map((s) => (
                    <div key={s.label} className="bg-cream-50 dark:bg-[#3A2A10] rounded-xl p-3 text-center">
                      <div className="text-2xl mb-1">{s.icon}</div>
                      <p className="font-bold text-temple-dark dark:text-cream-100 text-sm">{s.value}</p>
                      <p className="text-xs text-temple-medium">{s.label}</p>
                    </div>
                  ))}
                </div>

                {isEssay && (
                  <div className="rounded-xl p-4 mb-6"
                    style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)' }}>
                    <p className="text-sm" style={{ color: '#7c3aed' }}>
                      ✍️ <strong>Bài tự luận:</strong> Bạn sẽ viết câu trả lời cho mỗi câu hỏi.
                      Sau khi hoàn thành, đáp án mẫu sẽ hiện ra để bạn tự đánh giá.
                    </p>
                  </div>
                )}

                {!isEssay && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      💡 <strong>{t.quizDetail.note}</strong> {t.quizDetail.noteText}
                    </p>
                  </div>
                )}

                <button onClick={() => setStarted(true)} className="w-full btn-gold py-3 text-base">
                  {isEssay ? <><PenLine size={16} /> Bắt đầu làm bài</> : t.quizDetail.startNow}
                </button>
              </>
            )}
          </div>
        </div>
      </MainLayout>
    );
  }

  const current = questions[currentIndex];

  // ── In-progress: ESSAY ────────────────────────────────────────────────────
  if (isEssay) {
    return (
      <MainLayout showRightSidebar={false}>
        <div className="max-w-2xl mx-auto py-4 page-enter">
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

          <AnimatePresence mode="wait">
            <EssayQuestionCard
              key={currentIndex}
              question={current}
              questionIndex={currentIndex}
              totalQuestions={questions.length}
              answer={essayAnswers[currentIndex] ?? ''}
              onChange={(v) => setEssayAnswers((p) => ({ ...p, [currentIndex]: v }))}
              showModel={false}
            />
          </AnimatePresence>

          <div className="flex items-center justify-between mt-5">
            <button
              onClick={() => { if (currentIndex > 0) setCurrentIndex((i) => i - 1); }}
              disabled={currentIndex === 0}
              className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                currentIndex === 0 ? 'opacity-30 cursor-not-allowed text-temple-medium' : 'text-temple-medium hover:bg-cream-100 dark:hover:bg-[#3A2A10]')}
            >
              <ArrowLeft size={16} /> {t.quizDetail.prev}
            </button>

            {currentIndex < questions.length - 1 ? (
              <button onClick={() => setCurrentIndex((i) => i + 1)} className="flex items-center gap-2 btn-gold"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                {t.quizDetail.next} <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={() => setEssayFinished(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white"
                style={{ background: 'linear-gradient(135deg,#7c3aed,#a855f7)' }}>
                <CheckCircle size={16} /> Nộp bài
              </button>
            )}
          </div>
        </div>
      </MainLayout>
    );
  }

  // ── In-progress: TRẮC NGHIỆM ─────────────────────────────────────────────
  return (
    <MainLayout showRightSidebar={false}>
      <div className="max-w-2xl mx-auto py-4 page-enter">
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

        <div className="flex items-center justify-between mt-5">
          <button
            onClick={() => { if (currentIndex > 0) { setCurrentIndex((i) => i - 1); setShowResult(!!answers[currentIndex - 1]); } }}
            disabled={currentIndex === 0}
            className={cn('flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
              currentIndex === 0 ? 'opacity-30 cursor-not-allowed text-temple-medium' : 'text-temple-medium hover:bg-cream-100 dark:hover:bg-[#3A2A10]')}
          >
            <ArrowLeft size={16} /> {t.quizDetail.prev}
          </button>

          {showResult ? (
            <button onClick={handleNext} className="flex items-center gap-2 btn-gold">
              {currentIndex < questions.length - 1
                ? <>{t.quizDetail.next} <ArrowRight size={16} /></>
                : <><CheckCircle size={16} /> {t.quizDetail.submit}</>}
            </button>
          ) : (
            <span className="text-sm text-temple-medium">{t.quizDetail.selectAnswer}</span>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
