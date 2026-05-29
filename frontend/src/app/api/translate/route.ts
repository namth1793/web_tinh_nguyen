import { NextResponse } from 'next/server';

// ─── Google Translate unofficial (free, no API key needed) ────────────────────
async function gtTranslate(text: string, to: string): Promise<string> {
  if (!text?.trim()) return text ?? '';
  const url =
    `https://translate.googleapis.com/translate_a/single` +
    `?client=gtx&sl=vi&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; translation-bot/1.0)' },
  });
  if (!res.ok) throw new Error(`Google Translate HTTP ${res.status}`);
  const data = await res.json();
  // data[0] = array of [translated_chunk, original_chunk, ...]
  return (data[0] as any[][]).map((item) => item[0]).join('');
}

// Translate an array of texts in batches to avoid rate-limits
async function gtBatch(texts: string[], to: string, batchSize = 6): Promise<string[]> {
  const results: string[] = [];
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const translated = await Promise.all(batch.map((t) => gtTranslate(t, to)));
    results.push(...translated);
    // Small delay between batches to be polite to Google
    if (i + batchSize < texts.length) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }
  return results;
}

async function translateFree(title: string, questions: any[]) {
  const FIELDS = ['question', 'option_a', 'option_b', 'option_c', 'option_d', 'explanation'] as const;

  const buildResult = (translatedTexts: string[]) => {
    const tTitle = translatedTexts[0];
    const tQuestions = questions.map((q, qi) => {
      const base = 1 + qi * FIELDS.length;
      return Object.fromEntries(
        FIELDS.map((f, fi) => [f, translatedTexts[base + fi] ?? (q[f] ?? '')]),
      );
    });
    return { title: tTitle, questions: tQuestions };
  };

  // Build flat list: [title, q1.question, q1.option_a, ..., q1.explanation, q2.question, ...]
  const allTexts = [
    title,
    ...questions.flatMap((q) => FIELDS.map((f) => q[f] ?? '')),
  ];

  // Translate zh-CN and zh-TW in parallel
  const [cnTexts, twTexts] = await Promise.all([
    gtBatch(allTexts, 'zh-CN'),
    gtBatch(allTexts, 'zh-TW'),
  ]);

  return {
    'zh-CN': buildResult(cnTexts),
    'zh-TW': buildResult(twTexts),
    _engine: 'google',
  };
}

// ─── Claude (premium, uses ANTHROPIC_API_KEY) ─────────────────────────────────
async function translateWithClaude(title: string, questions: any[]) {
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const questionBlock = questions
    .map(
      (q: any, i: number) =>
        `Q${i + 1}: ${q.question}\nA: ${q.option_a}\nB: ${q.option_b}\nC: ${q.option_c}\nD: ${q.option_d}\nExplanation: ${q.explanation ?? ''}`,
    )
    .join('\n\n');

  const prompt = `You are a Buddhist studies expert fluent in Vietnamese, Simplified Chinese, and Traditional Chinese.

Translate the following Buddhist quiz from Vietnamese to BOTH Simplified Chinese (zh-CN) and Traditional Chinese (zh-TW).
Use accurate Buddhist terminology in both Chinese variants.
Return ONLY a valid JSON object — no explanation, no markdown fences.

Required JSON structure:
{
  "zh-CN": {
    "title": "<Simplified Chinese title>",
    "questions": [{"question":"...","option_a":"...","option_b":"...","option_c":"...","option_d":"...","explanation":"..."}]
  },
  "zh-TW": {
    "title": "<Traditional Chinese title>",
    "questions": [...]
  }
}

Quiz title: ${title}

Questions:
${questionBlock}`;

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 8096,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}') + 1;
  if (start === -1 || end === 0) throw new Error('AI không trả về JSON hợp lệ. Thử lại.');

  return { ...JSON.parse(text.slice(start, end)), _engine: 'claude' };
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { title, questions } = await req.json();

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: 'Thiếu dữ liệu: cần có title và questions.' }, { status: 400 });
    }

    // Use Claude if API key is set, otherwise fall back to free Google Translate
    const result = process.env.ANTHROPIC_API_KEY
      ? await translateWithClaude(title, questions)
      : await translateFree(title, questions);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Lỗi không xác định' }, { status: 500 });
  }
}
