import { Level } from '@/types';

export const LEVELS: Level[] = [
  {
    id: 1,
    name: 'Cơ bản',
    description: 'Dành cho người mới bắt đầu tìm hiểu giáo lý Phật đà',
    questionCount: 120,
    icon: '🌿',
    color: '#1A9362',
    bgColor: 'bg-jade-50 dark:bg-jade-950/30',
    borderColor: 'border-jade-200 dark:border-jade-800',
    buttonBg: 'bg-jade-500 hover:bg-jade-600',
    gradient: 'from-jade-50 to-jade-100',
  },
  {
    id: 2,
    name: 'Trung cấp',
    description: 'Kiến thức Phật pháp căn bản — Tứ Diệu Đế, Bát Chánh Đạo',
    questionCount: 180,
    icon: '🪷',
    color: '#B8860B',
    bgColor: 'bg-gold-50 dark:bg-gold-950/30',
    borderColor: 'border-gold-200 dark:border-gold-800',
    buttonBg: 'bg-gold-500 hover:bg-gold-600',
    gradient: 'from-gold-50 to-gold-100',
  },
  {
    id: 3,
    name: 'Nâng cao',
    description: 'Phật pháp chuyên sâu — Luận tạng, Thiền định, Mật tông',
    questionCount: 200,
    icon: '☸️',
    color: '#8B2635',
    bgColor: 'bg-maroon-50 dark:bg-maroon-950/30',
    borderColor: 'border-maroon-200 dark:border-maroon-800',
    buttonBg: 'bg-maroon-500 hover:bg-maroon-600',
    gradient: 'from-maroon-50 to-maroon-100',
  },
  {
    id: 4,
    name: 'Chuyên sâu',
    description: 'Học thuật & nghiên cứu — Tam tạng kinh điển',
    questionCount: 150,
    icon: '🏛️',
    color: '#EA6C00',
    bgColor: 'bg-saffron-50 dark:bg-saffron-950/30',
    borderColor: 'border-saffron-200 dark:border-saffron-800',
    buttonBg: 'bg-saffron-500 hover:bg-saffron-600',
    gradient: 'from-saffron-50 to-saffron-100',
  },
];

export const LEVEL_NAMES: Record<number, { name: string; maxXp: number }> = {
  1: { name: 'Sơ tâm', maxXp: 200 },
  2: { name: 'Trung cấp 1', maxXp: 500 },
  3: { name: 'Trung cấp 2', maxXp: 1000 },
  4: { name: 'Nâng cao 1', maxXp: 2000 },
  5: { name: 'Nâng cao 2', maxXp: 3500 },
  6: { name: 'Chuyên gia', maxXp: 6000 },
};

export const LEVEL_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Cơ bản':    { bg: 'bg-jade-100',   text: 'text-jade-700',   border: 'border-jade-200' },
  'Trung cấp': { bg: 'bg-gold-100',   text: 'text-gold-700',   border: 'border-gold-200' },
  'Nâng cao':  { bg: 'bg-maroon-100', text: 'text-maroon-600', border: 'border-maroon-200' },
  'Chuyên sâu':{ bg: 'bg-saffron-100',text: 'text-saffron-700',border: 'border-saffron-200' },
};

export const NAV_ITEMS = [
  { icon: 'Home', label: 'Trang chủ', href: '/dashboard' },
  { icon: 'BookOpen', label: 'Thi theo chủ đề', href: '/quiz' },
  { icon: 'BarChart2', label: 'Thi theo trình độ', href: '/quiz/level' },
  { icon: 'FileText', label: 'Bài thi của tôi', href: '/profile' },
  { icon: 'Trophy', label: 'Thành tích', href: '/achievements' },
  { icon: 'Award', label: 'Huy hiệu', href: '/badges' },
  { icon: 'Crown', label: 'Bảng xếp hạng', href: '/ranking' },
  { icon: 'MessageCircle', label: 'Hỏi đáp Phật pháp', href: '/qa' },
  { icon: 'Info', label: 'Giới thiệu', href: '/about' },
  { icon: 'HelpCircle', label: 'Hướng dẫn', href: '/guide' },
];
