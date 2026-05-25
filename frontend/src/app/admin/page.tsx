'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, ClipboardList, Users, LogOut,
  TrendingUp, TrendingDown, Plus, Pencil, Trash2, Search,
  X, CheckCircle2, XCircle, Download, Clock, Star, BarChart3, Shield,
  ArrowUpRight, Bell, Moon, Sun, Save,
  ListOrdered, AlignLeft, Tag, HelpCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useApp } from '@/context/ThemeContext';
import { mockTopics, allSubTopics } from '@/data/mockData';
import { LEVELS } from '@/constants';
import { cn } from '@/lib/utils';
import type { Question } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5030/api';

// ─── Mock data ────────────────────────────────────────────────────────────────
const mockUsers = [
  { id: 1, name: 'Admin',      email: 'admin@phatphap.vn',   role: 'admin', xp: 3200, level_id: 5, quizCount: 45, joined: '01/01/2024' },
  { id: 2, name: 'Minh Tâm',   email: 'minhtam@gmail.com',   role: 'user',  xp: 720,  level_id: 3, quizCount: 24, joined: '15/02/2024' },
  { id: 3, name: 'Tuệ Minh',   email: 'tueming@gmail.com',   role: 'user',  xp: 960,  level_id: 3, quizCount: 18, joined: '20/02/2024' },
  { id: 4, name: 'Pháp Hạnh',  email: 'phaph@gmail.com',     role: 'user',  xp: 680,  level_id: 2, quizCount: 12, joined: '05/03/2024' },
  { id: 5, name: 'Diệu Hạnh',  email: 'dieuhanh@gmail.com',  role: 'user',  xp: 620,  level_id: 2, quizCount: 10, joined: '10/03/2024' },
  { id: 6, name: 'Từ Bi',      email: 'tubi@gmail.com',      role: 'user',  xp: 430,  level_id: 1, quizCount: 7,  joined: '01/04/2024' },
  { id: 7, name: 'Giác Ngộ',   email: 'giacngo@gmail.com',   role: 'user',  xp: 310,  level_id: 1, quizCount: 5,  joined: '05/04/2024' },
  { id: 8, name: 'Huệ Tâm',    email: 'huetam@gmail.com',    role: 'user',  xp: 1150, level_id: 4, quizCount: 30, joined: '10/01/2024' },
];

const mockResults = [
  { id: 1,  userId: 2, userName: 'Minh Tâm',  email: 'minhtam@gmail.com',  quizId: 1, quizTitle: 'Vô thường – Khổ – Vô ngã cơ bản',   level: 'Cơ bản',    topic: 'Chủ Đề',   score: 9,  total: 10, percent: 90,  passed: true,  date: '10/04/2024', duration: 18 },
  { id: 2,  userId: 3, userName: 'Tuệ Minh',  email: 'tueming@gmail.com',  quizId: 1, quizTitle: 'Vô thường – Khổ – Vô ngã cơ bản',   level: 'Cơ bản',    topic: 'Chủ Đề',   score: 7,  total: 10, percent: 70,  passed: true,  date: '11/04/2024', duration: 22 },
  { id: 3,  userId: 4, userName: 'Pháp Hạnh', email: 'phaph@gmail.com',    quizId: 2, quizTitle: 'Tứ niệm xứ nâng cao',               level: 'Trung cấp', topic: 'Chủ Đề',   score: 5,  total: 15, percent: 50,  passed: false, date: '12/04/2024', duration: 35 },
  { id: 4,  userId: 2, userName: 'Minh Tâm',  email: 'minhtam@gmail.com',  quizId: 6, quizTitle: 'Thiền chỉ (Samatha) cơ bản',        level: 'Cơ bản',    topic: 'Thiền',    score: 8,  total: 10, percent: 80,  passed: true,  date: '13/04/2024', duration: 27 },
  { id: 5,  userId: 8, userName: 'Huệ Tâm',   email: 'huetam@gmail.com',   quizId: 2, quizTitle: 'Tứ niệm xứ nâng cao',               level: 'Trung cấp', topic: 'Chủ Đề',   score: 10, total: 15, percent: 100, passed: true,  date: '14/04/2024', duration: 15 },
  { id: 6,  userId: 5, userName: 'Diệu Hạnh', email: 'dieuhanh@gmail.com', quizId: 1, quizTitle: 'Vô thường – Khổ – Vô ngã cơ bản',   level: 'Cơ bản',    topic: 'Chủ Đề',   score: 6,  total: 10, percent: 60,  passed: true,  date: '15/04/2024', duration: 30 },
  { id: 7,  userId: 6, userName: 'Từ Bi',      email: 'tubi@gmail.com',     quizId: 4, quizTitle: 'Trường Bộ Kinh – Đại kinh',         level: 'Nâng cao',  topic: 'Kinh',     score: 4,  total: 8,  percent: 50,  passed: false, date: '16/04/2024', duration: 42 },
  { id: 8,  userId: 1, userName: 'Admin',      email: 'admin@phatphap.vn',  quizId: 5, quizTitle: 'Thập nhị nhân duyên chuyên sâu',    level: 'Nâng cao',  topic: 'Chủ Đề',   score: 9,  total: 20, percent: 90,  passed: true,  date: '17/04/2024', duration: 20 },
  { id: 9,  userId: 7, userName: 'Giác Ngộ',  email: 'giacngo@gmail.com',  quizId: 10,quizTitle: 'Cuộc đời Đức Phật Thích Ca',         level: 'Cơ bản',    topic: 'Lịch Sử',  score: 8,  total: 15, percent: 80,  passed: true,  date: '18/04/2024', duration: 24 },
  { id: 10, userId: 3, userName: 'Tuệ Minh',  email: 'tueming@gmail.com',  quizId: 7, quizTitle: 'Thiền quán (Vipassanā) nhập môn',   level: 'Trung cấp', topic: 'Thiền',    score: 7,  total: 12, percent: 70,  passed: true,  date: '19/04/2024', duration: 31 },
  { id: 11, userId: 4, userName: 'Pháp Hạnh', email: 'phaph@gmail.com',    quizId: 7, quizTitle: 'Thiền quán (Vipassanā) nhập môn',   level: 'Trung cấp', topic: 'Thiền',    score: 3,  total: 12, percent: 25,  passed: false, date: '20/04/2024', duration: 45 },
  { id: 12, userId: 8, userName: 'Huệ Tâm',   email: 'huetam@gmail.com',   quizId: 12,quizTitle: 'Trung Bộ Kinh – Kinh Căn Bản Pháp', level: 'Chuyên sâu',topic: 'Kinh',     score: 8,  total: 10, percent: 80,  passed: true,  date: '21/04/2024', duration: 28 },
];

