'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, ClipboardList, Users, Settings, LogOut,
  TrendingUp, TrendingDown, Plus, Pencil, Trash2, Eye, Search,
  X, ChevronDown, CheckCircle2, XCircle, Filter, Download,
  ChevronLeft, ChevronRight, Clock, Star, BarChart3, Shield,
  ArrowUpRight, Bell, Moon, Sun,
} from 'lucide-react';
import Link from 'next/link';
import { motion as m } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useApp } from '@/context/ThemeContext';
import { mockQuizzes, mockTopics } from '@/data/mockData';
import { LEVELS, LEVEL_COLORS } from '@/constants';
import { cn } from '@/lib/utils';

// ─── Mock data ────────────────────────────────────────────────────────────────
const mockUsers = [
  { id: 1, name: 'Admin', email: 'admin@phatphap.vn', role: 'admin', xp: 3200, level_id: 5, quizCount: 45, joined: '01/01/2024' },
  { id: 2, name: 'Minh Tâm', email: 'minhtam@gmail.com', role: 'user', xp: 720, level_id: 3, quizCount: 24, joined: '15/02/2024' },
  { id: 3, name: 'Tuệ Minh', email: 'tueming@gmail.com', role: 'user', xp: 960, level_id: 3, quizCount: 18, joined: '20/02/2024' },
  { id: 4, name: 'Pháp Hạnh', email: 'phaph@gmail.com', role: 'user', xp: 680, level_id: 2, quizCount: 12, joined: '05/03/2024' },
  { id: 5, name: 'Diệu Hạnh', email: 'dieuhanh@gmail.com', role: 'user', xp: 620, level_id: 2, quizCount: 10, joined: '10/03/2024' },
  { id: 6, name: 'Từ Bi', email: 'tubi@gmail.com', role: 'user', xp: 430, level_id: 1, quizCount: 7, joined: '01/04/2024' },
  { id: 7, name: 'Giác Ngộ', email: 'giacngo@gmail.com', role: 'user', xp: 310, level_id: 1, quizCount: 5, joined: '05/04/2024' },
  { id: 8, name: 'Huệ Tâm', email: 'huetam@gmail.com', role: 'user', xp: 1150, level_id: 4, quizCount: 30, joined: '10/01/2024' },
];

const mockResults = [
  { id: 1, userId: 2, userName: 'Minh Tâm', email: 'minhtam@gmail.com', quizId: 1, quizTitle: 'Tứ Diệu Đế căn bản', level: 'Cơ bản', topic: 'Giáo lý cốt lõi', score: 9, total: 10, percent: 90, passed: true, date: '10/04/2024', duration: 18 },
  { id: 2, userId: 3, userName: 'Tuệ Minh', email: 'tueming@gmail.com', quizId: 1, quizTitle: 'Tứ Diệu Đế căn bản', level: 'Cơ bản', topic: 'Giáo lý cốt lõi', score: 7, total: 10, percent: 70, passed: true, date: '11/04/2024', duration: 22 },
  { id: 3, userId: 4, userName: 'Pháp Hạnh', email: 'phaph@gmail.com', quizId: 2, quizTitle: 'Bát Chánh Đạo', level: 'Trung cấp', topic: 'Giới - Định - Tuệ', score: 5, total: 10, percent: 50, passed: false, date: '12/04/2024', duration: 35 },
  { id: 4, userId: 2, userName: 'Minh Tâm', email: 'minhtam@gmail.com', quizId: 3, quizTitle: 'Thiền Vipassana', level: 'Nâng cao', topic: 'Thiền học', score: 8, total: 10, percent: 80, passed: true, date: '13/04/2024', duration: 27 },
  { id: 5, userId: 8, userName: 'Huệ Tâm', email: 'huetam@gmail.com', quizId: 2, quizTitle: 'Bát Chánh Đạo', level: 'Trung cấp', topic: 'Giới - Định - Tuệ', score: 10, total: 10, percent: 100, passed: true, date: '14/04/2024', duration: 15 },
  { id: 6, userId: 5, userName: 'Diệu Hạnh', email: 'dieuhanh@gmail.com', quizId: 1, quizTitle: 'Tứ Diệu Đế căn bản', level: 'Cơ bản', topic: 'Giáo lý cốt lõi', score: 6, total: 10, percent: 60, passed: true, date: '15/04/2024', duration: 30 },
  { id: 7, userId: 6, userName: 'Từ Bi', email: 'tubi@gmail.com', quizId: 4, quizTitle: 'Kinh Pháp Cú nâng cao', level: 'Nâng cao', topic: 'Kinh tạng', score: 4, total: 10, percent: 40, passed: false, date: '16/04/2024', duration: 42 },
  { id: 8, userId: 1, userName: 'Admin', email: 'admin@phatphap.vn', quizId: 5, quizTitle: 'Luận A-Tỳ-Đàm', level: 'Chuyên sâu', topic: 'Luận tạng', score: 9, total: 10, percent: 90, passed: true, date: '17/04/2024', duration: 20 },
  { id: 9, userId: 7, userName: 'Giác Ngộ', email: 'giacngo@gmail.com', quizId: 1, quizTitle: 'Tứ Diệu Đế căn bản', level: 'Cơ bản', topic: 'Giáo lý cốt lõi', score: 8, total: 10, percent: 80, passed: true, date: '18/04/2024', duration: 24 },
  { id: 10, userId: 3, userName: 'Tuệ Minh', email: 'tueming@gmail.com', quizId: 3, quizTitle: 'Thiền Vipassana', level: 'Nâng cao', topic: 'Thiền học', score: 7, total: 10, percent: 70, passed: true, date: '19/04/2024', duration: 31 },
  { id: 11, userId: 4, userName: 'Pháp Hạnh', email: 'phaph@gmail.com', quizId: 3, quizTitle: 'Thiền Vipassana', level: 'Nâng cao', topic: 'Thiền học', score: 3, total: 10, percent: 30, passed: false, date: '20/04/2024', duration: 45 },
  { id: 12, userId: 8, userName: 'Huệ Tâm', email: 'huetam@gmail.com', quizId: 5, quizTitle: 'Luận A-Tỳ-Đàm', level: 'Chuyên sâu', topic: 'Luận tạng', score: 8, total: 10, percent: 80, passed: true, date: '21/04/2024', duration: 28 },
];

