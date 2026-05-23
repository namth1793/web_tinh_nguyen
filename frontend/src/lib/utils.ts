import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function formatScore(score: number): string {
  return `${Math.round(score)}%`;
}

export function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diff < 60) return 'Vừa xong';
  if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
  return `${Math.floor(diff / 86400)} ngày trước`;
}

export function getLevelInfo(levelId: number): { name: string; maxXp: number; progress: number } {
  const levels: Record<number, { name: string; baseXp: number; maxXp: number }> = {
    1: { name: 'Sơ tâm', baseXp: 0, maxXp: 200 },
    2: { name: 'Trung cấp 1', baseXp: 200, maxXp: 500 },
    3: { name: 'Trung cấp 2', baseXp: 500, maxXp: 1000 },
    4: { name: 'Nâng cao 1', baseXp: 1000, maxXp: 2000 },
    5: { name: 'Nâng cao 2', baseXp: 2000, maxXp: 3500 },
    6: { name: 'Chuyên gia', baseXp: 3500, maxXp: 6000 },
  };
  return { name: levels[levelId]?.name || 'Sơ tâm', maxXp: levels[levelId]?.maxXp || 1000, progress: 0 };
}

export function getRankLabel(rank: number): string {
  if (rank === 1) return '🥇';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}

export function getAvatarUrl(name: string): string {
  return `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=b6e3f4`;
}
