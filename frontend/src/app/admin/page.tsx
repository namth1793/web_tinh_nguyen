'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, ClipboardList, Users, LogOut,
  TrendingUp, TrendingDown, Plus, Pencil, Trash2, Search,
  X, CheckCircle2, XCircle, Download, Clock, Star, BarChart3, Shield,
  ArrowUpRight, Bell, Moon, Sun, Save,
  ListOrdered, AlignLeft, Tag, HelpCircle,
  Globe, Loader2, RefreshCw, Home,
} from 'lucide-react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useApp } from '@/context/ThemeContext';
import { useLang } from '@/context/LangContext';
import { mockTopics, allSubTopics } from '@/data/mockData';
import { LEVELS } from '@/constants';
import { cn } from '@/lib/utils';
import type { Question } from '@/types';
import { saveTranslation, loadTranslation, hasTranslation, TRANS_EVENT, type TData, type TQuestion } from '@/i18n/translationStore';

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


type Tab = 'dashboard' | 'quizzes' | 'results' | 'users';

// ─── Question Form Component ──────────────────────────────────────────────────
function QuestionForm({
  question, index, onSave, onCancel, quizType = 'trac_nghiem',
}: {
  question: Partial<Question>;
  index: number;
  onSave: (q: Question) => void;
  onCancel: () => void;
  quizType?: 'trac_nghiem' | 'tu_luan';
}) {
  const { t } = useLang();
  const qf = t.admin.questionForm;
  const isEssay = quizType === 'tu_luan';
  // DB stores 1-indexed (A=1,B=2,C=3,D=4). Form uses 0-indexed (A=0,B=1,C=2,D=3).
  const [q, setQ] = useState<Partial<Question>>(() => {
    const dbIdx = question.correct_answer;
    // Convert 1-indexed DB value to 0-indexed form, default to 0 (A) for new questions
    const formIdx = dbIdx !== undefined && dbIdx > 0 ? dbIdx - 1 : 0;
    return { ...question, correct_answer: formIdx };
  });
  const opts: Array<keyof Question> = ['option_a', 'option_b', 'option_c', 'option_d'];
  const labels = ['A', 'B', 'C', 'D'];

  const isValid = isEssay
    ? q.question?.trim()
    : q.question?.trim() && q.option_a?.trim() && q.option_b?.trim() && q.option_c?.trim() && q.option_d?.trim();

  return (
    <div className="rounded-xl p-4 border-2 space-y-3" style={{ borderColor: '#D4A01755', background: 'rgba(212,160,23,0.04)' }}>
      <div className="flex items-center gap-2 mb-1">
        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#D4A017,#B8860B)' }}>{index + 1}</span>
        <span className="text-xs font-semibold" style={{ color: 'var(--text-medium)' }}>{qf.label} {index + 1}</span>
      </div>

      <div>
        <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-dark)' }}>{qf.contentLabel}</label>
        <textarea rows={2} value={q.question ?? ''} onChange={(e) => setQ({ ...q, question: e.target.value })}
          placeholder={qf.contentPlaceholder}
          className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none resize-none"
          style={{ border: '1.5px solid rgba(212,160,23,0.3)', background: 'rgba(253,246,227,0.6)', color: 'var(--text-dark)' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.3)'; }}
        />
      </div>

      {/* ── Trắc nghiệm: 4 options ── */}
      {!isEssay && (
        <>
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
                  placeholder={`${qf.answerPlaceholder} ${labels[i]}...`}
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

          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>{qf.correctLabel}</label>
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

          <div>
            <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--text-dark)' }}>{qf.explanationLabel}</label>
            <textarea rows={2} value={q.explanation ?? ''} onChange={(e) => setQ({ ...q, explanation: e.target.value })}
              placeholder={qf.explanationPlaceholder}
              className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none resize-none"
              style={{ border: '1.5px solid rgba(212,160,23,0.2)', background: 'rgba(253,246,227,0.4)', color: 'var(--text-dark)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.2)'; }}
            />
          </div>
        </>
      )}

      {/* ── Tự luận: model answer only ── */}
      {isEssay && (
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <label className="text-xs font-semibold" style={{ color: 'var(--text-dark)' }}>Đáp án mẫu / Gợi ý trả lời</label>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold"
              style={{ background: 'rgba(139,92,246,0.1)', color: '#7c3aed' }}>Tự luận</span>
          </div>
          <textarea rows={4} value={q.explanation ?? ''} onChange={(e) => setQ({ ...q, explanation: e.target.value })}
            placeholder="Nhập gợi ý trả lời hoặc đáp án mẫu cho học viên tham khảo..."
            className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none resize-none"
            style={{ border: '1.5px solid rgba(139,92,246,0.3)', background: 'rgba(139,92,246,0.04)', color: 'var(--text-dark)' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(139,92,246,0.3)'; }}
          />
          <p className="text-[10px] mt-1" style={{ color: 'var(--text-light)' }}>
            💡 Học viên sẽ tự so sánh câu trả lời của mình với đáp án mẫu này sau khi hoàn thành
          </p>
        </div>
      )}

      <div className="flex gap-2 pt-1">
        <button onClick={onCancel} className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{ border: '1.5px solid rgba(212,160,23,0.25)', color: 'var(--text-medium)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.06)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
          {qf.cancel}
        </button>
        <button
          onClick={() => {
            if (!isValid) return;
            const saved: Question = isEssay
              ? { ...q as Question, option_a: '', option_b: '', option_c: '', option_d: '', correct_answer: 0 }
              // Convert 0-indexed form value back to 1-indexed for DB (A=1, B=2, C=3, D=4)
              : { ...q as Question, correct_answer: (q.correct_answer ?? 0) + 1 };
            onSave(saved);
          }}
          disabled={!isValid}
          className="flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
          style={isValid
            ? { background: 'linear-gradient(135deg,#D4A017,#B8860B)', color: '#fff', boxShadow: '0 2px 10px rgba(184,134,11,0.35)' }
            : { background: 'rgba(212,160,23,0.2)', color: 'rgba(184,134,11,0.5)', cursor: 'not-allowed' }}>
          <Save size={12} /> {qf.save}
        </button>
      </div>
    </div>
  );
}

// ─── Question Card (collapsed) ────────────────────────────────────────────────
function QuestionCard({ q, index, onEdit, onDelete, quizType = 'trac_nghiem' }: { q: Question; index: number; onEdit: () => void; onDelete: () => void; quizType?: 'trac_nghiem' | 'tu_luan' }) {
  const isEssay = quizType === 'tu_luan' || !q.option_a;
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
          <div className="flex items-center gap-1.5 mb-1.5">
            <p className="text-xs font-semibold leading-snug flex-1" style={{ color: 'var(--text-dark)' }}>{q.question}</p>
            {isEssay && (
              <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold flex-shrink-0"
                style={{ background: 'rgba(139,92,246,0.1)', color: '#7c3aed' }}>✍️ Tự luận</span>
            )}
          </div>
          {!isEssay ? (
            <div className="grid grid-cols-2 gap-1">
              {opts.map((opt, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  {/* DB is 1-indexed: A=1,B=2,C=3,D=4. i is 0-indexed. */}
                  <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0"
                    style={{ background: q.correct_answer - 1 === i ? '#D4A017' : 'rgba(212,160,23,0.12)', color: q.correct_answer - 1 === i ? '#fff' : '#B8860B' }}>
                    {labels[i]}
                  </span>
                  <span className={cn('text-[10px] truncate', q.correct_answer - 1 === i ? 'font-semibold' : '')}
                    style={{ color: q.correct_answer - 1 === i ? '#B8860B' : 'var(--text-medium)' }}>{opt}</span>
                  {q.correct_answer - 1 === i && <CheckCircle2 size={10} style={{ color: '#1A9362', flexShrink: 0 }} />}
                </div>
              ))}
            </div>
          ) : (
            q.explanation && (
              <p className="text-[10px] leading-relaxed line-clamp-2"
                style={{ color: 'var(--text-medium)', fontStyle: 'italic' }}>
                💡 {q.explanation}
              </p>
            )
          )}
        </div>
        <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="p-1.5 rounded-lg transition-all"
            style={{ color: '#B8860B' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(184,134,11,0.12)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
            <Pencil size={13} />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-lg transition-all"
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
function QuizModal({ quiz, onClose, onSave }: { quiz?: any; onClose: () => void; onSave: (data: any) => void }) {
  const { t } = useLang();
  const m = t.admin.modal;
  const [tab, setTab] = useState<'info' | 'questions'>(quiz?._openTab ?? 'info');

  const initParent = () => {
    if (!quiz?.topic_id) return mockTopics[0].id;
    const sub = allSubTopics.find((s) => s.id === quiz.topic_id);
    return sub ? sub.parent_id : mockTopics[0].id;
  };

  const [parentId, setParentId] = useState<number>(initParent);
  const subTopicsForParent = mockTopics.find((tp) => tp.id === parentId)?.children ?? [];
  const initSubTopic = () => {
    if (quiz?.topic_id && allSubTopics.find((s) => s.id === quiz.topic_id)) return quiz.topic_id;
    return subTopicsForParent[0]?.id ?? allSubTopics[0]?.id;
  };

  const [form, setForm] = useState({
    title: quiz?.title ?? '',
    description: quiz?.description ?? '',
    topic_id: initSubTopic(),
    level: quiz?.level ?? 'Cơ bản',
    quiz_type: (quiz?.quiz_type ?? 'trac_nghiem') as 'trac_nghiem' | 'tu_luan',
    time_limit: quiz?.time_limit ?? 30,
  });

  const handleParentChange = (newParentId: number) => {
    setParentId(newParentId);
    const subs = mockTopics.find((tp) => tp.id === newParentId)?.children ?? [];
    setForm((prev) => ({ ...prev, topic_id: subs[0]?.id ?? prev.topic_id }));
  };

  const [questions, setQuestions] = useState<Question[]>(quiz?.questions ?? []);
  const [questionsLoading, setQuestionsLoading] = useState(false);

  useEffect(() => {
    if (!quiz?.id) return;
    setQuestionsLoading(true);
    fetch(`${API_BASE}/quizzes/${quiz.id}/questions`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setQuestions(data); })
      .catch(() => {})
      .finally(() => setQuestionsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quiz?.id]);

  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [addingNew, setAddingNew] = useState(false);

  // Language switcher for viewing translations
  const [viewLang, setViewLang] = useState<'vi' | 'zh-CN' | 'zh-TW'>('vi');
  const [savedTrans, setSavedTrans] = useState<TData | null>(() => loadTranslation(quiz?.id));
  useEffect(() => {
    const refresh = () => setSavedTrans(loadTranslation(quiz?.id));
    window.addEventListener(TRANS_EVENT, refresh);
    return () => window.removeEventListener(TRANS_EVENT, refresh);
  }, [quiz?.id]);

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
      quiz_type: form.quiz_type,
    });
    onClose();
  };

  const parentColor = mockTopics.find((tp) => tp.id === parentId)?.color ?? '#D4A017';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 24 }}
        className="relative w-full max-w-2xl rounded-2xl z-10 flex flex-col"
        style={{ background: '#FFFDF7', border: '1px solid rgba(212,160,23,0.25)', boxShadow: '0 32px 80px rgba(42,21,5,0.25)', maxHeight: '90vh' }}
      >
        <div className="absolute top-0 left-8 right-8 h-px" style={{ background: 'linear-gradient(90deg,transparent,#D4A017,transparent)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(212,160,23,0.12)' }}>
          <div>
            <h2 className="font-bold text-base" style={{ fontFamily: "'Philosopher', serif", color: 'var(--text-dark)' }}>
              {quiz ? m.editTitle : m.addTitle}
            </h2>
            <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-light)' }}>
              {questions.length} {m.questions} · {form.time_limit} {m.minutes}
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
            { key: 'info', label: m.tabInfo, icon: AlignLeft },
            { key: 'questions', label: `${m.tabQuestions} (${questions.length})`, icon: ListOrdered },
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

            {tab === 'info' && (
              <motion.div key="info" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>{m.nameLabel}</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder={m.namePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none"
                    style={{ border: '1.5px solid rgba(212,160,23,0.3)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.3)'; }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>{m.descLabel}</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder={m.descPlaceholder} rows={2}
                    className="w-full px-3.5 py-2.5 rounded-xl text-sm focus:outline-none resize-none"
                    style={{ border: '1.5px solid rgba(212,160,23,0.3)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.3)'; }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>
                      <Tag size={11} className="inline mr-1" />{m.topicGroup}
                    </label>
                    <select value={parentId} onChange={(e) => handleParentChange(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                      style={{ border: '1.5px solid rgba(212,160,23,0.3)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' }}>
                      {mockTopics.map((tp) => (
                        <option key={tp.id} value={tp.id}>{tp.icon} {tp.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>{m.subTopic}</label>
                    <select value={form.topic_id} onChange={(e) => setForm({ ...form, topic_id: Number(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                      style={{ border: `1.5px solid ${parentColor}50`, background: `${parentColor}0A`, color: 'var(--text-dark)' }}>
                      {subTopicsForParent.map((s) => (
                        <option key={s.id} value={s.id}>{s.icon} {s.name.split('(')[0].trim()}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quiz type selector */}
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>Loại đề thi</label>
                  <div className="grid grid-cols-2 gap-2">
                    {([
                      { value: 'trac_nghiem', icon: '📝', label: 'Trắc nghiệm', desc: '4 đáp án A/B/C/D' },
                      { value: 'tu_luan',     icon: '✍️', label: 'Tự luận',     desc: 'Câu hỏi mở' },
                    ] as const).map(({ value, icon, label, desc }) => (
                      <button key={value} type="button"
                        onClick={() => setForm({ ...form, quiz_type: value })}
                        className="p-2.5 rounded-xl border-2 text-left transition-all"
                        style={form.quiz_type === value
                          ? { borderColor: '#D4A017', background: 'rgba(212,160,23,0.1)' }
                          : { borderColor: 'rgba(212,160,23,0.2)', background: 'rgba(253,246,227,0.4)' }}>
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span>{icon}</span>
                          <span className="text-xs font-bold" style={{ color: form.quiz_type === value ? '#B8860B' : 'var(--text-dark)' }}>{label}</span>
                        </div>
                        <p className="text-[10px]" style={{ color: 'var(--text-light)' }}>{desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>{m.level}</label>
                    <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl text-sm focus:outline-none"
                      style={{ border: '1.5px solid rgba(212,160,23,0.3)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' }}>
                      {LEVELS.map((l) => <option key={l.name} value={l.name}>{l.icon} {l.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--text-dark)' }}>
                      <Clock size={11} className="inline mr-1" />{m.timeLabel}
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

                <div className="rounded-xl p-3 flex items-start gap-2.5"
                  style={{ background: 'rgba(212,160,23,0.07)', border: '1px solid rgba(212,160,23,0.18)' }}>
                  <HelpCircle size={14} style={{ color: '#B8860B', flexShrink: 0, marginTop: 1 }} />
                  <p className="text-[11px] leading-relaxed" style={{ color: 'var(--text-medium)' }}>{m.infoText}</p>
                </div>
              </motion.div>
            )}

            {tab === 'questions' && (
              <motion.div key="questions" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>

                {/* ── Language switcher ── */}
                <div className="flex gap-1 mb-4 p-1 rounded-xl"
                  style={{ background: 'rgba(212,160,23,0.06)', border: '1px solid rgba(212,160,23,0.12)' }}>
                  {([
                    { lang: 'vi',    flag: '🇻🇳', label: 'Tiếng Việt', grad: 'linear-gradient(135deg,#D4A017,#B8860B)' },
                    { lang: 'zh-CN', flag: '🇨🇳', label: '简体中文',   grad: 'linear-gradient(135deg,#4285F4,#0ea5e9)' },
                    { lang: 'zh-TW', flag: '🇹🇼', label: '繁體中文',   grad: 'linear-gradient(135deg,#4285F4,#0ea5e9)' },
                  ] as const).map(({ lang, flag, label, grad }) => {
                    const hasTrans = lang !== 'vi' && !!savedTrans?.[lang as LangKey];
                    return (
                      <button key={lang} onClick={() => setViewLang(lang)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative"
                        style={viewLang === lang
                          ? { background: grad, color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }
                          : { color: 'var(--text-medium)' }}>
                        {flag} {label}
                        {hasTrans && (
                          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border border-white"
                            style={{ background: '#1A9362' }} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* ── Loading ── */}
                {questionsLoading && (
                  <div className="text-center py-10" style={{ color: 'var(--text-medium)' }}>
                    <div className="text-3xl mb-3 animate-pulse">📖</div>
                    <p className="text-sm">{m.loadingQuestions}</p>
                  </div>
                )}

                {/* ── TIẾNG VIỆT tab — editable ── */}
                {!questionsLoading && viewLang === 'vi' && (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <ListOrdered size={14} style={{ color: '#B8860B' }} />
                        <span className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>
                          {questions.length} {m.questionCount}
                        </span>
                        {questions.length > 0 && (
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(26,147,98,0.12)', color: '#1A9362' }}>
                            {m.readyBadge}
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
                          <Plus size={13} /> {m.addQuestion}
                        </button>
                      )}
                    </div>

                    {questions.length === 0 && !addingNew && (
                      <div className="text-center py-10 rounded-xl" style={{ border: '2px dashed rgba(212,160,23,0.25)', background: 'rgba(212,160,23,0.03)' }}>
                        <div className="text-4xl mb-3">📝</div>
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-dark)' }}>{m.emptyTitle}</p>
                        <p className="text-xs mt-1 mb-4" style={{ color: 'var(--text-medium)' }}>{m.emptyHint}</p>
                        <button onClick={() => setAddingNew(true)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
                          style={{ background: 'linear-gradient(135deg,#D4A017,#B8860B)' }}>
                          <Plus size={13} /> {m.addFirst}
                        </button>
                      </div>
                    )}

                    <div className="space-y-2.5">
                      {questions.map((q, i) => (
                        editingIdx === i ? (
                          <QuestionForm key={i} question={q} index={i} quizType={form.quiz_type}
                            onSave={(updated) => handleSaveQuestion(i, updated)}
                            onCancel={() => setEditingIdx(null)}
                          />
                        ) : (
                          <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                            <QuestionCard q={q} index={i} quizType={form.quiz_type}
                              onEdit={() => { setEditingIdx(i); setAddingNew(false); }}
                              onDelete={() => handleDeleteQuestion(i)}
                            />
                          </motion.div>
                        )
                      ))}
                      {addingNew && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                          <QuestionForm
                            question={{ correct_answer: 0 }}
                            index={questions.length}
                            quizType={form.quiz_type}
                            onSave={handleAddQuestion}
                            onCancel={() => setAddingNew(false)}
                          />
                        </motion.div>
                      )}
                      {!addingNew && questions.length > 0 && editingIdx === null && (
                        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                          <button
                            onClick={() => { setAddingNew(true); setEditingIdx(null); }}
                            className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border-2 border-dashed"
                            style={{ borderColor: 'rgba(212,160,23,0.35)', color: '#B8860B', background: 'rgba(212,160,23,0.04)' }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; e.currentTarget.style.borderColor = '#D4A017'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.04)'; e.currentTarget.style.borderColor = 'rgba(212,160,23,0.35)'; }}
                          >
                            <Plus size={13} /> Thêm câu hỏi tiếp theo
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </>
                )}

                {/* ── CHINESE tabs — read-only view ── */}
                {!questionsLoading && viewLang !== 'vi' && (() => {
                  const langData = savedTrans?.[viewLang as LangKey];
                  const optKeys = ['option_a','option_b','option_c','option_d'] as const;
                  const optLabels = ['A','B','C','D'];

                  if (!langData) {
                    return (
                      <div className="text-center py-10 rounded-xl"
                        style={{ border: '2px dashed rgba(66,133,244,0.2)', background: 'rgba(66,133,244,0.03)' }}>
                        <div className="text-4xl mb-3">🌐</div>
                        <p className="font-semibold text-sm mb-1" style={{ color: 'var(--text-dark)' }}>
                          Chưa có bản dịch {viewLang === 'zh-CN' ? '简体中文' : '繁體中文'}
                        </p>
                        <p className="text-xs mb-4" style={{ color: 'var(--text-medium)' }}>
                          Nhấn nút <strong>🌐</strong> trong danh sách bộ đề để dịch bộ đề này sang 2 ngôn ngữ
                        </p>
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{ background: 'rgba(66,133,244,0.1)', color: '#4285F4', border: '1px solid rgba(66,133,244,0.2)' }}>
                          <Globe size={12} /> Đóng modal → chọn bộ đề → nhấn 🌐
                        </div>
                      </div>
                    );
                  }

                  return (
                    <>
                      {/* Header info */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Globe size={14} style={{ color: '#4285F4' }} />
                          <span className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>
                            {langData.questions.length} câu hỏi
                          </span>
                          <span className="text-xs px-2 py-0.5 rounded-full"
                            style={{ background: 'rgba(66,133,244,0.1)', color: '#4285F4', border: '1px solid rgba(66,133,244,0.15)' }}>
                            {viewLang === 'zh-CN' ? '简体中文' : '繁體中文'}
                          </span>
                        </div>
                        <span className="text-[10px] px-2 py-1 rounded-lg"
                          style={{ background: 'rgba(212,160,23,0.08)', color: 'var(--text-light)' }}>
                          Chỉ xem · Chỉnh sửa qua nút 🌐
                        </span>
                      </div>

                      {/* Translated title */}
                      <div className="rounded-xl p-3 mb-3"
                        style={{ background: 'rgba(66,133,244,0.05)', border: '1px solid rgba(66,133,244,0.15)' }}>
                        <p className="text-[9px] font-bold mb-0.5" style={{ color: '#4285F4' }}>TÊN BỘ ĐỀ</p>
                        <p className="text-[10px] italic mb-1" style={{ color: 'var(--text-light)' }}>🇻🇳 {quiz?.title}</p>
                        <p className="text-sm font-semibold" style={{ color: 'var(--text-dark)' }}>{langData.title}</p>
                      </div>

                      {/* Translated questions */}
                      <div className="space-y-3">
                        {langData.questions.map((tq, qi) => {
                          const orig = questions[qi];
                          // DB is 1-indexed; convert to 0-indexed for comparison with oi
                          const corr = orig?.correct_answer != null ? orig.correct_answer - 1 : -1;
                          return (
                            <div key={qi} className="rounded-xl p-3.5 border"
                              style={{ borderColor: 'rgba(66,133,244,0.18)', background: 'rgba(66,133,244,0.03)' }}>
                              {/* Number + question */}
                              <div className="flex items-start gap-2.5 mb-3">
                                <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
                                  style={{ background: 'linear-gradient(135deg,#4285F4,#0ea5e9)' }}>{qi + 1}</span>
                                <div className="flex-1 min-w-0">
                                  {orig && (
                                    <p className="text-[9px] italic mb-1 leading-relaxed" style={{ color: 'var(--text-light)' }}>
                                      🇻🇳 {orig.question}
                                    </p>
                                  )}
                                  <p className="text-xs font-semibold leading-snug" style={{ color: 'var(--text-dark)' }}>
                                    {tq.question}
                                  </p>
                                </div>
                              </div>

                              {/* Options */}
                              <div className="grid grid-cols-2 gap-1.5 mb-2">
                                {optKeys.map((opt, oi) => {
                                  const isCorrect = corr === oi;
                                  return (
                                    <div key={opt} className="flex items-start gap-1.5 p-2 rounded-lg"
                                      style={{
                                        background: isCorrect ? 'rgba(26,147,98,0.1)' : 'rgba(212,160,23,0.05)',
                                        border: `1px solid ${isCorrect ? 'rgba(26,147,98,0.3)' : 'rgba(212,160,23,0.15)'}`,
                                      }}>
                                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 mt-0.5"
                                        style={{
                                          background: isCorrect ? '#1A9362' : 'rgba(212,160,23,0.15)',
                                          color: isCorrect ? '#fff' : '#B8860B',
                                        }}>
                                        {optLabels[oi]}
                                      </span>
                                      <div className="flex-1 min-w-0">
                                        {orig && (
                                          <p className="text-[8px] italic leading-tight mb-0.5" style={{ color: 'var(--text-light)' }}>
                                            {orig[opt]}
                                          </p>
                                        )}
                                        <p className={cn('text-[10px] leading-tight', isCorrect ? 'font-semibold' : '')}
                                          style={{ color: isCorrect ? '#1A9362' : 'var(--text-dark)' }}>
                                          {tq[opt]}
                                        </p>
                                      </div>
                                      {isCorrect && <CheckCircle2 size={11} style={{ color: '#1A9362', flexShrink: 0, marginTop: 2 }} />}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Explanation */}
                              {tq.explanation && (
                                <div className="rounded-lg p-2 mt-1"
                                  style={{ background: 'rgba(66,133,244,0.07)', border: '1px solid rgba(66,133,244,0.15)' }}>
                                  {orig?.explanation && (
                                    <p className="text-[8px] italic mb-0.5" style={{ color: 'var(--text-light)' }}>
                                      🇻🇳 {orig.explanation}
                                    </p>
                                  )}
                                  <p className="text-[10px] leading-relaxed" style={{ color: 'var(--text-medium)' }}>
                                    💡 {tq.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}

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
            {m.cancel}
          </button>
          <button onClick={handleSave} disabled={!form.title.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
            style={form.title.trim()
              ? { background: 'linear-gradient(135deg,#D4A017,#B8860B)', color: '#fff', boxShadow: '0 2px 12px rgba(184,134,11,0.35)' }
              : { background: 'rgba(212,160,23,0.2)', color: 'rgba(184,134,11,0.5)', cursor: 'not-allowed' }}>
            <Save size={15} />
            {quiz ? m.saveChanges : m.create}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Delete Confirm ───────────────────────────────────────────────────────────
function DeleteConfirm({ name, onClose, onConfirm }: { name: string; onClose: () => void; onConfirm: () => void }) {
  const { t } = useLang();
  const dc = t.admin.deleteConfirm;
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
        <h3 className="font-bold text-base mb-2" style={{ fontFamily: "'Philosopher', serif", color: 'var(--text-dark)' }}>{dc.title}</h3>
        <p className="text-sm mb-5" style={{ color: 'var(--text-medium)' }}>
          {dc.message} <span className="font-semibold" style={{ color: 'var(--text-dark)' }}>"{name}"</span>?
          <br /><span className="text-xs text-red-500">{dc.warning}</span>
        </p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ border: '1.5px solid rgba(212,160,23,0.3)', color: 'var(--text-medium)' }}>{dc.cancel}</button>
          <button onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-colors">
            {dc.confirm}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Translation Modal ────────────────────────────────────────────────────────
type LangKey = 'zh-CN' | 'zh-TW';
const LANG_LABELS: Record<LangKey, string> = { 'zh-CN': '🇨🇳 简体中文', 'zh-TW': '🇹🇼 繁體中文' };
const OPT_KEYS: Array<keyof TQuestion> = ['option_a', 'option_b', 'option_c', 'option_d'];
const OPT_LABELS = ['A', 'B', 'C', 'D'];

function TranslationModal({ quiz, onClose }: { quiz: any; onClose: () => void }) {
  type Step = 'idle' | 'fetching' | 'translating' | 'done' | 'error';
  const [step, setStep] = useState<Step>('idle');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [questions, setQuestions] = useState<Question[]>(
    Array.isArray(quiz.questions) && quiz.questions.length > 0 ? quiz.questions : [],
  );
  const [data, setData] = useState<TData | null>(() => {
    const existing = loadTranslation(quiz.id);
    return existing;
  });
  const [engine, setEngine] = useState<'claude' | 'google' | null>(null);
  const [activeLang, setActiveLang] = useState<LangKey>('zh-CN');

  // If data already loaded from localStorage, jump to done
  useEffect(() => {
    if (data) setStep('done');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch questions from API if not available
  useEffect(() => {
    if (data) return; // already have saved translation, no need to fetch just yet
    if (questions.length > 0) return;
    if (!quiz.id) { setStep('error'); setError('Bộ đề chưa có câu hỏi. Vui lòng thêm câu hỏi trước rồi dịch.'); return; }
    setStep('fetching');
    fetch(`${API_BASE}/quizzes/${quiz.id}/questions`)
      .then((r) => r.ok ? r.json() : Promise.reject('HTTP ' + r.status))
      .then((d: any) => {
        if (Array.isArray(d) && d.length > 0) { setQuestions(d); setStep('idle'); }
        else { setStep('error'); setError('Bộ đề chưa có câu hỏi nào. Vui lòng thêm câu hỏi trước rồi dịch.'); }
      })
      .catch(() => { setStep('error'); setError('Không thể tải câu hỏi. Kiểm tra kết nối server (port 5030).'); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translate = async (useQuestions: Question[] = questions) => {
    if (useQuestions.length === 0) { setError('Bộ đề chưa có câu hỏi.'); return; }
    setStep('translating');
    setError('');
    setSaved(false);
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: quiz.title, questions: useQuestions }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Lỗi dịch thuật');
      setEngine(json._engine === 'claude' ? 'claude' : 'google');
      const { _engine: _, ...cleanData } = json;
      setData(cleanData as TData);
      setStep('done');
    } catch (e: any) {
      setError(e.message ?? 'Lỗi kết nối API');
      setStep('error');
    }
  };

  const retranslate = () => translate(questions);

  const update = (field: string, val: string) =>
    setData((p) => p ? { ...p, [activeLang]: { ...p[activeLang], [field]: val } } : p);

  const updateQ = (qi: number, field: string, val: string) =>
    setData((p) => p ? {
      ...p,
      [activeLang]: {
        ...p[activeLang],
        questions: p[activeLang].questions.map((q, i) => i === qi ? { ...q, [field]: val } : q),
      },
    } : p);

  const handleSave = () => {
    if (!data || !quiz.id) return;
    saveTranslation(quiz.id, data);
    setSaved(true);
  };

  const fieldStyle = {
    border: '1.5px solid rgba(212,160,23,0.25)',
    background: 'rgba(253,246,227,0.6)',
    color: 'var(--text-dark)',
  };
  const focusGold = (e: React.FocusEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.borderColor = '#1A9362'; };
  const blurGold  = (e: React.FocusEvent<HTMLElement>) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(212,160,23,0.25)'; };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        className="relative w-full max-w-3xl rounded-2xl z-10 flex flex-col"
        style={{ background: '#FFFDF7', border: '1px solid rgba(212,160,23,0.3)', boxShadow: '0 32px 80px rgba(42,21,5,0.3)', maxHeight: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-8 right-8 h-px" style={{ background: 'linear-gradient(90deg,transparent,#1A9362,transparent)' }} />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(212,160,23,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#1A9362,#0ea5e9)', boxShadow: '0 0 12px rgba(26,147,98,0.3)' }}>
              <Globe size={17} className="text-white" />
            </div>
            <div>
              <h2 className="font-bold text-sm" style={{ fontFamily: "'Philosopher', serif", color: 'var(--text-dark)' }}>
                Dịch bộ đề sang 2 ngôn ngữ
              </h2>
              <p className="text-[10px] mt-0.5 max-w-xs truncate" style={{ color: 'var(--text-medium)' }}>
                {quiz.title}
                {hasTranslation(quiz.id) && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full text-[9px] font-semibold"
                    style={{ background: 'rgba(26,147,98,0.12)', color: '#1A9362' }}>
                    ✓ Đã có bản dịch
                  </span>
                )}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl transition-colors" style={{ color: 'var(--text-medium)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5" style={{ scrollbarWidth: 'thin' }}>

          {/* Fetching questions */}
          {step === 'fetching' && (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 size={36} className="animate-spin mb-4" style={{ color: '#D4A017' }} />
              <p className="text-sm" style={{ color: 'var(--text-medium)' }}>Đang tải câu hỏi từ server...</p>
            </div>
          )}

          {/* Idle — ready to translate */}
          {step === 'idle' && (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">🌐</div>
              <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-dark)' }}>
                Sẵn sàng dịch với AI
              </h3>
              <p className="text-sm mb-1" style={{ color: 'var(--text-medium)' }}>
                Bộ đề <strong>"{quiz.title}"</strong> có <strong>{questions.length} câu hỏi</strong>
              </p>
              <p className="text-xs mb-3" style={{ color: 'var(--text-light)' }}>
                Dịch toàn bộ câu hỏi, đáp án và giải thích sang <strong>简体中文</strong> và <strong>繁體中文</strong>
              </p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold mb-7"
                style={{ background: 'rgba(66,133,244,0.08)', border: '1px solid rgba(66,133,244,0.2)', color: '#4285F4' }}>
                🔍 Sử dụng MyMemory API — Miễn phí, không cần API key
              </div>
              <button onClick={() => translate()}
                className="inline-flex items-center gap-2.5 px-7 py-3 rounded-xl font-bold text-white transition-all"
                style={{ background: 'linear-gradient(135deg,#1A9362,#0ea5e9)', boxShadow: '0 4px 16px rgba(26,147,98,0.35)' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(26,147,98,0.45)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(26,147,98,0.35)'; }}>
                <Globe size={16} /> Dịch ngay với AI
              </button>
            </div>
          )}

          {/* Translating */}
          {step === 'translating' && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative mb-5">
                <Loader2 size={44} className="animate-spin" style={{ color: '#1A9362' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Globe size={18} style={{ color: '#D4A017' }} />
                </div>
              </div>
              <p className="font-bold mb-1.5" style={{ color: 'var(--text-dark)' }}>Đang dịch thuật...</p>
              <p className="text-sm" style={{ color: 'var(--text-medium)' }}>
                AI đang xử lý <strong>{questions.length}</strong> câu hỏi sang 2 ngôn ngữ
              </p>
              <p className="text-xs mt-2" style={{ color: 'var(--text-light)' }}>Thường mất 10–30 giây, vui lòng đợi</p>
            </div>
          )}

          {/* Error */}
          {step === 'error' && (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">⚠️</div>
              <p className="font-bold mb-2" style={{ color: 'var(--text-dark)' }}>Có lỗi xảy ra</p>
              <p className="text-sm mb-6 max-w-md mx-auto px-4 py-3 rounded-xl"
                style={{ color: '#DC2626', background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)' }}>
                {error}
              </p>
              {questions.length > 0 && (
                <button onClick={() => translate()}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg,#1A9362,#0ea5e9)' }}>
                  <RefreshCw size={14} /> Thử lại
                </button>
              )}
            </div>
          )}

          {/* Done — review & edit */}
          {step === 'done' && data && (
            <>
              {/* Lang tabs + retranslate */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  {(['zh-CN', 'zh-TW'] as LangKey[]).map((l) => (
                    <button key={l} onClick={() => setActiveLang(l)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                      style={activeLang === l
                        ? { background: 'linear-gradient(135deg,#1A9362,#0ea5e9)', color: '#fff', boxShadow: '0 2px 8px rgba(26,147,98,0.3)' }
                        : { background: 'rgba(26,147,98,0.08)', color: 'var(--text-medium)' }}>
                      {LANG_LABELS[l]}
                    </button>
                  ))}
                </div>
                <button onClick={retranslate}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                  style={{ border: '1.5px solid rgba(26,147,98,0.3)', color: '#1A9362' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(26,147,98,0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                  <RefreshCw size={12} /> Dịch lại
                </button>
              </div>

              {/* Info */}
              <div className="rounded-xl p-3 mb-5 flex items-start gap-2.5"
                style={{ background: 'rgba(26,147,98,0.07)', border: '1px solid rgba(26,147,98,0.18)' }}>
                <CheckCircle2 size={14} style={{ color: '#1A9362', flexShrink: 0, marginTop: 1 }} />
                <div className="flex-1">
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-medium)' }}>
                    Dịch hoàn tất <strong>{data[activeLang]?.questions?.length ?? 0}</strong> câu hỏi.
                    Văn bản gốc tiếng Việt được hiển thị màu nhạt phía trên mỗi ô — chỉnh sửa bản dịch bên dưới nếu cần.
                  </p>
                  {engine && (
                    <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={engine === 'claude'
                        ? { background: 'rgba(139,38,53,0.1)', color: '#8B2635' }
                        : { background: 'rgba(66,133,244,0.1)', color: '#4285F4' }}>
                      {engine === 'claude' ? '🤖 Claude AI' : '🔍 MyMemory (miễn phí)'}
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="mb-5 rounded-xl p-4" style={{ background: 'rgba(212,160,23,0.04)', border: '1px solid rgba(212,160,23,0.15)' }}>
                <p className="text-[10px] font-bold mb-1" style={{ color: '#B8860B' }}>TÊN BỘ ĐỀ</p>
                <p className="text-[10px] mb-1.5 italic" style={{ color: 'var(--text-light)' }}>🇻🇳 {quiz.title}</p>
                <input value={data[activeLang]?.title ?? ''}
                  onChange={(e) => update('title', e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl text-sm focus:outline-none"
                  style={fieldStyle}
                  onFocus={focusGold} onBlur={blurGold}
                />
              </div>

              {/* Questions */}
              <div className="space-y-4">
                {(data[activeLang]?.questions ?? []).map((q, qi) => {
                  const orig = questions[qi];
                  return (
                    <div key={qi} className="rounded-xl p-4 border"
                      style={{ borderColor: 'rgba(212,160,23,0.2)', background: 'rgba(253,246,227,0.3)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg,#D4A017,#B8860B)' }}>{qi + 1}</span>
                        <span className="text-xs font-semibold" style={{ color: 'var(--text-medium)' }}>Câu hỏi {qi + 1}</span>
                      </div>

                      {/* Question text */}
                      <div className="mb-3">
                        {orig && <p className="text-[10px] mb-1 italic px-1" style={{ color: 'var(--text-light)' }}>🇻🇳 {orig.question}</p>}
                        <textarea rows={2} value={q.question ?? ''}
                          onChange={(e) => updateQ(qi, 'question', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl text-sm focus:outline-none resize-none"
                          style={fieldStyle} onFocus={focusGold} onBlur={blurGold} />
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        {OPT_KEYS.map((opt, oi) => (
                          <div key={opt}>
                            {orig && <p className="text-[9px] mb-1 italic px-1" style={{ color: 'var(--text-light)' }}>🇻🇳 {orig[opt] as string}</p>}
                            <div className="relative">
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center"
                                style={{ background: 'rgba(212,160,23,0.15)', color: '#B8860B' }}>
                                {OPT_LABELS[oi]}
                              </span>
                              <input value={(q[opt] as string) ?? ''}
                                onChange={(e) => updateQ(qi, opt as string, e.target.value)}
                                className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs focus:outline-none"
                                style={fieldStyle} onFocus={focusGold} onBlur={blurGold}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Explanation */}
                      <div>
                        {orig?.explanation && (
                          <p className="text-[9px] mb-1 italic px-1" style={{ color: 'var(--text-light)' }}>
                            🇻🇳 {orig.explanation}
                          </p>
                        )}
                        <textarea rows={2} value={q.explanation ?? ''}
                          onChange={(e) => updateQ(qi, 'explanation', e.target.value)}
                          placeholder="Giải thích..."
                          className="w-full px-3 py-2 rounded-xl text-xs focus:outline-none resize-none"
                          style={fieldStyle} onFocus={focusGold} onBlur={blurGold} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 flex-shrink-0" style={{ borderTop: '1px solid rgba(212,160,23,0.12)' }}>
          <button onClick={onClose}
            className="py-2.5 px-5 rounded-xl text-sm font-semibold transition-all"
            style={{ border: '1.5px solid rgba(212,160,23,0.3)', color: 'var(--text-medium)' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.06)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
            Đóng
          </button>

          {step === 'done' && data && (
            <button onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
              style={saved
                ? { background: 'rgba(26,147,98,0.12)', color: '#1A9362', border: '1.5px solid rgba(26,147,98,0.3)' }
                : { background: 'linear-gradient(135deg,#1A9362,#0ea5e9)', color: '#fff', boxShadow: '0 2px 12px rgba(26,147,98,0.3)' }}>
              {saved ? <><CheckCircle2 size={15} /> Đã lưu bản dịch!</> : <><Save size={15} /> Lưu bản dịch</>}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Main Admin Page ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const { user, logout, token } = useApp();
  const { theme, setTheme } = useTheme();
  const { t } = useLang();
  const ad = t.admin;
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  useEffect(() => setMounted(true), []);

  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [quizzesLoading, setQuizzesLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/quizzes`)
      .then((r) => r.json())
      .then((data) => {
        setQuizzes(Array.isArray(data) ? data.map((q: any) => ({ ...q, questions: q.questions ?? [] })) : []);
      })
      .catch(() => setQuizzes([]))
      .finally(() => setQuizzesLoading(false));
  }, []);

  const [showQuizModal, setShowQuizModal]   = useState(false);
  const [editingQuiz, setEditingQuiz]       = useState<any>(null);
  const [deletingQuiz, setDeletingQuiz]     = useState<any>(null);
  const [translatingQuiz, setTranslatingQuiz] = useState<any>(null);
  const [quizSearch, setQuizSearch]         = useState('');
  const [quizLevelFilter, setQuizLevelFilter] = useState('');
  const [quizTopicFilter, setQuizTopicFilter] = useState<number | null>(null);

  const [results]          = useState(mockResults);
  const [resultSearch, setResultSearch]           = useState('');
  const [resultQuizFilter, setResultQuizFilter]   = useState('');
  const [resultPassFilter, setResultPassFilter]   = useState<'all' | 'passed' | 'failed'>('all');
  const [userSearch, setUserSearch]               = useState('');

  const filteredQuizzes = useMemo(() => quizzes.filter((q) => {
    if (quizSearch && !q.title.toLowerCase().includes(quizSearch.toLowerCase())) return false;
    if (quizLevelFilter && q.level !== quizLevelFilter) return false;
    if (quizTopicFilter) {
      const parent = mockTopics.find((tp) => tp.id === quizTopicFilter);
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
    { label: ad.stats.students, value: mockUsers.length,     sub: ad.stats.sub1,                          icon: Users,        color: '#1A9362', trend: true },
    { label: ad.stats.quizzes,  value: quizzes.length,       sub: `${quizzes.reduce((s, q) => s + (q.questions?.length || q.question_count), 0)} ${t.common.questions}`, icon: BookOpen, color: '#B8860B', trend: true },
    { label: ad.stats.attempts, value: totalAttempts,        sub: ad.stats.sub3,                          icon: ClipboardList, color: '#EA6C00', trend: true },
    { label: ad.stats.passRate, value: `${passRate}%`,       sub: `TB ${avgScore} ${t.common.score}`,     icon: BarChart3,    color: '#8B2635', trend: passRate >= 70 },
  ];

  const navItems: { id: Tab; icon: any; label: string; count?: number }[] = [
    { id: 'dashboard', icon: LayoutDashboard, label: ad.nav.dashboard },
    { id: 'quizzes',   icon: BookOpen,        label: ad.nav.quizzes,  count: quizzes.length },
    { id: 'results',   icon: ClipboardList,   label: ad.nav.results,  count: results.length },
    { id: 'users',     icon: Users,           label: ad.nav.users,    count: mockUsers.length },
  ];

  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  const handleSaveQuiz = async (data: any) => {
    try {
      let savedQuiz: any;
      if (editingQuiz) {
        const res = await fetch(`${API_BASE}/quizzes/${editingQuiz.id}`, {
          method: 'PUT', headers: authHeaders,
          body: JSON.stringify({ title: data.title, description: data.description, topic_id: data.topic_id, level: data.level, time_limit: data.time_limit, quiz_type: data.quiz_type }),
        });
        savedQuiz = await res.json();
        if (!res.ok) throw new Error(savedQuiz.error);
      } else {
        const res = await fetch(`${API_BASE}/quizzes`, {
          method: 'POST', headers: authHeaders,
          body: JSON.stringify({ title: data.title, description: data.description, topic_id: data.topic_id, level: data.level, time_limit: data.time_limit, quiz_type: data.quiz_type }),
        });
        savedQuiz = await res.json();
        if (!res.ok) throw new Error(savedQuiz.error);
      }
      if (data.questions !== undefined) {
        const qRes = await fetch(`${API_BASE}/quizzes/${savedQuiz.id}/questions`, {
          method: 'PUT', headers: authHeaders, body: JSON.stringify({ questions: data.questions }),
        });
        const qData = await qRes.json();
        if (qRes.ok) savedQuiz = { ...savedQuiz, questions: qData.questions ?? data.questions, question_count: (qData.questions ?? data.questions).length };
      }
      if (editingQuiz) {
        setQuizzes((prev) => prev.map((q) => q.id === editingQuiz.id ? { ...q, ...savedQuiz, questions: savedQuiz.questions ?? q.questions } : q));
      } else {
        setQuizzes((prev) => [{ ...savedQuiz, questions: savedQuiz.questions ?? [] }, ...prev]);
      }
    } catch (err) {
      console.error('handleSaveQuiz error:', err);
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
      await fetch(`${API_BASE}/quizzes/${id}`, { method: 'DELETE', headers: authHeaders });
    } catch (err) {
      console.error('handleDeleteQuiz error:', err);
    }
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  const inputStyle = { border: '1.5px solid rgba(212,160,23,0.2)', background: 'rgba(253,246,227,0.5)', color: 'var(--text-dark)' };

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg)', color: 'var(--text-dark)' }}>

      {/* ── Admin Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-56 min-h-screen fixed left-0 top-0 z-40"
        style={{ background: 'linear-gradient(180deg,#1C0E02 0%,#140900 100%)', borderRight: '1px solid rgba(212,160,23,0.2)', boxShadow: '4px 0 20px rgba(0,0,0,0.3)' }}>
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg,transparent,#D4A017,transparent)' }} />

        <div className="flex items-center gap-2.5 px-4 h-14 flex-shrink-0" style={{ borderBottom: '1px solid rgba(212,160,23,0.15)' }}>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#D4A017,#B8860B)', boxShadow: '0 0 12px rgba(212,160,23,0.4)' }}>
            <Shield size={16} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-bold tracking-wider" style={{ color: '#F5C842', fontFamily: 'Cinzel, serif' }}>ADMIN</p>
            <p className="text-[9px]" style={{ color: 'rgba(212,160,23,0.5)' }}>{t.site.name}</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-3">
          <p className="text-[9px] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: 'rgba(212,160,23,0.4)' }}>{ad.management}</p>
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
            <p className="text-[9px] font-bold uppercase tracking-widest px-2 mb-2" style={{ color: 'rgba(212,160,23,0.4)' }}>{ad.system}</p>
            <Link href="/dashboard">
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer" style={{ color: 'rgba(253,246,227,0.5)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}>
                <ArrowUpRight size={15} style={{ color: 'rgba(212,160,23,0.5)' }} />
                <span className="text-sm">{ad.backToHome}</span>
              </div>
            </Link>
            <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all" style={{ color: 'rgba(253,246,227,0.5)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.1)'; e.currentTarget.style.color = '#f87171'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = ''; e.currentTarget.style.color = 'rgba(253,246,227,0.5)'; }}>
              <LogOut size={15} style={{ color: 'rgba(220,38,38,0.5)' }} />
              <span className="text-sm">{t.header.logout}</span>
            </button>
          </div>
        </nav>

        <div className="px-3 pb-4 flex-shrink-0">
          <div className="flex items-center gap-2 p-2.5 rounded-xl" style={{ background: 'rgba(212,160,23,0.08)', border: '1px solid rgba(212,160,23,0.12)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#D4A017,#EA6C00)' }}>
              {user?.name?.charAt(0) ?? 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold truncate" style={{ color: '#F5C842' }}>{user?.name ?? 'Admin'}</p>
              <p className="text-[9px] truncate" style={{ color: 'rgba(212,160,23,0.5)' }}>{ad.administrator}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* Top bar */}
        <header className="sticky top-0 z-30 h-14 flex items-center px-4 gap-3"
          style={{ background: 'rgba(253,246,227,0.93)', borderBottom: '1px solid rgba(212,160,23,0.2)', boxShadow: '0 2px 12px rgba(42,21,5,0.05)' }}>

          {/* Mobile: shield icon + ADMIN label */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg,#D4A017,#B8860B)' }}>
              <Shield size={13} className="text-white" />
            </div>
            <span className="font-bold text-xs tracking-wider" style={{ fontFamily: 'Cinzel, serif', color: '#B8860B' }}>
              ADMIN
            </span>
          </div>

          {/* Desktop: current tab title */}
          <div className="hidden lg:block flex-1">
            <h1 className="font-bold text-base" style={{ fontFamily: "'Philosopher', serif", color: 'var(--text-dark)' }}>
              {navItems.find((n) => n.id === activeTab)?.label ?? 'Admin'}
            </h1>
          </div>

          {/* Mobile: current tab title (center) */}
          <div className="flex-1 lg:hidden text-center">
            <h1 className="font-bold text-sm truncate" style={{ fontFamily: "'Philosopher', serif", color: 'var(--text-dark)' }}>
              {navItems.find((n) => n.id === activeTab)?.label ?? 'Admin'}
            </h1>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl transition-colors" style={{ color: 'var(--text-medium)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
              {mounted ? (theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />) : <Moon size={18} />}
            </button>
            <button className="hidden lg:flex p-2 rounded-xl transition-colors relative" style={{ color: 'var(--text-medium)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400" />
            </button>
            {/* Mobile: logout button */}
            <button onClick={logout}
              className="lg:hidden p-2 rounded-xl transition-colors" style={{ color: '#DC2626' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
              <LogOut size={17} />
            </button>
          </div>
        </header>

        {/* ── Mobile bottom navigation for admin ── */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden"
          style={{
            background: 'rgba(22,12,2,0.96)',
            borderTop: '1px solid rgba(212,160,23,0.22)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}>
          <div className="flex items-center h-14">
            {navItems.map(({ id, icon: Icon, label }) => {
              const isActive = activeTab === id;
              return (
                <button key={id} onClick={() => setActiveTab(id)} className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5">
                  <div className="w-10 h-7 flex items-center justify-center rounded-full transition-all"
                    style={isActive ? { background: 'rgba(212,160,23,0.18)' } : {}}>
                    <Icon size={18} style={{ color: isActive ? '#D4A017' : 'rgba(212,160,23,0.38)' }} strokeWidth={isActive ? 2.2 : 1.8} />
                  </div>
                  <span className="text-[9px] font-semibold leading-none"
                    style={{ color: isActive ? '#D4A017' : 'rgba(212,160,23,0.38)' }}>
                    {label.slice(0, 8)}{label.length > 8 ? '…' : ''}
                  </span>
                </button>
              );
            })}
            {/* Back to main site */}
            <Link href="/dashboard" className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5">
              <div className="w-10 h-7 flex items-center justify-center rounded-full">
                <Home size={18} style={{ color: 'rgba(212,160,23,0.38)' }} strokeWidth={1.8} />
              </div>
              <span className="text-[9px] font-semibold leading-none" style={{ color: 'rgba(212,160,23,0.38)' }}>
                Web
              </span>
            </Link>
          </div>
        </nav>

        <main className="flex-1 p-3 sm:p-6 pb-20 lg:pb-6">
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
                      <h2 className="text-sm">{ad.dashboard.recentResults}</h2>
                      <button onClick={() => setActiveTab('results')} className="text-xs font-medium" style={{ color: '#B8860B' }}>{ad.dashboard.viewAll}</button>
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
                            <p className="text-[9px]" style={{ color: r.passed ? '#1A9362' : '#DC2626' }}>
                              {r.passed ? ad.dashboard.passed : ad.dashboard.failed}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>

                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }} className="card p-5">
                    <div className="section-header"><h2 className="text-sm">{ad.dashboard.quizByTopic}</h2></div>
                    <div className="space-y-3">
                      {mockTopics.map((tp) => {
                        const cnt = quizzes.filter((q) => tp.children?.some((c) => c.id === q.topic_id)).length;
                        return (
                          <div key={tp.id} className="flex items-center gap-3">
                            <span className="text-lg w-6 text-center flex-shrink-0">{tp.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-medium truncate" style={{ color: 'var(--text-dark)' }}>{tp.name}</span>
                                <span className="text-[10px] ml-2 flex-shrink-0" style={{ color: 'var(--text-light)' }}>{cnt} {ad.dashboard.exams}</span>
                              </div>
                              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(212,160,23,0.1)' }}>
                                <div className="h-full rounded-full transition-all duration-700"
                                  style={{ width: `${Math.min(100, (tp.question_count / 200) * 100)}%`, background: tp.color }} />
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
                <div className="card p-4 mb-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="relative flex-1 min-w-48">
                      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-medium)' }} />
                      <input value={quizSearch} onChange={(e) => setQuizSearch(e.target.value)}
                        placeholder={ad.quiz.searchPlaceholder}
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-xl focus:outline-none" style={inputStyle}
                        onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.2)'; }} />
                      {quizSearch && <button onClick={() => setQuizSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2"><X size={13} style={{ color: 'var(--text-medium)' }} /></button>}
                    </div>

                    <div className="flex gap-1.5 flex-wrap">
                      <button onClick={() => setQuizLevelFilter('')}
                        className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                        style={!quizLevelFilter ? { background: 'linear-gradient(135deg,#D4A017,#B8860B)', color: '#fff' } : { background: 'rgba(212,160,23,0.08)', color: 'var(--text-medium)' }}>
                        {ad.quiz.all}
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
                      <Plus size={15} /> {ad.quiz.add}
                    </button>
                  </div>

                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    <button onClick={() => setQuizTopicFilter(null)}
                      className="px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all"
                      style={!quizTopicFilter ? { background: 'rgba(212,160,23,0.15)', borderColor: '#D4A01750', color: '#B8860B' } : { borderColor: 'rgba(212,160,23,0.2)', color: 'var(--text-medium)' }}>
                      {ad.quiz.allTopics}
                    </button>
                    {mockTopics.map((tp) => (
                      <button key={tp.id} onClick={() => setQuizTopicFilter(quizTopicFilter === tp.id ? null : tp.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all"
                        style={quizTopicFilter === tp.id
                          ? { background: tp.color + '25', borderColor: tp.color + '60', color: tp.color }
                          : { borderColor: 'rgba(212,160,23,0.15)', color: 'var(--text-medium)' }}>
                        {tp.icon} {tp.name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(212,160,23,0.15)', background: 'rgba(212,160,23,0.05)' }}>
                          {ad.quiz.headers.map((h) => (
                            <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: 'var(--text-medium)' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {quizzesLoading && (
                          <tr><td colSpan={9} className="px-4 py-10 text-center text-sm" style={{ color: 'var(--text-medium)' }}>
                            {ad.quiz.loading}
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
                                {qCount > 0 && <span className="ml-1 text-[10px]" style={{ color: '#1A9362' }}>✓</span>}
                              </td>
                              <td className="px-4 py-3 text-sm" style={{ color: 'var(--text-medium)' }}>
                                <div className="flex items-center gap-1"><Clock size={12} />{q.time_limit} {ad.quiz.minutes}</div>
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
                                  <button onClick={() => setTranslatingQuiz(q)}
                                    className="p-1.5 rounded-lg transition-all relative"
                                    style={{ color: '#0ea5e9' }}
                                    title="Dịch bộ đề sang zh-CN & zh-TW"
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(14,165,233,0.1)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}>
                                    <Globe size={14} />
                                    {hasTranslation(q.id) && (
                                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                                        style={{ background: '#1A9362' }} />
                                    )}
                                  </button>
                                  <button onClick={() => { setEditingQuiz({ ...q, _openTab: 'questions' }); setShowQuizModal(true); }}
                                    className="p-1.5 rounded-lg transition-all" style={{ color: '#1A9362' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(26,147,98,0.1)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}>
                                    <ListOrdered size={14} />
                                  </button>
                                  <button onClick={() => { setEditingQuiz(q); setShowQuizModal(true); }}
                                    className="p-1.5 rounded-lg transition-all" style={{ color: '#B8860B' }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(184,134,11,0.1)'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = ''; }}>
                                    <Pencil size={14} />
                                  </button>
                                  <button onClick={() => setDeletingQuiz(q)}
                                    className="p-1.5 rounded-lg transition-all" style={{ color: '#DC2626' }}
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
                        <p className="font-semibold" style={{ color: 'var(--text-dark)' }}>{ad.quiz.noResults}</p>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-medium)' }}>{ad.quiz.noResultsHint}</p>
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(212,160,23,0.1)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-medium)' }}>
                      {ad.quiz.showing} <span className="font-semibold" style={{ color: 'var(--text-dark)' }}>{filteredQuizzes.length}</span> / {quizzes.length} {ad.quiz.countLabel}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-light)' }}>{ad.quiz.hasQuestions}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ══ RESULTS ══ */}
            {activeTab === 'results' && (
              <motion.div key="results" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <div className="grid grid-cols-3 gap-4 mb-5">
                  {[
                    { label: ad.results.totalLabel,  value: filteredResults.length,                            icon: ClipboardList, color: '#B8860B' },
                    { label: ad.results.passedLabel,  value: filteredResults.filter((r) => r.passed).length,   icon: CheckCircle2,  color: '#1A9362' },
                    { label: ad.results.failedLabel,  value: filteredResults.filter((r) => !r.passed).length,  icon: XCircle,       color: '#DC2626' },
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
                        placeholder={ad.results.searchPlaceholder}
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-xl focus:outline-none" style={inputStyle}
                        onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.2)'; }} />
                      {resultSearch && <button onClick={() => setResultSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2"><X size={13} style={{ color: 'var(--text-medium)' }} /></button>}
                    </div>
                    <select value={resultQuizFilter} onChange={(e) => setResultQuizFilter(e.target.value)}
                      className="px-3 py-2 rounded-xl text-sm focus:outline-none" style={{ ...inputStyle, minWidth: 160 }}>
                      <option value="">{ad.results.allQuizzes}</option>
                      {Array.from(new Set(results.map((r) => r.quizTitle))).map((tp) => (
                        <option key={tp} value={tp}>{tp}</option>
                      ))}
                    </select>
                    <div className="flex gap-1.5">
                      {(['all', 'passed', 'failed'] as const).map((f) => (
                        <button key={f} onClick={() => setResultPassFilter(f)}
                          className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                          style={resultPassFilter === f
                            ? { background: f === 'all' ? 'linear-gradient(135deg,#D4A017,#B8860B)' : f === 'passed' ? '#1A9362' : '#DC2626', color: '#fff' }
                            : { background: 'rgba(212,160,23,0.06)', color: 'var(--text-medium)' }}>
                          {f === 'all' ? ad.results.all : f === 'passed' ? ad.results.passedFilter : ad.results.failedFilter}
                        </button>
                      ))}
                    </div>
                    {(resultSearch || resultQuizFilter || resultPassFilter !== 'all') && (
                      <button onClick={() => { setResultSearch(''); setResultQuizFilter(''); setResultPassFilter('all'); }}
                        className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-xl"
                        style={{ color: '#DC2626', background: 'rgba(220,38,38,0.06)' }}>
                        <X size={12} /> {ad.results.clearFilter}
                      </button>
                    )}
                    <button className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl ml-auto transition-all"
                      style={{ border: '1.5px solid rgba(212,160,23,0.3)', color: '#B8860B' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,160,23,0.08)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                      <Download size={13} /> {ad.results.exportCSV}
                    </button>
                  </div>
                </div>

                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(212,160,23,0.15)', background: 'rgba(212,160,23,0.05)' }}>
                          {ad.results.headers.map((h) => (
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
                                <div className="flex items-center gap-1"><Clock size={11} />{r.duration} {ad.results.minutes}</div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                                  style={r.passed
                                    ? { background: 'rgba(26,147,98,0.12)', color: '#1A9362', border: '1px solid rgba(26,147,98,0.25)' }
                                    : { background: 'rgba(220,38,38,0.1)', color: '#DC2626', border: '1px solid rgba(220,38,38,0.2)' }}>
                                  {r.passed
                                    ? <><CheckCircle2 size={11} /> {ad.results.passedBadge}</>
                                    : <><XCircle size={11} /> {ad.results.failedBadge}</>}
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
                        <p className="font-semibold" style={{ color: 'var(--text-dark)' }}>{ad.results.noResults}</p>
                      </div>
                    )}
                  </div>
                  <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(212,160,23,0.1)' }}>
                    <p className="text-xs" style={{ color: 'var(--text-medium)' }}>
                      {ad.results.showing} <span className="font-semibold" style={{ color: 'var(--text-dark)' }}>{filteredResults.length}</span> / {results.length} {ad.results.countLabel}
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
                      placeholder={ad.users.searchPlaceholder}
                      className="w-full pl-9 pr-4 py-2 text-sm rounded-xl focus:outline-none" style={inputStyle}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#D4A017'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212,160,23,0.2)'; }} />
                    {userSearch && <button onClick={() => setUserSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2"><X size={13} style={{ color: 'var(--text-medium)' }} /></button>}
                  </div>
                  <p className="text-sm ml-auto" style={{ color: 'var(--text-medium)' }}>
                    <span className="font-semibold" style={{ color: 'var(--text-dark)' }}>{filteredUsers.length}</span> {ad.users.studentCount}
                  </p>
                </div>

                <div className="card overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(212,160,23,0.15)', background: 'rgba(212,160,23,0.05)' }}>
                          {ad.users.headers.map((h) => (
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
                                  {u.role === 'admin' ? ad.users.roleAdmin : ad.users.roleUser}
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
                                ) : <span className="text-xs" style={{ color: 'var(--text-light)' }}>{ad.users.noHistory}</span>}
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
        {translatingQuiz && (
          <TranslationModal
            quiz={translatingQuiz}
            onClose={() => setTranslatingQuiz(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
