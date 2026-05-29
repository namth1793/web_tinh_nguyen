const PREFIX = 'phatphap_trans_';
const EVENT = 'phatphap-trans-updated';

export type TQuestion = {
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  explanation: string;
};

export type TLangData = { title: string; questions: TQuestion[] };
export type TData = { 'zh-CN': TLangData; 'zh-TW': TLangData };

export function saveTranslation(quizId: number, data: TData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`${PREFIX}${quizId}`, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function loadTranslation(quizId: number): TData | null {
  if (typeof window === 'undefined') return null;
  try {
    const s = localStorage.getItem(`${PREFIX}${quizId}`);
    return s ? (JSON.parse(s) as TData) : null;
  } catch {
    return null;
  }
}

export function hasTranslation(quizId: number): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(`${PREFIX}${quizId}`);
}

export const TRANS_EVENT = EVENT;
