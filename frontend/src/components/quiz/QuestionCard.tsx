'use client';

import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionCardProps {
  question: {
    id: number;
    question: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer?: number;
    explanation?: string;
  };
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  showResult: boolean;
  onAnswer: (optionIndex: number) => void;
}

const OPTIONS = ['A', 'B', 'C', 'D'];

export default function QuestionCard({
  question, questionIndex, totalQuestions, selectedAnswer, showResult, onAnswer
}: QuestionCardProps) {
  const opts = [question.option_a, question.option_b, question.option_c, question.option_d];

  const getOptionStyle = (idx: number) => {
    const base = 'w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200 ';
    if (!showResult) {
      return base + (selectedAnswer === idx + 1
        ? 'border-gold-400 bg-gold-50 dark:bg-gold-900/20 text-temple-dark dark:text-cream-100'
        : 'border-cream-200 dark:border-[#3A2A10] hover:border-gold-300 hover:bg-cream-50 dark:hover:bg-[#3A2A10] text-temple-dark dark:text-cream-100 cursor-pointer');
    }
    if (idx + 1 === question.correct_answer) return base + 'border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700';
    if (selectedAnswer === idx + 1 && idx + 1 !== question.correct_answer) return base + 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600';
    return base + 'border-cream-200 dark:border-[#3A2A10] text-temple-medium opacity-60';
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-temple-medium">Câu {questionIndex + 1}/{totalQuestions}</span>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div key={i} className={cn('h-1.5 rounded-full transition-all', i <= questionIndex ? 'bg-gold-400 w-5' : 'bg-cream-200 dark:bg-[#3A2A10] w-3')} />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="card p-6 mb-4">
        <h3 className="text-base font-semibold text-temple-dark dark:text-cream-100 leading-relaxed">
          {question.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {opts.map((opt, idx) => (
          <motion.button
            key={idx}
            whileHover={!showResult ? { scale: 1.01 } : {}}
            whileTap={!showResult ? { scale: 0.99 } : {}}
            onClick={() => !showResult && onAnswer(idx + 1)}
            disabled={showResult}
            className={getOptionStyle(idx)}
          >
            <span className={cn(
              'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
              showResult && idx + 1 === question.correct_answer ? 'bg-green-500 text-white' :
              showResult && selectedAnswer === idx + 1 && idx + 1 !== question.correct_answer ? 'bg-red-500 text-white' :
              selectedAnswer === idx + 1 ? 'bg-gold-500 text-white' : 'bg-cream-100 dark:bg-[#3A2A10] text-temple-medium'
            )}>
              {OPTIONS[idx]}
            </span>
            <span className="text-sm leading-relaxed">{opt}</span>
            {showResult && idx + 1 === question.correct_answer && <CheckCircle size={16} className="ml-auto text-green-500 flex-shrink-0" />}
            {showResult && selectedAnswer === idx + 1 && idx + 1 !== question.correct_answer && <XCircle size={16} className="ml-auto text-red-500 flex-shrink-0" />}
          </motion.button>
        ))}
      </div>

      {/* Explanation */}
      {showResult && question.explanation && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl"
        >
          <p className="text-sm text-blue-800 dark:text-blue-200 font-medium mb-1">💡 Giải thích</p>
          <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">{question.explanation}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
