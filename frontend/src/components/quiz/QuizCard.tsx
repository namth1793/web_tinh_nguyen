'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, BookOpen, ChevronRight } from 'lucide-react';
import { Quiz } from '@/types';
import { LEVEL_COLORS } from '@/constants';
import { cn } from '@/lib/utils';

interface QuizCardProps {
  quiz: Quiz;
  index?: number;
}

export default function QuizCard({ quiz, index = 0 }: QuizCardProps) {
  const levelStyle = LEVEL_COLORS[quiz.level] || { bg: 'bg-gray-100', text: 'text-gray-600', border: '' };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="card p-5 flex flex-col gap-3 cursor-pointer group hover:shadow-gold transition-all duration-200"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ backgroundColor: (quiz.topic_color || '#D4A017') + '20' }}
        >
          {quiz.topic_icon || '📚'}
        </div>
        <span className={cn('badge-level ml-auto', levelStyle.bg, levelStyle.text)}>
          {quiz.level}
        </span>
      </div>

      {/* Title */}
      <div>
        <h3 className="font-semibold text-sm text-temple-dark dark:text-cream-100 line-clamp-2 group-hover:text-gold-600 transition-colors leading-snug">
          {quiz.title}
        </h3>
        {quiz.topic_name && (
          <p className="text-xs text-temple-medium mt-1">{quiz.topic_name}</p>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-temple-medium">
        <div className="flex items-center gap-1">
          <BookOpen size={13} />
          <span className="text-xs">{quiz.question_count} câu hỏi</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={13} />
          <span className="text-xs">{quiz.time_limit} phút</span>
        </div>
      </div>

      {/* CTA */}
      <Link href={`/quiz/${quiz.id}`}>
        <button className="w-full py-2 rounded-xl bg-gold-50 dark:bg-gold-900/20 text-gold-600 hover:bg-gold-500 hover:text-white font-medium text-sm transition-all duration-200 flex items-center justify-center gap-1 group">
          Làm bài thi
          <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </Link>
    </motion.div>
  );
}