// Sample questions for demo
const SAMPLE_QUESTIONS: Question[] = [
  { id: 1, question: 'Vô thường (Anicca) có nghĩa là gì?', option_a: 'Mọi thứ đều tốt đẹp', option_b: 'Mọi hiện tượng đều thay đổi và không bền vững', option_c: 'Cuộc sống là trường tồn', option_d: 'Chỉ con người mới thay đổi', correct_answer: 1, explanation: 'Vô thường là một trong Ba Pháp Ấn — mọi pháp hữu vi đều sinh diệt, biến đổi không ngừng.' },
  { id: 2, question: 'Khổ (Dukkha) bao gồm mấy loại?', option_a: '2 loại', option_b: '3 loại', option_c: '4 loại', option_d: '5 loại', correct_answer: 1, explanation: 'Khổ gồm 3 loại: Khổ khổ (đau đớn trực tiếp), Hoại khổ (khổ do biến đổi) và Hành khổ (khổ vi tế do sự sinh diệt).' },
  { id: 3, question: 'Vô ngã (Anattā) phủ nhận điều gì?', option_a: 'Phủ nhận sự tồn tại của thế giới', option_b: 'Phủ nhận ý nghĩa của cuộc sống', option_c: 'Phủ nhận sự tồn tại của một bản ngã thường hằng, bất biến', option_d: 'Phủ nhận nghiệp báo', correct_answer: 2, explanation: 'Vô ngã là giáo lý riêng biệt của Phật giáo — không có một "bản thân" hay "linh hồn" cố định, thường hằng.' },
];

type Tab = 'dashboard' | 'quizzes' | 'results' | 'users';

