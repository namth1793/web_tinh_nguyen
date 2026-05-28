'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Heart, Users, BookOpen, Award, ArrowRight, Globe, Target, Sparkles } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useLang } from '@/context/LangContext';

const STAT_ICONS = [Users, BookOpen, Award, Globe];
const STAT_COLORS = [
  { color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { color: 'text-gold-500', bg: 'bg-gold-50 dark:bg-gold-900/20' },
  { color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
  { color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
];
const STAT_VALUES = ['500+', '500+', '10+', '7'];

export default function AboutPage() {
  const { t } = useLang();
  const a = t.about;

  const statsLabels = [a.stats.students, a.stats.questions, a.stats.quizzes, a.stats.topics];

  return (
    <MainLayout showRightSidebar={false}>
      <div className="max-w-4xl page-enter">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl mb-10 p-10 text-center"
          style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 50%, #F59E0B 100%)' }}
        >
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full bg-orange-300/20 blur-2xl" />

          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="text-7xl mb-4 relative z-10"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}
          >
            🪷
          </motion.div>

          <h1 className="relative z-10 text-3xl font-black text-amber-900 mb-3">
            {t.site.name}
          </h1>
          <p className="relative z-10 text-amber-800/90 max-w-xl mx-auto leading-relaxed text-sm">
            {a.heroDesc}
          </p>

          <div className="relative z-10 mt-5 inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full text-amber-800 text-xs font-semibold border border-white/60">
            <Sparkles size={13} /> {a.tagline}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {statsLabels.map((label, i) => {
            const Icon = STAT_ICONS[i];
            const { color, bg } = STAT_COLORS[i];
            return (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="card p-5 text-center"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-3 ${bg}`}>
                  <Icon size={20} className={color} />
                </div>
                <p className="text-2xl font-black text-temple-dark dark:text-cream-100">{STAT_VALUES[i]}</p>
                <p className="text-xs text-temple-medium mt-0.5">{label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Mission */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="card p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center">
              <Target size={20} className="text-gold-600" />
            </div>
            <h2 className="text-xl font-black text-temple-dark dark:text-cream-100">{a.missionTitle}</h2>
          </div>
          <div className="space-y-3 text-sm text-temple-dark dark:text-cream-200 leading-relaxed">
            <p><strong>{t.site.name}</strong> {a.mission1}</p>
            <p>{a.mission2}</p>
            <p>
              {a.mission3.split('{em}').map((part, i) =>
                i === 0 ? part : <span key={i}><em>{a.mission3em}</em>{part}</span>
              )}
            </p>
          </div>
        </motion.div>

        {/* Values */}
        <div className="mb-10">
          <h2 className="text-xl font-black text-temple-dark dark:text-cream-100 mb-5 flex items-center gap-2">
            <Heart size={22} className="text-gold-500" /> {a.valuesTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {a.values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="card p-5 flex gap-4"
              >
                <span className="text-3xl flex-shrink-0">{v.icon}</span>
                <div>
                  <h3 className="font-bold text-temple-dark dark:text-cream-100 mb-1">{v.title}</h3>
                  <p className="text-sm text-temple-medium leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-10">
          <h2 className="text-xl font-black text-temple-dark dark:text-cream-100 mb-5 flex items-center gap-2">
            <Users size={22} className="text-gold-500" /> {a.teamTitle}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {a.team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="card p-5 text-center"
              >
                <div className="text-5xl mb-3">{member.avatar}</div>
                <h3 className="font-bold text-temple-dark dark:text-cream-100">{member.name}</h3>
                <p className="text-xs font-semibold text-gold-500 mb-2">{member.role}</p>
                <p className="text-xs text-temple-medium leading-relaxed">{member.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="card p-8 text-center bg-gradient-to-br from-gold-50 to-amber-50 dark:from-gold-900/20 dark:to-amber-900/20 border-gold-200 dark:border-gold-800"
        >
          <div className="text-4xl mb-3">☸️</div>
          <h2 className="text-xl font-black text-temple-dark dark:text-cream-100 mb-2">{a.ctaTitle}</h2>
          <p className="text-sm text-temple-medium mb-5 max-w-md mx-auto">{a.ctaDesc}</p>
          <div className="flex justify-center gap-3">
            <Link href="/dashboard">
              <button className="btn-gold flex items-center gap-2">
                {a.ctaStart} <ArrowRight size={16} />
              </button>
            </Link>
            <Link href="/register">
              <button className="btn-outline-gold">{a.ctaRegister}</button>
            </Link>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
