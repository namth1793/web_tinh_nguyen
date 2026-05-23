'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { PenLine, BarChart2 } from 'lucide-react';

export default function HeroBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl mb-6"
      style={{ minHeight: 240 }}
    >
      {/* ── Background layers ── */}
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, #3D1C02 0%, #6B2F08 35%, #9A4D0F 65%, #B8860B 100%)' }}
      />

      {/* Mandala SVG overlay (right side) */}
      <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Cg fill='none' stroke='%23D4A017' stroke-width='1.2'%3E%3Ccircle cx='200' cy='200' r='180'/%3E%3Ccircle cx='200' cy='200' r='140'/%3E%3Ccircle cx='200' cy='200' r='100'/%3E%3Ccircle cx='200' cy='200' r='60'/%3E%3Ccircle cx='200' cy='200' r='25'/%3E%3Cline x1='200' y1='20' x2='200' y2='380'/%3E%3Cline x1='20' y1='200' x2='380' y2='200'/%3E%3Cline x1='73' y1='73' x2='327' y2='327'/%3E%3Cline x1='327' y1='73' x2='73' y2='327'/%3E%3Cellipse cx='200' cy='200' rx='70' ry='140' transform='rotate(22.5 200 200)'/%3E%3Cellipse cx='200' cy='200' rx='70' ry='140' transform='rotate(67.5 200 200)'/%3E%3Cellipse cx='200' cy='200' rx='70' ry='140' transform='rotate(112.5 200 200)'/%3E%3Cellipse cx='200' cy='200' rx='70' ry='140' transform='rotate(157.5 200 200)'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center right',
        }}
      />

      {/* Soft inner glow circles */}
      <div className="absolute top-0 left-1/3 w-80 h-80 rounded-full opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #D4A017 0%, transparent 70%)' }}
      />
      <div className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full opacity-10 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #EA6C00 0%, transparent 70%)' }}
      />

      {/* ── Top ornamental border ── */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #D4A017 30%, #F5C842 50%, #D4A017 70%, transparent 100%)' }}
      />
      <div className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #D4A017 30%, #F5C842 50%, #D4A017 70%, transparent 100%)' }}
      />

      {/* ── Content ── */}
      <div className="relative z-10 flex items-center h-full p-7 lg:p-10 gap-6">
        {/* Left: text */}
        <div className="flex-1 min-w-0">
          {/* Tag line */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{
              background: 'rgba(212,160,23,0.2)',
              border: '1px solid rgba(212,160,23,0.4)',
              color: '#F5C842',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span>☸</span>
            Nền tảng học Phật giáo — Chính pháp · Thanh tịnh · An lạc
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="font-bold leading-tight mb-1"
            style={{
              fontFamily: "'Philosopher', serif",
              fontSize: 'clamp(1.6rem, 3.5vw, 2.6rem)',
              color: '#FDF6E3',
            }}
          >
            Kiến thức Phật giáo
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="font-bold leading-tight mb-4"
            style={{
              fontFamily: "'Philosopher', serif",
              fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
              background: 'linear-gradient(135deg, #F5C842 0%, #EA6C00 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Từ cơ bản đến nâng cao
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm mb-6 leading-relaxed max-w-sm"
            style={{ color: 'rgba(253,246,227,0.75)' }}
          >
            Thi trắc nghiệm &amp; tự luận · Kiểm tra trí tuệ · Nuôi dưỡng từ bi
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-wrap gap-3"
          >
            <Link href="/quiz">
              <button className="btn-saffron text-sm">
                <PenLine size={15} />
                Làm bài thi ngay
              </button>
            </Link>
            <Link href="/quiz/level">
              <button
                className="inline-flex items-center gap-2 text-sm font-semibold rounded-xl px-5 py-2.5 transition-all duration-200"
                style={{
                  background: 'rgba(253,246,227,0.12)',
                  border: '1px solid rgba(253,246,227,0.3)',
                  color: '#FDF6E3',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(253,246,227,0.22)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(253,246,227,0.12)'; }}
              >
                <BarChart2 size={15} />
                Thi theo trình độ
              </button>
            </Link>
          </motion.div>

          {/* Mini stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="flex gap-5 mt-5"
          >
            {[
              { value: '500+', label: 'Câu hỏi' },
              { value: '7',    label: 'Chủ đề' },
              { value: '4',    label: 'Trình độ' },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-bold text-base" style={{ color: '#F5C842' }}>{s.value}</p>
                <p className="text-xs" style={{ color: 'rgba(253,246,227,0.6)' }}>{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: decorative Buddha */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 100 }}
          className="hidden md:flex flex-col items-center flex-shrink-0"
        >
          {/* Halo ring */}
          <div className="relative flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="absolute"
              style={{
                width: 180,
                height: 180,
                borderRadius: '50%',
                border: '1px dashed rgba(212,160,23,0.4)',
              }}
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute"
              style={{
                width: 140,
                height: 140,
                borderRadius: '50%',
                border: '1px solid rgba(212,160,23,0.25)',
              }}
            />
            {/* Radial glow */}
            <div className="absolute inset-0 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(212,160,23,0.18) 0%, transparent 70%)' }}
            />
            {/* Buddha emoji */}
            <motion.div
              animate={{ y: [-6, 6, -6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              style={{ fontSize: 90, filter: 'drop-shadow(0 0 20px rgba(212,160,23,0.7)) drop-shadow(0 4px 10px rgba(0,0,0,0.5))', lineHeight: 1 }}
            >
              🧘
            </motion.div>
          </div>

          {/* Floating symbols */}
          <motion.div
            animate={{ y: [4, -4, 4], rotate: [0, -15, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute"
            style={{ bottom: 10, left: -8, fontSize: 18, filter: 'drop-shadow(0 0 6px rgba(212,160,23,0.7))' }}
          >
            ☸️
          </motion.div>

          {/* "Nam Mô..." tagline */}
          <p className="mt-4 text-xs text-center" style={{ color: 'rgba(245,200,66,0.7)', fontFamily: 'Philosopher, serif', letterSpacing: '0.05em' }}>
            Nam Mô Bổn Sư Thích Ca Mâu Ni Phật
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