// ─── Question Form Component ──────────────────────────────────────────────────
function QuestionForm({
  question, index, onSave, onCancel,
}: {
  question: Partial<Question>;
  index: number;
  onSave: (q: Question) => void;
  onCancel: () => void;
}) {
  const [q, setQ] = useState<Partial<Question>>({ correct_answer: 0, ...question });
  const opts: Array<keyof Question> = ['option_a', 'option_b', 'option_c', 'option_d'];
  const labels = ['A', 'B', 'C', 'D'];

  const isValid = q.question?.trim() && q.option_a?.trim() && q.option_b?.trim() && q.option_c?.trim() && q.option_d?.trim();

  return (
    <div className="rounded-xl p-4 border-2 space-y-3" style={{ borderColor: '#D4A01755', background: 'rgba(212,160,23,0.04)' }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#D4A017,#B8860B)' }}>{index + 1}</span>
        <span className="text-xs font-semibold" style={{ color: 'var(--text-medium)' }}>Câu hỏi {index + 1}</span>
      </div>

      {/* Question text */}
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-dark)' }}>Nội dung câu hỏi *</label>
        <textarea rows={2} value={q.question ?? ''} onChange={(e) => setQ({ ...q, question: e.target.value })}
          placeholder="Nhập nội dung câu hỏi..."
          className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none resize-none"
          style={{ border: '1.5px solid rgba(212,160,23,0.3)', background: 'rgba(253,246,227,0.6)', color: 'var(--text-dark)' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.3)'; }}
        />
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-2">
        {opts.map((opt, i) => (
          <div key={opt} className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: q.correct_answer === i ? '#D4A017' : 'rgba(212,160,23,0.15)', color: q.correct_answer === i ? '#fff' : '#B8860B', fontSize: 9 }}>
              {labels[i]}
            </span>
            <input
              value={(q[opt] as string) ?? ''}
              onChange={(e) => setQ({ ...q, [opt]: e.target.value })}
              placeholder={`Đáp án ${labels[i]}...`}
              className="w-full pl-8 pr-3 py-2 rounded-xl text-xs focus:outline-none"
              style={{
                border: q.correct_answer === i ? '1.5px solid #D4A017' : '1.5px solid rgba(212,160,23,0.2)',
                background: q.correct_answer === i ? 'rgba(212,160,23,0.1)' : 'rgba(253,246,227,0.5)',
                color: 'var(--text-dark)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
              onBlur={(e) => { if (q.correct_answer !== i) e.currentTarget.style.borderColor = 'rgba(212,160,23,0.2)'; }}
            />
          </div>
        ))}
      </div>

      {/* Correct answer */}
      <div>
        <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>Đáp án đúng *</label>
        <div className="flex gap-2">
          {labels.map((lbl, i) => (
            <button key={i} type="button" onClick={() => setQ({ ...q, correct_answer: i })}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all"
              style={q.correct_answer === i
                ? { background: '#D4A017', borderColor: '#D4A017', color: '#fff' }
                : { background: 'transparent', borderColor: 'rgba(212,160,23,0.3)', color: 'var(--text-medium)' }}>
              {q.correct_answer === i && <CheckCircle2 size={11} />}
              {lbl}
            </button>
          ))}
        </div>
      </div>

      {/* Explanation */}
      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-dark)' }}>Giải thích đáp án (tuỳ chọn)</label>
        <textarea rows={2} value={q.explanation ?? ''} onChange={(e) => setQ({ ...q, explanation: e.target.value })}
          placeholder="Giải thích tại sao đáp án này đúng..."
          className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none resize-none"
          style={{ border: '1.5px solid rgba(212,160,23,0.2)', background: 'rgba(253,246,227,0.4)', color: 'var(--text-dark)' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.2)'; }}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{ border: '1.5px solid rgba(212,160,23,0.25)', color: 'var(--text-medium)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
          Hủy
        </button>
        <button onClick={() => { if (isValid) onSave(q as Question); }}
          disabled={!isValid}
          className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          style={isValid
            ? { background: 'linear-gradient(135deg,#D4A017,#B8860B)', color: '#fff', boxShadow: '0 2px 10px rgba(184,134,11,0.35)' }
            : { background: 'rgba(212,160,23,0.2)', color: 'rgba(184,134,11,0.5)', cursor: 'not-allowed' }}>
          <Save size={12} /> Lưu câu hỏi
        </button>
      </div>
    </div>
  );
}

// ─── Question Card (collapsed) ────────────────────────────────────────────────
function QuestionCard({ q, index, onEdit, onDelete }: { q: Question; index: number; onEdit: () => void; onDelete: () => void }) {
  const labels = ['A', 'B', 'C', 'D'];
  const opts = [q.option_a, q.option_b, q.option_c, q.option_d];

  return (
    <div className="rounded-xl p-3.5 border transition-all group"
      style={{ borderColor: 'rgba(212,160,23,0.18)', background: 'rgba(253,246,227,0.35)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,160,23,0.4)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,160,23,0.18)'; }}
    >
      <div className="flex items-start gap-2.5">
        <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
          style={{ background: 'linear-gradient(135deg,#D4A017,#B8860B)' }}>{index + 1}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold mb-2 leading-snug" style={{ color: 'var(--text-dark)' }}>{q.question}</p>
          <div className="grid grid-cols-2 gap-1">
            {opts.map((opt, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                  style={{ background: q.correct_answer === i ? '#D4A017' : 'rgba(212,160,23,0.12)', color: q.correct_answer === i ? '#fff' : '#B8860B' }}>
                  {labels[i]}
                </span>
                <span className={cn('text-[10px] truncate', q.correct_answer === i ? 'font-semibold' : '')}
                  style={{ color: q.correct_answer === i ? '#B8860B' : 'var(--text-medium)' }}>{opt}</span>
                {q.correct_answer === i && <CheckCircle2 size={10} style={{ color: '#1A9362', flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} title="Sửa" className="p-1.5 rounded-lg transition-all"
            style={{ color: '#B8860B' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(184,134,11,0.12)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
            <Pencil size={13} />
          </button>
          <button onClick={onDelete} title="Xóa" className="p-1.5 rounded-lg transition-all"
            style={{ color: '#DC2626' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Quiz Modal ───────────────────────────────────────────────────────────────
function QuizModal({
  quiz, onClose, onSave,
}: {
  quiz?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [tab, setTab] = useState<'info' | 'questions'>(quiz?._openTab ?? 'info');

  // Find initial parent from sub-topic
  const initParent = () => {
    if (!quiz?.topic_id) return mockTopics[0].id;
    const sub = allSubTopics.find((s) => s.id === quiz.topic_id);
    return sub ? sub.parent_id : mockTopics[0].id;
  };

  const [parentId, setParentId] = useState<number>(initParent);
  const subTopicsForParent = mockTopics.find((t) => t.id === parentId)?.children ?? [];
  const initSubTopic = () => {
    if (quiz?.topic_id && allSubTopics.find((s) => s.id === quiz.topic_id)) return quiz.topic_id;
    return subTopicsForParent[0]?.id ?? allSubTopics[0]?.id;
  };

  const [form, setForm] = useState({
    title: quiz?.title ?? '',
    description: quiz?.description ?? '',
    topic_id: initSubTopic(),
    level: quiz?.level ?? 'Cơ bản',
    time_limit: quiz?.time_limit ?? 30,
  });

  // Update sub-topic when parent changes
  const handleParentChange = (newParentId: number) => {
    setParentId(newParentId);
    const subs = mockTopics.find((t) => t.id === newParentId)?.children ?? [];
    setForm((prev) => ({ ...prev, topic_id: subs[0]?.id ?? prev.topic_id }));
  };

  // Questions state — fetch from API for existing quizzes, empty for new ones
  const [questions, setQuestions] = useState<Question[]>(quiz?.questions ?? []);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  // Fetch real questions when opening an existing quiz
  useEffect(() => {
    if (!quiz?.id) return;
    setQuestionsLoading(true);
    fetch(`${API_BASE}/quizzes/${quiz.id}/questions`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setQuestions(data);
      })
      .catch(() => {/* keep existing questions */})
      .finally(() => setQuestionsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz?.id]);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [addingNew, setAddingNew] = useState(false);

  const handleSaveQuestion = (idx: number, updated: Question) => {
    setQuestions(questions.map((q, i) => i === idx ? { ...updated, id: q.id } : q));
    setEditingIdx(null);
  };
  const handleAddQuestion = (q: Question) => {
    const newId = questions.length > 0 ? Math.max(...questions.map((q) => q.id)) + 1 : 1;
    setQuestions([...questions, { ...q, id: newId }]);
    setAddingNew(false);
  };
  const handleDeleteQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
    if (editingIdx === idx) setEditingIdx(null);
  };

  const handleSave = () => {
    const subTopic = allSubTopics.find((s) => s.id === form.topic_id);
    onSave({
      ...form,
      topic_name: subTopic?.name ?? '',
      topic_icon: subTopic?.icon ?? '📖',
      topic_color: subTopic?.color ?? '#D4A017',
      question_count: questions.length > 0 ? questions.length : form.time_limit,
      questions,
    });
    onClose();
  };

  const parentColor = mockTopics.find((t) => t.id === parentId)?.color ?? '#D4A017';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        className="relative w-full max-w-2xl rounded-2xl z-10 flex flex-col"
        style={{
          background: '#FFFDF7',
          border: '1px solid rgba(212,160,23,0.25)',
          boxShadow: '0 32px 80px rgba(42,21,5,0.25)',
          maxHeight: '90vh',
        }}
      >
        {/* Top ornament */}
        <div className="absolute top-0 left-8 right-8 h-px" style={{ background: 'linear-gradient(90deg,transparent,#D4A017,transparent)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(212,160,23,0.12)' }}>
          <div>
            <h2 className="font-bold text-base" style={{ fontFamily: "'Philosopher', serif", color: 'var(--text-dark)' }}>
              {quiz ? '✏️ Chỉnh sửa bài thi' : '➕ Thêm bài thi mới'}
            </h2>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-light)' }}>
              {questions.length} câu hỏi · {form.time_limit} phút
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl transition-colors" style={{ color: 'var(--text-medium)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-6 pt-3 flex-shrink-0">
          {[
            { key: 'info', label: 'Thông tin đề thi', icon: AlignLeft },
            { key: 'questions', label: `Câu hỏi (${questions.length})`, icon: ListOrdered },
          ].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setTab(key as 'info' | 'questions')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={tab === key
                ? { background: 'linear-gradient(135deg,#D4A017,#B8860B)', color: '#fff', boxShadow: '0 2px 8px rgba(184,134,11,0.3)' }
                : { background: 'rgba(212,160,23,0.08)', color: 'var(--text-medium)' }}>
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4" style={{ scrollbarWidth: 'thin' }}>
          <AnimatePresence mode="wait">

            {/* ── Tab: Thông tin ── */}
            {tab === 'info' && (
              <motion.div key="info" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>
                    Tên bài thi *
                  </label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="VD: Vô thường – Khổ – Vô ngã cơ bản"
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ border: '1.5px solid rgba(212,160,23,0.3)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.3)'; }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>
                    Mô tả (tuỳ chọn)
                  </label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Mô tả ngắn về nội dung và mục tiêu của bài thi..."
                    rows={2}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none resize-none"
                    style={{ border: '1.5px solid rgba(212,160,23,0.3)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.3)'; }}
                  />
                </div>

                {/* Topic cascade */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>
                      <Tag size={11} className="inline mr-1" />Nhóm chủ đề
                    </label>
                    <select value={parentId} onChange={(e) => handleParentChange(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                      style={{ border: '1.5px solid rgba(212,160,23,0.3)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' }}>
                      {mockTopics.map((t) => (
                        <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>
                      Chủ đề con *
                    </label>
                    <select value={form.topic_id} onChange={(e) => setForm({ ...form, topic_id: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                      style={{ border: `1.5px solid ${parentColor}50`, background: `${parentColor}0A`, color: 'var(--text-dark)' }}>
                      {subTopicsForParent.map((s) => (
                        <option key={s.id} value={s.id}>{s.icon} {s.name.split('(')[0].trim()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Level + Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>Trình độ</label>
                    <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                      style={{ border: '1.5px solid rgba(212,160,23,0.3)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' }}>
                      {LEVELS.map((l) => <option key={l.name} value={l.name}>{l.icon} {l.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>
                      <Clock size={11} className="inline mr-1" />Thời gian (phút)
                    </label>
                    <input type="number" min={5} max={180} value={form.time_limit}
                      onChange={(e) => setForm({ ...form, time_limit: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
                      style={{ border: '1.5px solid rgba(212,160,23,0.3)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.3)'; }}
                    />
                  </div>
                </div>

                {/* Info box */}
                <div className="rounded-xl p-3 flex items-start gap-2.5"
                  style={{ background: 'rgba(212,160,23,0.07)', border: '1px solid rgba(212,160,23,0.18)' }}>
                  <HelpCircle size={14} style={{ color: '#B8860B', flexShrink: 0, marginTop: 1 }} />
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-medium)' }}>
                    Số câu hỏi sẽ tự động tính từ tab <strong>Câu hỏi</strong>. Chuyển sang tab Câu hỏi để thêm câu hỏi trắc nghiệm.
                  </p>
                </div>
              </motion.div>
            )}

            {/* ── Tab: Câu hỏi ── */}
            {tab === 'questions' && (
              <motion.div key="questions" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
                {/* Loading state */}
                {questionsLoading && (
                  <div className="text-center py-10" style={{ color: 'var(--text-medium)' }}>
                    <div className="text-3xl mb-3 animate-pulse">📖</div>
                    <p className="text-sm">Đang tải câu hỏi từ cơ sở dữ liệu...</p>
                  </div>
                )}
                {!questionsLoading && (
                <>{/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ListOrdered size={14} style={{ color: '#B8860B' }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>
                      {questions.length} câu hỏi
                    </span>
                    {questions.length > 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(26,147,98,0.12)', color: '#1A9362' }}>
                        Đủ nội dung thi
                      </span>
                    )}
                  </div>
                  {!addingNew && (
                    <button
                      onClick={() => { setAddingNew(true); setEditingIdx(null); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                      style={{ background: 'linear-gradient(135deg,#D4A017,#B8860B)', color: '#fff', boxShadow: '0 2px 8px rgba(184,134,11,0.3)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 14px rgba(184,134,11,0.45)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(184,134,11,0.3)'; }}>
                      <Plus size={13} /> Thêm câu hỏi
                    </button>
                  )}
                </div>

                {/* Empty state */}
                {questions.length === 0 && !addingNew && (
                  <div className="text-center py-10 rounded-xl" style={{ border: '2px dashed rgba(212,160,23,0.25)', background: 'rgba(212,160,23,0.03)' }}>
                    <div className="text-4xl mb-3">📝</div>
                    <p className="font-semibold text-sm" style={{ color: 'var(--text-dark)' }}>Chưa có câu hỏi nào</p>
                    <p className="text-xs mt-1 mb-4" style={{ color: 'var(--text-medium)' }}>Bấm nút bên trên để thêm câu hỏi trắc nghiệm</p>
                    <button onClick={() => setAddingNew(true)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
                      style={{ background: 'linear-gradient(135deg,#D4A017,#B8860B)' }}>
                      <Plus size={13} /> Thêm câu hỏi đầu tiên
                    </button>
                  </div>
                )}

                {/* Question list */}
                <div className="space-y-2.5">
                  {questions.map((q, i) => (
                    editingIdx === i ? (
                      <QuestionForm key={i} question={q} index={i}
                        onSave={(updated) => handleSaveQuestion(i, updated)}
                        onCancel={() => setEditingIdx(null)}
                      />
                    ) : (
                      <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                        <QuestionCard q={q} index={i}
                          onEdit={() => { setEditingIdx(i); setAddingNew(false); }}
                          onDelete={() => handleDeleteQuestion(i)}
                        />
                      </motion.div>
                    )
                  ))}

                  {/* New question form */}
                  {addingNew && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      <QuestionForm
                        question={{ correct_answer: 0 }}
                        index={questions.length}
                        onSave={handleAddQuestion}
                        onCancel={() => setAddingNew(false)}
                      />
                    </motion.div>
                  )}
                </div>
                </>)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(212,160,23,0.12)' }}>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ border: '1.5px solid rgba(212,160,23,0.3)', color: 'var(--text-medium)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.06)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
            Hủy
          </button>
          <button onClick={handleSave} disabled={!form.title.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
            style={form.title.trim()
              ? { background: 'linear-gradient(135deg,#D4A017,#B8860B)', color: '#fff', boxShadow: '0 2px 12px rgba(184,134,11,0.35)' }
              : { background: 'rgba(212,160,23,0.2)', color: 'rgba(184,134,11,0.5)', cursor: 'not-allowed' }}>
            <Save size={15} />
            {quiz ? 'Lưu thay đổi' : 'Tạo bài thi'}
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
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
        className="relative w-full max-w-sm rounded-2xl p-6 z-10 text-center"
        style={{ background: '#FFFDF7', border: '1px solid rgba(220,38,38,0.2)', boxShadow: '0 24px 64px rgba(42,21,5,0.2)' }}>
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <h3 className="font-bold text-base mb-2" style={{ fontFamily: "'Philosopher', serif", color: 'var(--text-dark)' }}>Xác nhận xóa</h3>
        <p className="text-sm mb-5" style={{ color: 'var(--text-medium)' }}>
          Bạn có chắc muốn xóa <span className="font-semibold" style={{ color: 'var(--text-dark)' }}>"{name}"</span>?
          <br /><span className="text-xs text-red-500">Hành động này không thể hoàn tác.</span>
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
  const { user, logout, token } = useApp();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  // Chỉ render theme-sensitive UI sau khi mount (tránh hydration mismatch)
  useEffect(() => setMounted(true), []);

  // Quiz state — loaded from API
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [quizzesLoading, setQuizzesLoading] = useState(true);

  // Fetch quizzes from backend on mount
  useEffect(() => {
    fetch(`${API_BASE}/quizzes`)
      .then((r) => r.json())
      .then((data) => {
        // Normalize: ensure questions array is always present
        setQuizzes(Array.isArray(data) ? data.map((q: any) => ({ ...q, questions: q.questions ?? [] })) : []);
      })
      .catch(() => setQuizzes([]))
      .finally(() => setQuizzesLoading(false));
  }, []);

  const [showQuizModal, setShowQuizModal]   = useState(false);
  const [editingQuiz, setEditingQuiz]       = useState<any>(null);
  const [deletingQuiz, setDeletingQuiz]     = useState<any>(null);
  const [quizSearch, setQuizSearch]         = useState('');
  const [quizLevelFilter, setQuizLevelFilter] = useState('');
  const [quizTopicFilter, setQuizTopicFilter] = useState<number | null>(null);

  // Results / Users
  const [results]          = useState(mockResults);
  const [resultSearch, setResultSearch]           = useState('');
  const [resultQuizFilter, setResultQuizFilter]   = useState('');
  const [resultPassFilter, setResultPassFilter]   = useState<'all' | 'passed' | 'failed'>('all');
  const [userSearch, setUserSearch]               = useState('');

  // Filtered
  const filteredQuizzes = useMemo(() => quizzes.filter((q) => {
    if (quizSearch && !q.title.toLowerCase().includes(quizSearch.toLowerCase())) return false;
    if (quizLevelFilter && q.level !== quizLevelFilter) return false;
    if (quizTopicFilter) {
      const parent = mockTopics.find((t) => t.id === quizTopicFilter);
      const childIds = parent?.children?.map((c) => c.id) ?? [];
      if (!childIds.includes(q.topic_id) && q.topic_id !== quizTopicFilter) return false;
    }
    return true;
  }), [quizzes, quizSearch, quizLevelFilter, quizTopicFilter]);

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

  const totalAttempts = results.length;
  const passRate = Math.round((results.filter((r) => r.passed).length / totalAttempts) * 100);
  const avgScore = Math.round(results.reduce((s, r) => s + r.percent, 0) / totalAttempts);

  const dashboardStats = [
    { label: 'Học viên',   value: mockUsers.length,     sub: '+2 tuần này',                          icon: Users,       color: '#1A9362', trend: true },
    { label: 'Bài thi',    value: quizzes.length,        sub: `${quizzes.reduce((s, q) => s + (q.questions?.length || q.question_count), 0)} câu hỏi`, icon: BookOpen, color: '#B8860B', trend: true },
    { label: 'Lượt thi',   value: totalAttempts,         sub: '+3 hôm nay',                           icon: ClipboardList,color: '#EA6C00', trend: true },
    { label: 'Tỉ lệ đạt', value: `${passRate}%`,        sub: `TB ${avgScore} điểm`,                  icon: BarChart3,   color: '#8B2635', trend: passRate >= 70 },
  ];

  const navItems: { id: Tab; icon: any; label: string; count?: number }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Tổng quan' },
    { id: 'quizzes',   icon: BookOpen,        label: 'Quản lý đề thi', count: quizzes.length },
    { id: 'results',   icon: ClipboardList,   label: 'Kết quả thi',    count: results.length },
    { id: 'users',     icon: Users,           label: 'Người dùng',     count: mockUsers.length },
  ];

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const handleSaveQuiz = async (data: any) => {
    try {
      let savedQuiz: any;

      if (editingQuiz) {
        // Update quiz metadata
        const res = await fetch(`${API_BASE}/quizzes/${editingQuiz.id}`, {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            topic_id: data.topic_id,
            level: data.level,
            time_limit: data.time_limit,
          }),
        });
        savedQuiz = await res.json();
        if (!res.ok) throw new Error(savedQuiz.error || 'Lỗi cập nhật');
      } else {
        // Create new quiz
        const res = await fetch(`${API_BASE}/quizzes`, {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify({
            title: data.title,
            description: data.description,
            topic_id: data.topic_id,
            level: data.level,
            time_limit: data.time_limit,
          }),
        });
        savedQuiz = await res.json();
        if (!res.ok) throw new Error(savedQuiz.error || 'Lỗi tạo bài thi');
      }

      // Save questions (bulk replace)
      if (data.questions !== undefined) {
        const qRes = await fetch(`${API_BASE}/quizzes/${savedQuiz.id}/questions`, {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify({ questions: data.questions }),
        });
        const qData = await qRes.json();
        if (qRes.ok) {
          savedQuiz = {
            ...savedQuiz,
            questions: qData.questions ?? data.questions,
            question_count: (qData.questions ?? data.questions).length,
          };
        }
      }

      // Update local state
      if (editingQuiz) {
        setQuizzes((prev) => prev.map((q) => q.id === editingQuiz.id ? { ...q, ...savedQuiz, questions: savedQuiz.questions ?? q.questions } : q));
      } else {
        setQuizzes((prev) => [{ ...savedQuiz, questions: savedQuiz.questions ?? [] }, ...prev]);
      }
    } catch (err) {
      console.error('handleSaveQuiz error:', err);
      // Fallback: keep optimistic local update even if API fails
      if (editingQuiz) {
        setQuizzes((prev) => prev.map((q) => q.id === editingQuiz.id ? { ...q, ...data } : q));
      } else {
        const newId = quizzes.length > 0 ? Math.max(...quizzes.map((q) => q.id)) + 1 : Date.now();
        setQuizzes((prev) => [{ ...data, id: newId }, ...prev]);
      }
    }
    setEditingQuiz(null);
  };

  const handleDeleteQuiz = async (id: number) => {
    try {
      await fetch(`${API_BASE}/quizzes/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      });
    } catch (err) {
      console.error('handleDeleteQuiz error:', err);
    }
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  // ── Input helper style ──
  const inputStyle = {
    border: '1.5px solid rgba(212,160,23,0.2)',
    background: 'rgba(253,246,227,0.5)',
    color: 'var(--text-dark)',
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)', color: 'var(--text-dark)' }}>

      {/* ── Admin Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-56 min-h-screen fixed left-0 top-0 z-40"
        style={{ background: 'linear-gradient(180deg,#1C0E02 0%,#140900 100%)', borderRight: '1px solid rgba(212,160,23,0.2)', boxShadow: '4px 0 20px rgba(0,0,0,0.3)' }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,#D4A017,transparent)' }} />

        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-14 flex-shrink-0" style={{ borderBottom: '1px solid rgba(212,160,23,0.15)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#D4A017,#B8860B)', boxShadow: '0 0 12px rgba(212,160,23,0.4)' }}>
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
            {navItems.map(({ id, icon: Icon, label, count }) => {
              const isActive = activeTab === id;
              return (
                <li key={id}>
                  <button onClick={() => setActiveTab(id)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
                    style={isActive ? { background: 'linear-gradient(135deg,rgba(212,160,23,0.9),rgba(184,134,11,0.9))', boxShadow: '0 2px 10px rgba(184,134,11,0.4)' } : {}}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = ''; }}>
                    <Icon size={16} style={{ color: isActive ? '#fff' : 'rgba(212,160,23,0.6)', flexShrink: 0 }} />
                    <span className="text-sm font-medium flex-1" style={{ color: isActive ? '#fff' : 'rgba(253,246,227,0.65)' }}>{label}</span>
                    {count !== undefined && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(212,160,23,0.15)', color: isActive ? '#fff' : '#D4A017' }}>
                        {count}
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
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer" style={{ color: 'rgba(253,246,227,0.5)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}>
                <ArrowUpRight size={15} style={{ color: 'rgba(212,160,23,0.5)' }} />
                <span className="text-sm">Về trang chủ</span>
              </div>
            </Link>
            <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all" style={{ color: 'rgba(253,246,227,0.5)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; e.currentTarget.style.color = '#f87171'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(253,246,227,0.5)'; }}>
              <LogOut size={15} style={{ color: 'rgba(220,38,38,0.5)' }} />
              <span className="text-sm">Đăng xuất</span>
            </button>
          </div>
        </nav>

        {/* Admin info */}
        <div className="px-3 pb-4 flex-shrink-0">
          <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.12)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#D4A017,#EA6C00)' }}>
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
        <header className="sticky top-0 z-30 h-14 flex items-center px-6 gap-4"
          style={{ background: 'rgba(253,246,227,0.93)', borderBottom: '1px solid rgba(212,160,23,0.2)', boxShadow: '0 2px 12px rgba(42,21,5,0.05)' }}>
          <div className="flex-1">
            <h1 className="font-bold text-base" style={{ fontFamily: "'Philosopher', serif", color: 'var(--text-dark)' }}>
              {navItems.find((n) => n.id === activeTab)?.label ?? 'Admin'}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl transition-colors" style={{ color: 'var(--text-medium)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
              {mounted ? (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />) : <Moon size={18} />}
            </button>
            <button className="p-2 rounded-xl transition-colors relative" style={{ color: 'var(--text-medium)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400" />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">

            {/* ══ DASHBOARD ══ */}
            {activeTab === 'dashboard' && (
              <motion.div key="dashboard" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {dashboardStats.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} className="card p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: s.color + '15', border: `1px solid ${s.color}25` }}>
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
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="card p-5">
                    <div className="section-header">
                      <h2 className="text-sm">Kết quả thi gần đây</h2>
                      <button onClick={() => setActiveTab('results')} className="text-xs font-medium" style={{ color: '#B8860B' }}>Xem tất cả →</button>
                    </div>
                    <div className="space-y-2.5">
                      {results.slice(0, 5).map((r) => (
                        <div key={r.id} className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: 'linear-gradient(135deg,rgba(212,160,23,0.2),rgba(234,108,0,0.15))', color: '#B8860B' }}>
                            {r.userName.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-dark)' }}>{r.userName}</p>
                            <p className="text-[10px] truncate" style={{ color: 'var(--text-medium)' }}>{r.quizTitle}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold" style={{ color: r.passed ? '#1A9362' : '#DC2626' }}>{r.percent}%</p>
                            <p className="text-[9px]" style={{ color: r.passed ? '#1A9362' : '#DC2626' }}>{r.passed ? '✓ Đạt' : '✗ Trượt'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="card p-5">
                    <div className="section-header"><h2 className="text-sm">Bài thi theo chủ đề</h2></div>
                    <div className="space-y-3">
                      {mockTopics.map((t) => {
                        const cnt = quizzes.filter((q) => t.children?.some((c) => c.id === q.topic_id)).length;
                        return (
                          <div key={t.id} className="flex items-center gap-3">
                            <span className="text-lg w-6 text-center flex-shrink-0">{t.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium truncate" style={{ color: 'var(--text-dark)' }}>{t.name}</span>
                                <span className="text-[10px] ml-2 flex-shrink-0" style={{ color: 'var(--text-light)' }}>{cnt} bài</span>
                              </div>
                              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(212,160,23,0.1)' }}>
                                <div className="h-full rounded-full transition-all duration-700"
                                  style={{ width: `${Math.min(100, (t.question_count / 200) * 100)}%`, background: t.color }} />
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

            {/* ══ QUIZZES ══ */}
            {activeTab === 'quizzes' && (
              <motion.div key="quizzes" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Toolbar */}
                <div className="card p-4 mb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-48">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-medium)' }} />
                      <input value={quizSearch} onChange={(e) => setQuizSearch(e.target.value)}
                        placeholder="Tìm bài thi..."
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-xl focus:outline-none" style={inputStyle}
                        onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.2)'; }} />
                      {quizSearch && <button onClick={() => setQuizSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2"><X size={13} style={{ color: 'var(--text-medium)' }} /></button>}
                    </div>

                    {/* Level filter */}
                    <div className="flex gap-1.5 flex-wrap">
                      <button onClick={() => setQuizLevelFilter('')}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                        style={!quizLevelFilter ? { background: 'linear-gradient(135deg,#D4A017,#B8860B)', color: '#fff' } : { background: 'rgba(212,160,23,0.08)', color: 'var(--text-medium)' }}>
                        Tất cả
                      </button>
                      {LEVELS.map((l) => (
                        <button key={l.name} onClick={() => setQuizLevelFilter(quizLevelFilter === l.name ? '' : l.name)}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                          style={quizLevelFilter === l.name ? { background: l.color, color: '#fff' } : { background: 'rgba(212,160,23,0.06)', color: 'var(--text-medium)', border: `1px solid ${l.color}30` }}>
                          {l.icon} {l.name}
                        </button>
                      ))}
                    </div>

                    <button onClick={() => { setEditingQuiz(null); setShowQuizModal(true); }}
                      className="btn-saffron text-sm py-2 px-4 ml-auto">
                      <Plus size={15} /> Thêm bài thi
                    </button>
                  </div>

                  {/* Topic filter row */}
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    <button onClick={() => setQuizTopicFilter(null)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all"
                      style={!quizTopicFilter ? { background: 'rgba(212,160,23,0.15)', borderColor: '#D4A01750', color: '#B8860B' } : { borderColor: 'rgba(212,160,23,0.2)', color: 'var(--text-medium)' }}>
                      Tất cả chủ đề
                    </button>
                    {mockTopics.map((t) => (
                      <button key={t.id} onClick={() => setQuizTopicFilter(quizTopicFilter === t.id ? null : t.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all"
                        style={quizTopicFilter === t.id
                          ? { background: t.color + '25', borderColor: t.color + '60', color: t.color }
                          : { borderColor: 'rgba(212,160,23,0.15)', color: 'var(--text-medium)' }}>
                        {t.icon} {t.name}
                      </button>
                    ))}
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
                        {quizzesLoading && (
                          <tr><td colSpan={9} className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-medium)' }}>
                            ⏳ Đang tải danh sách bài thi...
                          </td></tr>
                        )}
                        {filteredQuizzes.map((q, i) => {
                          const lvlColor = LEVELS.find((l) => l.name === q.level)?.color ?? '#B8860B';
                          const qResults = results.filter((r) => r.quizId === q.id);
                          const qAvg = qResults.length ? Math.round(qResults.reduce((s, r) => s + r.percent, 0) / qResults.length) : 0;
                          const qCount = q.questions?.length || q.question_count;
                          return (
                            <motion.tr key={q.id}
                              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                              style={{ borderBottom: '1px solid rgba(212,160,23,0.08)' }} className="group"
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(212,160,23,0.04)'; }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}>
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
                              <td className="px-4 py-3">
                                <span className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>{qCount}</span>
                                {qCount > 0 && (
                                  <span className="ml-1 text-[10px]" style={{ color: '#1A9362' }}>✓</span>
                                )}
                              </td>
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
                                <div className="flex items-center gap-1">
                                  {/* Edit questions directly */}
                                  <button
                                    onClick={() => { setEditingQuiz({ ...q, _openTab: 'questions' }); setShowQuizModal(true); }}
                                    className="p-1.5 rounded-lg transition-all" title="Sửa câu hỏi"
                                    style={{ color: '#1A9362' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(26,147,98,0.1)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}>
                                    <ListOrdered size={14} />
                                  </button>
                                  <button
                                    onClick={() => { setEditingQuiz(q); setShowQuizModal(true); }}
                                    className="p-1.5 rounded-lg transition-all" title="Chỉnh sửa"
                                    style={{ color: '#B8860B' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(184,134,11,0.1)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}>
                                    <Pencil size={14} />
                                  </button>
                                  <button onClick={() => setDeletingQuiz(q)}
                                    className="p-1.5 rounded-lg transition-all" title="Xóa"
                                    style={{ color: '#DC2626' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}>
                                    <Trash2 size={14} />
                                  </button>
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
                  <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(212,160,23,0.1)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-medium)' }}>
                      Hiển thị <span className="font-semibold" style={{ color: 'var(--text-dark)' }}>{filteredQuizzes.length}</span> / {quizzes.length} bài thi
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-light)' }}>
                      <span className="text-[#1A9362]">✓</span> = đã có câu hỏi
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ RESULTS ══ */}
            {activeTab === 'results' && (
              <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[
                    { label: 'Tổng lượt thi', value: filteredResults.length,                              icon: ClipboardList, color: '#B8860B' },
                    { label: 'Đạt',            value: filteredResults.filter((r) => r.passed).length,      icon: CheckCircle2,  color: '#1A9362' },
                    { label: 'Không đạt',      value: filteredResults.filter((r) => !r.passed).length,     icon: XCircle,       color: '#DC2626' },
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

                <div className="card p-4 mb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-48">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-medium)' }} />
                      <input value={resultSearch} onChange={(e) => setResultSearch(e.target.value)}
                        placeholder="Tìm theo tên học viên / bài thi..."
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-xl focus:outline-none" style={inputStyle}
                        onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.2)'; }} />
                      {resultSearch && <button onClick={() => setResultSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2"><X size={13} style={{ color: 'var(--text-medium)' }} /></button>}
                    </div>
                    <select value={resultQuizFilter} onChange={(e) => setResultQuizFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl text-sm focus:outline-none" style={{ ...inputStyle, minWidth: 160 }}>
                      <option value="">Tất cả bài thi</option>
                      {Array.from(new Set(results.map((r) => r.quizTitle))).map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <div className="flex gap-1.5">
                      {(['all', 'passed', 'failed'] as const).map((f) => (
                        <button key={f} onClick={() => setResultPassFilter(f)}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                          style={resultPassFilter === f
                            ? { background: f === 'all' ? 'linear-gradient(135deg,#D4A017,#B8860B)' : f === 'passed' ? '#1A9362' : '#DC2626', color: '#fff' }
                            : { background: 'rgba(212,160,23,0.06)', color: 'var(--text-medium)' }}>
                          {f === 'all' ? 'Tất cả' : f === 'passed' ? '✓ Đạt' : '✗ Không đạt'}
                        </button>
                      ))}
                    </div>
                    {(resultSearch || resultQuizFilter || resultPassFilter !== 'all') && (
                      <button onClick={() => { setResultSearch(''); setResultQuizFilter(''); setResultPassFilter('all'); }}
                        className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-xl"
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
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}>
                              <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-light)' }}>{i + 1}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                    style={{ background: 'linear-gradient(135deg,rgba(212,160,23,0.2),rgba(234,108,0,0.15))', color: '#B8860B' }}>
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
                                  style={{ background: lvlColor + '15', color: lvlColor, border: `1px solid ${lvlColor}25` }}>{r.level}</span>
                              </td>
                              <td className="px-4 py-3 text-sm font-bold" style={{ color: 'var(--text-dark)' }}>
                                {r.score}<span className="text-xs font-normal" style={{ color: 'var(--text-light)' }}>/{r.total}</span>
                              </td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-12 h-1.5 rounded-full overflow-hidden flex-shrink-0" style={{ background: 'rgba(212,160,23,0.12)' }}>
                                    <div className="h-full rounded-full" style={{ width: `${r.percent}%`, background: r.percent >= 60 ? '#1A9362' : '#DC2626' }} />
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
                                    : { background: 'rgba(220,38,38,0.1)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.2)' }}>
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
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(212,160,23,0.1)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-medium)' }}>
                      Hiển thị <span className="font-semibold" style={{ color: 'var(--text-dark)' }}>{filteredResults.length}</span> / {results.length} kết quả
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ USERS ══ */}
            {activeTab === 'users' && (
              <motion.div key="users" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="card p-4 mb-4 flex items-center gap-3">
                  <div className="relative flex-1 max-w-xs">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-medium)' }} />
                    <input value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
                      placeholder="Tìm người dùng..."
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-xl focus:outline-none" style={inputStyle}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.2)'; }} />
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
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ''; }}>
                              <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-light)' }}>{i + 1}</td>
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                                    style={{ background: 'linear-gradient(135deg,#D4A017,#EA6C00)', color: '#fff', boxShadow: '0 2px 8px rgba(184,134,11,0.3)' }}>
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
                                ) : <span className="text-xs" style={{ color: 'var(--text-light)' }}>Chưa thi</span>}
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
            onConfirm={() => handleDeleteQuiz(deletingQuiz.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
