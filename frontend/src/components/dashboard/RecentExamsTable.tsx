'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react';
import { LEVEL_COLORS } from '@/constants';
import { cn } from '@/lib/utils';
import { useLang } from '@/context/LangContext';
import { useMockData } from '@/hooks/useMockData';

export default function RecentExamsTable() {
  const { t } = useLang();
  const { recentResults, getLevelName } = useMockData();

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title text-lg">{t.recent.title}</h2>
        <Link href="/profile">
          <span className="text-sm text-gold-500 hover:text-gold-600 font-medium flex items-center gap-1">
            {t.recent.viewAll} <ChevronRight size={14} />
          </span>
        </Link>
      </div>

      {/* ── Mobile: Card layout ── */}
      <div className="sm:hidden space-y-2.5">
        {recentResults.map((result, i) => {
          const levelStyle = LEVEL_COLORS[result.level] || { bg: 'bg-gray-100', text: 'text-gray-600' };
          return (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="card p-3.5"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <Link href={`/quiz/${result.quiz_id}`} className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-temple-dark dark:text-cream-100 leading-snug line-clamp-2">
                    {result.quiz_title}
                  </p>
                </Link>
                {result.passed ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium flex-shrink-0">
                    <CheckCircle size={10} /> {t.recent.passed}
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-medium flex-shrink-0">
                    <XCircle size={10} /> {t.recent.failed}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn('badge-level text-[10px]', levelStyle.bg, levelStyle.text)}>
                  {getLevelName(result.level)}
                </span>
                <span
                  className={cn('text-sm font-bold', result.score >= 80 ? 'text-green-600' : result.score >= 60 ? 'text-yellow-600' : 'text-red-500')}
                >
                  {result.score}%
                </span>
                <span className="flex items-center gap-1 text-[10px] text-temple-medium ml-auto">
                  <Clock size={10} /> {result.time_spent} {t.recent.duration}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ── Desktop: Table layout ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden hidden sm:block"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-cream-200 dark:border-[#3A2A10]">
                <th className="text-left px-4 py-3 text-xs font-semibold text-temple-medium">{t.recent.examName}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-temple-medium hidden md:table-cell">{t.recent.topic}</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-temple-medium">{t.recent.level}</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-temple-medium">{t.recent.score}</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-temple-medium hidden lg:table-cell">{t.recent.time}</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-temple-medium">{t.recent.result}</th>
              </tr>
            </thead>
            <tbody>
              {recentResults.map((result, i) => {
                const levelStyle = LEVEL_COLORS[result.level] || { bg: 'bg-gray-100', text: 'text-gray-600', border: '' };
                return (
                  <motion.tr
                    key={result.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="border-b border-cream-100 dark:border-[#3A2A10] last:border-0 hover:bg-cream-50 dark:hover:bg-[#3A2A10]/50 transition-colors group"
                  >
                    <td className="px-4 py-3">
                      <Link href={`/quiz/${result.quiz_id}`}>
                        <span className="text-sm font-medium text-temple-dark dark:text-cream-100 group-hover:text-gold-600 transition-colors line-clamp-1 cursor-pointer">
                          {result.quiz_title}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-temple-medium">{result.topic_name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('badge-level text-xs', levelStyle.bg, levelStyle.text)}>
                        {getLevelName(result.level)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={cn('text-sm font-bold', result.score >= 80 ? 'text-green-600' : result.score >= 60 ? 'text-yellow-600' : 'text-red-500')}>
                        {result.score}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      <div className="flex items-center justify-center gap-1 text-temple-medium">
                        <Clock size={12} />
                        <span className="text-xs">{result.time_spent} {t.recent.duration}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {result.passed ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-medium">
                          <CheckCircle size={11} /> {t.recent.passed}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-medium">
                          <XCircle size={11} /> {t.recent.failed}
                        </span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </section>
  );
}
