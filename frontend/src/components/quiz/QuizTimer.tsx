'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizTimerProps {
  totalSeconds: number;
  onTimeUp: () => void;
  paused?: boolean;
}

export default function QuizTimer({ totalSeconds, onTimeUp, paused = false }: QuizTimerProps) {
  const [remaining, setRemaining] = useState(totalSeconds);

  const tick = useCallback(() => {
    setRemaining((prev) => {
      if (prev <= 1) { onTimeUp(); return 0; }
      return prev - 1;
    });
  }, [onTimeUp]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [tick, paused]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const pct = (remaining / totalSeconds) * 100;
  const isUrgent = pct <= 20;

  return (
    <div className={cn(
      'flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all',
      isUrgent ? 'bg-red-100 dark:bg-red-900/30 text-red-600 animate-pulse' : 'bg-gold-50 dark:bg-gold-900/20 text-gold-700'
    )}>
      <Clock size={16} />
      <span className="tabular-nums">{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
    </div>
  );
}