type Tab = 'dashboard' | 'quizzes' | 'results' | 'users';

// ─── Quiz Modal ───────────────────────────────────────────────────────────────
function QuizModal({ quiz, onClose, onSave }: {
  quiz?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [form, setForm] = useState({
    title: quiz?.title ?? '',
    topic_id: quiz?.topic_id ?? 1,
    level: quiz?.level ?? 'Cơ bản',
    question_count: quiz?.question_count ?? 10,
    time_limit: quiz?.time_limit ?? 30,
    description: quiz?.description ?? '',
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative w-full max-w-lg rounded-2xl p-6 z-10"
        style={{ background: '#FFFDF7', border: '1px solid rgba(212,160,23,0.25)', boxShadow: '0 24px 64px rgba(42,21,5,0.2)' }}
      >
        {/* Top ornament */}
        <div className="absolute top-0 left-8 right-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, #D4A017, transparent)' }} />

        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg" style={{ fontFamily: "'Philosopher', serif", color: 'var(--text-dark)' }}>
            {quiz ? '✏️ Chỉnh sửa bài thi' : '➕ Thêm bài thi mới'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors" style={{ color: 'var(--text-medium)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          ><X size={18} /></button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>Tên bài thi</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="VD: Tứ Diệu Đế căn bản"
              className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition-all"
              style={{ border: '1.5px solid rgba(212,160,23,0.3)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.3)'; }}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Mô tả ngắn về nội dung bài thi..."
              rows={2}
              className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none transition-all resize-none"
              style={{ border: '1.5px solid rgba(212,160,23,0.3)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.3)'; }}
            />
          </div>

          {/* Topic & Level */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>Chủ đề</label>
              <select
                value={form.topic_id}
                onChange={(e) => setForm({ ...form, topic_id: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ border: '1.5px solid rgba(212,160,23,0.3)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' }}
              >
                {mockTopics.map((t) => (
                  <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>Trình độ</label>
              <select
                value={form.level}
                onChange={(e) => setForm({ ...form, level: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ border: '1.5px solid rgba(212,160,23,0.3)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' }}
              >
                {LEVELS.map((l) => <option key={l.name} value={l.name}>{l.name}</option>)}
              </select>
            </div>
          </div>

          {/* Count & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>Số câu hỏi</label>
              <input
                type="number" min={5} max={100}
                value={form.question_count}
                onChange={(e) => setForm({ ...form, question_count: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ border: '1.5px solid rgba(212,160,23,0.3)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.3)'; }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>Thời gian (phút)</label>
              <input
                type="number" min={5} max={180}
                value={form.time_limit}
                onChange={(e) => setForm({ ...form, time_limit: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
                style={{ border: '1.5px solid rgba(212,160,23,0.3)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.3)'; }}
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ border: '1.5px solid rgba(212,160,23,0.3)', color: 'var(--text-medium)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.06)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
          >
            Hủy
          </button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)', boxShadow: '0 2px 12px rgba(184,134,11,0.35)' }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 18px rgba(184,134,11,0.5)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(184,134,11,0.35)'; }}
          >
            {quiz ? 'Lưu thay đổi' : 'Thêm bài thi'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteConfirm({ name, onClose, onConfirm }: { name: string; onClose: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-sm rounded-2xl p-6 z-10 text-center"
        style={{ background: '#FFFDF7', border: '1px solid rgba(220,38,38,0.2)', boxShadow: '0 24px 64px rgba(42,21,5,0.2)' }}
      >
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <h3 className="font-bold text-base mb-2" style={{ fontFamily: "'Philosopher', serif", color: 'var(--text-dark)' }}>Xác nhận xóa</h3>
        <p className="text-sm mb-5" style={{ color: 'var(--text-medium)' }}>
          Bạn có chắc muốn xóa <span className="font-semibold" style={{ color: 'var(--text-dark)' }}>"{name}"</span>? Hành động này không thể hoàn tác.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ border: '1.5px solid rgba(212,160,23,0.3)', color: 'var(--text-medium)' }}>Hủy</button>
          <button onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors">
            Xóa
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user, logout } = useApp();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  // Quiz state
  const [quizzes, setQuizzes] = useState(mockQuizzes);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [deletingQuiz, setDeletingQuiz] = useState<any>(null);
  const [quizSearch, setQuizSearch] = useState('');
  const [quizLevelFilter, setQuizLevelFilter] = useState('');

  // Results state
  const [results] = useState(mockResults);
  const [resultSearch, setResultSearch] = useState('');
  const [resultQuizFilter, setResultQuizFilter] = useState('');
  const [resultPassFilter, setResultPassFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [expandedQuizId, setExpandedQuizId] = useState<number | null>(null);

  // Users state
  const [userSearch, setUserSearch] = useState('');

  // Filtered data
  const filteredQuizzes = useMemo(() => quizzes.filter((q) => {
    if (quizSearch && !q.title.toLowerCase().includes(quizSearch.toLowerCase())) return false;
    if (quizLevelFilter && q.level !== quizLevelFilter) return false;
    return true;
  }), [quizzes, quizSearch, quizLevelFilter]);

  const filteredResults = useMemo(() => results.filter((r) => {
    if (resultSearch && !r.userName.toLowerCase().includes(resultSearch.toLowerCase()) && !r.quizTitle.toLowerCase().includes(resultSearch.toLowerCase())) return false;
    if (resultQuizFilter && r.quizTitle !== resultQuizFilter) return false;
    if (resultPassFilter === 'passed' && !r.passed) return false;
    if (resultPassFilter === 'failed' && r.passed) return false;
    return true;
  }), [results, resultSearch, resultQuizFilter, resultPassFilter]);

  const filteredUsers = useMemo(() => mockUsers.filter((u) =>
    !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  ), [userSearch]);

  // Stats
  const totalAttempts = results.length;
  const passRate = Math.round((results.filter((r) => r.passed).length / totalAttempts) * 100);
  const avgScore = Math.round(results.reduce((s, r) => s + r.percent, 0) / totalAttempts);

  const dashboardStats = [
    { label: 'Học viên', value: mockUsers.length, sub: '+2 tuần này', icon: Users, color: '#1A9362', trend: true },
    { label: 'Bài thi', value: quizzes.length, sub: `${quizzes.reduce((s, q) => s + q.question_count, 0)} câu hỏi`, icon: BookOpen, color: '#B8860B', trend: true },
    { label: 'Lượt thi', value: totalAttempts, sub: '+3 hôm nay', icon: ClipboardList, color: '#EA6C00', trend: true },
    { label: 'Tỉ lệ đạt', value: `${passRate}%`, sub: `TB ${avgScore} điểm`, icon: BarChart3, color: '#8B2635', trend: passRate >= 70 },
  ];

  const navItems: { id: Tab; icon: any; label: string; count?: number }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
    { id: 'quizzes', icon: BookOpen, label: 'Bài thi', count: quizzes.length },
    { id: 'results', icon: ClipboardList, label: 'Kết quả thi', count: results.length },
    { id: 'users', icon: Users, label: 'Người dùng', count: mockUsers.length },
  ];

  // ── Handlers ──
  const handleSaveQuiz = (data: any) => {
    if (editingQuiz) {
      setQuizzes(quizzes.map((q) => q.id === editingQuiz.id ? { ...q, ...data } : q));
    } else {
      const topic = mockTopics.find((t) => t.id === data.topic_id);
      setQuizzes([...quizzes, {
        ...data,
        id: quizzes.length + 1,
        topic_name: topic?.name ?? '',
        topic_icon: topic?.icon ?? '📖',
        description: data.description,
      }]);
    }
    setEditingQuiz(null);
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)', color: 'var(--text-dark)' }}>

      {/* ── Admin Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-56 min-h-screen fixed left-0 top-0 z-40"
        style={{
          background: 'linear-gradient(180deg, #1C0E02 0%, #140900 100%)',
          borderRight: '1px solid rgba(212,160,23,0.2)',
          boxShadow: '4px 0 20px rgba(0,0,0,0.3)',
        }}
      >
        {/* Top gold line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #D4A017, transparent)' }} />

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-14 flex-shrink-0" style={{ borderBottom: '1px solid rgba(212,160,23,0.15)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #D4A017 0%, #B8860B 100%)', boxShadow: '0 0 12px rgba(212,160,23,0.4)' }}>
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider" style={{ color: '#F5C842', fontFamily: 'Cinzel, serif' }}>ADMIN</p>
            <p className="text-[9px]" style={{ color: 'rgba(212,160,23,0.5)' }}>Phật Pháp Test</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3">
          <p className="text-[9px] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: 'rgba(212,160,23,0.4)' }}>Quản lý</p>
          <ul className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => setActiveTab(item.id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                    style={isActive
                      ? { background: 'linear-gradient(135deg, rgba(212,160,23,0.9) 0%, rgba(184,134,11,0.9) 100%)', boxShadow: '0 2px 10px rgba(184,134,11,0.4)' }
                      : {}}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = ''; }}
                  >
                    <Icon size={16} style={{ color: isActive ? '#fff' : 'rgba(212,160,23,0.6)', flexShrink: 0 }} />
                    <span className="text-sm font-medium flex-1" style={{ color: isActive ? '#fff' : 'rgba(253,246,227,0.65)' }}>{item.label}</span>
                    {item.count !== undefined && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(212,160,23,0.15)', color: isActive ? '#fff' : '#D4A017' }}>
                        {item.count}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(212,160,23,0.12)' }}>
            <p className="text-[9px] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: 'rgba(212,160,23,0.4)' }}>Hệ thống</p>
            <Link href="/dashboard">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer"
                style={{ color: 'rgba(253,246,227,0.5)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
              >
                <ArrowUpRight size={15} style={{ color: 'rgba(212,160,23,0.5)' }} />
                <span className="text-sm">Về trang chủ</span>
              </div>
            </Link>
            <button onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all"
              style={{ color: 'rgba(253,246,227,0.5)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; e.currentTarget.style.color = '#f87171'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(253,246,227,0.5)'; }}
            >
              <LogOut size={15} style={{ color: 'rgba(220,38,38,0.5)' }} />
              <span className="text-sm">Đăng xuất</span>
            </button>
          </div>
        </nav>

        {/* Admin info */}
        <div className="px-3 pb-4 flex-shrink-0">
          <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.12)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #D4A017 0%, #EA6C00 100%)' }}>
              {user?.name?.charAt(0) ?? 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: '#F5C842' }}>{user?.name ?? 'Admin'}</p>
              <p className="text-[9px] truncate" style={{ color: 'rgba(212,160,23,0.5)' }}>Quản trị viên</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* Top bar */}
        <header
          className="sticky top-0 z-30 h-14 flex items-center px-6 gap-4"
          style={{
            background: 'rgba(253,246,227,0.93)',
            borderBottom: '1px solid rgba(212,160,23,0.2)',
            boxShadow: '0 1px 0 rgba(212,160,23,0.08), 0 2px 12px rgba(42,21,5,0.05)',
          }}
        >
          {/* Page title */}
          <div className="flex-1">
            <h1 className="font-bold text-base" style={{ fontFamily: "'Philosopher', serif", color: 'var(--text-dark)' }}>
              {navItems.find((n) => n.id === activeTab)?.label ?? 'Admin'}
            </h1>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl transition-colors" style={{ color: 'var(--text-medium)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="p-2 rounded-xl transition-colors relative" style={{ color: 'var(--text-medium)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400" />
            </button>
            {/* Mobile menu info */}
            <div className="lg:hidden flex items-center gap-2 ml-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: 'linear-gradient(135deg, #D4A017 0%, #EA6C00 100%)', color: '#fff' }}>
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">

            {/* ══════════════ DASHBOARD ══════════════ */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {dashboardStats.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                        className="card p-5"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                            style={{ background: s.color + '15', border: `1px solid ${s.color}25` }}>
                            <Icon size={18} style={{ color: s.color }} />
                          </div>
                          <span className={cn('flex items-center gap-0.5 text-[10px] font-semibold', s.trend ? 'text-green-600' : 'text-red-500')}>
                            {s.trend ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          </span>
                        </div>
                        <p className="text-2xl font-black mb-0.5" style={{ color: 'var(--text-dark)' }}>{s.value}</p>
                        <p className="text-xs font-medium" style={{ color: 'var(--text-medium)' }}>{s.label}</p>
                        <p className="text-[10px] mt-0.5" style={{ color: s.color }}>{s.sub}</p>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Recent results */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card p-5">
                    <div className="section-header">
                      <h2 className="text-sm">Kết quả thi gần đây</h2>
                      <button onClick={() => setActiveTab('results')} className="text-xs font-medium" style={{ color: '#B8860B' }}>
                        Xem tất cả →
                      </button>
                    </div>
                    <div className="space-y-2.5">
                      {results.slice(0, 5).map((r) => (
                        <div key={r.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg, rgba(212,160,23,0.2), rgba(234,108,0,0.15))', color: '#B8860B' }}>
                            {r.userName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-dark)' }}>{r.userName}</p>
                            <p className="text-[10px] truncate" style={{ color: 'var(--text-medium)' }}>{r.quizTitle}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold" style={{ color: r.passed ? '#1A9362' : '#DC2626' }}>{r.percent}%</p>
                            <p className="text-[9px]" style={{ color: r.passed ? '#1A9362' : '#DC2626' }}>
                              {r.passed ? '✓ Đạt' : '✗ Trượt'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  {/* Quiz distribution */}
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="card p-5">
                    <div className="section-header">
                      <h2 className="text-sm">Bài thi theo chủ đề</h2>
                    </div>
                    <div className="space-y-3">
                      {mockTopics.map((t) => {
                        const quizCount = quizzes.filter((q) => q.topic_id === t.id).length;
                        const attemptCount = results.filter((r) => mockQuizzes.find((q) => q.id === r.quizId && q.topic_id === t.id)).length;
                        return (
                          <div key={t.id} className="flex items-center gap-3">
                            <span className="text-lg w-6 text-center flex-shrink-0">{t.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium truncate" style={{ color: 'var(--text-dark)' }}>{t.name}</span>
                                <span className="text-[10px] ml-2 flex-shrink-0" style={{ color: 'var(--text-light)' }}>{quizCount} bài · {attemptCount} lượt</span>
                              </div>
                              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(212,160,23,0.1)' }}>
                                <div className="h-full rounded-full transition-all duration-700"
                                  style={{ width: `${(t.question_count / 80) * 100}%`, background: t.color }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* ══════════════ QUIZZES ══════════════ */}
            {activeTab === 'quizzes' && (
              <motion.div key="quizzes" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Toolbar */}
                <div className="card p-4 mb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-48">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-medium)' }} />
                      <input value={quizSearch} onChange={(e) => setQuizSearch(e.target.value)}
                        placeholder="Tìm bài thi..."
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-xl focus:outline-none"
                        style={{ border: '1.5px solid rgba(212,160,23,0.2)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.2)'; }}
                      />
                      {quizSearch && <button onClick={() => setQuizSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2"><X size={13} style={{ color: 'var(--text-medium)' }} /></button>}
                    </div>

                    {/* Level filter */}
                    <div className="flex gap-1.5">
                      <button onClick={() => setQuizLevelFilter('')}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                        style={!quizLevelFilter ? { background: 'linear-gradient(135deg, #D4A017, #B8860B)', color: '#fff' } : { background: 'rgba(212,160,23,0.08)', color: 'var(--text-medium)' }}>
                        Tất cả
                      </button>
                      {LEVELS.map((l) => (
                        <button key={l.name} onClick={() => setQuizLevelFilter(quizLevelFilter === l.name ? '' : l.name)}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                          style={quizLevelFilter === l.name
                            ? { background: l.color, color: '#fff' }
                            : { background: 'rgba(212,160,23,0.06)', color: 'var(--text-medium)', border: `1px solid ${l.color}25` }}>
                          {l.icon} {l.name}
                        </button>
                      ))}
                    </div>

                    {/* Add button */}
                    <button
                      onClick={() => { setEditingQuiz(null); setShowQuizModal(true); }}
                      className="btn-saffron text-sm py-2 px-4 ml-auto"
                    >
                      <Plus size={15} /> Thêm bài thi
                    </button>
                  </div>
                </div>

                {/* Quiz table */}
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(212,160,23,0.15)', background: 'rgba(212,160,23,0.05)' }}>
                          {['STT', 'Tên bài thi', 'Chủ đề', 'Trình độ', 'Câu hỏi', 'Thời gian', 'Lượt thi', 'TB điểm', 'Hành động'].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-medium)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredQuizzes.map((q, i) => {
                          const lvlColor = LEVELS.find((l) => l.name === q.level)?.color ?? '#B8860B';
                          const qResults = results.filter((r) => r.quizId === q.id);
                          const qAvg = qResults.length ? Math.round(qResults.reduce((s, r) => s + r.percent, 0) / qResults.length) : 0;
                          return (
                            <motion.tr key={q.id}
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                              style={{ borderBottom: '1px solid rgba(212,160,23,0.08)' }}
                              className="group"
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,23,0.04)'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
                            >
                              <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-light)' }}>{i + 1}</td>
                              <td className="px-4 py-3">
                                <p className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>{q.title}</p>
                                {q.description && <p className="text-[10px] mt-0.5 line-clamp-1" style={{ color: 'var(--text-light)' }}>{q.description}</p>}
                              </td>
                              <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-medium)' }}>{q.topic_icon} {q.topic_name}</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                                  style={{ background: lvlColor + '15', color: lvlColor, border: `1px solid ${lvlColor}30` }}>
                                  {q.level}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>{q.question_count}</td>
                              <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-medium)' }}>
                                <div className="flex items-center gap-1"><Clock size={12} />{q.time_limit} phút</div>
                              </td>
                              <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#B8860B' }}>{qResults.length}</td>
                              <td className="px-4 py-3">
                                {qResults.length > 0 ? (
                                  <span className="text-sm font-bold" style={{ color: qAvg >= 60 ? '#1A9362' : '#DC2626' }}>{qAvg}%</span>
                                ) : (
                                  <span className="text-xs" style={{ color: 'var(--text-light)' }}>—</span>
                                )}
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-1.5">
                                  <button
                                    onClick={() => { setExpandedQuizId(expandedQuizId === q.id ? null : q.id); setActiveTab('results'); setResultQuizFilter(q.title); }}
                                    className="p-1.5 rounded-lg transition-all" title="Xem kết quả"
                                    style={{ color: '#1A9362' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(26,147,98,0.1)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
                                  ><Eye size={14} /></button>
                                  <button
                                    onClick={() => { setEditingQuiz(q); setShowQuizModal(true); }}
                                    className="p-1.5 rounded-lg transition-all" title="Chỉnh sửa"
                                    style={{ color: '#B8860B' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(184,134,11,0.1)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
                                  ><Pencil size={14} /></button>
                                  <button
                                    onClick={() => setDeletingQuiz(q)}
                                    className="p-1.5 rounded-lg transition-all" title="Xóa"
                                    style={{ color: '#DC2626' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}
                                  ><Trash2 size={14} /></button>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {filteredQuizzes.length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-4xl mb-3">🔍</div>
                        <p className="font-semibold" style={{ color: 'var(--text-dark)' }}>Không tìm thấy bài thi</p>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-medium)' }}>Thử thay đổi bộ lọc hoặc từ khóa</p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(212,160,23,0.1)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-medium)' }}>
                      Hiển thị <span className="font-semibold" style={{ color: 'var(--text-dark)' }}>{filteredQuizzes.length}</span> / {quizzes.length} bài thi
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════ RESULTS ══════════════ */}
            {activeTab === 'results' && (
              <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[
                    { label: 'Tổng lượt thi', value: filteredResults.length, icon: ClipboardList, color: '#B8860B' },
                    { label: 'Đạt', value: filteredResults.filter((r) => r.passed).length, icon: CheckCircle2, color: '#1A9362' },
                    { label: 'Không đạt', value: filteredResults.filter((r) => !r.passed).length, icon: XCircle, color: '#DC2626' },
                  ].map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <div key={i} className="card p-4 flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: s.color + '15' }}>
                          <Icon size={18} style={{ color: s.color }} />
                        </div>
                        <div>
                          <p className="text-xl font-black" style={{ color: 'var(--text-dark)' }}>{s.value}</p>
                          <p className="text-xs" style={{ color: 'var(--text-medium)' }}>{s.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Filters */}
                <div className="card p-4 mb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-48">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-medium)' }} />
                      <input value={resultSearch} onChange={(e) => setResultSearch(e.target.value)}
                        placeholder="Tìm theo tên học viên / bài thi..."
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-xl focus:outline-none"
                        style={{ border: '1.5px solid rgba(212,160,23,0.2)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.2)'; }}
                      />
                      {resultSearch && <button onClick={() => setResultSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2"><X size={13} style={{ color: 'var(--text-medium)' }} /></button>}
                    </div>

                    {/* Quiz filter */}
                    <select value={resultQuizFilter} onChange={(e) => setResultQuizFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl text-sm focus:outline-none"
                      style={{ border: '1.5px solid rgba(212,160,23,0.2)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)', minWidth: 160 }}>
                      <option value="">Tất cả bài thi</option>
                      {Array.from(new Set(results.map((r) => r.quizTitle))).map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>

                    {/* Pass/fail filter */}
                    <div className="flex gap-1.5">
                      {(['all', 'passed', 'failed'] as const).map((f) => (
                        <button key={f} onClick={() => setResultPassFilter(f)}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                          style={resultPassFilter === f
                            ? { background: f === 'all' ? 'linear-gradient(135deg, #D4A017, #B8860B)' : f === 'passed' ? '#1A9362' : '#DC2626', color: '#fff' }
                            : { background: 'rgba(212,160,23,0.06)', color: 'var(--text-medium)' }}>
                          {f === 'all' ? 'Tất cả' : f === 'passed' ? '✓ Đạt' : '✗ Không đạt'}
                        </button>
                      ))}
                    </div>

                    {/* Clear filters */}
                    {(resultSearch || resultQuizFilter || resultPassFilter !== 'all') && (
                      <button onClick={() => { setResultSearch(''); setResultQuizFilter(''); setResultPassFilter('all'); }}
                        className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-xl transition-all"
                        style={{ color: '#DC2626', background: 'rgba(220,38,38,0.06)' }}>
                        <X size={12} /> Xóa lọc
                      </button>
                    )}

                    <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl ml-auto transition-all"
                      style={{ border: '1.5px solid rgba(212,160,23,0.3)', color: '#B8860B' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.08)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                      <Download size={13} /> Xuất CSV
                    </button>
                  </div>
                </div>

                {/* Results table */}
                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(212,160,23,0.15)', background: 'rgba(212,160,23,0.05)' }}>
                          {['STT', 'Học viên', 'Bài thi', 'Trình độ', 'Điểm', '%', 'Thời gian', 'Kết quả', 'Ngày thi'].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-medium)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResults.map((r, i) => {
                          const lvlColor = LEVELS.find((l) => l.name === r.level)?.color ?? '#B8860B';
                          return (
                            <motion.tr key={r.id}
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                              style={{ borderBottom: '1px solid rgba(212,160,23,0.08)' }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,23,0.03)'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
                            >
                              <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-light)' }}>{i + 1}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                    style={{ background: 'linear-gradient(135deg, rgba(212,160,23,0.2), rgba(234,108,0,0.15))', color: '#B8860B' }}>
                                    {r.userName.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold" style={{ color: 'var(--text-dark)' }}>{r.userName}</p>
                                    <p className="text-[10px]" style={{ color: 'var(--text-light)' }}>{r.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <p className="text-xs font-medium max-w-32 line-clamp-2" style={{ color: 'var(--text-dark)' }}>{r.quizTitle}</p>
                                <p className="text-[10px]" style={{ color: 'var(--text-light)' }}>{r.topic}</p>
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                                  style={{ background: lvlColor + '15', color: lvlColor, border: `1px solid ${lvlColor}25` }}>
                                  {r.level}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm font-bold" style={{ color: 'var(--text-dark)' }}>
                                {r.score}<span className="text-xs font-normal" style={{ color: 'var(--text-light)' }}>/{r.total}</span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-12 h-1.5 rounded-full overflow-hidden flex-shrink-0" style={{ background: 'rgba(212,160,23,0.12)' }}>
                                    <div className="h-full rounded-full"
                                      style={{ width: `${r.percent}%`, background: r.percent >= 60 ? '#1A9362' : '#DC2626' }} />
                                  </div>
                                  <span className="text-sm font-bold" style={{ color: r.percent >= 60 ? '#1A9362' : '#DC2626' }}>{r.percent}%</span>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-medium)' }}>
                                <div className="flex items-center gap-1"><Clock size={11} />{r.duration} phút</div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                                  style={r.passed
                                    ? { background: 'rgba(26,147,98,0.12)', color: '#1A9362', border: '1px solid rgba(26,147,98,0.25)' }
                                    : { background: 'rgba(220,38,38,0.1)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.2)' }
                                  }>
                                  {r.passed ? <><CheckCircle2 size={11} /> Đạt</> : <><XCircle size={11} /> Trượt</>}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-medium)' }}>{r.date}</td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>

                    {filteredResults.length === 0 && (
                      <div className="text-center py-12">
                        <div className="text-4xl mb-3">📋</div>
                        <p className="font-semibold" style={{ color: 'var(--text-dark)' }}>Không có kết quả nào</p>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-medium)' }}>Thử thay đổi bộ lọc</p>
                      </div>
                    )}
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(212,160,23,0.1)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-medium)' }}>
                      Hiển thị <span className="font-semibold" style={{ color: 'var(--text-dark)' }}>{filteredResults.length}</span> / {results.length} kết quả
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══════════════ USERS ══════════════ */}
            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Toolbar */}
                <div className="card p-4 mb-4 flex items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-medium)' }} />
                    <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Tìm người dùng..."
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-xl focus:outline-none"
                      style={{ border: '1.5px solid rgba(212,160,23,0.2)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.2)'; }}
                    />
                    {userSearch && <button onClick={() => setUserSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2"><X size={13} style={{ color: 'var(--text-medium)' }} /></button>}
                  </div>
                  <p className="text-sm ml-auto" style={{ color: 'var(--text-medium)' }}>
                    <span className="font-semibold" style={{ color: 'var(--text-dark)' }}>{filteredUsers.length}</span> học viên
                  </p>
                </div>

                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(212,160,23,0.15)', background: 'rgba(212,160,23,0.05)' }}>
                          {['STT', 'Học viên', 'Email', 'Vai trò', 'XP', 'Bài đã thi', 'Tỉ lệ đạt', 'Ngày tham gia'].map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-medium)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u, i) => {
                          const uResults = results.filter((r) => r.userId === u.id);
                          const uPass = uResults.length ? Math.round((uResults.filter((r) => r.passed).length / uResults.length) * 100) : 0;
                          return (
                            <motion.tr key={u.id}
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                              style={{ borderBottom: '1px solid rgba(212,160,23,0.08)' }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,23,0.03)'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}
                            >
                              <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-light)' }}>{i + 1}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                                    style={{ background: 'linear-gradient(135deg, #D4A017 0%, #EA6C00 100%)', color: '#fff', boxShadow: '0 2px 8px rgba(184,134,11,0.3)' }}>
                                    {u.name.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>{u.name}</p>
                                    <div className="flex items-center gap-1">
                                      <Star size={10} style={{ color: '#D4A017' }} />
                                      <span className="text-[10px]" style={{ color: '#B8860B' }}>{u.xp} XP</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-medium)' }}>{u.email}</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                                  style={u.role === 'admin'
                                    ? { background: 'rgba(139,38,53,0.12)', color: '#8B2635', border: '1px solid rgba(139,38,53,0.25)' }
                                    : { background: 'rgba(26,147,98,0.12)', color: '#1A9362', border: '1px solid rgba(26,147,98,0.2)' }}>
                                  {u.role === 'admin' ? '⚡ Admin' : '🧘 Học viên'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm font-bold" style={{ color: '#B8860B' }}>{u.xp}</td>
                              <td className="px-4 py-3 text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>{uResults.length}</td>
                              <td className="px-4 py-3">
                                {uResults.length > 0 ? (
                                  <div className="flex items-center gap-2">
                                    <div className="w-14 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(212,160,23,0.1)' }}>
                                      <div className="h-full rounded-full" style={{ width: `${uPass}%`, background: uPass >= 60 ? '#1A9362' : '#DC2626' }} />
                                    </div>
                                    <span className="text-xs font-bold" style={{ color: uPass >= 60 ? '#1A9362' : '#DC2626' }}>{uPass}%</span>
                                  </div>
                                ) : (
                                  <span className="text-xs" style={{ color: 'var(--text-light)' }}>Chưa thi</span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-xs" style={{ color: 'var(--text-medium)' }}>{u.joined}</td>
                            </motion.tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showQuizModal && (
          <QuizModal
            quiz={editingQuiz}
            onClose={() => { setShowQuizModal(false); setEditingQuiz(null); }}
            onSave={handleSaveQuiz}
          />
        )}
        {deletingQuiz && (
          <DeleteConfirm
            name={deletingQuiz.title}
            onClose={() => setDeletingQuiz(null)}
            onConfirm={() => setQuizzes(quizzes.filter((q) => q.id !== deletingQuiz.id))}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
