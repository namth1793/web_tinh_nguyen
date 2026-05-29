'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLang } from '@/context/LangContext';
import { loadTranslation, TRANS_EVENT } from '@/i18n/translationStore';
import { levelNameMap, subTopicNames } from '@/i18n/quizData';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5030/api';

function applyQuizTranslation(q: any, lang: string): any {
  if (lang === 'vi') return q;
  const saved = loadTranslation(q.id);
  const title = saved?.[lang as 'zh-CN' | 'zh-TW']?.title ?? q.title;
  const topic_name = subTopicNames[q.topic_id]?.[lang as 'zh-CN' | 'zh-TW'] ?? q.topic_name;
  return { ...q, title, topic_name };
}

/** Fetch all quizzes from the API and apply saved translations */
export function useApiQuizzes() {
  const { lang } = useLang();
  const [raw, setRaw] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [transVersion, setTransVersion] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/quizzes`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setRaw(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const h = () => setTransVersion((v) => v + 1);
    window.addEventListener(TRANS_EVENT, h);
    return () => window.removeEventListener(TRANS_EVENT, h);
  }, []);

  const quizzes = useMemo(
    () => raw.map((q) => applyQuizTranslation(q, lang)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [raw, lang, transVersion],
  );

  const getLevelName = (viName: string) => levelNameMap[viName]?.[lang as 'vi' | 'zh-CN' | 'zh-TW'] ?? viName;

  return { quizzes, loading, getLevelName };
}

/** Fetch a single quiz + its questions, and apply saved translations */
export function useApiQuizDetail(quizId: number) {
  const { lang } = useLang();
  const [quiz, setQuiz] = useState<any>(null);
  const [rawQuestions, setRawQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [transVersion, setTransVersion] = useState(0);

  useEffect(() => {
    if (!quizId) return;
    setLoading(true);
    Promise.all([
      fetch(`${API_BASE}/quizzes/${quizId}`).then((r) => r.json()),
      fetch(`${API_BASE}/quizzes/${quizId}/questions`).then((r) => r.json()),
    ])
      .then(([qData, qsData]) => {
        setQuiz(qData);
        setRawQuestions(Array.isArray(qsData) ? qsData : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [quizId]);

  useEffect(() => {
    const h = () => setTransVersion((v) => v + 1);
    window.addEventListener(TRANS_EVENT, h);
    return () => window.removeEventListener(TRANS_EVENT, h);
  }, []);

  const translatedQuiz = useMemo(() => {
    if (!quiz) return null;
    return applyQuizTranslation(quiz, lang);
  }, [quiz, lang, transVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  const questions = useMemo(() => {
    if (lang === 'vi' || !rawQuestions.length) return rawQuestions;
    const saved = loadTranslation(quizId)?.[lang as 'zh-CN' | 'zh-TW'];
    if (!saved?.questions?.length) return rawQuestions;
    return rawQuestions.map((q, i) => {
      const t = saved.questions[i];
      if (!t) return q;
      return {
        ...q,
        question:    t.question    || q.question,
        option_a:    t.option_a    || q.option_a,
        option_b:    t.option_b    || q.option_b,
        option_c:    t.option_c    || q.option_c,
        option_d:    t.option_d    || q.option_d,
        explanation: t.explanation || q.explanation,
      };
    });
  }, [rawQuestions, lang, quizId, transVersion]); // eslint-disable-line react-hooks/exhaustive-deps

  const getLevelName = (viName: string) => levelNameMap[viName]?.[lang as 'vi' | 'zh-CN' | 'zh-TW'] ?? viName;

  return { quiz: translatedQuiz, questions, loading, getLevelName };
}
