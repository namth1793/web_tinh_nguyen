'use client';

import { useMemo } from 'react';
import { useLang } from '@/context/LangContext';
import { mockTopics, mockQuizzes, mockQuizQuestions, mockRecentResults, mockBadges } from '@/data/mockData';
import { LEVELS, LEVEL_NAMES } from '@/constants';
import {
  topicNames, subTopicNames, quizTitles, levelNameMap,
  levelDescMap, xpLevelNames, badgeTranslations, questionData,
} from '@/i18n/quizData';
import type { Topic, SubTopic, Quiz, QuizResult, Badge, Level } from '@/types';

export type TranslatedLevel = Level & { _viName: string };

export function useMockData() {
  const { lang } = useLang();

  const topics = useMemo<Topic[]>(() =>
    mockTopics.map((tp) => ({
      ...tp,
      name: topicNames[tp.id]?.[lang] ?? tp.name,
      children: tp.children?.map((ch): SubTopic => ({
        ...ch,
        name: subTopicNames[ch.id]?.[lang] ?? ch.name,
      })),
    })),
  [lang]);

  const quizzes = useMemo<Quiz[]>(() =>
    mockQuizzes.map((q) => ({
      ...q,
      title:      quizTitles[q.id]?.[lang] ?? q.title,
      topic_name: subTopicNames[q.topic_id]?.[lang] ?? q.topic_name,
    })),
  [lang]);

  const questions = useMemo(() =>
    questionData.map((qd) => {
      const t = qd[lang];
      return {
        id:             qd.id,
        correct_answer: qd.correct_answer,
        question:       t.question,
        option_a:       t.option_a,
        option_b:       t.option_b,
        option_c:       t.option_c,
        option_d:       t.option_d,
        explanation:    t.explanation,
      };
    }),
  [lang]);

  const levels = useMemo<TranslatedLevel[]>(() =>
    LEVELS.map((l) => ({
      ...l,
      _viName:     l.name,
      name:        levelNameMap[l.name]?.[lang] ?? l.name,
      description: levelDescMap[l.id]?.[lang] ?? l.description,
    })),
  [lang]);

  const recentResults = useMemo<QuizResult[]>(() =>
    mockRecentResults.map((r) => ({
      ...r,
      quiz_title: quizTitles[r.quiz_id]?.[lang] ?? r.quiz_title,
      topic_name: subTopicNames[mockQuizzes.find((q) => q.id === r.quiz_id)?.topic_id ?? 0]?.[lang] ?? r.topic_name,
    })),
  [lang]);

  const badges = useMemo<Badge[]>(() =>
    mockBadges.map((b) => ({
      ...b,
      name:        badgeTranslations[b.id]?.name[lang] ?? b.name,
      description: badgeTranslations[b.id]?.description[lang] ?? b.description,
    })),
  [lang]);

  const allSubTopics = useMemo(() =>
    topics.flatMap((t) => t.children ?? []),
  [topics]);

  const getLevelName = (viName: string): string =>
    levelNameMap[viName]?.[lang] ?? viName;

  const getXpLevelName = (levelId: number): string =>
    xpLevelNames[levelId]?.[lang] ?? LEVEL_NAMES[levelId]?.name ?? '';

  return { topics, quizzes, questions, levels, recentResults, badges, allSubTopics, getLevelName, getXpLevelName };
}
